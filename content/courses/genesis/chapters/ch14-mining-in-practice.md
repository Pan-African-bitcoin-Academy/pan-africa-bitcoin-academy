# Chapter 14 · Mining in Practice
# ምዕራፍ 14 · ዕደና ቢትኮይን

**Level:** Intermediate · **ደረጃ:** ማእከላይ
**Duration:** 60 min · **ግዜ:** 60 ደቒቕ
**Type:** Theory · **ዓይነት:** ክልሰ-ሓሳብ

> Mining economics—difficulty, pools, fees—shape network security.
> ቁጠባ ዕደና- ክብደት፡ ፑል፡ ክፍሊት- ንውሕስነት መርበብ ይውስኖ።

[← Chapter 13](https://panafricanbitcoin.com/chapters/proof-of-work-and-block-rewards) | [Chapter 15 →](https://panafricanbitcoin.com/chapters/layer-2-sidechains-in-daily-life)

---

## What You Will Learn | እንታይ ክትመሃር ኢኻ።

- Difficulty adjustment mechanics | ናይ ክብደት ምትዕርራይ መካኒክስ
- Mining pools, payout schemes, censorship risk | ናይ ዕደና ፑል፣ ናይ ክፍሊት መደባት፣ ናይ ሳንሱር ሓደጋ
- Security budget: subsidy vs fees | ናይ ጸጥታ ባጀት፡ ድጎማ ኣንጻር ክፍሊት
- ASIC supply chain and geopolitical risks | ASIC ቀረብ ሰንሰለትን ጂኦፖለቲካዊ ሓደጋታትን

---

## Introduction | መእተዊ

While Proof of Work provides Bitcoin's security, the practical reality of mining involves complex economics, coordination challenges, and real-world risks.

መርትዖ ስራሕ ንቢትኮይን ውሕስነት ክህብ እንከሎ፡ ግብራዊ ክውንነት ዕደና ግን ዝተሓላለኸ ቁጠባን፡ ናይ ምውህሃድ ብድሆታትን ኣብ ሓደጋታትን ዘጠቓልል እዩ።

---

## 14.0 Difficulty Adjustment | 14.0 ምትዕርራይ ጸገም (ነፍሲ ወከፍ 2016 ብሎኮታት)

Every **2016 blocks** (~2 weeks), the network automatically adjusts mining difficulty to keep block times at ~10 minutes. This self-regulation means the network can absorb massive hash rate swings without breaking.

ኣብ ነፍሲ ወከፍ **2016 ብሎካት** (~2 ሰሙን)፡ እቲ መርበብ ነቲ ናይ ዕደና ክብደት ንናይ ብሎክ ግዜ ኣብ ~10 ደቓይቕ ንምዕቃብ ብኣውቶማቲክ የስተኻኽሎ።

> **📝 Note | መተሓሳሰቢ:** Difficulty adjusts every 2016 blocks to maintain ~10-minute block times. | ክብደት ኣብ ነፍሲ ወከፍ 2016 ብሎክ ይስተኻኸል ~10 ደቓይቕ ዝኸውን ናይ ብሎክ ግዜ ንምዕቃብ።

---

## 14.1 Mining Pools & Centralization Risk | 14.1 ፑል ዕደናን ሓደጋ ማእኸላይነትን

Solo mining is like a lottery — low odds. Most miners join **mining pools** that combine hashing power and share rewards proportionally. Pool operators use the **Stratum protocol**; payout models include PPS, PPLNS, and FPPS.

ውልቃዊ ዕደና ልክዕ ከም ሎተሪ ምጽዋት እዩ — ዕድሊ ኣዝዩ ትሑት። መብዛሕትኦም ዕደናውያን ናብ **ናይ ዕደና ፑል** ይጽንበሩ፣ ሃሺንግ ሓይሎም ኣወሃሂዶም ሽልማት ብመጠኑ ይካፈሉ።

> **⚠️ Warning | መጠንቀቕታ:** Large pools could censor transactions or influence network policy. Monitor pool concentration and consider supporting smaller pools. | ዓበይቲ ፑል ትራንዛክሽን ክሰናብቱ ወይ ፖሊሲ ኔትወርክ ክጸልዉ ይኽእሉ። ምትእኽኻብ ፑል ምክትታልን ንኣሽቱ ፑል ምድጋፍ ኣብ ግምት ምእታውን።

---

## 14.2 Security Budget | 14.2 ድሕነት ባጀት (ድጎማ ኣንጻር ክፍሊት)

Bitcoin's security comes from two sources: **block rewards** (subsidy) and **transaction fees**. As halvings continue, fees must grow to maintain security. After ~2140, miners rely entirely on fees.

ናይ ቢትኮይን ውሕስነት ካብ ክልተ ምንጭ ይመጽእ: **ሽልማት ብሎክ** (ድጎማ) ከምኡ'ውን **ክፍሊት ትራንዛክሽን**። ናይ ፍርቂ ምጉዳል እናቐጸለ ምስ ከደ ክፍሊት ክዓቢ ኣለዎ።

> **📝 Note | መተሓሳሰቢ:** As block rewards decline, transaction fees must grow to maintain network security. | ሽልማት ብሎክ እናነከየ ምስ ከደ ክፍሊት ትራንዛክሽን ክዓቢ ኣለዎ።

---

## 14.3 ASIC Supply Chains & Geopolitical Risks | 14.3 ASIC ቀረብ ሰንሰለታትን ጂኦፖለቲካዊ ሓደጋታትን

Bitcoin mining requires **ASICs** (Application-Specific Integrated Circuits). Most ASICs are manufactured in a few countries, creating geopolitical risks. Mining is also geographically concentrated due to cheap electricity.

ዕደና ቢትኮይን **ASICs** (Application-Specific Integrated Circuits) ዝበሃል ፍሉይ ሃርድዌር የድሊ። መብዛሕትኦም ASICs ኣብ ውሑዳት ሃገራት ዝስርሑ ኮይኖም ጂኦፖለቲካዊ ሓደጋ ይፈጥሩ።

> **⚠️ Warning | መጠንቀቕታ:** ASIC supply chain concentration and geographic mining concentration create potential risks. Diversification is important for network resilience. | ምትእኽኻብ ቀረብ ሰንሰለት ASICን ምትእኽኻብ ጂኦግራፍያዊ ዕደናን ክህልዉ ዝኽእሉ ሓደጋታት ይፈጥሩ።
