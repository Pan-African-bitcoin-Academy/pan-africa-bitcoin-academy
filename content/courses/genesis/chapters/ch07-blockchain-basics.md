# Chapter 7: Blockchain Basics / ምዕራፍ 7 · መሰረታዊ ብሎክቸይን

Blocks are linked pages; change one and you break the chain.  
ብሎኮታት ዝተኣሳሰሩ ገጻት እዮም፤ ሓደ ተቀይርካ ሰንሰለት ትሰብሮ።

> “Don't trust, verify.”  
> “ኣይትእመን ኣረጋግጽ።”

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **Blocks, hashes, chaining**  
  ብሎክ፡ ሃሽ፡ ሰንሰለት።
- **Immutability and tamper-evidence**  
  ዘይምልዋጥን ምትዕንቓፍን-መርትዖ
- **Role of miners and Proof of Work**  
  ተራ ዕደናውያንን መርትዖ ስራሕን።

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### Introduction / መእተዊ
Imagine you and your friends are keeping a notebook where you write down who owes whom money. At first, it seems simple: whenever someone pays or borrows, you record it. But soon, problems appear. What if someone erases a line? What if someone changes the numbers later to make themselves look richer? Who is supposed to guard the notebook so nobody cheats?  
ንስኻን ኣዕሩኽትኻን መን ንመን ገንዘብ ዕዳ ከም ዘለዎ እትጽሕፈሉ ደፍተር ሒዝኩም ከም ዘለኹም እሞ ሕሰብ። ኣብ መጀመርታ ቀሊል ይመስል: ሓደ ሰብ ክኸፍል ወይ ክለቅሕ ከሎ ንስኻ ትምዝግቦ። ነዊሕ ከይጸንሐ ግን ጸገማት ይቕልቀል። ሓደ ሰብ መስመር እንተ ደምሲሱኸ፧ ሓደ ሰብ ንርእሱ ዝያዳ ሃብታም ንኽመስል ድሒሩ ቁጽሪ እንተቐይሩኸ? መን እዩ ነታ ደፍተር ዝሕሉ ሰብ ከይተታልል?

Blockchain is a clever solution to this problem. It's like a special notebook that everyone shares, where the pages are locked together in such a way that nobody can secretly change them. Each page represents a 'block,' and when all the pages are linked, we get a 'blockchain.'  
ብሎክቸይን ነዚ ጸገም ዝኸውን ውሕሉል መፍትሒ እዩ። ከም ፍሉይ ደፍተር ኩሉ ሰብ ዝካፈሎ ኮይኑ፡ እቶም ገጻት ብሕቡእ ክቕይሮም ብዘይክእል መንገዲ ተዓጽዮም ይርከቡ። ነፍሲ ወከፍ ገጽ ንሓደ ‘ብሎክ’ ይውክል፣ ኩሎም ገጻት ምስ ተተሓሓዙ ድማ ‘ብሎክቸይን’ ንረክብ።ሕንቅልሕንቅሊተይ ኣብ ቦታኦም ስለዝተዓጽዉ፡ ታሪኽ ዳግማይ ምጽሓፍ ዳርጋ ዘይከኣል ይገብሮ።

### 7.0 What Is a Block? / 7.0 ብሎክ እንታይ እዩ?
A block is like one page in this shared notebook. On it, you'll find a list of transactions — basically, records of who sent money to whom. But there's something extra: each block also contains a unique code called a hash, along with a link to the block that came before it. This design is what makes blockchain so secure. If anyone tries to change even a single line in one block, its hash will change too. And since the next block depends on the old hash, the entire chain would instantly cease to match. In other words, the blocks lock each other in place like puzzle pieces, making history nearly impossible to rewrite.  
ብሎክ ከም ሓደ ገጽ ኣብዚ ናይ ሓባር ደፍተር እዩ። ኣብኡ፡ ዝርዝር ናይ ትራንዛክሽን ክትረክብ ኢኻ — ብመሰረቱ፡ መን ገንዘብ ንመን ከም ዝሰደደ መዛግብቲ። ግን ተወሳኺ ነገር ኣሎ፡ ነፍሲ ወከፍ ብሎክ ውን ሃሽ ዝበሃል ፍሉይ ኮድ ዝሓዘ ኮይኑ፡ ምስቲ ቅድሚኡ ዝመጸ ብሎክ ዝወስድ መላግቦ ኣለዎ። እዚ ዲዛይን እዚ እዩ ንብሎክቸይን ኣዝዩ ውሑስ ዝገብሮ። ዝኾነ ሰብ ኣብ ሓደ ብሎክ ዋላ ሓንቲ መስመር ክቕይር እንተፈቲኑ ሃሽኡ እውን ክቕየር እዩ። ከምኡ’ውን እቲ ዝቕጽል ብሎክ ኣብቲ ናይ ቀደም ሃሽ ስለ ዝምርኮስ፡ ምሉእ ሰንሰለት ብቕጽበት ምትእስሳር ምተቛረጸ። ብኻልእ ኣዘራርባ፡ እቶም ብሎኮታት ከም ቁራጽ ሕንቅልሕንቅሊተይ ኣብ ቦታኦም ስለዝተዓጽዉ፡ ታሪኽ ዳግማይ ምጽሓፍ ዳርጋ ዘይከኣል ይገብሮ።

### 7.1 Why Hashes Matter / 7.1 ስለምንታይ ሃሽ ኣገዳሲ ምዃኑ
The hash is the secret ingredient that keeps blockchain tamper-proof. You can think of it like a fingerprint for information. No two pieces of information share the same fingerprint, and even the tiniest change — like switching one letter in a sentence — completely changes the fingerprint. Because every block depends on the hash of the block before it, the blockchain is quick to expose tampering. If someone alters a block, all the fingerprints after it no longer fit.  
እቲ ሃሽ ንብሎክቸይን ምትዕንቓፍ ዘይብሉ ዝገብሮ ምስጢራዊ ቀመም እዩ። ንሓበሬታ ከም ኣሰር ኣጻብዕቲ ክትሓስቦ ትኽእል ኢኻ። ክልተ ሓበሬታ ሓደ ዓይነት ኣሰር ኣጻብዕቲ ዝካፈሉ የለዉን፡ ዋላ እቲ ዝነኣሰ ለውጢ - ከም ኣብ ሓረግ ሓንቲ ፊደል ምቕያር - ነቲ ኣሰር ኣጻብዕቲ ምሉእ ብምሉእ ይቕይሮ። ነፍሲ ወከፍ ብሎክ ኣብቲ ቅድሚኡ ዘሎ ብሎክ ሃሽ ስለ ዝምርኮስ፡ እቲ ብሎክቸይን ንዝፍጠር ምትዕንቓፍ ንምቅላዕ ቅልጡፍ እዩ። ሓደ ሰብ ንሓደ ብሎክ እንተቐይርዎ፡ ኩሉ እቲ ድሕሪኡ ዘሎ ኣሰር ኣጻብዕቲ ድሕሪ ደጊም ኣይሰማማዕን እዩ።

> **💡 Tip / ምኽሪ፤**  
> Think of hashes like a fingerprint: even a tiny change creates a completely different hash, making tampering immediately obvious.  
> ንሃሽ ከም ኣሰር ኣጻብዕቲ ሕሰብዎ: ዋላ ንእሽቶ ለውጢ እውን እንተኾነ ፍጹም ዝተፈልየ ሃሽ ይፈጥር፣ ምትዕንቓፍ ብኡንብኡ ርኡይ ይገብሮ።

### 7.2 Why It's Called a Chain / 7.2 ስለምንታይ ሰንሰለት ተባሂሉ
The term 'blockchain' comes from the way blocks are connected. Each new block points back to the one before it, forming a long chain of history. Block 2 points to Block 1, Block 3 points to Block 2, and so on. This simple design makes the entire system extremely strong. If someone wanted to change something profound in the past, they wouldn't just have to fix that one block — they would need to rebuild every block after it as well. For all practical purposes, that's impossible.  
'ብሎክቸይን' ዝብል ቃል ካብቲ ብሎኮታት ዝራኸብሉ ኣገባብ ዝመጸ እዩ። ነፍሲ ወከፍ ሓድሽ ብሎክ ናብቲ ቅድሚኡ ዝነበረ ንድሕሪት ብምምላስ ነዊሕ ሰንሰለት ታሪኽ ይፈጥር። ብሎክ 2 ናብ ብሎክ 1፣ ብሎክ 3 ናብ ብሎክ 2 የመልክት፣ ወዘተ። እዚ ቀሊል ዲዛይን ንብምሉኡ እቲ ስርዓት ኣዝዩ ድልዱል ይገብሮ። ሓደ ሰብ ኣብ ዝሓለፈ እዋን ዓሚቝ ነገር ክቕይር እንተደልዩ፡ ነታ ሓንቲ ብሎክ ጥራይ ከዐርያ ኣይምተገደደን — ድሕሪኡ እውን ነፍሲ ወከፍ ብሎክ ዳግማይ ክሃንጻ ምተገደደ። ንኹሉ ግብራዊ ዕላማታት፡ እዚ ዘይከኣል እዩ።

### 7.3 Who Adds the Blocks? / 7.3 መን እዩ ነቶም ብሎኮታት ዝውስኾም?
New blocks don't appear by magic; they are added by people called miners. Miners gather fresh transactions and bundle them into a block. To seal the block, they solve a math puzzle that requires time and computing power. Once a miner finds the correct solution, the block is locked in place and added to the chain, and everyone else on the network updates their copy of the notebook. This process, known as Proof of Work, ensures that no one can cheaply rewrite history — it's always far easier to be honest than to try to cheat.  
ሓደስቲ ብሎኮታት ብስሕበት ኣይረኣዩን እዮም፤ ዕደናውያን ዝበሃሉ ሰባት ይውሰኹ። ዕደናውያን ሓድሽ ትራንዛክሽን ኣኪቦም ኣብ ሓደ ብሎክ ይጥርንፍዎ። ነቲ ብሎክ ንምዕሻግ ድማ ግዜን ናይ ኮምፒዩተር ሓይልን ዝሓትት ናይ ሒሳብ ሕንቅልሕንቅሊተይ ይፈትሑ። ሓደ ዕደናዊ ቅኑዕ ፍታሕ ምስ ረኸበ፡ እቲ ብሎክ ኣብ ቦታኡ ተዓጽዩ ኣብቲ ሰንሰለት ይውሰኽ፡ ካልኦት ኩሎም ኣብቲ መርበብ ዘለዉ ድማ ቅዳሕ ናይቲ ደፍተር የሐድስ። እዚ ብመርትዖ ስራሕ ዝፍለጥ መስርሕ፡ ዝኾነ ሰብ ብሕሱር ዋጋ ታሪኽ ዳግማይ ክጽሕፍ ከምዘይክእል የረጋግጽ — ኩሉ ግዜ ካብ ምትላል ምፍታን ብቕንዕና ምዃን ኣዝዩ ቀሊል እዩ።

### 7.4 Why Blockchain Matters / 7.4 ስለምንታይ ብሎክቸይን ኣገዳሲ ምዃኑ
The beauty of the blockchain is that it makes history permanent. Once something is written, it cannot be erased or quietly edited later. That means we no longer need a middleman like a bank or a government official to 'guarantee' the records. Instead, the security comes from math, from the way the blocks are linked, and from the shared effort of the network. Cheating is expensive, while honesty comes naturally. This is what makes Bitcoin possible — a financial system where the rules are written in code, not controlled by a single authority.  
ጽባቐ ናይቲ ብሎክቸይን ታሪኽ ነባሪ ዝገብሮ ምዃኑ እዩ። ሓደ ነገር ሓንሳብ ምስ ተጻሕፈ ድሒሩ ክድምሰስ ወይ ስቕ ኢሉ ክእረም ኣይክእልን እዩ። እዚ ማለት ድሕሪ ደጊም ከም ባንክ ወይ በዓል ስልጣን መንግስቲ ዝኣመሰለ ማእከላይ ሰብ ነቲ መዛግብቲ ‘ውሕስነት’ ዝህብ ኣየድልየናን እዩ። ኣብ ክንድኡስ፡ እቲ ድሕነት ካብ ሒሳብ፡ ካብቲ እቶም ብሎኮታት ዝተኣሳሰሩሉ ኣገባብ፡ ከምኡ’ውን ካብቲ ናይቲ መርበብ ሓባራዊ ጻዕሪ ዝመጽእ እዩ። ምትላል ክቡር ክኸውን ከሎ፡ ቅንዕና ግን ብተፈጥሮኡ እዩ ዝመጽእ። እዚ እዩ ንቢትኮይን ዝከኣል ዝገብሮ - ሕግታት ብኮድ ዝተጻሕፈሉ ፋይናንሳዊ ስርዓት እምበር ብሓደ በዓል መዚ ዘይቆጻጸሮ።

> **📝 Note / መተሓሳሰቢ፤**  
> Blockchain's immutability means that once a transaction is confirmed, it becomes part of permanent history that cannot be altered.  
> ብሎክቸይን ዘይቅየር ምዃኑ ማለት ሓደ ትራንዛክሽን ምስ ተረጋገጸ ኣካል ናይቲ ክቕየር ዘይክእል ቀዋሚ ታሪኽ ይኸውን።

---

## Interactive Blockchain Demo / መስተጋብራዊ ብሎክቸይን ዲሞ
Explore how blocks, hashes, and blockchain work together in this interactive demonstration. You can experiment with creating blocks, changing data, and seeing how the hash changes.  
ኣብዚ መስተጋብራዊ ምርኢት ብሎክ፡ ሃሽን ብሎክቸይንን ብኸመይ ብሓባር ከም ዝሰርሑ ዳህሰሱ። ብሎክ ምፍጣር፡ ዳታ ምቕያርን እቲ ሃሽ ከመይ ከም ዝቕየር ምርኣይን ክትፍትን ትኽእል ኢኻ።

[🔗 Try Blockchain Demo →](https://andersbrownworth.com/blockchain) / [🔗 ብሎክቸይን ዲሞ ፈትኑ →](https://andersbrownworth.com/blockchain)

This demo covers: Hash functions, Block structure, Blockchain linking, and Distributed consensus  
እዚ ዲሞ እዚ ዝሽፍን ኮይኑ፡ ሃሽ ፋንክሽን፡ ብሎክ ስትራክቸር፡ ብሎክቸይን ምትእስሳር፡ ከምኡ’ውን Distributed consensus እዩ።

---

## Activity: Build a Human Blockchain / ዕማም፡ ናይ ደቂ-ሰብ ብሎክቸይን ምህናጽ
To really understand how it works, imagine each student in a classroom is a block. Each one holds a piece of paper with a few fake transactions written down, plus a made-up 'hash' — maybe just a random number. The first student starts with a hash of '0000,' and every student after that writes the hash of the block before them at the top of their paper. Then they all connect with a string or by holding hands, forming a 'human blockchain.' Now, if one student changes a transaction on their paper, the hash no longer matches the one that the next student wrote down—the whole chain breaks.  
ብኸመይ ከም ዝሰርሕ ብሓቂ ንምርዳእ፡ ኣብ ክፍሊ ዘሎ ነፍሲ ወከፍ ተማሃራይ ሓደ ብሎክ ከም ዝኾነ ሕሰቡ። ነፍሲ ወከፎም ሒደት ናይ ሓሶት ትራንዛክሽናት ዝተጻሕፈሉ ወረቐት ይሕዙ፡ ምስ ዝተሰርሐ 'ሃሽ' — ምናልባት ዝኾነ ቁጽሪ። እቲ ቀዳማይ ተማሃራይ ብሃሽ '0000' ይጅምር፣ ድሕሪኡ ዝመጽእ ነፍሲ ወከፍ ተማሃራይ ድማ ነቲ ቅድሚኡ ዝነበረ ብሎክ ሃሽ ኣብ ላዕሊ ናይ ወረቐቱ ይጽሕፍ። ድሕሪኡ ኩሎም ብገመድ ወይ ብኢድ ብምሓዝ ይተሓሓዙ፣ 'ናይ ደቂ-ሰብ ብሎክቸይን' ይፈጥሩ። ሕጂ ሓደ ተማሃራይ ኣብ ወረቐቱ ዘሎ ትራንዛክሽን እንተቐይርዎ፡ እቲ ሃሽ ምስቲ እቲ ዝቕጽል ተማሃራይ ዝጸሓፎ ኣይሰማማዕን እዩ — ምሉእ ሰንሰለት ይስበር።

This simple game shows why blockchain is so powerful: once something is written into the chain, changing it without everyone noticing is almost impossible.  
እዚ ቀሊል ጸወታ ብሎክቸይን ስለምንታይ ክሳብ ክንድዚ ሓያል ከም ዝኾነ የርኢ፡ ሓንሳብ ሓደ ነገር ኣብቲ ሰንሰለት ምስ ተጻሕፈ፡ ኩሉ ሰብ ከየስተውዓሎ ምቕያር ዳርጋ ዘይከኣል እዩ።

---

## Summary / ጽማረ
- A block contains transactions, a hash, and a link to the previous block.  
  ሓደ ብሎክ ትራንዛክሽናት፣ ሃሽ ከምኡ’ውን ምስቲ ቅድሚኡ ዝነበረ ብሎክ ዘራኽብ መላግቦ ዝሓዘ እዩ።
- Hashes act like fingerprints — any change creates a completely different hash.  
  ሃሽ ከም ኣሰር ኣጻብዕቲ ይሰርሕ — ዝኾነ ለውጢ ምሉእ ብምሉእ ዝተፈልየ ሃሽ ይፈጥር።
- Blocks are chained together, making it nearly impossible to alter past transactions.  
  ብሎኮታት ብሰንሰለት ዝተኣሳሰሩ እዮም፣ እዚ ድማ ናይ ዝሓለፉ ትራንዛክሽናት ምቕያር ዳርጋ ዘይከኣል ይገብሮ።
- Miners add new blocks by solving Proof of Work puzzles.  
  ዕደናውያን ናይ መርትዖ ስራሕ ሕንቅልሕንቅሊተይ ብምፍታሕ ሓደስቲ ብሎኮታት ይውስኹ።
- Blockchain creates tamper-evident, permanent history without needing a central authority.  
  ብሎክቸይን ማእከላይ በዓል መዚ ከየድለየ ምትዕንቓፍ ዘይብሉ ቀዋሚ ታሪኽ ይፈጥር።
