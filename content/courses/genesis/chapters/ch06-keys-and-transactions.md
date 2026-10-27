# Chapter 6: Keys and Transactions / ምዕራፍ 6 · መፍትሕን ትራንዛክሽንን

Ownership is math: keys and signatures authorize every spend.  
ዋንነት ቁጽሪ እዩ: መፍትሕን ፌርማን ንነፍሲ ወከፍ ወጻኢታት ፍቓድ ይህቡ።

> “Not your keys, not your coins.”  
> “መፍትሕካ ኣይኮነን ሳንቲምካ ኣይኮነን።”

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **Public/private keys and digital signatures**  
  ህዝባዊ/ብሕታዊ መፍትሕን ዲጂታላዊ ፌርማን
- **Transaction flow from creation to confirmation**  
  ዋሕዚ ትራንዛክሽን ካብ ምፍጣር ክሳብ ምርግጋፅ

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### Introduction / መእተዊ
If you have a house, you lock it with a key. Only you can open the door, because you own the key. Bitcoin works similarly. Instead of a physical key, it uses digital keys — long strings of numbers and letters — that prove ownership. But how do these keys allow us to send Bitcoin safely over the internet, where anyone could try to cheat?  
ገዛ እንተሃልዩካ ብመፍትሕ ትዓጽዎ። ንስኻ ጥራይ ኢኻ ነቲ ማዕጾ ክትከፍቶ እትኽእል፣ ምኽንያቱ እቲ መፍትሕ ንስኻ ኢኻ ትውንኖ። ቢትኮይን እውን ብተመሳሳሊ እዩ ዝሰርሕ። ኣብ ክንዲ ኣካላዊ መፍትሕ፡ ዋንነት ዘረጋግጹ ዲጂታላዊ መፍትሕታት - ነዊሕ ሕብረ ቁጽርታትን ፊደላትን - ይጥቀም። እዞም መፍትሕታት ግን ከመይ ጌሮም እዮም ቢትኮይን ብኢንተርነት ብዘይ ስግኣት ክንሰድድ ዘኽእሉና፣ ዝኾነ ሰብ ከታልል ክፍትን ዝኽእል?

The answer lies in digital signatures, a kind of mathematical stamp that proves, beyond doubt, that a transaction is real and belongs to you.  
እቲ መልሲ ኣብ ዲጂታላዊ ፌርማታት እዩ ዝርከብ፣ እዚ ድማ ሓደ ዓይነት ናይ ሒሳብ ማሕተም እዩ፣ ኪኖ ጥርጣረ፣ ሓደ ትራንዛክሽን ሓቀኛን ናትካ ምዃኑን ዘረጋግጽ እዩ።

In this chapter, we'll explore how Bitcoin utilizes keys and signatures to ensure that money cannot be stolen, copied, or forged.  
ኣብዚ ምዕራፍ፡ ቢትኮይን ገንዘብ ክስረቕ፡ ክቕዳሕ ወይ ክምስራሕ ከምዘይክእል ንምርግጋጽ መፍትሕን ፌርማን ብኸመይ ከም ዝጥቀም ክንምርምር ኢና።

### Seed Phrase Example / ዘርኢ ሓረግ ኣብነት (seed Phrase)
A seed phrase is the most important part of your Bitcoin wallet. It is a list of 12 or 24 simple words that create and control your bitcoin. These words are not a password and they are not stored on the internet. Whoever has the seed phrase can fully access and spend the bitcoin in that wallet. This is why a seed phrase must be written down offline, kept private, and never shared with anyone.  
ዘርኢ ሓረግ እቲ ኣገዳሲ ክፋል ናይ ቢትኮይን ቦርሳኻ እዩ። ቢትኮይንካ ዝፈጥሩን ዝቆጻጸሩን 12 ወይ 24 ቀለልቲ ቃላት ዝሓዘ ዝርዝር እዩ። እዞም ቃላት እዚኦም ፓስዎርድ ኣይኮኑን ኣብ ኢንተርነት እውን ኣይክዘኑን እዮም። እቲ ዘርኢ ሓረግ ዘለዎ ሰብ ነቲ ኣብቲ ቦርሳ ዘሎ ቢትኮይን ምሉእ ብምሉእ ክረኽቦን ከውዕሎን ይኽእል። ነዚ እዩ ድማ ሓደ ዘርኢ ሓረግ ካብ መስመር ወጻኢ ክጽሓፍ፣ ብሕታዊ ክኸውን፣ ምስ ዝኾነ ሰብ ፈጺሙ ክካፈል ዘለዎ።

You should never take a screenshot of your seed phrase, store it in your phone, send it on WhatsApp, email, or cloud storage. Legitimate wallet apps, teachers, or support teams will never ask for your seed phrase. If you lose your phone but still have your seed phrase, you can recover your wallet on a new device. If someone else gets your seed phrase, they can take your bitcoin and there is no way to reverse it.  
ናይ ዘርኢ ሓረግካ ስክሪን ሾት ክትወስድ፡ ኣብ ስልክኻ ክትዕቅቦ፡ ኣብ ዋትስኣፕ፡ ኢመይል፡ ወይ ክላውድ ስቶሬጅ ክትሰዶ ፈጺምካ የብልካን። ሕጋዊ ናይ ቦርሳ መተግበሪታት፡ መምህራን፡ ወይ ናይ ደገፍ ጋንታታት ንናይ ዘርኢ ሓረግካ ፈጺሞም ኣይሓቱን እዮም። ስልክኻ እንተጠፊኡካ ግን ገና ናይ ዘርኢ ሓረግካ እንተሃልዩካ፡ ቦርሳኻ ኣብ ሓድሽ መሳርሒ ክትመልሶ ትኽእል ኢኻ። ካልእ ሰብ ናትካ ዘርኢ ሓረግ እንተረኺቡ ናትካ ቢትኮይን ክወስዶ ይኽእል እዩ ንዕኡ ድማ ንድሕሪት ዝምለሰሉ መንገዲ የለን።

In Bitcoin, there is no "forgot password" button and no customer support that can help you recover lost funds. Your seed phrase is your money, and protecting it is your responsibility. Treat it like physical cash or gold—once it's gone, it's gone.  
ኣብ ቢትኮይን፡ "forgot password" ዝብል መጠወቒን ዝጠፍአ ገንዘብ ንምምላስ ክሕግዘካ ዝኽእል ናይ ዓማዊል ደገፍን የለን። ዘርኢ ሓረግካ ገንዘብካ እዩ፡ ምሕላው ድማ ሓላፍነትካ እዩ። ከም ኣካላዊ ጥረ ገንዘብ ወይ ወርቂ ጌርካ ርኣዮ-ሓንሳብ ምስ ጠፍአ፡ ጠፊኡ እዩ።

Example of a 24-word seed phrase:  
ናይ 24 ቃላት ዘርኢ ሓረግ ኣብነት:
```
1. adult      7. absorb     13. adapt      19. address
2. ahead      8. alert      14. airport    20. account
3. alarm      9. absurd     15. acquire    21. accuse
4. agent     10. achieve    16. ability    22. acid
5. aisle     11. action     17. about      23. acoustic
6. alien     12. age        18. absent     24. across
```

> **⚠️ Warning / መጠንቀቕታ፤**  
> If someone gets your seed phrase, they can take your coins without asking. Never share it, photograph it, or store it digitally.  
> ሓደ ሰብ ናይ ዘርኢ ሓረግካ እንተረኺቡ፡ ከይሓተተ ሳንቲምካ ክወስድ ይኽእል እዩ። ፈጺምካ ሼር ኣይትግበር፡ ስእሊ ኣይትስኣሎ፡ ወይ ብዲጂታል ኣይትኽዘን።

> **💡 Tip / ምኽሪ፤**  
> Write your seed phrase on paper, check spelling twice, and store it in a safe place where fire, water, and curious eyes can't reach.  
> ሓረግ ዘርእኻ ኣብ ወረቐት ጽሓፍ፡ ኣጸሓሕፋ ክልተ ግዜ መርምር፡ ሓዊ፡ ማይን ንኽፈልጡ ዝደልዩ ኣዒንቲ ኣብ ዘይበጽሖ ውሑስ ቦታ ድማ ኣቐምጦ።

### 6.1 Public/Private Keys Explained Simply / 6.1 ህዝባዊ/ብሕታዊ መፍትሕታት ብቐሊሉ ተገሊጹ
Think of your Bitcoin wallet as a mailbox:  
ብዛዕባ ቢትኮይን ቦርሳኻ ከም ሳጹን ፖስታ ሕሰቦ፤

This system is based on cryptography, but you don't need to be a mathematician to grasp the idea. Just remember:  
እዚ ስርዓት እዚ ኣብ ክሪፕቶግራፊ ዝተመርኮሰ ኮይኑ፡ ነቲ ሓሳብ ንምሓዝ ግን ክኢላ ሒሳብ ምዃን ኣየድልየካን እዩ። ጥራይ ዘክር፤

- **The public key is like your mailbox address. Anyone can know it, and people use it to send you Bitcoin.**  
  እቲ ህዝባዊ መፍትሕ ከም ኣድራሻ ሳጹን ፖስታኻ እዩ። ዝኾነ ሰብ ክፈልጦ ይኽእል እዩ፡ ሰባት ድማ ቢትኮይን ክሰዱልካ ይጥቀሙሉ።
- **The private key is like the key that opens the mailbox. Only you should have it. If you lose it, you lose access to your Bitcoin forever.**  
  እቲ ብሕታዊ መፍትሕ ከምቲ ነቲ ሳጹን ፖስታ ዝኸፍት መፍትሕ እዩ። ንስኻ ጥራይ ክህልወካ ይግባእ። እንተ ስኢንካዮ ንሓዋሩ ናብ ቢትኮይንካ ክትረኽቦ ትስእን።
- **Together, these keys form the heart of Bitcoin security:**  
  እዞም መፍትሕታት ብሓባር ልቢ ድሕነት ቢትኮይን ይፈጥሩ፤
- **Your private key allows you to sign transactions (like writing your signature on a cheque).**  
  ናይ ብሕቲ መፍትሕካ ትራንዛክሽን ክትፍርም የኽእለካ (ከም ፌርማኻ ኣብ ቸክ ምጽሓፍ)።
- **The public key allows others to verify that the signature is genuine.**  
  እቲ ህዝባዊ መፍትሕ ካልኦት እቲ ፌርማ ሓቀኛ ምዃኑ ከረጋግጹ የኽእሎም።
- **Public = address for receiving.**  
  ህዝባዊ = ኣድራሻ ንመቐበሊ።
- **Private = proof of ownership.**  
  ናይ ብሕቲ = መርትዖ ዋንነት።

> **⚠️ Warning / መጠንቀቕታ፤**  
> If you lose your private key, you lose access to your Bitcoin forever. There is no recovery. This is why backing up your seed phrase is critical.  
> ናይ ብሕቲ መፍትሕካ እንተ ጠፊኡካ፡ ንሓዋሩ ናብ ቢትኮይንካ ክትረኽቦ ትስእን። ምሕዋይ የለን። ነዚ እዩ ድማ ነቲ ዘርኢ ሓረግካ ምድጋፍ ወሳኒ ዝኸውን።

#### Public Key Example / ህዝባዊ ቁልፊ ኣብነት
This is what others use to send you Bitcoin  
ካልኦት ቢትኮይን ክሰዱልካ ዝጥቀሙሉ እዚ እዩ።
```
02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5fb
```
Or as a Bitcoin address:  
ወይ ድማ ከም ኣድራሻ ቢትኮይን፤
```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

#### Private Key Example / ናይ ብሕቲ ቁልፊ ኣብነት
Keep this secret and secure - never share it!  
ነዚ ምስጢርን ውሑስን ሓልዎ - ፈጺምካ ሼር ግበርዎ!
```
L5EZftvrYaSudiozVRzTqLcHLNDoVn7H5HSfM9BAN6tMJX8oTWz6
```
Or in hex format:  
ወይ ድማ ብመልክዕ ሄክስ፤
```
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

#### Lightning Network Invoice Example / ላይትኒንግ መርበብ ፋክቱር ኣብነት
A Lightning invoice is a payment request for fast, low-fee Bitcoin transactions on the Lightning Network  
ፋክቱር ላይትኒንግ ኣብ መርበብ ላይትኒንግ ንዝግበር ቅልጡፍን ትሑት ክፍሊትን ትራንዛክሽን ቢትኮይን ናይ ክፍሊት ሕቶ እዩ።
```
lnbc20u1p5cpmx0dqqpp5d5mzfqk3kjv46ujecwtkr0337gm7nlw43n69rlyd0uvlg8tx0sxqsp56wh3phhm0vkpxxtyhxt6u3fm0pfec5nvqy8qz4vp9y5lp0jz033s9qrsgqcqpjnp4q0plte0wjhr4t478uwp02wvl2gra39jamke83jfh8506kjd0dg0gyxqyz5vqrzjqt07ejxdllcugwyqydh5j3m3wgxlqew3ywmfgljfv0u99ssumtxuzqqqqqqqqqqqqgqqqqqqqqqqqqqqrcftdaunftydx463n9chlj6j3dd3hp570hz725nd773hmna2cq9q655djym8ph86wyvdqeta37p5lycaksk9xsfgs3rlnezwx7m8tfsqqq9a2mfy
```
Lightning invoices enable instant, low-cost payments and are used for everyday Bitcoin transactions  
ላይትኒንግ ፋክቱራት ቅጽበታዊ፡ ትሑት ወጻኢታት ዘለዎ ክፍሊት ዘኽእል ኮይኑ፡ ንመዓልታዊ ትራንዛክሽን ቢትኮይን ዝውዕል እዩ።

### 6.2 Peer-to-Peer Transactions (P2P) / 6.2 ካብ መዛኑ ዝግበር ትራንዛክሽን (P2P)
So how does a Bitcoin transaction actually happen? Let's follow the steps:  
ስለዚ ብሓቂ ናይ ቢትኮይን ትራንዛክሽን ከመይ ይፍጸም? እዞም ዝስዕቡ ስጉምትታት ንኽተል፤

This peer-to-peer process is what makes Bitcoin powerful: no bank, no government, and no middleman—just cryptography and consensus.  
እዚ መዛኑ ንመዛኑ ዝግበር መስርሕ እዩ ንቢትኮይን ሓያል ዝገብሮ: ባንክ የለን: መንግስቲ የለን: ከምኡውን ማእከላይ ሰብ የለን-ምስጢራዊ ጽሑፍን ምርድዳእን ጥራይ።

- **Creating the Transaction – Alice wants to send 0.01 BTC to Bob. She opens her wallet app, enters Bob's public address, and signs the transaction with her private key.**  
  ምፍጣር ትራንዛክሽን – ኣሊስ 0.01 BTC ናብ ቦብ ክትሰድድ ትደሊ። ንሳ ድማ ናይ ቦርሳ ኣፕ ከፊታ ኣብ ህዝባዊ ኣድራሻ ቦብ ኣእትያ ነቲ ትራንዛክሽን ብናይ ብሕቲ መፍትሓ ትፈርሞ።
- **Broadcasting – The signed transaction is sent out to the Bitcoin network (like announcing to the whole world: 'I'm sending this money to Bob').**  
  ፈነወ – እቲ ዝተፈረመ ትራንዛክሽን ናብ መርበብ ቢትኮይን ይለኣኽ (ከምቲ ንመላእ ዓለም ምእዋጅ: ‘እዚ ገንዘብ ናብ ቦብ ይሰዶ ኣለኹ’)።
- **Verification – Thousands of computers (called nodes) verify the signature against Alice's public key to ensure its valid and not a forgery. If it checks out, the transaction is considered legitimate.**  
  ምርግጋጽ – ኣሽሓት ኮምፒዩተራት (ኖድስ ዝበሃላ) ነቲ ፌርማ ኣንጻር ህዝባዊ መፍትሕ ኣሊስ ብምርግጋጽ ቅኑዕ ምዃኑን ናይ ሓሶት ከምዘይኮነን የረጋግጻኦ። እንተወጺኡ እቲ ትራንዛክሽን ከም ሕጋዊ ይቑጸር።
- **Confirmation – Miners collect valid transactions into blocks. Once Alice's transaction is added to a block and confirmed by the network, it becomes permanent. No one can erase it, no one can double-spend it.**  
  ምጽዳቕ – ዕደናውያን ቅኑዕ ትራንዛክሽን ናብ ብሎክ ይእክቡ። ትራንዛክሽን ኣሊስ ኣብ ሓደ ብሎክ ምስ ተወሰኸን ብኔትወርክ ምስ ተረጋገጸን ቀዋሚ ይኸውን። ዝኾነ ሰብ ክድምስሶ ኣይክእልን፣ ካልኣይ ግዜ ክጥቀመሉ ዝኽእል የለን።

---

### Activity: Role-play a Bitcoin Transaction / ዕማም: ናይ ቢትኮይን ትራንዛክሽን ተራ-ምጽዋት
This is a fun way to make the process real for students.  
እዚ ነቲ መስርሕ ንተመሃሮ ጭቡጥ ንምግባር ዘሐጉስ መንገዲ እዩ።

Setup: / ምድላው:
- Choose 5–6 volunteers to act out different roles.  
  ዝተፈላለየ ተራ ዝጻወቱ 5–6 ወለንተኛታት ምረጽ።
- Give each role a simple prop:  
  ንነፍሲ ወከፍ ተራ ቀሊል መሳርሒ ሃብ:
  - Alice (sender) — a piece of paper labeled 'Private Key.'  
    ኣሊስ (ሰዳዲት) — 'ናይ ብሕቲ መፍትሕ' ዝብል ወረቐት።
  - Bob (receiver) — a paper labeled 'Public Key/Address.'  
    ቦብ (ተቐባሊ) — 'ህዝባዊ መፍትሕ/ኣድራሻ' ዝብል ወረቐት።
  - Verifiers (2–3 students) — 'Network Nodes.'  
    ኣረጋጋጽቲ (2–3 ተመሃሮ) — 'ናይ መርበብ ኖድስ'።
  - Miner — 'Block Builder.'  
    ዕደናይ — 'ብሎክ ሃናጺ'።

Steps: / ስጉምትታት:
1. **Alice creates a transaction:** She writes on paper: 'I want to send 0.01 BTC to Bob,' then 'signs' it with her private key.  
   ኣሊስ ትራንዛክሽን ትፈጥር: ኣብ ወረቐት 'ናብ ቦብ 0.01 BTC ክሰድድ እደሊ' ኢላ ትጽሕፍ፡ ድሕሪኡ ብናይ ብሕቲ መፍትሓ 'ትፈርሞ'።
2. **Broadcast:** She hands it to the 'network.'  
   ፈነወ: ናብቲ 'መርበብ' ተረክቦ።
3. **Verification:** The network students check if Alice's private key matches her public key. If valid, they shout: 'Transaction approved!'  
   ምርግጋጽ: ተመሃሮ መርበብ ናይ ብሕቲ መፍትሕ ኣሊስ ምስ ህዝባዊ መፍትሓ ዝሰማማዕ ምዃኑ ይምርምሩ። ቅኑዕ እንተኾይኑ፡ 'ትራንዛክሽን ጸዲቑ!' ይብሉ።
4. **Miner:** The miner collects the approved transaction and tapes it to a big sheet labeled 'Block.'  
   ዕደናይ: ዕደናይ ነቲ ዝጸደቐ ትራንዛክሽን ኣኪቡ 'ብሎክ' ኣብ ዝብል ዓቢ ወረቐት ይለጥፎ።
5. **Final Confirmation:** The class now sees that Alice's payment is locked into the blockchain.  
   ናይ መወዳእታ ምርግጋጽ: ክፍሊ ሕጂ ክፍሊት ኣሊስ ኣብቲ ብሎክቸይን ከም ዝተዓሸገ ይርኢ።

## Image references
- `images/book_images/P2p.jpeg`
