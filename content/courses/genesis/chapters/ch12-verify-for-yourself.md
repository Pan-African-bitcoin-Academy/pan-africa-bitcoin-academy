# Chapter 12: Verify for Yourself — Block Explorers & Nodes / ምዕራፍ 12 · ባዕልኻ ኣረጋግጽ — Block Explorers & Nodes

Don't trust—verify your own transactions and the network.  
ኣይትእመን-ናይ ገዛእ ርእስኻ ትራንዛክሽንን መርበብን ኣረጋግጽ።

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **Use explorers for txids, confirmations, fees**  
  ንtxids, ምርግጋጽ, ክፍሊት ዳህሰስቲ ተጠቐም
- **Merkle path inclusion (conceptual)**  
  መርክል መንገዲ ምትእትታው (ኣምር)
- **Why run a node; mempool visibility; policy/relay basics**  
  ንምንታይ ኖድ ምጉያይ፤ mempool ርኡይነት፤ መሰረታዊ ፖሊሲ/ሪለይ

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### Introduction / መእተዊ
One of Bitcoin's core principles is 'don't trust, verify.' This means you shouldn't rely on others to tell you what's true about your transactions or the network — you should verify it yourself. Block explorers and Bitcoin nodes are two essential tools for doing exactly that. Block explorers are websites that let you search and view Bitcoin transactions, while running your own node gives you complete independence to verify everything yourself. In this chapter, we'll explore both tools and understand when to use each.  
ሓደ ካብቲ ቀንዲ መትከላት ቢትኮይን 'ኣይትእመን፡ ኣረጋግጽ' ዝብል እዩ። እዚ ማለት ብዛዕባ ትራንዛክሽንካ ወይ መርበብ ሓበሬታ እንታይ ሓቂ ምዃኑ ክነግሩኻ ኣብ ካልኦት ክትምርኮስ የብልካን — ባዕልኻ ከተረጋግጽ ይግባእ። ብሎክ ኤክስፕሎረራትን ቢትኮይን ኖድስን ልክዕ ከምኡ ንምግባር ክልተ ኣገደስቲ መሳርሒታት እዮም። ብሎክ ኤክስፕሎረርስ ንናይ ቢትኮይን ትራንዛክሽን ክትደሊን ክትዕዘብን ዘኽእሉኻ መርበባት ሓበሬታ ኮይኖም፡ ናይ ገዛእ ርእስኻ ኖድ ምዝዋር ድማ ንኹሉ ባዕልኻ ንምርግጋጽ ምሉእ ናጽነት ይህበካ። ኣብዚ ምዕራፍ እዚ ንኽልቲኦም መሳርሒታት ክንድህስሶምን ነፍሲ ወከፎም መዓስ ከም እንጥቀመሉ ክንርዳእን ኢና።

---

### 12.0 Using a Block Explorer (Txids, Confirmations, Fees, Mempool) / 12.0 ምጥቃም ብሎክ ኤክስፕሎረር (Txids, Confirmations, Fees, Mempool)
A block explorer is like a search engine for the Bitcoin blockchain. You can paste in a transaction ID (txid) or address and see its history, status, and details. This is incredibly useful for checking if a payment you sent has been confirmed, how many confirmations it has, what fee was paid, and whether it's still waiting in the mempool (the pool of unconfirmed transactions).  
ብሎክ ኤክስፕሎረር ከም መድለዩ ሞተር ናይ ቢትኮይን ብሎክቸይን እዩ። ኣብ ሓደ ናይ ትራንዛክሽን መለለዪ (txid) ወይ ኣድራሻ ክትለጥፎን ታሪኹን ኩነታቱን ዝርዝራቱን ክትዕዘብ ትኽእል ኢኻ። እዚ ንዝለኣኽካዮ ክፍሊት ተረጋጊጹ እንተኾይኑ፡ ክንደይ መረጋገጺታት ኣለዎ፡ እንታይ ክፍሊት ተኸፊሉ፡ ከምኡ’ውን ገና ኣብቲ mempool (እቲ ፑል ናይ ዘይተረጋገጸ ትራንዛክሽን) ይጽበ ኣሎ ድዩ ኣይኮነን ንምፍታሽ ንምእማኑ ዘጸግም ጠቓሚ እዩ።

When you receive a payment, you can look up the txid on a block explorer to verify it independently of your wallet. This helps you catch errors, understand delays, and confirm that transactions are progressing as expected. Block explorers are also great for learning — you can browse recent transactions, see how fees fluctuate, and understand network activity.  
ክፍሊት ምስ ተቐበልካ፡ ነቲ txid ኣብ ብሎክ ኤክስፕሎረር ክትጥምቶ ትኽእል ኢኻ፡ ካብ ቦርሳኻ ነጻ ኮይንካ ከተረጋግጽ ትኽእል። እዚ ድማ ጌጋታት ክትሕዝ፡ ምድንጓያት ንምርዳእን ትራንዛክሽን ከምቲ ትጽቢት ዝግበረሉ ይኸይድ ከምዘሎ ከተረጋግጽን ይሕግዘካ። ዳህሰስቲ ብሎክ ንመምሃሪ እውን ብሉጻት እዮም — ኣብ ቀረባ እዋን ዝተገብረ ትራንዛክሽን ክትድህስስ ትኽእል ኢኻ፣ ክፍሊት ብኸመይ ከም ዝለዋወጥ ክትዕዘብ ትኽእል ኢኻ፣ ከምኡ’ውን ንጥፈታት መርበብ ክትርድኦ ትኽእል ኢኻ።

> **💡 Tip / ምኽሪ፤**  
> Always verify transactions on a block explorer, especially for large payments. Don't rely solely on your wallet's status.  
> ኩሉ ግዜ ኣብ ብሎክ ኤክስፕሎረር ትራንዛክሽን ኣረጋግጽ ብፍላይ ንዓበይቲ ክፍሊታት። ኣብ ኩነታት ቦርሳኻ ጥራይ ኣይትምርኮስ።

---

### 12.1 Proving Inclusion (Merkle Path Concept) / 12.1 ምትእትታው ምርግጋፅ (ኣምር መንገዲ መርክል)
How can you prove that a transaction is included in a block without downloading the entire blockchain? Bitcoin uses something called a Merkle tree. Think of it like a family tree, but for transactions. Each transaction is hashed, then pairs of hashes are combined and hashed again, and this continues until you reach a single root hash at the top. This root is stored in the block header.  
ምሉእ ብሎክቸይን ከየውረድካ ሓደ ትራንዛክሽን ኣብ ሓደ ብሎክ ከም ዝተሓወሰ ከመይ ጌርካ ከተረጋግጽ ትኽእል? ቢትኮይን መርክል ትሪ ዝበሃል ነገር ይጥቀም። ከም ስድራቤታዊ ገረብ ሕሰቦ፡ ግን ንትራንዛክሽን። ነፍሲ ወከፍ ትራንዛክሽን ሃሽ ይግበር፣ ድሕሪኡ ጽምዲ ሃሽ ይወሃሃዱን እንደገና ይሃሽ ይገብሩን፣ እዚ ድማ ክሳብ ኣብ ላዕሊ ኣብ ሓደ ሱር ሃሽ እትበጽሕ ይቕጽል። እዚ ሱር ኣብ ርእሲ ብሎክ ይኽዘን።

A Merkle path (or Merkle proof) is a small set of hashes that proves your transaction is part of the tree without needing all the other transactions. By following the path from your transaction up to the root, you can mathematically prove inclusion. This is how lightweight wallets can verify transactions without storing the full blockchain — they just need the Merkle proof, not every single transaction.  
መንገዲ መርክል (ወይ መርትዖ መርክል) ንእሽቶ ስብስብ ሃሽ ኮይኑ፡ ትራንዛክሽንካ ኣካል ናይቲ ገረብ ምዃኑ ዘረጋግጽ ኮይኑ፡ ኩሎም ካልኦት ትራንዛክሽን ከየድለዮም። ካብ ትራንዛክሽንካ ክሳብ ሱር ዝበጽሕ መንገዲ ብምኽታል፡ ብሕሳብ ምትእትታው ከተረጋግጽ ትኽእል። እዚ እዩ ቀለልቲ ቦርሳታት ምሉእ ብሎክቸይን ከይዓቀቡ ትራንዛክሽን ከረጋግጹ ዝኽእሉ — ንነፍሲ ወከፍ ንጽል ትራንዛክሽን ዘይኮነስ ናይ መርክል መርትዖ ጥራይ እዩ ዘድልዮም።

> **📝 Note / መተሓሳሰቢ፤**  
> Merkle proofs enable lightweight verification — you can prove a transaction is in a block without downloading the entire blockchain.  
> መርትዖታት መርክል ቀሊል ምርግጋጽ የኽእሉ — ሓደ ትራንዛክሽን ኣብ ሓደ ብሎክ ከምዘሎ ከተረጋግጽ ትኽእል ኢኻ ምሉእ ብሎክቸይን ከየውረድካ።

---

### 12.2 Why Run a Node (Independent Validation; Mempool Visibility; Policy/Relay Basics) / 12.2 ስለምንታይ ኖድ ንሰርሕ (ናጻ ምጽዳቕ፤ ርኡይነት መምፑል፤ መሰረታዊ ፖሊሲ/ሪለይ)
While block explorers are useful, they're run by third parties. If that third party is compromised, censored, or simply wrong, you might get incorrect information. Running your own Bitcoin node solves this problem by giving you complete independence. Your node downloads and validates the entire blockchain, checking every transaction and block according to Bitcoin's rules. No one can lie to you about what's on the blockchain because you're verifying it yourself.  
ብሎክ ኤክስፕሎረርስ ጠቐምቲ ክኾኑ እንከለዉ፡ ብሳልሳይ ወገን ግን ይመሓደሩ። እቲ ሳልሳይ ወገን ኣብ ዋጋ ዕዳጋ ዝኣተወ፡ ሳንሱር እንተተገይሩሉ ወይ ጌጋ ጥራይ እንተኾይኑ፡ ጌጋ ሓበሬታ ክትረክብ ትኽእል ኢኻ። ናይ ገዛእ ርእስኻ ቢትኮይን ኖድ ምዝዋር ነዚ ጸገም ምሉእ ናጽነት ብምሃብ ይፈትሖ። ናትካ ኖድ ንኹሉ ብሎክቸይን ኣውሪዱ የረጋግጽ፣ ነፍሲ ወከፍ ትራንዛክሽንን ብሎክን ብመሰረት ሕግታት ቢትኮይን ይምርምር። ኣብቲ ብሎክቸይን ዘሎ ነገር ክሕስወካ ዝኽእል ሰብ የለን ምኽንያቱ ባዕልኻ ስለ እተረጋግጽ።

Your node also gives you direct access to the mempool — the pool of transactions waiting to be confirmed. This visibility helps you understand network congestion, estimate fees accurately, and see what's happening in real-time. Additionally, your node enforces your own policy rules about which transactions to relay, giving you control over what you participate in.  
ናትካ መስመር እውን ቀጥታዊ መእተዊ ናብቲ mempool ይህበካ — እቲ ንኽረጋገጽ ዝጽበ ዘሎ ፑል ናይ ትራንዛክሽን። እዚ ርኡይነት እዚ ንጽቕጥቕጥ መርበብ ንምርዳእ፡ ክፍሊት ብትኽክል ንምግማትን ኣብ ሓቀኛ ግዜ እንታይ ይፍጸም ከምዘሎ ንምርኣይን ይሕግዘካ። ብተወሳኺ፡ ናትካ መስመር ኣየኖት ትራንዛክሽን ከም እትመሓላለፍ ናይ ገዛእ ርእስኻ ፖሊሲ ሕግታት የተግብር፡ እዚ ድማ ኣብ ልዕሊ እንታይ ከም እትሳተፍ ምቁጽጻር ይህበካ።

> **💡 Tip / ምኽሪ፤**  
> Running your own node is the ultimate form of Bitcoin sovereignty. You verify everything yourself, with no trusted third parties.  
> ናይ ገዛእ ርእስኻ መስመር ምምራሕ ናይ መወዳእታ መልክዕ ልኡላውነት ቢትኮይን እዩ። ንኹሉ ባዕልኻ ኢኻ እተረጋግጽ፣ እትኣምኖ ሳልሳይ ወገን የብልካን።

---

### 12.3 First-Time Node Sync (Full vs Pruned/Light; Storage/Bandwidth Planning) / 12.3 ንመጀመርታ ግዜ ኖድ ሲንክ (ምሉእ ንኡስ/ፈኩስ፤ ምኽዛን/ባንድዊድዝ ትልሚ)
When you first run a Bitcoin node, it needs to download and verify the entire blockchain — currently over 900+ GB of data. This initial sync can take days or weeks depending on your internet connection and hardware. You have a few options:  
መጀመርታ ቢትኮይን ኖድ ክትሰርሕ ከለኻ፡ ንብምሉኡ ብሎክቸይን ኣውሪድካ ምርግጋጽ የድልዮ — ኣብዚ እዋን’ዚ ልዕሊ 900+ GB ዳታ። እዚ ናይ መጀመርታ ምትእስሳር ከም ምትእስሳር ኢንተርነትካን ሃርድዌርካን መዓልታት ወይ ሰሙናት ክወስድ ይኽእል።ስለዚ ውሑዳት ኣማራጺታት ኣለዉኻ፤

For most users, a pruned node offers the best balance — you get full validation with much less storage. Plan ahead for the initial sync time and bandwidth usage, and don't worry about advanced configurations until you're comfortable with the basics.  
ንመብዛሕትኦም ተጠቀምቲ፡ ንኡስ መስመር ዝበለጸ ሚዛን የቕርብ — ምሉእ ምጽዳቕ ምስ ኣዝዩ ዝወሓደ መኽዘን ትረክብ። ንመጀመርታ ናይ ምትእስሳር ግዜን ኣጠቓቕማ ባንድዊድን ኣቐዲምካ ውጥን ግበር፣ ብዛዕባ ምዕቡል ውቅርታት ድማ ምስ መሰረታዊ ነገራት ክሳብ እትሰማማዕ ኣይትጨነቕ።

- **Full node**: Downloads and stores the complete blockchain. Maximum security and features, but requires significant storage (900+ GB).  
  ምሉእ ኖድ፦ ምሉእ ብሎክቸይን የውርድን ይዕቅቦን። ዝለዓለ ድሕነትን ባህርያትን፡ ግን ከኣ ርኡይ መኽዘን (900+ GB) የድልዮ።
- **Pruned node**: Downloads the full chain but deletes old blocks after verification, keeping only recent ones. Saves storage (about 5 GB) while maintaining full validation.  
  ንኡስ ኖድ : ምሉእ ሰንሰለት የውርድ ግን ድሕሪ ምርግጋጽ ናይ ቀደም ብሎክ ይድምስስ፣ ናይ ቀረባ ግዜ ጥራይ ይሕዝ። ምሉእ ምጽዳቕ እናሓለወ መኽዘን (ኣስታት 5 ጊባ) ይዕቅብ።
- **Light node**: Doesn't download the full chain, relies on others for some data. Less secure but uses minimal resources.  
  ፈኩስ ኖድ: ምሉእ ሰንሰለት ኣየውርድን እዩ፣ ንገለ ዳታ ኣብ ካልኦት ይምርኮስ። ውሑድ ውሕስነት ዘለዎ ግን ከኣ ውሑድ ጸጋታት ዝጥቀም።

> **💡 Tip / ምኽሪ፤**  
> A pruned node gives you full validation with minimal storage. It's the best starting point for most users.  
> ንኡስ ኖድመስመር ምሉእ ምጽዳቕ ምስ ዝተሓተ መኽዘን ይህበካ። ንመብዛሕትኦም ተጠቀምቲ እቲ ዝበለጸ መበገሲ እዩ።

---

## Activities / ንጥፈታት
- **Activity: Explorer Scavenger Hunt / ንጥፈት: ናይ ብሎክ ዳህሳሲ ሃድን**  
  Search a given txid on a block explorer to verify confirmations, fee rates, and status.  
  ሓደ ዝተዋህበ txid ኣብ ብሎክ ኤክስፕሎረር ድለዩ እሞ መረጋገጺታቱን፡ ክፍሊቱን፡ ኩነታቱን ኣረጋግጹ።

---

## Summary / ጽማረ
- Block explorers are useful tools for checking transaction status, but they're run by third parties.  
  ብሎክ ዳህሰስቲ ኩነታት ትራንዛክሽን ንምፍታሽ ጠቐምቲ መሳርሒታት እዮም፡ ግን ብሳልሳይ ወገን ይመሓደሩ።
- Merkle proofs enable lightweight verification without downloading the full blockchain.  
  ናይ መርክል መርትዖታት ምሉእ ብሎክቸይን ከየውረድካ ቀሊል ምርግጋጽ የኽእሉ።
- Running your own node gives you complete independence and sovereignty over verification.  
  ናይ ገዛእ ርእስኻ ኖድ ምጉያይ ኣብ ምርግጋጽ ምሉእ ናጽነትን ልኡላውነትን ይህበካ።
- Nodes provide direct access to the mempool and let you enforce your own policy rules.  
  ኖድስ ናብ mempool ቀጥታዊ መእተዊ ይህቡኻ፡ ናይ ገዛእ ርእስኻ ናይ ፖሊሲ ሕግታት ንምትግባር ድማ የኽእሉኻ።
- Pruned nodes offer full validation with minimal storage requirements.  
  ንኡስ ኖድስ (Pruned nodes) ብውሑድ ናይ መኽዘን ጠለብ ምሉእ ምጽዳቕ ይህቡ።

---

## Key Terms / ቁልፊ ቃላት
- **Block explorer** — ብሎክ ኤክስፕሎረር (Block explorer)
- **Txid** — Txid (መለለዪ ትራንዛክሽን)
- **Confirmation** — ምርግጋጽ (Confirmation)
- **Mempool** — Mempool (መምፑል)
- **Merkle path** — መንገዲ መርክል (Merkle path)
- **Merkle proof** — መርትዖ መርክል (Merkle proof)
- **Full node** — ምሉእ ኖድ (Full node)
- **Pruned node** — ንኡስ ኖድ (Pruned node)
- **Light node** — ፈኩስ ኖድ (Light node)
