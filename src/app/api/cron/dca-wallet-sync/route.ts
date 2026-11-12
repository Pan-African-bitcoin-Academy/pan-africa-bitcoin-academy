import { randomUUID, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { syncWalletRecord } from '@/lib/bitcoin/syncWalletRecord';

const MAX_WALLETS_PER_RUN = 10;
const LOCK_TTL_SECONDS = 600;
const SAFE_SYNC_MESSAGES = new Set([
  'Stored watch-only wallet data could not be decoded or validated.',
  'The blockchain data provider could not complete synchronization.',
  'Wallet balance update failed.',
  'Wallet transaction update failed.',
  'Wallet balance snapshot could not be recorded.',
]);

export const maxDuration = 300;

function isAuthorized(request: NextRequest, secret: string): boolean {
  const authorization = request.headers.get('authorization') ?? '';
  if (!authorization.startsWith('Bearer ')) return false;
  const supplied = Buffer.from(authorization.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function getSafeSyncError(error: unknown): string {
  const message = error instanceof Error ? error.message : '';
  return SAFE_SYNC_MESSAGES.has(message) ? message : 'Unexpected wallet synchronization failure.';
}

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Scheduled wallet synchronization is not configured.' }, { status: 503 });
  }
  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const executionId = randomUUID();
  const lockToken = randomUUID();
  const startedAt = new Date();
  let processed = 0;
  let synced = 0;
  let failed = 0;
  let fatalError = '';
  let lockReleased = true;
  const errors: Array<{ walletNumber: number; message: string }> = [];
  const startedAtIso = startedAt.toISOString();

  console.info('Scheduled wallet sync started.', { executionId, startedAt: startedAtIso });

  let lockAcquired = false;
  let lockRequestFailed = false;
  let lockErrorCode: string | undefined;
  try {
    const { data, error } = await supabaseAdmin.rpc(
      'try_acquire_dca_wallet_sync_lock',
      { p_lock_token: lockToken, p_lock_ttl_seconds: LOCK_TTL_SECONDS },
    );
    if (error) {
      lockRequestFailed = true;
      lockErrorCode = error.code ?? 'unknown';
    }
    else lockAcquired = data === true;
  } catch {
    lockRequestFailed = true;
    lockErrorCode = 'request_failed';
  }
  if (lockRequestFailed) {
    const completedAt = new Date();
    console.error('Scheduled wallet sync could not acquire its database lock.', {
      executionId,
      databaseErrorCode: lockErrorCode,
    });
    console.info('Scheduled wallet sync completed.', {
      executionId,
      startedAt: startedAtIso,
      completedAt: completedAt.toISOString(),
      processed,
      synced,
      failed,
    });
    return NextResponse.json({
      executionId,
      startedAt: startedAtIso,
      completedAt: completedAt.toISOString(),
      processed,
      synced,
      failed,
      error: 'Unable to acquire the synchronization lock.',
    }, { status: 503 });
  }

  if (!lockAcquired) {
    const completedAt = new Date();
    console.info('Scheduled wallet sync skipped because another execution holds the lock.', {
      executionId,
      startedAt: startedAtIso,
      completedAt: completedAt.toISOString(),
    });
    return NextResponse.json({
      executionId,
      startedAt: startedAtIso,
      completedAt: completedAt.toISOString(),
      processed,
      synced,
      failed,
      error: 'A wallet synchronization is already in progress.',
    }, { status: 409 });
  }

  try {
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from('dca_wallets')
      .select('id, user_id, format, watch_data_encrypted')
      .order('updated_at', { ascending: true })
      .limit(MAX_WALLETS_PER_RUN);

    if (walletsError) {
      fatalError = 'Could not load wallets for synchronization.';
      console.error('Scheduled wallet sync could not load wallet records.', {
        executionId,
        databaseErrorCode: walletsError.code,
      });
    } else {
      const selectedWallets = wallets ?? [];
      processed = selectedWallets.length;
      for (let index = 0; index < selectedWallets.length; index += 1) {
        const wallet = selectedWallets[index];
        try {
          await syncWalletRecord({
            id: wallet.id,
            userId: wallet.user_id,
            format: wallet.format,
            encryptedWatchData: wallet.watch_data_encrypted,
          });
          synced += 1;
        } catch (error) {
          const message = getSafeSyncError(error);
          console.error('Scheduled wallet synchronization failed.', {
            executionId,
            walletNumber: index + 1,
            message,
          });
          let statusErrorCode: string | undefined;
          let statusUpdateFailed = false;
          try {
            const { error: statusError } = await supabaseAdmin
              .from('dca_wallets')
              .update({
                sync_status: 'error',
                sync_error: 'Scheduled synchronization failed. Check the last saved balance and retry later.',
                updated_at: new Date().toISOString(),
              })
              .eq('id', wallet.id)
              .eq('user_id', wallet.user_id);
            if (statusError) {
              statusUpdateFailed = true;
              statusErrorCode = statusError.code ?? 'unknown';
            }
          } catch {
            statusUpdateFailed = true;
            statusErrorCode = 'request_failed';
          }
          if (statusUpdateFailed) {
            console.error('Could not record a scheduled wallet synchronization failure.', {
              executionId,
              walletNumber: index + 1,
              databaseErrorCode: statusErrorCode,
            });
          }
          failed += 1;
          errors.push({ walletNumber: index + 1, message });
        }
      }
    }
  } catch {
    fatalError = 'Scheduled wallet synchronization failed unexpectedly.';
    console.error('Scheduled wallet synchronization failed unexpectedly.', { executionId });
  } finally {
    let releaseErrorCode: string | undefined;
    let releaseFailed = false;
    try {
      const { data: released, error: releaseError } = await supabaseAdmin.rpc(
        'release_dca_wallet_sync_lock',
        { p_lock_token: lockToken },
      );
      if (releaseError) {
        releaseFailed = true;
        releaseErrorCode = releaseError.code ?? 'unknown';
      }
      lockReleased = !releaseFailed && released === true;
    } catch {
      releaseFailed = true;
      releaseErrorCode = 'request_failed';
      lockReleased = false;
    }
    if (!lockReleased) {
      console.error('Scheduled wallet sync could not release its database lock.', {
        executionId,
        databaseErrorCode: releaseErrorCode,
      });
    }
  }

  const completedAt = new Date();
  const completedAtIso = completedAt.toISOString();
  const durationMs = completedAt.getTime() - startedAt.getTime();
  const responseError = fatalError ||
    (lockReleased ? '' : 'Synchronization finished, but its lock could not be released.');

  console.info('Scheduled wallet sync completed.', {
    executionId,
    startedAt: startedAtIso,
    completedAt: completedAtIso,
    durationMs,
    processed,
    synced,
    failed,
    lockReleased,
  });

  return NextResponse.json({
    executionId,
    startedAt: startedAtIso,
    completedAt: completedAtIso,
    durationMs,
    processed,
    synced,
    failed,
    errors,
    ...(responseError ? { error: responseError } : {}),
  }, { status: responseError || failed > 0 ? 500 : 200 });
}
