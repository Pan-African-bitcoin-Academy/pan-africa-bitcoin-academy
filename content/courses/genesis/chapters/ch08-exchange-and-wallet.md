# Chapter 8: Software Wallet & Exchange / ምዕራፍ 8 · ሶፍትዌር ዋለተ & ኤክስቸንጅ

Exchanges are bridges; wallets are keys—withdraw and own your coins.  
ምልውዋጥ ድልድል እዩ፤ ቦርሳታት መፍትሕ እዮም- ሳንቲምካ ኣውጺእካ ውነን።

---

## What You Will Learn / እንታይ ክትመሃር ኢኻ።
- **How exchanges work and why to withdraw**  
  ምልውዋጥ ብኸመይ ይሰርሕን ስለምንታይ ተውጽኦን
- **Create a software wallet and back up the seed**  
  ሶፍትዌር ዋለተ ፈጢርካ ነቲ ሲድ ዓቅብ
- **Send/receive first transaction; fee basics**  
  ቀዳማይ ትራንዛክሽን ምልኣኽ/ምቕባል፤ መሰረታዊ ነገራት ክፍሊት
- **Privacy starters: address reuse, VPN, local-first**  
  ጀመርቲ ብሕትውና: ኣድራሻ ዳግመ-ምጥቃም, VPN, local-first

---

## Main Lesson Content / ቀንዲ ትሕዝቶ ትምህርቲ

### 8.0 What Is an Exchange? How to Acquire Bitcoin (centralized on-ramp) / 8.0 ምልውዋጥ እንታይ እዩ? ከመይ ጌርና ቢትኮይን ንረክብ (centralized on-ramp)
Imagine a bustling bus station where people arrive with various currencies and depart with tickets to new destinations. A centralized crypto exchange works like that station. It matches buyers and sellers, shows a price, and lets you swap your local money for bitcoin. Because it involves banks and national payment rails, an exchange typically requests identity documents. This is called KYC (Know Your Customer). It can feel annoying, but it's how these companies follow the law and keep their bank accounts open.  
ሰባት ዝተፈላለየ ባጤራ ሒዞም ዝመጹሉን ናብ ሓደስቲ መዳረግቲ ቦታታት ትኬት ሒዞም ዝብገሱሉን ዕሙር መደበር ኣውቶቡስ እሞ ሕሰብዎ። ማእከላይ ክሪፕቶ ምልውዋጥ ከምታ ጣብያ እዩ ዝሰርሕ። ምስ ዓደግትን ሸየጥትን ይሰማማዕ፡ ዋጋ የርኢ፡ ከምኡ’ውን ናይ ከባቢኻ ገንዘብ ብቢትኮይን ክትቅይሮ የኽእለካ። ባንክታትን ሃገራዊ ናይ ክፍሊት ባቡርን ስለዘጠቓልል፡ ሓደ ምልውዋጥ ብተለምዶ መንነት ሰነዳት ይሓትት። እዚ ድማ KYC (Know Your Customer) ይበሃል። ዘሕርቕ ኮይኑ ክስምዓካ ይኽእል እዩ፡ እንተኾነ ግን እዘን ኩባንያታት ሕጊ ብኸመይ ከም ዝኽተላን ሕሳበን ባንክ ክፉት ከም ዝገብራን እዩ።

For a first purchase, think small—an amount you would be comfortable losing if you make a mistake. Fees matter, so check both the explicit fee and the 'spread' (the hidden difference between buy and sell prices). The safest rhythm for beginners is simple: buy a small amount, withdraw to your own wallet, and confirm that it arrived before buying more. That last step—moving coins off the exchange—teaches the core lesson of Bitcoin: if you don't hold the keys, you're only renting access. Treat the exchange like a temporary bridge, not a home.  
ንመጀመርታ ግዜ ንዝገዛእካዮ ንእሽቶ ሕሰብ፣ እዚ ኸኣ እንተ ተጋጊኻ ክትስእኖ ምቹእ እትኸውን መጠን ገንዘብ እዩ። ክፍሊት ኣገዳሲ እዩ፣ ስለዚ ንኽልቲኡ እቲ ግሉጽ ክፍሊትን እቲ ‘ዝርገሐን’ (ኣብ መንጎ ዋጋታት ምዕዳግን ምሻጥን ዘሎ ሕቡእ ፍልልይ) መርምር። እቲ ዝበለጸ ውሑስ ህርመት ንጀመርቲ ቀሊል እዩ፡ ንእሽቶ ገንዘብ ግዛእ፡ ናብ ናይ ገዛእ ርእስኻ ፖርተፊልዮ ኣውጽእ፡ ቅድሚ ተወሳኺ ምግዛእካ ድማ ከም ዝመጸ ኣረጋግጽ። እቲ ናይ መወዳእታ ስጉምቲ- ሳንቲም ካብቲ ምልውዋጥ ምግዓዝ- ነቲ ቀንዲ ትምህርቲ ቢትኮይን ይምህር፡ መፍትሕ እንተዘይሒዝካዮ፡ መእተዊ ጥራይ ኢኻ ትካረ ዘለኻ። ነቲ ምልውዋጥ ከም ግዝያዊ ድልድል እምበር ከም ገዛ ኣይትሕዞ።

If you live in a place where exchanges are limited, people often use peer-to-peer marketplaces, money-transfer shops, or trusted community meetups. These methods can work, but they add human risk. Meet in public places, bring a friend, and never let anyone rush you. Bitcoin is global and fast, but your decisions should be slow and deliberate.  
ምልውዋጥ ድሩት ኣብ ዘለዎ ቦታ ትነብር እንተኾንካ፡ ሰባት መብዛሕትኡ ግዜ መዛኑ ዕዳጋታት፡ ድኳናት ምትሕልላፍ ገንዘብ፡ ወይ እሙናት ማሕበረሰባዊ ኣኼባታት ይጥቀሙ። እዞም ኣገባባት እዚኣቶም ክሰርሑ ይኽእሉ እዮም፡ እንተኾነ ግን ሰብኣዊ ሓደጋ ይውስኹ። ኣብ ህዝባዊ ቦታታት ተራኸብ፡ ዓርክኻ ኣምጽእ፡ ዝኾነ ሰብ ክጓየየካ ድማ ፈጺምካ ኣይትፍቀደሉ። ቢትኮይን ዓለማውን ቅልጡፍን ኮይኑ፡ ውሳነታትካ ግን ቀስ ዝበለን ኮነ ኢልካ ዝግበርን ክኸውን ይግባእ።

> **⚠️ Warning / መጠንቀቕታ፤**  
> If you don't hold the keys, you're only renting access. Always withdraw your Bitcoin from exchanges to your own wallet.  
> መፍትሕ እንተዘይሒዝካዮ መእተዊ ጥራይ ኢኻ ትካረ ዘለኻ። ኩሉ ግዜ ቢትኮይንካ ካብ ምልውዋጥ ናብ ናይ ገዛእ ርእስኻ ፖርተፊልዮ ኣውጽኣዮ

> **💡 Tip / ምኽሪ፤**  
> For first purchases, start small. Buy a small amount, withdraw to your wallet, and confirm it arrived before buying more.  
> ንመጀመርታ ዕድጊታት፡ ብንእሽቶ ጀምር። ንእሽቶ ገንዘብ ገዚእካ ናብ ቦርሳኻ ኣውጽእ፡ ቅድሚ ተወሳኺ ምግዛእካ ድማ ከም ዝመጸ ኣረጋግጽ።

---

### 8.1 Software Signer (mobile/desktop): create wallet, seed backup / 8.1 ሶፍትዌር ሳይነር (ሞባይል/ዴስክቶፕ)፦ ፖርተፊልዮ ምፍጣር፣ ምዕቃብ ሲድ ፍሬዝስ
A Bitcoin 'wallet' is really two things: a signer and a notebook. The signer is the part that holds your secret—your private keys—and uses them to sign transactions. The notebook is the interface that helps you see balances and create payments. Many apps bundle both into one, so we simply refer to it as a wallet.  
ቢትኮይን 'ቦርሳ' ብሓቂ ክልተ ነገራት እዩ፡ ፈራሚን ደፍተርን። እቲ ፈራሚ እቲ ምስጢርካ ዝሕዝ ክፋል እዩ- ናይ ብሕቲ መፍትሕታትካ-ን ትራንዛክሽን ንምፍራም ዝጥቀመሉን። እቲ ደፍተር ሚዛን ንምርኣይን ክፍሊት ንምፍጣርን ዝሕግዘካ መተሓላለፊ እዩ። ብዙሓት ኣፕስ ንኽልቲኡ ኣብ ሓደ ስለ ዝጥርንፍዎ፡ ፖርተፊልዮ ኢልና ጥራይ ኢና ንጽውዖ።

Creating a wallet feels like opening a new lockbox. The app will generate a seed phrase—usually 12 or 24 simple words. Those words are the master key to every present and future address your wallet will create. Write them carefully on paper, check the spelling, and store the paper where fire, water, and curious eyes can't reach. Don't take photos, don't put the words in cloud storage, and don't paste them into chat apps. If someone gets that phrase, they can take your coins without asking. If you lose it and your phone dies, no company can help you recover—Bitcoin is a bearer asset.  
ፖርተፊልዮ ምፍጣር ሓድሽ መዕጸዊ ሳንዱቕ ምኽፋት ኮይኑ ይስምዓካ። እቲ ኣፕ ዘርኢ ሓረግ ክፈጥር እዩ-መብዛሕትኡ ግዜ 12 ወይ 24 ቀለልቲ ቃላት። እተን ቃላት ንነፍሲ ወከፍ ቦርሳኻ ዝፈጥሮ ህሉውን መጻእን ኣድራሻ ዋና መፍትሕ እየን። ኣብ ወረቐት ብጥንቃቐ ጽሓፍዎም፡ ኣጸሓሕፋኦም መርምሩ፡ ነቲ ወረቐት ድማ ሓዊን ማይን ንኽፈልጡ ዝደልዩ ኣዒንቲ ኣብ ዘይበጽሖ ቦታ ኣቐምጦም። ስእሊ ኣይትውሰድ፡ እቶም ቃላት ኣብ ክላውድ ስቶሬጅ ኣይተእትዎም፡ ኣብ ቻት ኣፕስ ኣይትለጥፎም። ሓደ ሰብ ነታ ሓረግ እንተረኺቡ፡ ከይሓተተ ሳንቲምካ ክወስድ ይኽእል እዩ። እንተ ስኢንካዮን ስልክኻ እንተሞይታን፡ ዝኾነ ኩባንያ ንኽትሓዊ ክሕግዘካ ኣይክእልን እዩ-ቢትኮይን ተሰካሚ ንብረት እዩ።

---

### 8.2 Complete a First Transaction (send/receive) / 8.2 ቀዳማይ ትራንዛክሽን ምዝዛም (ምልኣኽ/ምቕባል)
On Bitcoin, coins don't 'move' like a physical object—instead, the global ledger updates to reflect your signed instruction. To receive, your wallet will show you a fresh address—often as both text and a QR code. Share that with the sender. Good wallets avoid address reuse by generating a new one each time; this helps protect your privacy because reused addresses create an easy trail.  
ኣብ ቢትኮይን፡ ሳንቲም ከም ኣካላዊ ነገር ‘ኣይንቀሳቐሱን’ እዮም-ኣብ ክንድኡ፡ እቲ ዓለማዊ መዝገብ መዝገብ ነቲ ዝፈረምካዮ መምርሒ ንምንጽብራቕ ይመሓየሽ። ንኽትቅበል፡ ቦርሳኻ ሓድሽ ኣድራሻ ከርእየካ እዩ- መብዛሕትኡ ግዜ ከም ጽሑፍን QR ኮድን እዩ። ንሱ ድማ ምስቲ ላኣኺ ሼር ግበርዎ። ጽቡቕ ቦርሳታት ኣብ ነፍሲ ወከፍ እዋን ሓድሽ ብምፍጣር ዳግማይ ካብ ምጥቃም ኣድራሻ ይቑጠቡ፤ እዚ ድማ ዳግማይ ዝተጠቕሙ ኣድራሻታት ቀሊል ኣሰር ስለ ዝፈጥሩ ንብሕትውናኻ ንምሕላው ይሕግዝ።

To send, you paste or scan the recipient's address, enter the amount, and choose a network fee. Fees go to miners and vary with network traffic. Low fees may confirm slowly; higher fees confirm faster. Your wallet will propose a sensible default—don't be shy to accept it while you learn. After you hit send, the transaction is broadcast to the network. Within seconds, other nodes can see it. A miner then bundles it into a block, and once confirmed, it becomes part of Bitcoin's permanent history. The first confirmation is usually enough for small payments. For larger amounts, people wait for more confirmations.  
ንምልኣኽ፡ ኣድራሻ ናይቲ ተቐባሊ ትለጥፎ ወይ ትስካን፡ መጠን ገንዘብ ኣእቲኻ፡ ክፍሊት መርበብ ሓበሬታ ትመርጽ። ክፍሊት ናብ ዕደናውያን ዝኸይድ ኮይኑ ምስ ትራፊክ መርበብ ይፈላለ። ትሑት ክፍሊት ቀስ ኢሉ ከረጋግጽ ይኽእል እዩ፤ ዝለዓለ ክፍሊት ብቕልጡፍ የረጋግጽ። ቦርሳኻ ርትዓዊ ነባሪ ሓሳብ ከቕርብ እዩ- እናተማሃርካ ክትቅበሎ ኣይትሕፈር። send ምስ ሃረምካ እቲ ትራንዛክሽን ናብቲ መርበብ ይፍኖ። ኣብ ውሽጢ ካልኢታት ካልኦት ኖድስ ክርእይዎ ይኽእሉ። ድሕሪኡ ሓደ ዕደናዊ ሰብ ኣብ ሓደ ብሎክ ይጥርንፎ፡ ምስ ተረጋገጸ ድማ ኣካል ቀዋሚ ታሪኽ ቢትኮይን ይኸውን። እቲ ቀዳማይ ምርግጋጽ መብዛሕትኡ ግዜ ንንኣሽቱ ክፍሊታት እኹል እዩ። ንዝዓበየ መጠን ገንዘብ፡ ሰባት ተወሳኺ መረጋገጺታት ይጽበዩ።

If anything looks wrong, pause. Check the first and last few characters of the address, and check the amount unit (BTC vs sats). When in doubt, do a tiny 'test send' first. A careful habit today saves tears tomorrow.  
ዝኾነ ጌጋ እንተመሲሉ ደው በል። ቀዳሞትን ናይ መወዳእታን ፊደላት ናይቲ ኣድራሻ መርምሩ፣ ከምኡውን ነቲ ናይ መጠን ኣሃዱ (BTC vs sats) መርምሩ። ኣብ እትጠራጠረሉ እዋን መጀመርታ ንእሽቶ ‘ፈተነ ምልኣኽ’ ግበሩ። ሎሚ ጥንቁቕ ልምዲ ንጽባሕ ንብዓት የድሕን።

> **💡 Tip / ምኽሪ፤**  
> Always do a small test send first when sending to a new address. Check the first and last few characters of the address carefully.  
> ኩሉ ግዜ ናብ ሓድሽ ኣድራሻ ክትሰድድ ከለኻ መጀመርታ ንእሽቶ ናይ ፈተነ ምልኣኽ ግበር። ቀዳሞትን ናይ መወዳእታን ፊደላት ናይቲ ኣድራሻ ብጥንቃቐ መርምሩ።

> **⚠️ Warning / መጠንቀቕታ፤**  
> Check the amount unit (BTC vs sats). Sending 1 BTC when you meant 1 sat is a costly mistake.  
> ኣሃዱ መጠን ገንዘብ (BTC vs sats) መርምሩ። 1 sat ክትብል ከለኻ 1 BTC ምልኣኽ ብዙሕ ወጻኢታት ዝሓትት ጌጋ እዩ።

---

### 8.3 Privacy Basics (VPN, address reuse awareness, local-first tools) / 8.3 መሰረታዊ ብሕታዊነት (VPN, ኣድራሻ ዳግመ-ኣጠቓቕማ ንቕሓት፣ ኣብ ከባቢ-ቀዳማይ መሳርሒታት)
Bitcoin is public by design. That transparency is a strength, but it also means careless habits can expose your financial life. Start with the basics. Avoid reusing addresses; most wallets handle this automatically. Be mindful when posting screenshots or sharing transaction IDs—those breadcrumbs can be linked together. Using a reputable VPN on untrusted Wi-Fi can protect your internet traffic from local snoops, though it does not make your on-chain transactions private. Think of a VPN like curtains on a window: helpful, but not a brick wall.  
ቢትኮይን ብዲዛይን ህዝባዊ እዩ። እቲ ግሉጽነት ሓይሊ’ኳ እንተኾነ፡ ሸለልትነት ዘይብሉ ልምድታት ንፋይናንሳዊ ህይወትካ ከቃልዕ ይኽእል’ዩ ማለት’ውን እዩ። ካብ መሰረታዊ ነገራት ጀምር። ኣድራሻታት ዳግማይ ካብ ምጥቃም ምቑጣብ፤ መብዛሕትኦም ቦርሳታት ነዚ ብኣውቶማቲክ ይሕዝዎ። ስክሪን ሾት ክትልጥፍ ወይ ናይ ትራንዛክሽን መለለዪ ክትካፈል ከለኻ ኣስተውዕል-እቶም ቅጫታት ብሓባር ክተሓሓዙ ይኽእሉ። ኣብ ዘይተኣማመን ዋይ-ፋይ ዝና ዘለዎ ቪፒኤን ምጥቃም፡ ንናይ ኢንተርነት ትራፊክካ ካብ ናይ ከባቢ ስኑፕስ ክከላኸለሉ ይኽእል እዩ፡ ዋላ እኳ ነቲ ኣብ ሰንሰለት ዘሎ ትራንዛክሽንካ ብሕታዊ እንተዘይገብሮ። ከም መጋረጃ ኣብ መስኮት ዝኣመሰለ ቪፒኤን ሕሰብ: ሓጋዚ፡ ግን ከኣ መንደቕ ሕጡብ ኣይኮነን።

Where possible, prefer 'local-first' features. A wallet that can verify transactions using simplified proofs (SPV) or your own node leaks less data to third-party servers than one that requires you to send every detail to a company. If that sounds advanced, don't worry; you can start simple and grow into it. The key idea is to develop the habit of asking, 'Who learns something about me when I click this button?' Good tools minimize that answer.  
ኣብ ዝከኣለሉ፡ 'ከባብያዊ-ቀዳማይ' ባህርያት ምረጹ። ዝተቐለለ መርትዖታት (SPV) ወይ ናይ ገዛእ ርእስኻ መስመር ተጠቒምካ ትራንዛክሽን ከረጋግጽ ዝኽእል ቦርሳ፡ ካብቲ ነፍሲ ወከፍ ዝርዝር ናብ ሓደ ኩባንያ ክትሰድድ ዝጠልብ ንላዕሊ ዝወሓደ ዳታ ናብ ሳልሳይ ወገን ኣገልገልቲ የፍስስ። እዚ ምዕቡል እንተመሲሉ ኣይትሻቐል፤ ቀሊል ጀሚርካ ናብኡ ክትዓቢ ትኽእል ኢኻ። እቲ ቀንዲ ሓሳብ፡ ‘ነዚ መጠወቒ ምስ ጠወቕኩ መን ብዛዕባይ ገለ ይመሃር?’ ዝብል ልምዲ ምምዕባል እዩ። ጽቡቕ መሳርሒታት ነዚ መልሲ እዚ የጉድልዎ።

Finally, protect your identity on the exchange side. SIM-swap fraud and email takeovers are common. Use an authenticator app for 2FA instead of SMS, set strong, unique passwords, and keep recovery emails safe. Privacy is not one switch; it's a posture—a collection of small, steady choices.  
ኣብ መወዳእታ ብወገን ምልውዋጥ መንነትካ ሓልው። ምትላል ሲም-ስዋፕን ኢመይል ምውሳድን ልሙድ እዩ። ኣብ ክንዲ ኤስኤምኤስ ን2FA ዝኸውን መረጋገጺ ኣፕ ተጠቐም፣ ድልዱላትን ፍሉያትን ፓስዎርድታት ኣቐምጥ፣ ከምኡ’ውን ናይ ምሕዋይ ኢመይላት ውሑስ ይኹን። ብሕትውና ሓደ ምቅይያር ኣይኮነን፤ ኣቃውማ እዩ-እኩብ ንኣሽቱን ርጉኣትን ምርጫታት።

> **💡 Tip / ምኽሪ፤**  
> Use an authenticator app for 2FA instead of SMS to protect against SIM-swap attacks.  
> ካብ SIM-swap መጥቃዕቲ ንምክልኻል ኣብ ክንዲ SMS ን2FA ዝኸውን authenticator app ተጠቐም።

> **📝 Note / መተሓሳሰቢ፤**  
> Privacy is not one switch; it's a posture—a collection of small, steady choices.  
> ብሕትውና ሓደ ምቅይያር ኣይኮነን፤ ኣቃውማ እዩ-እኩብ ንኣሽቱን ርጉኣትን ምርጫታት።

---

## Activities / ንጥፈታት
- **Activity: Testnet Walkthrough — 'Buy' mock sats → send to class wallets**  
  ንጥፈት: ቴስትኔት መገሻ — ዘይሓቀኛ ሳትስ 'ግዛእ' → ናብ ናይ ክፍሊ ፖርተፊልዮታት ስደድ
- **Activity: Create and Explore a Wallet (Mock Exercise):**  
  ንጥፈት: ፖርተፊልዮ ምፍጣርን ምድህሳስን (ናይ ልምምድ ዕዮ):
  1. **Create a Wallet** – Students write down a 12-word seed phrase (provided or generated). Explain that this seed is the master key.  
     1. **ፖርተፊልዮ ምፍጣር** – ተመሃሮ ናይ 12 ቃላት ዘርኢ ሓረግ (ዝተዋህበ ወይ ዝተፈጥረ) ይጽሕፉ። እዚ ዘርኢ ዋና መፍትሕ ምዃኑ ግለጽ።
  2. **Generate Addresses** – From the seed, students create a few mock addresses. Discuss why wallets use new addresses for privacy.  
     2. **ኣድራሻታት ምፍጣር** – ካብቲ ዘርኢ፡ ተመሃሮ ሒደት ዘይሓቀኛ ኣድራሻታት ይፈጥሩ። ፖርተፊልዮታት ንብሕትውና ስለምንታይ ሓደስቲ ኣድራሻታት ከም ዝጥቀሙ ተመያየጡ።
  3. **Receive Coins** – The Instructor assigns each student a mock balance. Students 'receive' coins at one of their addresses.  
     3. **ሳንቲም ምቕባል** – መምህር ንነፍሲ ወከፍ ተመሃራይ ዘይሓቀኛ ሚዛን ይህብ። ተመሃሮ ኣብ ሓደ ካብ ኣድራሻታቶም ሳንቲም ‘ይቕበሉ’።
  4. **Send Coins** – Students 'send' a portion of their balance to a classmate's address, noting from/to addresses, amount, and fee. Explain how real transactions are signed with private keys.  
     4. **ሳንቲም ምልኣኽ** – ተመሃሮ ካብ ሚዛኖም ገለ ክፋል ናብ ናይ ክፍሊ መማህርቶም ኣድራሻ ‘ይሰዱ’፡ ካብ/ናብ ኣድራሻታት፡ መጠንን ክፍሊትን የመልክቱ። ሓቀኛ ትራንዛክሽናት ብናይ ብሕቲ መፍትሕታት ብኸመይ ከም ዝፍረሙ ግለጽ።
  5. **Recover Wallet** – Students erase their mock wallet and restore it using the seed. Confirm balances and addresses reappear.  
     5. **ፖርተፊልዮ ምምላስ** – ተመሃሮ ነቲ ናይ ፈተነ ፖርተፊልዮኦም ደምሲሶም በቲ ዘርኢ ሓረግ ተጠቒሞም ይመልስዎ። ሚዛናትን ኣድራሻታትን ዳግማይ ከም ዝረኣዩ ኣረጋግጽ።

---

## Summary / ጽማረ
- Exchanges are bridges to acquire Bitcoin, but always withdraw to your own wallet.  
  ምልውዋጥ ቢትኮይን ንምርካብ ድልድል እዩ፡ እንተኾነ ግን ኩሉ ግዜ ናብ ናይ ገዛእ ርእስኻ ፖርተፊልዮ ኣውጽኣዮ።
- Seed phrases are the master key—write them on paper, never digitally, and practice recovery.  
  ዘርኢ ሓረጋት (Seed phrases) ዋና መፍትሕ እዮም—ኣብ ወረቐት ጽሓፎም፡ ፈጺምካ ብዲጂታል ኣይትጽሓፎም፡ ከምኡውን ምሕዋይ ተላመድ።
- Use a new address for each receive to protect privacy.  
  ብሕትውናኻ ንምሕላው ንነፍሲ ወከፍ ምቕባል ሓድሽ ኣድራሻ ተጠቐም።
- Always verify addresses and do test sends when uncertain.  
  ኩሉ ግዜ ኣድራሻታት ኣረጋግጽ፡ ኣብ እትጠራጠረሉ እዋን ድማ ፈተነ ምልኣኽ ግበር።
- Privacy is built through small, consistent habits: avoid address reuse, use VPN on untrusted networks, prefer local-first tools.  
  ብሕትውና ብንኣሽቱ ቀጻሊ ልምድታት ይህነጽ: ኣድራሻ ዳግመ-ምጥቃም ኣወግድ፡ ኣብ ዘይተኣማመኑ መርበባት VPN ተጠቐም፡ ከባብያዊ-ቀዳሞት መሳርሒታት ምረጽ።

---

## Key Terms / ቁልፊ ቃላት
- **Exchange** — ምልውዋጥ (Exchange)
- **KYC (Know Your Customer)** — KYC (ዓሚልካ ፍለጥ)
- **Seed phrase** — ዘርኢ ሓረግ (Seed phrase)
- **Passphrase** — ፓስፍረይዝ (Passphrase)
- **Address reuse** — ኣድራሻ ዳግመ-ምጥቃም (Address reuse)
- **Fee** — ክፍሊት (Fee)
- **Testnet** — ቴስትኔት (Testnet)
- **VPN** — VPN (ቪፒኤን)
- **2FA** — 2FA (ክልተ-ደረጃ መረጋገጺ)
- **SPV** — SPV (ዝተቐለለ ክፍሊት ምርግጋጽ)
