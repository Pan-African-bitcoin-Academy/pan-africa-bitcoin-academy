# Chapter 11: Hardware Signers / ምዕራፍ 11 · ሃርድዌር መፈረሚ

Hardware keeps keys offline; malware hears only static.  
ሃርድዌር መፍትሕታት ካብ መስመር ወጻኢ ይገብሮም፤ ማልዌር ስታትቲክ ጥራይ እዩ ዝሰምዕ።

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **Threats hardware mitigates vs hot wallets**  
  ስግኣታት ሃርድዌር ምቅላል vs ናይ ኢንተርነት ቦርሳታት
- **Setup, seed/backup, passphrase basics**  
  ምድላው፣ ናይ መፍትሕ ቃላት/ምዕቃብን፣ መሰረታዊ ሓረግ ምሕላፍ
- **PSBT signing flow and on-device verification**  
  ኣሰራርሓ ምፍራም PSBTን ኣብ መሳርሒ ምርግጋጽንን።

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### Introduction / መእተዊ
When it comes to protecting your Bitcoin, one of the most powerful tools you can use is a hardware signer (commonly called a hardware wallet). Unlike software wallets that live on your phone or computer, hardware signers are dedicated devices built with one purpose: keeping your private keys safe. By storing your keys offline and isolating them from internet-connected devices, hardware signers significantly reduce the risks of theft, hacking, or accidental loss. In this chapter, we'll explore why these devices are essential, how to set them up correctly, and how to use them safely for transactions.  
ንቢትኮይንካ ንምክልኻል፡ ሓደ ካብቲ ክትጥቀመሉ እትኽእል ሓያል መሳርሒታት፡ ሃርድዌር ፌርማ (ብተለምዶ ሃርድዌር ዋለተ ተባሂሉ ዝጽዋዕ) እዩ። ዘይከምቶም ኣብ ሞባይልካ ወይ ኮምፒተርካ ዝነብሩ ሶፍትዌር ቦርሳታት፡መፈረሚታት ሃርድዌር ብሓደ ዕላማ ዝተሰርሑ ፍሉያት መሳርሒታት እዮም፡ እዚ ድማ ናይ ውልቂ መፍትሕታትካ ውሑስ ምግባር እዩ። መፍትሕታትካ ካብ ኢንተርነት ወጻኢ ብምኽዛንን ካብ ምስ ኢንተርነት ዝተኣሳሰሩ መሳርሒታት ብምንጻልን፡ ፈረምቲ ሃርድዌር፡ ንሓደጋታት ስርቂ፡ ምጥፍፋእ ወይ ብኣጋጣሚ ምጥፋእ ብዓቢኡ ይቕንሱ። ኣብዚ ምዕራፍ እዚ፡ እዞም መሳርሒታት ስለምንታይ ኣገደስቲ ምዃኖም፡ ብኸመይ ብትኽክል ከም እንሰርዖምን ብኸመይ ንትራንስክሽን ብዘይ ስግኣት ከም እንጥቀመሉን ክንምርምር ኢና።

---

### 11.0 Why Hardware (Threats It Mitigates; Hot vs Cold) / 11.0 ስለምንታይ ሃርድዌር (ዘቃልሎ ስግኣታት፤ ውዑይ ኣንጻር ዝሑል)
A hardware wallet protects against many threats that software wallets cannot. Because your private keys never touch the internet, they're shielded from malware, viruses, phishing attacks, and even a compromised computer. This security makes hardware signers the gold standard for safeguarding long-term Bitcoin savings.  
ሃርድዌር ዋለተ ካብ ብዙሓት ስግኣታት ይከላኸል፣ ሶፍትዌር ዋለተስ ዘይክእልዎ። ናይ ብሕቲ መፍትሕታትካ ንኢንተርነት ፈጺሞም ስለዘይትንክፉ፡ ካብ ማልዌር፡ ቫይረስ፡ መጥቃዕቲ ፊሽንግ፡ ዋላ’ውን ካብ ኣብ ሓደጋ ዝወደቐት ኮምፒተር ይሕለዉ። እዚ ውሕስነት እዚ ንፈረምቲ ሃርድዌር ንነዊሕ እዋን ዝቅመጥ ሃብቲ ቢትኮይን ንምሕላው ወርቃዊ መለክዒ ይገብሮም።

It's important to understand the difference between hot wallets and cold wallets. Hot wallets are connected to the internet and offer convenience for frequent spending — like a checking account. Cold wallets, on the other hand, are kept offline, providing maximum protection for long-term storage — like a vault. A hardware signer is a practical balance between these two: it stays offline for key security but can still interact with your software wallet when you want to spend, giving you both usability and safety.  
ኣብ መንጎ ውዑይ ቦርሳን ዝሑል ቦርሳን ዘሎ ፍልልይ ምርዳእ ኣገዳሲ እዩ። ውዑያት ቦርሳታት ምስ ኢንተርነት ዝተኣሳሰሩ ኮይኖም ንተደጋጋሚ ወጻኢታት ምቹእነት ይህቡ - ከም ቸኪንግ ኣካውንት። ብኣንጻሩ ዝሑል ቦርሳታት ካብ መስመር ወጻኢ ይቕመጡ፣ እዚ ድማ ንነዊሕ እዋን ንምኽዛን ዝለዓለ መከላኸሊ ይህብ - ከም ካሳ። ሃርድዌር ፈራሚ ኣብ መንጎ እዞም ክልተ ግብራዊ ሚዛን እዩ: ንቁልፊ ድሕነት ካብ ኢንተርነት ወጻኢ ኮይኑ ይጸንሕ ግን ገና ክትጥቀመሉ ኣብ እትደልየሉ እዋን ምስ ሶፍትዌር ቦርሳኻ ክራኸብ ይኽእል እዩ፣ እዚ ድማ ንኽልቲኡ ተጠቃምነትን ድሕነትን ይህበካ።

> **💡 Tip / ምኽሪ፤**  
> Hardware wallets are the gold standard for securing Bitcoin. They keep your private keys offline, safe from malware and hackers.  
> ሃርድዌር ቦርሳታት ንቢትኮይን ውሕስነት ዝኸውን ወርቃዊ መለክዒ እዩ። ናይ ውልቂ መፍትሕታትካ ካብ ኢንተርነት ወጻኢ የቀምጡ፡ ካብ ማልዌርን ሃከራትን ውሑስ ይገብሩ።

---

### 11.1 Setup, Backup, and Test Recovery (Seed vs Passphrase Basics) / 11.1 ምድላው፣ ምዕቃብ ፥መዕቀቢ ምፍታንን (ቃላት ኣንጻር መሰረታዊ ፓስፍራዝ)
When setting up a hardware wallet, the device generates a seed phrase — usually 12 or 24 words — which acts as the master key to your Bitcoin. This phrase is the single most important backup: anyone who has it can control your funds. Writing it down securely (never digitally) and storing it in a safe place is essential.  
እቲ መሳርሒ ሃርድዌር ዋለተ ኣብ እተዳልወሉ እዋን፡ሓረግ ቃላት ይፈጥር - መብዛሕትኡ ግዜ 12 ወይ 24 ቃላት - እዚ ድማ ከም ዋና መፍትሕ ቢትኮይንካ ኮይኑ የገልግል። እዚ ሓረግ ቃላት እዚ እቲ ቀንዲ ኣገዳሲ መተካእታ እዩ: ዝኾነ ነዚ ዝረኸበ ሰብ ገንዘብካ ክቆጻጸሮ ይኽእል እዩ። ብውሑስ መንገዲ ምጽሓፍ (ካብ ድጅታላዊ ወጻኢ) ኣብ ውሑስ ቦታ ምኽዛን ኣገዳሲ እዩ።

For added protection, you can use a passphrase, sometimes called a '25th word.' This works like an extra password layered on top of the seed phrase. Even if someone steals your seed, they would still need your secret passphrase to access the wallet.  
ንተወሳኺ መከላኸሊ፡ ሓደ ሓደ ግዜ ‘መበል 25 ቃል’ ተባሂሉ ዝጽዋዕ መሕለፊ ሓረግ ቃላት ክትጥቀም ትኽእል ኢኻ። እዚ ከም ተወሳኺ ፓስዎርድ ኣብ ልዕሊ እቲ ሓረግ ቃላት ዝድረብ ኮይኑ ይሰርሕ። ዋላ ሓደ ሰብ ሓረግ ቃላት እንተ ሰረቐ፡ ናብቲ ቦርሳ ንምእታው ምስጢራዊ መሕለፊ ቃልካ የደለዮ።

Testing your backup is just as important as creating it. By doing a dry-run recovery on a fresh device or in recovery mode, you confirm that your seed and passphrase actually work without risking real funds. This gives you confidence that if your hardware signer is lost or destroyed, you can always recover your Bitcoin.  
ሓረግ ቃላት ምፍታን ልክዕ ከምቲ ክትፈጠሮ ከለኻ ኣገዳሲ እዩ። ኣብ ሓድሽ መሳርሒ ወይ ኣብ መረጋገጺ ደረጃ ብምግባር ሓረ ቃላትካ መሕለፊ ቃልካን ቅኑዓት ከም ዘለዉ ቅድሚ ገንዘብካ ኣብ ሓደጋ ምእታዉ ተረጋግጽ። እዚ ድማ እቲ ናይ ሃርድዌር ፌርማኻ እንተጠፊኡ ወይ እንተዓንዩ ኩሉ ግዜ ቢትኮይንካ ክትመልሶ ከም እትኽእል ርእሰ ተኣማንነት ይህበካ።

> **⚠️ Warning / መጠንቀቕታ፤**  
> Anyone who has your seed phrase can control your funds. Never share it, photograph it, or store it digitally.  
> ናትካ ዘርኢ ሓረግ ዘለዎ ሰብ ገንዘብካ ክቆጻጸሮ ይኽእል እዩ። ፈጺምካ ሼር ኣይትግበር፡ ስእሊ ኣይትስኣሎ፡ ወይ ብዲጂታል ኣይትኽዘን።

> **💡 Tip / ምኽሪ፤**  
> Always test your recovery before storing real Bitcoin. Wipe the device and restore from your seed phrase to confirm it works.  
> ኩሉ ግዜ ቅድሚ ናይ ብሓቂ ቢትኮይን ምኽዛንካ ምሕዋይካ ፈትኖ። ነቲ መሳርሒ ደርዝዮን ካብ ዘርኢ ሓረግካ ምምላስን ከም ዝሰርሕ ንምርግጋጽ።

---

### 11.2 Spending Safely with a Hardware Signer (PSBT Flow Where Applicable) / 11.2 ብውሑስ መንገዲ ምስ ሃርድዌር ፈራሚ (PSBT Flow ኣብ ዝምልከቶ ቦታ)
When you want to spend Bitcoin, the hardware signer ensures your private keys never leave the secure device. The transaction is first prepared on your computer or phone as a Partially Signed Bitcoin Transaction (PSBT). The unsigned transaction is then sent to the hardware signer, which securely signs it without ever exposing the keys. The signed transaction is finally returned to the computer or wallet app, ready to broadcast to the Bitcoin network.  
ቢትኮይን ከተውጽእ ኣብ እትደልየሉ እዋን፡ እቲ ናይ ሃርድዌር ፈራሚ፡ ናይ ብሕቲ መፍትሕታትካ ካብቲ ውሑስ መሳርሒ ፈጺሞም ከምዘይወጹ የረጋግጽ። እቲ ትራንዛክሽን መጀመርታ ኣብ ኮምፒተርካ ወይ ስልክኻ ከም Partially Signed Bitcoin Transaction (PSBT) ይዳሎ። ድሕሪኡ እቲ ዘይተፈረመ ትራንዛክሽን ናብቲ ናይ ሃርድዌር ፈራሚ ይለኣኽ፣ ንሱ ድማ ነቲ መፍትሕታት ፈጺሙ ከየቃልዐ ብውሑስ መንገዲ ይፈርሞ። እቲ ዝተፈረመ ትራንዛክሽን ኣብ መወዳእታ ናብቲ ናይ ኮምፒተር ወይ ዋለተ ኣፕ ይምለስ፣ ናብ መርበብ ቢትኮይን ንምፍናው ድሉው ይኸውን።

This process keeps your funds safe even if your computer is infected with malware, since the sensitive signing step happens only inside the secure hardware device. Always verify the transaction details — like addresses and amounts — directly on the device's screen before signing. This step prevents attackers from secretly changing payment details in the software.  
እዚ መስርሕ እዚ ዋላ ኮምፒተርካ ብማልዌር እንተተለኺፋ ገንዘብካ ውሑስ ይገብሮ፣ ምኽንያቱ እቲ ተሃዋሲ ስጉምቲ ምፍራም ኣብ ውሽጢ እቲ ውሑስ ሃርድዌር መሳርሒ ጥራይ እዩ ዝፍጸም። ኩሉ ግዜ ቅድሚ ምፍራምካ ዝርዝር ትራንዛክሽን - ከም ኣድራሻታትን መጠን ገንዘብን - ብቐጥታ ኣብ ስክሪን ናይቲ መሳርሒ ኣረጋግጽ። እዚ ስጉምቲ እዚ፡ መጥቃዕቲ ዝፍጽሙ ሰባት ኣብቲ ሶፍትዌር ዘሎ ዝርዝር ክፍሊት ብሕቡእ ከይቅይሩ ይኽልክል።

> **⚠️ Warning / መጠንቀቕታ፤**  
> Always verify transaction details (address and amount) on the hardware device screen before signing. Malware can change details in the software.  
> ኩሉ ግዜ ቅድሚ ምፍራምካ ኣብ ስክሪን ናይ ሃርድዌር መሳርሒ ዝርዝር ትራንዛክሽን (ኣድራሻን መጠን ገንዘብን) ኣረጋግጽ። ማልዌር ኣብቲ ሶፍትዌር ዝርዝር ክቕይር ይኽእል።

---

## Activities / ንጥፈታት
- **Activity: Dry-Run Recovery + Sign a Testnet PSBT / ንጥፈት: ናይ ምምላስ ፈተነ (ብዘይ ገንዘብ) + ናይ ቴስትኔት PSBT ምፍራም**  
  To practice safely, perform a dry-run recovery of your hardware wallet using only your seed phrase and passphrase, but without any real Bitcoin. Next, create and sign a testnet PSBT transaction.  
  ብውሑስ መንገዲ ንምልምማድ፡ ብዘይ ዝኾነ ናይ ብሓቂ ቢትኮይን፡ ብዘርኢ ሓረግካን ፓስፍረይዝካን ጥራይ ተጠቒምካ ኣብ ናይ ሃርድዌር ዋለትካ ናይ ምምላስ ፈተነ ኣካይድ። ቀጺልካ፡ ናይ ቴስትኔት PSBT ትራንዛክሽን ፍጠርን ፈርምን።

---

## Summary / ጽማረ
- Hardware wallets keep private keys offline, protecting them from malware and hackers.  
  ሃርድዌር ዋለታት ንናይ ብሕቲ መፍትሕታት ካብ ኢንተርነት ወጻኢ የቐምጥዎም፡ ካብ ማልዌርን ሃከራትን ይከላኸሉ።
- Hot wallets are convenient but less secure; cold wallets are most secure but less convenient.  
  ውዑያት ቦርሳታት ምቹኣት ግን ውሑድ ድሕነት ዘለዎም እዮም፤ ዝሑላት ቦርሳታት ዝለዓለ ድሕነት ዘለዎም ግን ውሑድ ምቹኣት እዮም።
- Hardware wallets balance security and usability.  
  ሃርድዌር ዋለታት ኣብ መንጎ ድሕነትን ተጠቃምነትን ሚዛን ይሕዙ።
- Seed phrases are the master key — write them on paper, never digitally, and test recovery.  
  ዘርኢ ሓረጋት ዋና መፍትሕ እዮም — ኣብ ወረቐት ጽሓፎም፡ ፈጺምካ ብዲጂታል ኣይትጽሓፎም፡ ከምኡውን ምሕዋይ ፈትን።
- Passphrases add an extra layer of security on top of the seed phrase.  
  ፓስፍረይዝ ኣብ ልዕሊ ዘርኢ ሓረግ ተወሳኺ ደረጃ ድሕነት ይውስኽ።
- PSBT flow keeps signing secure on the hardware device, even if your computer is compromised.  
  ኮምፒተርካ ዋላ እንተተበላሸወት፡ ኣሰራርሓ PSBT ኣብቲ ናይ ሃርድዌር መሳርሒ ምፍራም ውሑስ ይገብሮ።
- Always verify transaction details on the device screen before signing.  
  ኩሉ ግዜ ቅድሚ ምፍራምካ ዝርዝር ትራንዛክሽን ኣብ ስክሪን ናይቲ መሳርሒ ኣረጋግጽ።

---

## Key Terms / ቁልፊ ቃላት
- **Hardware wallet** — ሃርድዌር ዋለት (Hardware wallet)
- **Hardware signer** — ሃርድዌር መፈረሚ (Hardware signer)
- **PSBT** — PSBT (ብኸፊል ዝተፈረመ ቢትኮይን ትራንዛክሽን)
- **Passphrase** — ፓስፍረይዝ (Passphrase)
- **Cold storage** — ዝሑል ምዕቃብ (Cold storage)
- **Hot wallet** — ውዑይ ቦርሳ (Hot wallet)
- **Seed phrase** — ዘርኢ ሓረግ (Seed phrase)
- **Recovery** — ምሕዋይ/ምምላስ (Recovery)
