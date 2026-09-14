---
title: "XIRR vs Absolute Return: Which SIP Return Should You Check?"
description: "Learn XIRR vs absolute return for SIPs, why investment apps show different percentages, when short-period XIRR can look extreme, and how CAGR differs."
summary: "Absolute return shows the total percentage gain or loss without adjusting for time. XIRR calculates an annualised rate using the date and amount of every cash flow, which makes it useful for SIPs after a meaningful period but sometimes confusing for recent investments."
publishedAt: 2026-09-14
updatedAt: 2026-09-14
reviewedAt: 2026-09-12
reviewBy: 2027-03-12
author: nikhil-arora
reviewer: mazhar-arif
topics:
  - mutual-fund-returns
  - sip
  - investing-basics
hero:
  type: quote
  quote: "Absolute return tells you how much changed. XIRR also accounts for when each rupee was invested."
  attribution: Roz Invest
socialImage: /assets/images/learn/xirr-vs-absolute-return-quote-social.png
socialImageAlt: "Quote comparing absolute return with XIRR, which also accounts for when each rupee was invested"
articleImages:
  - /assets/images/learn/xirr-vs-absolute-return-quote-16x9.jpg
  - /assets/images/learn/xirr-vs-absolute-return-quote-4x3.jpg
  - /assets/images/learn/xirr-vs-absolute-return-quote-1x1.jpg
sources:
  - title: XIRR Function
    url: https://support.microsoft.com/en-us/excel/functions/xirr-function
    publisher: Microsoft Support
  - title: How to Calculate Mutual Fund Returns
    url: https://support.zerodha.com/category/mutual-funds/features-on-coin/systematic-investment-plan/articles/calculating-mf-return
    publisher: Zerodha Support
  - title: Mutual Funds Advanced
    url: https://investor.sebi.gov.in/pdf/reference-material/ppt/Mutual-Fund-for-Advance.pdf
    publisher: SEBI Investor
  - title: Systematic Investment Plan
    url: https://www.amfiindia.com/mutual-fund
    publisher: Association of Mutual Funds in India
cta:
  label: Join the waitlist
  href: /#waitlist
  description: Be among the first to use Roz Invest when the platform opens to new investors.
faqs:
  - question: What is the difference between XIRR and absolute return?
    answer: Absolute return measures the total percentage change without adjusting for time. XIRR calculates an annualised rate using the amount and date of each investment, withdrawal and current value.
  - question: Which return should I check for an SIP?
    answer: XIRR is generally the more informative annualised measure for an SIP with multiple cash flows over a meaningful period. For a recent investment, also check the rupee gain and absolute return because annualisation can exaggerate a short experience.
  - question: Why is my XIRR high but absolute return low?
    answer: XIRR annualises the return implied by a short period. A modest gain earned over a few months can therefore appear as a much larger annualised percentage even though the actual gain remains modest.
  - question: Can XIRR be negative?
    answer: Yes. XIRR can be negative when the dates and values of your cash flows imply an annualised loss. It does not mean every instalment lost the same percentage.
  - question: Is XIRR the same as CAGR?
    answer: No. CAGR is commonly used for one starting investment and one ending value. XIRR is designed for multiple cash flows occurring on different dates, such as SIP instalments and withdrawals.
  - question: Is the XIRR shown by an app guaranteed to continue?
    answer: No. XIRR describes past cash flows and the current or ending value. It is not a forecast, and it can change as NAV changes or new transactions occur.
relatedArticles:
  - what-is-an-sip
  - sip-down-should-i-stop
  - what-happens-when-sip-ends
status: published
featured: false
disclosure: comparison
---

## What is the difference between XIRR and absolute return?

Absolute return tells you the total percentage gain or loss without adjusting for how long the money was invested. XIRR uses the amount and date of every cash flow to calculate an annualised rate, which makes it better suited to a series of SIP instalments.

The two percentages answer different questions:

| Measure | Question it answers |
| --- | --- |
| Absolute return | How much has the investment changed in total? |
| XIRR | What annualised rate fits the timing of all my cash flows? |
| CAGR | What steady annual rate connects one starting value and one ending value? |

Seeing different numbers on the same app screen does not mean one is necessarily wrong. The calculation and time frame differ.

## How is absolute return calculated?

Absolute return compares the gain or loss with the amount invested and ignores the time taken. It is easy to understand for a short, single investment but cannot compare different holding periods fairly.

The common formula is:

**Absolute return = (current value minus amount invested) divided by amount invested × 100**

If ₹10,000 becomes ₹10,500, the absolute return is 5%. That remains 5% whether the change took three months or three years, which is the formula's main limitation.

[Zerodha's return-calculation guidance](https://support.zerodha.com/category/mutual-funds/features-on-coin/systematic-investment-plan/articles/calculating-mf-return), accessed 11 September 2026, uses this formula and separates absolute return, CAGR and XIRR by investment pattern and duration.

## How does XIRR work for an SIP?

XIRR treats each SIP instalment as a separate cash outflow on its actual date and the current or redemption value as an inflow. It finds the annualised rate that mathematically connects those dated cash flows.

[Microsoft's XIRR documentation](https://support.microsoft.com/en-us/excel/functions/xirr-function), accessed 11 September 2026, defines XIRR as the internal rate of return for cash flows that are not necessarily periodic. It uses the corresponding dates and a 365-day year.

An SIP is a good example because the first ₹5,000 instalment has been invested longer than the latest ₹5,000 instalment. Dividing the total gain by the total amount invested would ignore that timing.

## Why can XIRR look very high after a few months?

XIRR can look unusually high after a short period because it converts the observed result into a one-year rate. The displayed percentage is annualised, but you did not actually earn that annual percentage over a full year.

Suppose ₹10,000 invested six months ago is worth ₹10,500. The actual gain is ₹500 and the absolute return is 5%. Annualising a short result can produce a percentage around twice that size, depending on the exact dates and calculation.

This does not mean the investment is on track to deliver the same rate for the next six months. Market values can change every day. For a recent SIP, keep the rupee gain, absolute return and short history visible beside XIRR.

## Which return should you check for an SIP?

For an SIP with multiple instalments over a meaningful period, XIRR is generally the more useful annualised measure of your personal cash flows. For a new SIP, absolute gain and absolute return are often easier to interpret alongside it.

Roz Invest's **three-number dashboard check** reads the screen in this order:

1. Amount invested
2. Current value and rupee gain or loss
3. Time-adjusted return such as XIRR

This sequence prevents a dramatic annualised number from hiding a small rupee change or a very short track record.

The guide to [reviewing an SIP that is down after one year](/learn/sip-down-should-i-stop/) explains why a return number should be considered with the goal, time horizon, benchmark and scheme evidence.

## Is XIRR the same as the mutual fund's published return?

No, your XIRR can differ from a scheme's published return because your purchases happened on different dates and at different NAVs. The scheme return follows a stated standard period and method, while personal XIRR follows your own cash flows.

Two investors in the same scheme can have different XIRRs if they started on different dates, changed instalments or made withdrawals. Neither personal result should be presented as the return every investor received.

SEBI Investor's [advanced mutual-fund material](https://investor.sebi.gov.in/pdf/reference-material/ppt/Mutual-Fund-for-Advance.pdf), accessed 11 September 2026, identifies absolute return and CAGR as distinct return measures and tells investors to consider costs, comparative performance and risk. The calculation is one part of evaluation, not a quality certificate.

## What happens to XIRR after a withdrawal or extra investment?

XIRR changes when a withdrawal, top-up or lump-sum investment adds another dated cash flow. A correct calculation must include the amount and date of every relevant transaction.

Partial redemptions are inflows to the investor. Reinvested distributions and transfers may also need consistent treatment depending on the record being analysed. An incomplete transaction history can produce a misleading result.

If the app's number appears impossible, compare the transaction list, current value and calculation date. Do not infer missing money from one percentage alone.

## Can you use XIRR to predict future SIP returns?

No, XIRR measures the return implied by past cash flows and a current or ending value. It does not forecast the scheme's next year or guarantee that the past rate will continue.

AMFI's [SIP overview](https://www.amfiindia.com/mutual-fund), accessed 11 September 2026, describes SIP as a method of investing periodically. The chosen mutual fund remains market-linked, so its future NAV and your future XIRR are uncertain.

Avoid selecting a fund only because another investor posts a high XIRR. Their dates, cash flows, scheme mix and risk may differ from yours.

## What should you check when an app shows several return numbers?

Check the label, period and cash flows before comparing the percentages. Then ask whether the number measures your portfolio or a scheme's standard performance.

Use this checklist:

- confirm the invested amount and current value;
- check whether the return is absolute or annualised;
- check the investment start date;
- include top-ups and withdrawals;
- compare like-for-like periods;
- separate personal XIRR from scheme return; and
- never treat the displayed rate as guaranteed.

For personalised portfolio evaluation, consult a SEBI-registered investment adviser. The practical rule is that absolute return explains the total change, while XIRR explains that change after accounting for when each rupee entered or left.
