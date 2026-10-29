# Chapter 15 · Layer 2 & Sidechains in Daily Life
# ምዕራፍ 15 · ቀጸላ2 & ጎናዊ ሰንሰለታት ኣብ መዓልታዊ ህይወት

**Level:** Intermediate · **ደረጃ:** ማእከላይ
**Duration:** 70 min · **ግዜ:** 70 ደቓይቕ
**Type:** Practice · **ዓይነት:** ልምምድ

> Lightning and sidechains make Bitcoin faster and more flexible—with trade-offs.
> ላይትኒንግን ጎድናዊ ሰንሰለትን ንቢትኮይን ዝቐልጠፈን ተዓጻጻፍን ይገብርዎ-ምስ ምትሕውዋስ።

[← Chapter 14](https://panafricanbitcoin.com/chapters/mining-in-practice) | [Chapter 16 →](https://panafricanbitcoin.com/chapters/full-node-opening-a-lightning-channel)

---

## What You Will Learn | እንታይ ክትመሃር ኢኻ።

- Lightning basics and settlement trade-offs | መሰረታዊ ነገራት ላይትኒንግ ምትሕውዋስ ምውርራድን
- Custodial vs non-custodial Lightning | ምእሳር ኣንጻር ዘይመእሰሪ ላይትኒንግ
- Sidechains (e.g., Liquid) and federated trust | ጎናዊ ሰንሰለታት (ንኣብነት ፈሳሲ)ን ፌደራላዊ እምነትንን
- Circular economies running on sats | ኣብ sats ዝተመርኮሱ ቁጠባታት

---

## Introduction | መእተዊ

Bitcoin's base layer is secure and decentralized, but it has limitations: transactions can take time to confirm, and fees can be high during busy periods. Layer 2 solutions and sidechains address these challenges by building additional layers on top of Bitcoin, enabling faster payments, lower fees, and new features.

መሰረታዊ ቀጸላ ቢትኮይን ውሑስን ዘይተማእከለን ኮይኑ፡ ድሩትነት ግን ኣለዎ፡ ምስግጋር ንምርግጋጽ ግዜ ክወስድ ይኽእል እዩ፡ ኣብ ጽዑቕ እዋን ድማ ክፍሊት ልዑል ክኸውን ይኽእል። 2ይ ቀጸላ መፍትሒታትን ጎድናዊ ሰንሰለታትን ነዞም ብድሆታት ዝፈትሕዎ፡ ኣብ ልዕሊ ቢትኮይን ተወሳኺ ቀጸላ ብምህናጽ፡ ዝቐልጠፈ ክፍሊት፡ ዝተሓተ ክፍሊትን ሓደስቲ ባህርያትን የኽእሉ።

---

## 15.0 Lightning Basics | 15.0 መሰረታዊ ነገራት ላይትኒንግ

The Lightning Network is a Layer 2 solution that enables instant, low-fee payments by moving transactions off the main Bitcoin blockchain using payment channels.

ላይትኒንግ ኔትወርክ ትራንዛክሽን ካብቲ ቀንዲ ቢትኮይን ብሎክቸይን ብምግዓዝ ቅጽበታዊን ትሑት ክፍሊት ዘለዎን ክፍሊት ዘኽእል ንብርኪ 2 መፍትሒ እዩ።

> **📝 Note | መተሓሳሰቢ:** Lightning channels require liquidity management. You need inbound capacity to receive and outbound capacity to send. | ላይትኒንግ መስመራት ምሕደራ ዓቅሚ ገንዘብ የድልዮም። ንምቕባል ናይ ምእታው ዓቕሚ፡ ንምልኣኽ ድማ ናይ ደገ ዓቕሚ የድልየካ።

---

## 15.1 Receive and Spend on Lightning | 15.1 ኣብ ላይትኒንግ ምቕባልን ምውጻእን (Custodial vs Non-Custodial)

- **Custodial wallets:** convenient like bank accounts, but requires trusting a third party.
- **Non-custodial wallets:** full control of channels, liquidity, and keys, but requires active management.

- **ካስቶድያል ቦርሳታት:** ከም ናይ ባንክ ሕሳብ ምቹኣት እዮም — ሓደ ኩባንያ ገንዘብካ ይሕዝን ንኹሉ ቴክኒካዊ ዝርዝራት ይሕዝን።
- **Non-Custodial ቦርሳታት:** ምሉእ ቁጽጽር ይህቡኻ። ቻነላትን ፈሳሲን መፍትሕን ባዕልኻ ኢኻ እተመሓድር።

> **💡 Tip | ምኽሪ:** Start with a custodial Lightning wallet to learn, then graduate to non-custodial for full control and privacy. | ንኽትመሃር ብናይ ምእሳር ላይትኒንግ ቦርሳ ጀምር፣ ድሕሪኡ ንሙሉእ ምቁጽጻርን ብሕትውናን ናብ ዘይ-ካስቶድያል ቀጽል።

> **⚠️ Warning | መጠንቀቕታ:** Custodial Lightning wallets require trust in the provider. Only keep small amounts in custodial wallets. | ካስቶድያል ላይትኒንግ ቦርሳታት ኣብቲ ኣቕራቢ እምነት የድልዮም ስለዚ ኣብ ቦርሳታት መዕቆቢ ንእሽቶ ገንዘብ ጥራይ ኣቐምጥ።

---

## 15.2 Sidechains and Federated Trust | 15.2 ጎናዊ ሰንሰለታት (ንኣብነት ፈሳሲ)ን ፈደረሽን ትራስትን

Sidechains (like Liquid) are separate blockchains pegged to Bitcoin. They use federated trust where trusted entities validate transactions.

ሳይድቸይን (ከም Liquid) ምስ ቢትኮይን ዝተኣሳሰሩ ዝተፈላለዩ ብሎክቸይን እዮም። ጎድናዊ ሰንሰለታት ብተለምዶ ፌደራላዊ ትራስት ይጥቀሙ።

> **⚠️ Warning | መጠንቀቕታ:** Sidechains introduce trust in federations. Only use them if you understand and accept this trade-off. | ጎናዊ ሰንሰለታት ኣብ ፈደረሽናት ምትእምማን የተኣታቱ። ነዚ ምትሕውዋስ እንተተረዲእካዮን እንተተቐቢልካን ጥራይ ኢኻ ተጠቐመሎም።

---

## 15.3 Circular Economies Running on Sats | 15.3 ኣብ ቢትኮይን ዝምርኮሱ ዓንኬላዊ ቁጠባታት

Communities where people earn and spend Bitcoin entirely within their local network, reducing reliance on traditional banking.

ሰባት ቢትኮይን ምሉእ ብምሉእ ኣብ ውሽጢ ውሽጣዊ መርበቦም ዝረኽብሉን ዘውጽእሉን ማሕበረሰባት፡ ኣብ ባህላዊ ስርዓታት ባንክ ዘለዎም ጽግዕተኛነት ይቕንሱ።

> **📖 Example | ኣብነት:** A local marketplace where vendors accept Lightning payments, and customers can spend their earnings at other vendors in the same network, creating a circular economy. | ናይ ውሽጢ ዓዲ ዕዳጋ ሸቃጦ ክፍሊት ላይትኒንግ ዝቕበሉሉ ፣ ዓማዊል ድማ ኣታዊታቶም ኣብ ካልኦት ሸየጥቲ ኣብ ሓደ መርበብ ከውጽእዎ ይኽእሉ፣ እዚ ድማ ክቢ ቁጠባ ይፈጥር።
