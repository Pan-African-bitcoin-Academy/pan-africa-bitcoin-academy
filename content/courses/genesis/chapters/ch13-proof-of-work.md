# Chapter 13 · Proof of Work and Block Rewards
# ምዕራፍ 13 · መርትዖ ስራሕን ናይ ብሎክ ሽልማትን

**Level:** Intermediate · **ደረጃ:** ማእከላይ
**Duration:** 55 min · **ግዜ:** 55 ደቒቕ
**Type:** Theory · **ዓይነት:** ክልሰ-ሓሳብ

> PoW makes blocks hard to forge but easy to verify.
> PoW ንብሎኮታት ንምፍሻል ኣጸጋሚ ይገብሮም ግን ከኣ ንምርግጋጽ ቀሊል ይገብሮ።

[← Chapter 12](https://panafricanbitcoin.com/chapters/verify-for-yourself-block-explorers-nodes) | [Chapter 14 →](https://panafricanbitcoin.com/chapters/mining-in-practice)

---

## What You Will Learn | እንታይ ክትመሃር ኢኻ።

- PoW asymmetry | ዘይምምጥጣን (PoW asymmetry)
- Block rewards (3.125 BTC post-Apr 2024) and fees | ሽልማት ብሎክ (3.125 BTC ድሕሪ ሚያዝያ 2024) ከምኡ'ውን ክፍሊት
- Halving schedule and fixed supply | ፍርቂ ምቕናስ መደብ ስራሕን ቀዋሚ ቀረብን
- Subsidy timeline to 2140 | ናይ ክፍሊት ግዜ ገደብ ክሳብ 2140

---

## Introduction | መእተዊ

Bitcoin's security and consensus mechanism is built on something called Proof of Work (PoW). This system makes it extremely expensive to create new blocks but very easy to verify that blocks are valid. This asymmetry is what prevents attacks like double-spending and ensures everyone agrees on the same version of the blockchain.

ድሕነትን ቢትኮይንን ናይ ምርድዳእን ኣገባብን ኣብ መርትዖ ስራሕ (PoW) ዝበሃል ነገር ዝተሃንጸ እዩ። እዚ ስርዓት እዚ ሓደስቲ ብሎክ ንምፍጣር ኣዝዩ ክቡር ይገብሮ ግን ብሎክ ቅኑዓት ምዃኖም ንምርግጋጽ ኣዝዩ ቀሊል እዩ።

---

## 13.0 Proof of Work | 13.0 መርትዖ ስራሕ

Proof of Work is like a cryptographic puzzle that miners must solve to create a new block. The genius of PoW is its **asymmetry**: creating a valid block is extremely expensive, but verifying it is trivial.

መርትዖ ስራሕ ከምቲ ዓደንቲ ሓድሽ ብሎክ ንምፍጣር ክፈትሕዎ ዘለዎም ምስጢራዊ ሕንቅልሕንቅሊተይ እዩ። ኣገራሚ ኣሰራርሓ ናይ PoW ዘይምምጥጣኑ እዩ: ቅኑዕ ብሎክ ምፍጣር ኣዝዩ ክቡር፣ ምርግጋጽ ግን ቀሊል።

> **📝 Note | መተሓሳሰቢ:** Proof of Work makes attacks economically irrational. | መርትዖ ስራሕ ንመጥቃዕቲ ብቑጠባ ዘይርትዓዊ ይገብሮ።

---

## 13.1 Miners and Block Rewards | 13.1 ዓዳንቲን ሽልማት ብሎክን

Miners are rewarded in two ways: block rewards (currently **3.125 BTC** per block) and transaction fees.

ዓደንቲ ብኽልተ መንገዲ ይሽለሙ: ሽልማት ብሎክ (ኣብዚ እዋን **3.125 BTC** ንሓደ ብሎክ) ከምኡ'ውን ክፍሊት ትራንዛክሽን።

> **💡 Tip | ምኽሪ:** Block rewards plus fees incentivize miners to secure the network honestly. | ሽልማት ብሎክ ተወሲኹዎ ክፍሊት ንዓዳንቲ ነቲ መርበብ ብቕንዕና ንኽውሕስዎ የተባብዕ።

---

## 13.2 Halving Schedule and Fixed Supply | 13.2 ፍርቂ ምጉዳል መደብ ስራሕን ቀዋሚ ቀረብን

Every ~4 years (210,000 blocks) the block reward halves. Bitcoin's total supply is fixed at **21 million coins**.

ኣብ ነፍሲ ወከፍ ~4 ዓመት (210,000 ብሎክ) ሽልማት ብፍርቂ ይቑረጽ። ጠቕላላ ቀረብ ቢትኮይን ኣብ **21 ሚልዮን ሳንቲም** ዝተወሰነ እዩ።

### Halving Timeline | ናይ ፍርቂ ምጉዳል መስመር ግዜ

| Period Start | Period End | Block Range | Subsidy/Block | BTC Created | Total BTC |
|---|---|---|---|---|---|
| 2009-01-03 | 2012-11-28 | 0–209,999 | 50.00 BTC | 10,500,000 | 10,500,000 |
| 2012-11-28 | 2016-07-09 | 210,000–419,999 | 25.00 BTC | 5,250,000 | 15,750,000 |
| 2016-07-09 | 2020-05-11 | 420,000–629,999 | 12.50 BTC | 2,625,000 | 18,375,000 |
| 2020-05-11 | 2024-04-20 | 630,000–839,999 | 6.25 BTC | 1,312,500 | 19,687,500 |
| 2024-04-20 | ~2028-03 | 840,000–1,049,999 | 3.125 BTC | 656,250 | 20,343,750 |
| ~2028-03 | ~2032-02 | 1,050,000–1,259,999 | 1.5625 BTC | 328,125 | 20,671,875 |
| ~2032-02 | ~2036-01 | 1,260,000–1,469,999 | 0.78125 BTC | 164,062.5 | 20,835,937.5 |
| ~2036-01 | ~2040-01 | 1,470,000–1,679,999 | 0.390625 BTC | 82,031.25 | 20,917,968.75 |

*(Issuance continues with the same halving logic until subsidy reaches 0 satoshis ~2140.)*

> **⚠️ Warning | መጠንቀቕታ:** Blocks define supply, not dates. Block height is the law. | ብሎኮታት ንቐረብ እምበር ዕለታት ኣይገልጹን። መስርዕ ብሎክ ሕጊ እዩ።

> **📝 Note | መተሓሳሰቢ:** Bitcoin's supply is fixed at 21 million coins. | ቀረብ ቢትኮይን ኣብ 21 ሚልዮን ሳንቲም ውሱን እዩ።

---

## 13.3 End of Subsidy | 13.3 ምዝዛም ክፍሊት

Around 2140, block rewards drop to zero. Miners will rely entirely on transaction fees. A healthy fee market is essential for long-term network security.

ኣብ ከባቢ 2140 ሽልማት ናብ ዜሮ ይወርድ። ዓዳንቲ ምሉእ ብምሉእ ኣብ ክፍሊት ትራንዛክሽን ክምርኮሱ እዮም። ጥዑይ ዕዳጋ ክፍሊት ንነዊሕ ግዜ ዝፀንሕ ድሕነት ኔትወርክ ኣገዳሲ እዩ።

> **📝 Note | መተሓሳሰቢ:** After 2140, miners rely entirely on transaction fees. | ድሕሪ 2140 ዓዳንቲ ምሉእ ብምሉእ ኣብ ክፍሊት ትራንዛክሽን ክምርኮሱ እዮም።

---

## Assignment | ዕዮ

**🧩 The Halving Timeline Puzzle | እቲ ፍርቂ ናይ ግዜ መስመር ሕንቅልሕንቅሊተይ**

Place the Bitcoin block reward tiles (50 BTC → 25 BTC → 12.5 BTC → 6.25 BTC → 3.125 BTC) in chronological order from left (Genesis) to right (Today).

ናይ ቢትኮይን ሽልማት ብሎክ ቀጻሊታት (50 BTC → 25 BTC → 12.5 BTC → 6.25 BTC → 3.125 BTC) ካብ ጸጋም (ዘፍጥረት) ናብ የማን (ሎሚ) ብመስርዕ ግዜ ኣቐምጦም።

> Bitcoin's block reward does not decrease smoothly. It drops suddenly — like stairs, not a ramp.
> ናይ ቢትኮይን ብሎክ ሽልማት ቀስ ኢሉ ኣይንኪን እዩ። ሃንደበት ይወድቕ — ከም መደያይቦ እምበር ከም ራምፕ ኣይኮነን።
