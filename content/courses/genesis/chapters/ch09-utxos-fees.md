# Chapter 9: UTXOs, Fees & Coin Control / ምዕራፍ 9 · UTXOs, Fees & Coin Control

Your balance is a pile of UTXO coins; choosing inputs changes fees and privacy.  
ሕሳብካ እኩብ ናይ UTXO ሳንቲም እዩ፤ ኢንፑትስ ምምራጽ ክፍሊትን ብሕትውናን ይቕይር።

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **UTXO model vs account model**  
  ሞዴል UTXO vs ሞዴል ኣካውንት።
- **Fees depend on size (vbytes), not amount**  
  ክፍሊት ኣብ መጠን (vbytes) እምበር ኣብ መጠን ኣይምርኮስን እዩ።
- **When and why to consolidate**  
  ምድልዳል መዓስን ስለምንታይን

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### Introduction / መእተዊ
When you open your Bitcoin wallet, you usually just see a single number: your balance. But under the hood, Bitcoin doesn't actually work like a simple bank account. Instead, it uses something called the UTXO model — short for Unspent Transaction Outputs. You can think of these UTXOs like individual coins in your pocket. Some are big, some are small, and together they add up to your total balance.  
ናይ ቢትኮይን ዋለትካ ክትከፍቶ ከለኻ፡ መብዛሕትኡ ግዜ ቁጽሪ ጥራይ ኢኻ ትርኢ፡ ንሳ ድማ ብዝሒ ገንዘብካ እያ። ብውሽጢ ግን፡ ቢትኮይን ከም ቀሊል ናይ ባንክ ሕሳብ ኣይሰርሕን እዩ። ኣብ ክንድኡ፡ UTXO model ዝበሃል ነገር ይጥቀም — ሓጺር ትርጉም Unspent Transaction Outputs። ነዞም UTXOs ከም ኣብ ጁባኻ ዝርከብ ሳንቲም ክትሓስቦም ትኽእል ኢኻ። ገሊኦም ዓበይቲ፡ ገሊኦም ንኣሽቱ፡ ብሓባር ድማ ናብ ጠቕላላ ሕሳብካ ይድመሩ።

Whenever you spend Bitcoin, you don't just 'subtract' money from your balance like a bank would. Instead, you pick specific UTXOs to spend, and if the one you use is larger than what you owe, you get change back — just like paying for a coffee with a $20 bill. This difference between 'account balances' and 'coin outputs' is one of the most important (and often misunderstood) parts of how Bitcoin works.  
ቢትኮይን ኣብ እትጥቀመሉ እዋን፡ ከምቲ ባንክ ዝገብሮ፡ ካብ ሕሳብካ ገንዘብ 'ምጉዳል' ጥራይ ኣይኮነን። ኣብ ክንድኡ፡ ትኸፍለሎም ፍሉያት UTXOs ትመርጽ፡ እቲ ትኸፍለሉ ድማ ካብቲ ዕዳኻ ዝዓበየ እንተኾይኑ፡ ማልስ ይምለሰልካ - ልክዕ ከምቲ ንሻሂ 20 ናቅፋ ሕሳብ ምኽፋል'ዩ ማልስ ይምጸካ። እዚ ኣብ መንጎ 'ሚዛን ሕሳብ'ን 'ውጽኢት ሳንቲምን' ዘሎ ፍልልይ፡ ሓደ ካብቶም ኣገደስቲ (መብዛሕትኡ ግዜ ድማ ብጌጋ ዝርድኡ) ክፋላት ናይቲ ቢትኮይን ብኸመይ ከም ዝሰርሕ እዩ።

---

### 9.0 What You Really Own — The UTXO Model / 9.0 ብሓቂ እንታይ ኢኻ ትውንን— ሞዴል UTXO
Each time you receive Bitcoin, it arrives as a new UTXO. You can imagine each UTXO as a digital coin with a fixed value stamped on it. For example, if someone sends you 0.015 BTC, that creates one coin of exactly 0.015 BTC in your wallet. If another person sends you 0.003 BTC, that's another coin.  
ኣብ ነፍሲ ወከፍ ቢትኮይን ኣብ እትቕበልሉ እዋን ከም ሓድሽ UTXO እዩ ዝመጽእ። ነፍሲ ወከፍ UTXO ከም ዲጂታላዊ ሳንቲም ጌርካ ክትሓስቦ ትኽእል ኢኻ፡ ኣብኡ ድማ ውሱን ዋጋ ተሓቲሙ። ንኣብነት ሓደ ሰብ 0.015 BTC እንተሰዲዱልካ፡ እዚ ኣብ ቦርሳኻ ልክዕ 0.015 BTC ዘለዎ ሓደ ሳንቲም ይፈጥር። ካልእ ሰብ 0.003 BTC እንተሰዲዱልካ ካልእ ሳንቲም እዩ።

When you make a payment, your wallet selects one or more of these coins to spend. If the total is bigger than the amount you need, your wallet automatically creates a 'change output' and sends the leftover Bitcoin back to a new address you control. This way, every spend creates new UTXOs for the receiver and often one for yourself. Ownership in Bitcoin, then, really means owning the right to spend specific UTXOs.  
ክፍሊት ክትከፍል ከለኻ፡ ቦርሳኻ ካብዞም ሳንቲማት ሓደ ወይ ልዕሊኡ ንኽትጥቀም ትመርጽ። እቲ ጠቕላላ ካብቲ ዘድልየካ መጠን ዝዓበየ እንተኾይኑ፡ ቦርሳኻ ብኣውቶማቲክ 'ናይ ማልስ ውጽኢት' ይፈጥር እሞ ነቲ ዝተረፈ ቢትኮይን ናብቲ እትቆጻጸሮ ሓድሽ ኣድራሻ ይመልሶ። በዚ መንገዲ እዚ ነፍሲ ወከፍ ወጻኢታት ንተቐባሊ ሓድሽ UTXO ይፈጥር መብዛሕትኡ ግዜ ድማ ኮላይንዓኻ ። ዋንነት ኣብ ቢትኮይን እምበኣር፡ ምውናን መሰል ምጥቃም እዞም UTXOs ማለት እዩ።

---

### 9.1 Fees and Input Selection / 9.1 ክፍሊትን ምምራጽ ኢንፑትስ
Unlike credit card payments or bank transfers, Bitcoin transaction fees aren't based on the amount of money being sent. Instead, fees are determined by the size of the transaction in virtual bytes (vB). More inputs and outputs make a transaction larger, and larger transactions cost more to include in the blockchain.  
ዘይከም ክፍሊት ብክረዲት ካርድ ወይ ባንክ ዝውውር፡ ክፍሊት ትራንዛክሽን ቢትኮይን ኣብቲ ዝለኣኽ መጠን ገንዘብ ዝተመርኮሰ ኣይኮነን። ኣብ ክንድኡ፡ ክፍሊት ብዓቐን ናይቲ ትራንዛክሽን ብቨርቹዋል ባይት (vB) ይውሰን። ዝያዳ እታዎታትን ውጽኢታትን ንሓደ ትራንዛክሽን ዝዓበየ ይገብሮ፣ ዝዓበየ ትራንዛክሽን ድማ ኣብቲ ብሎክቸይን ንምእታው ዝያዳ ወጻኢታት ይሓትት።

Here's where input selection matters:  
ምምራጽ እታዎት ኣገዳሲ ዝኾነሉ ኣብዚ እዩ፤

Most wallets automatically choose inputs for you, but understanding this process helps you save money on fees and keep better control over your privacy.  
መብዛሕትኦም ዋለታት ብኣውቶማቲክ እታዎታት ይመርጹልካ፣ ነዚ መስርሕ ምርዳእ ግን ኣብ ክፍሊት ገንዘብ ክትቆጥብን ኣብ ልዕሊ ብሕትውናኻ ዝሓሸ ቁጽጽር ክትገብርን ይሕግዘካ።

- If you use many small UTXOs to pay, the transaction grows bigger, and fees increase.  
  ብዙሓት ንኣሽቱ UTXOs ተጠቒምካ ክትከፍል እንተኾንካ፡ እቲ ትራንዛክሽን ይዓቢ፡ ክፍሊት ድማ ይውስኽ።
- If you use fewer, larger UTXOs, the transaction is smaller and cheaper, but you may reveal more information about your balance.  
  ውሑድን ዝዓበየን UTXO እንተተጠቒምካ፡ እቲ ትራንዛክሽን ዝነኣሰን ዝሓሰረን እዩ፡ ግን ብዛዕባ ሚዛንካ ዝያዳ ሓበሬታ ክትገልጽ ትኽእል ኢኻ።

> **💡 Tip / ምኽሪ፤**  
> Fees depend on transaction size (vbytes), not the amount being sent. A transaction sending 0.001 BTC can cost the same as one sending 1 BTC if they're the same size.  
> ክፍሊት ኣብ ዓቐን ትራንዛክሽን (vbytes) እምበር ኣብቲ ዝለኣኽ መጠን ገንዘብ ኣይምርኮስን እዩ። 0.001 BTC ዝልእኽ ትራንዛክሽን ተመሳሳሊ ዓቐን እንተሃልይዎም ምስቲ 1 BTC ዝልእኽ ሓደ ዓይነት ዋጋ ክህልዎ ይኽእል።

---

### 9.2 UTXO Management & When to Consolidate / 9.2 ምሕደራ UTXO & መዓስ ምድልዳል
Managing your UTXOs is like deciding which coins to carry in your pocket. If you always keep lots of small coins, paying exact amounts is easy — but your wallet becomes heavy, and when you finally spend them all at once, it takes more effort. In Bitcoin, too many small UTXOs can lead to high fees later because each one adds weight to a transaction.  
ምምሕዳር ዩቲኤክስኦታትካ ኣየኖት ሳንቲም ኣብ ጁባኻ ክትሕዝ ከም ዘለካ ምውሳን ማለት እዩ። ኩሉ ግዜ ብዙሓት ንኣሽቱ ሳንቲማት እንተሓዚኻ፡ ልክዕ መጠን ገንዘብ ምኽፋል ቀሊል እዩ — ቦርሳኻ ግን ከቢድ ይኸውን፡ ኣብ መወዳእታ ድማ ንኹሎም ብሓንሳብ ምስ ኣውጻእካዮም፡ ዝያዳ ጻዕሪ ይሓትት። ኣብ ቢትኮይን፡ ብዙሓት ንኣሽቱ UTXOs ድሒሮም ልዑል ክፍሊት ከስዕቡ ይኽእሉ እዮም ምኽንያቱ ነፍሲ ወከፎም ንሓደ ትራንዛክሽን ክብደት ስለ ዝውስኹሉ።

On the other hand, keeping only a few large UTXOs makes spending simpler but can hurt your privacy, since large outputs make your payments more identifiable. That's where consolidation comes in. Consolidation means combining many small UTXOs into a single one, usually when fees are cheap. It's like exchanging a handful of coins for a single bill at the bank. The trick is choosing the right time to consolidate so you stay efficient without overspending on fees.  
ብኻልእ ወገን ድማ ውሑዳት ዓበይቲ UTXOs ጥራይ ምሕላው ወጻኢታት ቀሊል ይገብሮ ግን ንብሕትውናኻ ክጎድእ ይኽእል እዩ፡ ምኽንያቱ ዓበይቲ ውጽኢታት ንክፍሊትካ ዝያዳ መለለዪ ይገብሩ። ኣብኡ እዩ ምድማር ዝኣቱ። ምድማር ማለት ብዙሓት ንኣሽቱ UTXOs ኣብ ሓደ ምውህሃድ ማለት እዩ፣ መብዛሕትኡ ግዜ ክፍሊት ርካሽ ኣብ ዝኾነሉ እዋን። ኣብ ባንክ ብኣጻብዕ ዝቑጸር ሳንቲም ብሓንቲ ኖት ምልዋጥ ማለት እዩ። እቲ ብልሓት ንምድልዳል ትኽክለኛ ግዜ ምምራጽ እዩ ስለዚ ኣብ ክፍሊት ልዕሊ ዓቐን ወጻኢታት ከይገበርካ ብቑዕ ክትጸንሕ።

> **📝 Note / መተሓሳሰቢ፤**  
> Consolidate during low-fee periods to save money. But be aware that consolidating can link your UTXOs together, potentially reducing privacy.  
> ገንዘብ ንምቑጣብ ኣብ ትሑት ክፍሊት ኣብ ዝኽፈልሉ እዋን ምድልዳል። ግን ምድልዳል ንUTXOታትካ ብሓባር ከራኽቦም ከም ዝኽእልን ብሕታዊነት ክቕንስ ከም ዝኽእልን ኣስተውዕል።

---

## Activities / ንጥፈታት
- **Activity: Plan a Spend from a UTXO Set / ንጥፈት: ካብ ናይ UTXO ስብስብ ወጻኢ ምምጻእ ምውጣን**  
  Each group gets a sheet with UTXOs of different sizes (e.g. 0.002, 0.005, 0.01 BTC). Make a payment of 0.007 BTC and decide:  
  ነፍሲ ወከፍ ጉጅለ ሒደት UTXOs ዝተፈላለየ ዓቐን ዘለዎ ወረቐት ይወሃቦ (ንኣብነት፡ 0.002 BTC, 0.005 BTC, 0.01 BTC)። 0.007 BTC ናብ ሸያጣይ ምኽፋል ዕዮ፡ ወሳኒ ድማ፤
  - Which UTXOs should you pick? / ኣየኖት UTXOs ክምርጹ ኣለዎም?
  - How much change will you receive? / ክንደይ ማልስ ይምለሰሎም?
  - How many inputs/outputs, and what is the fee? / ክንደይ እታዎታትን ውጽኢታትን ክህልዎ እዩ፡ ክፍሊት ኸ ብኸመይ ይርኤ?

---

## Summary / ጽማረ
- Bitcoin uses the UTXO model, not account balances — you own specific digital coins.  
  ቢትኮይን UTXO model ይጥቀም እምበር ናይ ሕሳብ ሚዛን ኣይኮነን — ፍሉያት ዲጂታላዊ ሳንቲም ኢኻ ትውንን።
- Each receive creates a new UTXO; spending selects UTXOs and creates change.  
  ነፍሲ ወከፍ ምቕባል ሓድሽ UTXO ይፈጥር፤ ምጥቃም ድማ UTXOs ትመርጽ ናይ ማልስ ድማ ይፈጥር።
- Fees depend on transaction size (vbytes), not the amount being sent.  
  ክፍሊት ኣብ ዓቐን ትራንዛክሽን (vbytes) ዝምርኮስ እዩ እምበር ኣብቲ ዝለኣኽ ክፍሊት ኣይኮነን።
- Too many small UTXOs increase fees; too few large ones reduce privacy.  
  ብዙሓት ንኣሽቱ UTXOs ክፍሊት ይውስኹ፤ ውሑዳት ዓበይቲ ድማ ብሕትውና ይቕንሱ።
- Consolidation combines UTXOs efficiently, but timing and privacy matter.  
  ምድልዳል UTXOs ብቑዕ ኣብ ዝኾነሉ ይሕዝ፡ ሓኖ ምሓዝን ብሕትውናን ግን ኣገዳሲ እዩ።

---

## Key Terms / ቁልፊ ቃላት
- **UTXO** — Unspent Transaction Output (ዘይተጠቕሰ ናይ ትራንዛክሽን ውጽኢት)
- **Input** — እታዎት (Input)
- **Output** — ውጽኢት (Output)
- **Change** — ማልስ (Change)
- **vBytes** — ቨርቹዋል ባይት (vBytes)
- **Consolidation** — ምድልዳል (Consolidation)
- **Transaction size** — ዓቐን ትራንዛክሽን (Transaction size)
