

import { deriveAddressRange, type DetectedWalletInput } from '@/lib/bitcoin/watchWallet';

export interface RawTransaction {
  txid: string;
  vin: Array<{
    txid: string;
    vout: number;
    prevout?: {
      scriptpubkey_address?: string;
      value?: number;
    };
  }>;
  vout: Array<{
    scriptpubkey_address?: string;
    value: number;
  }>;
  fee: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
}

export interface NormalizedWalletTx {
  txid: string;
  txType: 'incoming' | 'outgoing';
  amountSats: number;
  feeSats: number | null;
  confirmed: boolean;
  confirmations: number;
  blockHeight: number | null;
  blockTime: string | null;
}

export interface WalletSyncResult {
  balanceSats: number;
  unconfirmedBalanceSats: number;
  transactions: NormalizedWalletTx[];
}

const ESPLORA_APIS = ['https://blockstream.info/api', 'https://mempool.space/api'] as const;
const TIMEOUT_MS = 8_000;
const BATCH_SIZE = 4;
const MAX_TX_PAGES_PER_ADDRESS = 40;
const ADDRESS_GAP_LIMIT = 20;
const MAX_ADDRESSES_PER_BRANCH = 500;
const MAX_SAFE_SATS = 2_100_000_000_000_000;

async function fetchWithTimeout(url: string, timeoutMs = TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'PBA-DCA-WatchWallet/1.0',
      },
      next: { revalidate: 60 },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function queryApi<T>(path: string): Promise<T> {
  let wasRateLimited = false;
  for (const api of ESPLORA_APIS) {
    try {
      const response = await fetchWithTimeout(`${api}${path}`);
      if (response.status === 429) {
        wasRateLimited = true;
        continue;
      }
      if (!response.ok) continue;
      return await response.json() as T;
    } catch {
      // Try the next Esplora-compatible provider.
    }
  }

  throw new Error(
    wasRateLimited
      ? 'Bitcoin data providers are rate limiting requests. Please retry shortly.'
      : 'Bitcoin data providers are unavailable or timed out. Please retry shortly.',
  );
}

async function queryTipHeight(): Promise<number> {
  for (const api of ESPLORA_APIS) {
    try {
      const response = await fetchWithTimeout(`${api}/blocks/tip/height`);
      if (!response.ok) continue;
      const height = Number((await response.text()).trim());
      if (Number.isSafeInteger(height) && height >= 0) return height;
    } catch {
      // Try the next Esplora-compatible provider.
    }
  }
  throw new Error('Bitcoin data providers could not return the current block height.');
}

interface AddressStats {
  balanceSats: number;
  unconfirmedBalanceSats: number;
  transactionCount: number;
}

async function queryAddressStats(address: string): Promise<AddressStats> {
  const data = await queryApi<{
    chain_stats?: {
      funded_txo_sum?: number;
      spent_txo_sum?: number;
      tx_count?: number;
    };
    mempool_stats?: {
      funded_txo_sum?: number;
      spent_txo_sum?: number;
      tx_count?: number;
    };
  }>(`/address/${encodeURIComponent(address)}`);

  const chain = data.chain_stats;
  const mempool = data.mempool_stats;
  if (!chain || !mempool) throw new Error('Bitcoin data provider returned an incomplete address balance.');

  const confirmed = Number(chain.funded_txo_sum ?? 0) - Number(chain.spent_txo_sum ?? 0);
  const unconfirmed = Number(mempool.funded_txo_sum ?? 0) - Number(mempool.spent_txo_sum ?? 0);
  const transactionCount = Number(chain.tx_count ?? 0) + Number(mempool.tx_count ?? 0);
  if (
    !Number.isSafeInteger(confirmed) ||
    confirmed < 0 ||
    confirmed > MAX_SAFE_SATS ||
    !Number.isSafeInteger(unconfirmed) ||
    Math.abs(unconfirmed) > MAX_SAFE_SATS ||
    !Number.isSafeInteger(transactionCount) ||
    transactionCount < 0
  ) {
    throw new Error('Bitcoin data provider returned invalid balance data.');
  }
  return { balanceSats: confirmed, unconfirmedBalanceSats: unconfirmed, transactionCount };
}

async function queryAddressTransactions(address: string): Promise<RawTransaction[]> {
  const transactions: RawTransaction[] = [];
  let path = `/address/${encodeURIComponent(address)}/txs`;

  for (let page = 0; page < MAX_TX_PAGES_PER_ADDRESS; page += 1) {
    const data = await queryApi<unknown>(path);
    if (!Array.isArray(data)) throw new Error('Bitcoin data provider returned invalid transaction history.');
    const pageTransactions = data as RawTransaction[];
    transactions.push(...pageTransactions);
    if (pageTransactions.length < 25) return transactions;
    const lastTxid = pageTransactions[pageTransactions.length - 1]?.txid;
    if (!lastTxid || !/^[0-9a-f]{64}$/i.test(lastTxid)) {
      throw new Error('Bitcoin data provider returned an invalid transaction identifier.');
    }
    path = `/address/${encodeURIComponent(address)}/txs/chain/${lastTxid}`;
  }
  return transactions;
}

function canonicalAddress(address: string): string {
  return /^(bc1|tb1)/i.test(address) ? address.toLowerCase() : address;
}

function validateTransaction(tx: RawTransaction): boolean {
  return Boolean(
    tx &&
    typeof tx.txid === 'string' &&
    /^[0-9a-f]{64}$/i.test(tx.txid) &&
    Array.isArray(tx.vin) &&
    Array.isArray(tx.vout) &&
    tx.status &&
    typeof tx.status.confirmed === 'boolean',
  );
}

async function syncUsingStats(
  uniqueAddresses: string[],
  addressStats: Map<string, AddressStats>,
): Promise<WalletSyncResult> {
  const balanceSats = [...addressStats.values()].reduce((total, item) => total + item.balanceSats, 0);
  const unconfirmedBalanceSats = [...addressStats.values()].reduce(
    (total, item) => total + item.unconfirmedBalanceSats,
    0,
  );
  const activeAddresses = uniqueAddresses.filter((address) =>
    (addressStats.get(address)?.transactionCount ?? 0) > 0,
  );
  const txsById = new Map<string, RawTransaction>();

  for (let offset = 0; offset < activeAddresses.length; offset += BATCH_SIZE) {
    const batch = activeAddresses.slice(offset, offset + BATCH_SIZE);
    const results = await Promise.all(batch.map(async (address) => ({
      transactions: await queryAddressTransactions(address),
    })));
    for (const result of results) {
      for (const transaction of result.transactions) {
        if (validateTransaction(transaction)) txsById.set(transaction.txid, transaction);
      }
    }
  }

  const ownedAddresses = new Set(uniqueAddresses.map(canonicalAddress));
  const tipHeight = [...txsById.values()].some((transaction) => transaction.status.confirmed)
    ? await queryTipHeight()
    : 0;
  const transactions: NormalizedWalletTx[] = [];
  for (const transaction of txsById.values()) {
    let receivedSats = 0;
    let sentSats = 0;
    for (const output of transaction.vout) {
      if (output.scriptpubkey_address && ownedAddresses.has(canonicalAddress(output.scriptpubkey_address))) {
        receivedSats += Number(output.value);
      }
    }
    for (const input of transaction.vin) {
      const previousAddress = input.prevout?.scriptpubkey_address;
      if (previousAddress && ownedAddresses.has(canonicalAddress(previousAddress))) {
        sentSats += Number(input.prevout?.value ?? 0);
      }
    }

    const netSats = receivedSats - sentSats;
    if (netSats === 0) continue;
    transactions.push({
      txid: transaction.txid,
      txType: netSats > 0 ? 'incoming' : 'outgoing',
      amountSats: Math.abs(netSats),
      feeSats: Number.isSafeInteger(transaction.fee) && transaction.fee >= 0 ? transaction.fee : null,
      confirmed: transaction.status.confirmed,
      confirmations: transaction.status.confirmed && Number.isSafeInteger(transaction.status.block_height)
        ? Math.max(0, tipHeight - Number(transaction.status.block_height) + 1)
        : 0,
      blockHeight: transaction.status.confirmed && Number.isSafeInteger(transaction.status.block_height)
        ? Number(transaction.status.block_height)
        : null,
      blockTime: transaction.status.confirmed && Number.isSafeInteger(transaction.status.block_time)
        ? new Date(Number(transaction.status.block_time) * 1000).toISOString()
        : null,
    });
  }

  transactions.sort((a, b) => (b.blockTime ? Date.parse(b.blockTime) : 0) - (a.blockTime ? Date.parse(a.blockTime) : 0));
  return { balanceSats, unconfirmedBalanceSats, transactions };
}

async function loadAddressStats(addresses: string[]): Promise<Map<string, AddressStats>> {
  const addressStats = new Map<string, AddressStats>();
  for (let offset = 0; offset < addresses.length; offset += BATCH_SIZE) {
    const batch = addresses.slice(offset, offset + BATCH_SIZE);
    const results = await Promise.all(batch.map(async (address) => ({
      address,
      stats: await queryAddressStats(address),
    })));
    for (const result of results) addressStats.set(result.address, result.stats);
  }
  return addressStats;
}

export async function syncWalletAddresses(addresses: string[]): Promise<WalletSyncResult> {
  const uniqueAddresses = [...new Set(addresses.map((address) => address.trim()).filter(Boolean))];
  if (!uniqueAddresses.length) {
    throw new Error('No supported Bitcoin addresses were derived for this wallet.');
  }
  return syncUsingStats(uniqueAddresses, await loadAddressStats(uniqueAddresses));
}

export async function syncDetectedWallet(wallet: DetectedWalletInput): Promise<WalletSyncResult> {
  if (wallet.type === 'address') return syncWalletAddresses(wallet.addressesToWatch);
  if (wallet.type !== 'xpub' || !wallet.scheme) {
    throw new Error('This watch-only wallet type is not enabled for synchronization.');
  }

  const addresses: string[] = [];
  const stats = new Map<string, AddressStats>();
  for (const chain of [0, 1] as const) {
    let index = 0;
    let gap = 0;
    while (gap < ADDRESS_GAP_LIMIT && index < MAX_ADDRESSES_PER_BRANCH) {
      const count = Math.min(BATCH_SIZE, MAX_ADDRESSES_PER_BRANCH - index);
      const batchAddresses = deriveAddressRange(wallet.normalizedData, wallet.scheme, chain, index, count);
      const batchStats = await loadAddressStats(batchAddresses);
      for (const address of batchAddresses) {
        const addressStat = batchStats.get(address);
        if (!addressStat) throw new Error('Bitcoin data provider did not return all derived addresses.');
        addresses.push(address);
        stats.set(address, addressStat);
        gap = addressStat.transactionCount === 0 ? gap + 1 : 0;
        index += 1;
        if (gap === ADDRESS_GAP_LIMIT) break;
      }
    }

    if (gap < ADDRESS_GAP_LIMIT) {
      throw new Error('This wallet exceeded the current address scan limit. Use a self-hosted indexed provider.');
    }
  }

  return syncUsingStats(addresses, stats);
}
