# Chapter 11: Hardware Signers

## Introduction
Hardware signers keep keys offline, reducing theft and malware risk.

## 11.0 Why Hardware (Hot vs Cold)
- Offline keys mitigate malware/phishing.  
- Balance: convenience of hot vs security of cold; hardware is a safe middle.

## 11.1 Setup, Backup, and Test Recovery
- Seed phrase: write offline, store safely.  
- Optional passphrase (25th word) for extra protection.  
- Dry-run recovery to verify backups.

## 11.2 Spending Safely (PSBT Flow)
- Create unsigned tx on computer; sign on device; broadcast from host.  
- Always verify details on device screen.

### Activity: Dry-Run Recovery + Testnet PSBT
- Practice recovery and sign/broadcast a testnet PSBT.

