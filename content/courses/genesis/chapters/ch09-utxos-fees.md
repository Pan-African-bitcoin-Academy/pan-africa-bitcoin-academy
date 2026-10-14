# Chapter 9: UTXOs, Fees & Coin Control

## Introduction
Bitcoin uses UTXOs (individual “coins”) instead of account balances. Spending picks specific UTXOs; change comes back as a new output.

## 9.0 What You Really Own — The UTXO Model
Each receive creates a distinct UTXO. Spending selects UTXOs; change is a new output you control.

## 9.1 Fees and Input Selection
- Fees depend on transaction size (vBytes), not amount.  
- More inputs/outputs = higher fee.  
- Fewer/larger UTXOs cheaper but may reveal balance patterns.

## 9.2 UTXO Management & When to Consolidate
- Too many small UTXOs → high future fees.  
- Consolidate during low-fee windows; balance fee efficiency vs privacy.

### Activity: Plan a Spend from a UTXO Set
- Choose UTXOs, compute change, estimate fee, discuss privacy/fee trade-offs.

