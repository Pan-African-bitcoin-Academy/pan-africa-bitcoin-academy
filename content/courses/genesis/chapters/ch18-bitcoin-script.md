# Chapter 18: Intro to Bitcoin Script

## 18.0 Locking & Unlocking Conditions
- P2PKH → P2WPKH → P2SH/P2TR; scripts define spending conditions.

## 18.1 Timelocks & Simple Policies
- CLTV/CSV for time-based constraints; useful for vaults, inheritance, escrow.

## 18.2 Script in Real Wallets
- Wallets abstract scripts but build/verify locking/unlocking under the hood.

## 18.3 Step-by-Step Transaction Flow
1. Create outputs (locking scripts).  
2. Sign (unlocking/witness).  
3. Nodes validate.  
4. Broadcast and confirm.

## 18.4 Security Considerations
- Misconfigured scripts, malleability (mitigated by SegWit), key safety, testing complex scripts.

### Activity: Construct and Broadcast a Test Transaction
- Build P2WPKH or multi-sig on testnet/regtest; sign and broadcast; test timelock spend.

