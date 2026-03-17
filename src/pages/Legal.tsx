import { Link } from "react-router-dom";
import kaioLogo from "@/assets/kaio-logo.svg";
import { ArrowLeft } from "lucide-react";

const Legal = () => (
  <div className="min-h-screen">
    <header className="px-4 sm:px-6 py-4 sm:py-5">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <img src={kaioLogo} alt="KAIO" className="h-8 sm:h-10" />
      </div>
    </header>

    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <article className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
          Important Notice — Please Read Carefully Before Proceeding
        </h1>

        <p>
          KAIO Explorer is a technology interface operated by the KAIO Foundation in its capacity as a tokenization service provider. This Platform displays information about investment fund products that have been tokenized using KAIO's proprietary distributed ledger technology infrastructure. The display of such information is provided solely for the purposes of: (i) demonstrating KAIO's tokenization capabilities; (ii) providing transparency to existing holders of tokenized interests regarding their on-chain positions; and (iii) providing general public information about the tokenization of real-world assets.
        </p>
        <p>
          This Platform is not a fund distribution platform, a placement platform, a securities exchange, a trading venue, or a marketing channel for any fund, asset manager, or financial product. Nothing on this Platform constitutes, or should be construed as, an offer, solicitation, invitation, recommendation, or advice to invest in any fund, product, or financial instrument referenced herein.
        </p>
        <p>
          By accessing this Platform, you confirm that you have read, understood, and accepted the terms of this Disclaimer in their entirety. If you do not agree, you must immediately cease accessing the Platform.
        </p>

        <Section title="I. KAIO's Role — Technology Service Provider Only">
          <p>
            KAIO operates exclusively as a technology and tokenization service provider. In this capacity, KAIO provides distributed ledger technology infrastructure and tokenization rails that enable investment fund managers and issuers to represent interests in their funds in tokenized form on-chain.
          </p>
          <p>KAIO does not, by virtue of operating this Platform or providing tokenization services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>act as distributor, placement agent, arranger, broker, dealer, or marketing agent for any fund or financial product;</li>
            <li>solicit, procure, or facilitate investment in any fund or financial product by any person;</li>
            <li>provide investment management, portfolio management, or investment advisory services of any nature;</li>
            <li>act as an alternative investment fund manager ("AIFM") within the meaning of the Alternative Investment Fund Managers Directive (Directive 2011/61/EU, as amended by Directive 2024/927/EU) ("AIFMD") or any equivalent legislation; or</li>
            <li>perform any function that constitutes marketing of alternative investment fund units within the meaning of Article 4(1)(x) of AIFMD.</li>
          </ul>
          <p>
            The display of fund information on this Platform is a technology transparency function, not a marketing or distribution function. It reflects the technical reality that certain fund products have been tokenized using KAIO's infrastructure; it does not constitute, and must not be construed as, any recommendation, endorsement, or promotion of those fund products.
          </p>
        </Section>

        <Section title="II. Third-Party Fund Issuers — Independence, No Association, No Endorsement">
          <p>
            This Platform may display information relating to investment funds and products investing in or managed or issued by third-party asset managers, including, without limitation, BlackRock, Hamilton Lane, Brevan Howard, Laser Digital, and other fund managers (each, a "Fund Issuer" and the relevant funds, "Third-Party Funds").
          </p>
          <p>The following must be clearly understood by all persons accessing this Platform:</p>
          <p className="font-medium text-foreground/80">(a) No affiliation or association.</p>
          <p>Unless otherwise stated in the relevant offering documentation, KAIO is not affiliated with, connected to, associated with, or in any way related to any Fund Issuer. The display of a Fund Issuer's name, branding, fund data, or product information on this Platform reflects solely the fact that KAIO has provided tokenization technology services in respect of that Fund Issuer's product. It does not imply any commercial relationship beyond the provision of technology services, nor any partnership, joint venture, endorsement, or sponsorship.</p>
          <p className="font-medium text-foreground/80">(b) No review, approval, or verification by Fund Issuers.</p>
          <p>No Fund Issuer has reviewed, approved, verified, or endorsed the content of this Platform or any information displayed herein. No Fund Issuer has authorised KAIO to market, promote, or distribute interests in their funds through this Platform. No Fund Issuer accepts any responsibility for the accuracy, completeness, or currency of any information displayed on this Platform in connection with their funds.</p>
          <p className="font-medium text-foreground/80">(c) No agency or distribution mandate.</p>
          <p>KAIO does not act as agent, authorised distributor, placement agent, or representative of any Fund Issuer in connection with any product displayed on this Platform. No person should treat any information on this Platform as having been communicated on behalf of, or with the authority of, any Fund Issuer.</p>
          <p className="font-medium text-foreground/80">(d) Fund Issuer data — source and limitation.</p>
          <p>Where fund performance data, net asset values, asset allocations, or other fund information attributable to a Fund Issuer is displayed on this Platform, such data is sourced from publicly available disclosures, fund administrator reports, or on-chain records as at a prior date. KAIO makes no representation as to its accuracy, completeness, or currency, and accepts no liability for errors or omissions.</p>
          <p className="font-medium text-foreground/80">(e) Direct contact with Fund Issuers required.</p>
          <p>Any person wishing to obtain current, authoritative information about a Third-Party Fund — including its performance, terms, fees, regulatory status, or subscription procedures — must contact the relevant Fund Issuer directly or through their authorised distributors and/or investment managers and rely only on the Fund Issuer's official, current offering documentation.</p>
          <p>Fund Issuers' names, trademarks, and branding are the property of their respective owners and are referenced on this Platform solely for identification purposes in connection with KAIO's tokenization services.</p>
        </Section>

        <Section title="III. Data Accuracy — No Reliance; Information May Not Be Current">
          <p>
            The information displayed on this Platform, including any data relating to fund performance, net asset values, asset allocations, token prices, yields, on-chain positions, and market data, may not be current, complete, or accurate at the time of access and must not be relied upon for any investment or financial decision.
          </p>
          <p>Specifically:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Data displayed on this Platform may reflect figures sourced from third-party administrators, Fund Issuers, data providers, or on-chain sources as at a prior reporting date and may not reflect the most recent available position;</li>
            <li>KAIO does not guarantee the accuracy, completeness, timeliness, or fitness for purpose of any data or content on the Platform;</li>
            <li>All data is subject to change without prior notice and may differ from data available from the relevant Fund Issuer or fund administrator;</li>
            <li>Discrepancies may exist between data displayed on this Platform and the most recent official fund documentation; and</li>
            <li>On-chain data reflects the state of the blockchain at the time of display and is subject to network latency, reorgs, and reporting delays.</li>
          </ul>
          <p>In all cases, the most recent version of the relevant fund's official offering documentation, as made available by the Fund Issuer or its authorised administrator, shall prevail over any data displayed on this Platform.</p>
          <p>Where any analysis, research, or commentary appears on this Platform, it may reflect KAIO's internal views as of the date of preparation. It may not be comprehensive, is not guaranteed for accuracy, and does not necessarily represent the views of any Fund Issuer. Such material is subject to change without notice.</p>
        </Section>

        <Section title="IV. This Is Not a Marketing Communication for Any Fund">
          <p>
            To the extent that this Platform constitutes a communication of any kind for regulatory purposes, it is a communication relating to KAIO's tokenization technology and infrastructure services — not a marketing communication in respect of any Third-Party Fund or the units or shares thereof.
          </p>
          <p>
            KAIO expressly does not intend this Platform to constitute marketing of any alternative investment fund within the meaning of Article 4(1)(x) of AIFMD, a financial promotion within the meaning of section 21 of the Financial Services and Markets Act 2000 ("FSMA"), an advertisement for a collective investment scheme within the meaning of section 251 of the Securities and Futures Act 2001 of Singapore ("SFA"), or any equivalent regulated communication under any applicable law.
          </p>
          <p>
            KAIO does not hold, and does not represent that it holds, any licence, authorisation, or registration permitting it to market, distribute, or solicit investment in any fund or financial product in any jurisdiction.
          </p>
        </Section>

        <Section title="V. No Offer or Solicitation; Geographic and Investor Restrictions">
          <p>Nothing on this Platform constitutes an offer to sell, a solicitation of an offer to buy, or an inducement to subscribe for any security, fund unit, financial instrument, or crypto-asset in any jurisdiction.</p>
          <p className="font-medium text-foreground/80">(a) European Union / EEA.</p>
          <p>Any fund units referenced on this Platform are interests in alternative investment funds or UCITS governed by AIFMD or the UCITS Directive (Directive 2009/65/EC). They are not crypto-assets within the scope of Regulation (EU) 2023/1114 ("MiCA") by reason of Article 2(4)(a) thereof, as they constitute financial instruments under Annex I, Section C of MiFID II (Directive 2014/65/EU). No AIFMD marketing passport has been obtained by KAIO in any EEA jurisdiction. Any marketing or distribution of Third-Party Funds in the EEA must be undertaken by the relevant AIFM or its authorised distributors through appropriate regulated channels.</p>
          <p className="font-medium text-foreground/80">(b) United Kingdom.</p>
          <p>This Platform has not been approved as a financial promotion under section 21 FSMA. Access by United Kingdom persons is restricted to professional clients and eligible counterparties as defined under FCA rules. Any regulated financial promotion in connection with Third-Party Funds must be approved by an appropriately FCA-authorised person.</p>
          <p className="font-medium text-foreground/80">(c) Singapore.</p>
          <p>This Platform does not constitute an offer or invitation to subscribe for or purchase any collective investment scheme interests in Singapore. Access is restricted to accredited investors and institutional investors as defined under the SFA.</p>
          <p className="font-medium text-foreground/80">(d) United States.</p>
          <p>This Platform is not directed at, and may not be accessed or relied upon by, any U.S. Person (as defined under Rule 902(k) of Regulation S under the Securities Act of 1933). No interests in any Third-Party Fund or product referenced on this Platform may be offered to or purchased by U.S. persons, directly or indirectly. None of the products referenced have been registered under the Securities Act of 1933, the Investment Company Act of 1940, or any U.S. state securities laws. Access by U.S. Persons is strictly prohibited.</p>
          <p>You are solely responsible for ensuring that your access to and use of this Platform complies with all applicable laws and regulations in your jurisdiction. Before making any investment, you should seek independent legal, tax, and regulatory advice.</p>
        </Section>

        <Section title="VI. Investment Risks — General Risk Warnings">
          <p>Investment in any fund or product referenced on this Platform carries significant risk, including the risk of total loss. You should not invest unless you are prepared to sustain a total loss of the amount invested. In particular:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground/80">Capital risk.</strong> The value of investments and any income from them may fall as well as rise. Investors may not recover the full amount invested.</li>
            <li><strong className="text-foreground/80">Exchange rate risk.</strong> Currency fluctuations may adversely affect the value of investments and any income derived from them.</li>
            <li><strong className="text-foreground/80">Past performance.</strong> Past performance and historical yields are not reliable indicators of future results and must not be relied upon as such.</li>
            <li><strong className="text-foreground/80">Forecasts.</strong> Any forecasts or projections on this Platform are illustrative only, are not guaranteed, and may not be realised. There is no assurance that any forecast will materialise.</li>
            <li><strong className="text-foreground/80">Investment objectives.</strong> The attainment of any fund's stated investment objectives cannot be guaranteed.</li>
            <li><strong className="text-foreground/80">Liquidity risk.</strong> Tokenized fund interests may have no or limited secondary market liquidity. Transfer, redemption, or sale may be restricted by lock-ups, gates, or transfer restrictions.</li>
            <li><strong className="text-foreground/80">Regulatory risk.</strong> The legal and regulatory classification of tokenized instruments is evolving and may change, potentially affecting the value, transferability, or legal status of investments.</li>
          </ul>
        </Section>

        <Section title="VII. Technology and Tokenization Risks">
          <p>Where products referenced on this Platform involve blockchain technology, distributed ledger technology, or smart contracts, you acknowledge and accept the following additional risks:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground/80">Smart contract risk:</strong> Smart contracts may contain vulnerabilities or errors resulting in loss or unintended transfer of assets.</li>
            <li><strong className="text-foreground/80">Network risk:</strong> Blockchain networks are subject to failures, forks, congestion, reorganisation, and cyber attacks that may disrupt transactions.</li>
            <li><strong className="text-foreground/80">Key management risk:</strong> Loss or compromise of private keys may result in permanent and irrecoverable loss of tokenized interests. KAIO accepts no responsibility for losses arising from key management failures outside KAIO's control.</li>
            <li><strong className="text-foreground/80">Irreversibility:</strong> Confirmed on-chain transactions may be irreversible. Errors may result in permanent loss.</li>
            <li><strong className="text-foreground/80">Custody:</strong> Digital asset custody arrangements differ materially from traditional regulatory depositary arrangements under AIFMD. Protections applicable to traditional fund assets may not apply to the same extent.</li>
            <li><strong className="text-foreground/80">Tokenization infrastructure:</strong> KAIO's tokenization infrastructure is provided on a technology service basis. KAIO does not guarantee the uninterrupted availability of the infrastructure or the accuracy of on-chain representations of fund data.</li>
          </ul>
        </Section>

        <Section title="VIII. Offering Documentation Primacy">
          <p>
            Before entering into any transaction in respect of any Third-Party Fund referenced on this Platform, you must obtain, read, understand, and accept the terms set out in the most recent version of the relevant offering documentation as made available by the relevant Fund Issuer or its authorised administrator. Copies are available directly from the relevant Fund Issuer upon request.
          </p>
          <p>
            Nothing on this Platform replaces or supersedes the terms of any fund's offering documentation. In the event of any inconsistency between information on this Platform and the relevant offering documentation, the offering documentation shall prevail in all respects without exception.
          </p>
        </Section>

        <Section title="IX. Recording; Personal Data; AML">
          <p>
            To the extent permitted by applicable law, KAIO may record telephone calls and monitor electronic communications for legal, regulatory, and internal policy compliance purposes. Personal data will be collected, stored, and processed in accordance with our Privacy Policy and applicable data protection legislation, including the GDPR (Regulation (EU) 2016/679) and the UK GDPR. On-chain data, including wallet addresses, may be immutable and may not be capable of deletion in satisfaction of applicable data subject rights.
          </p>
        </Section>

        <Section title="X. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, KAIO, its directors, officers, employees, agents, and affiliates shall not be liable for any loss or damage — direct, indirect, consequential, or otherwise — arising from: access to or use of the Platform; reliance on any data or information herein; inaccuracy or incompleteness of fund data; technology failure, smart contract malfunction, or key management failure; any investment decision made in connection with the Platform; or any regulatory action taken against any user. Nothing herein limits liability for fraud or any liability that cannot be excluded under applicable law.
          </p>
        </Section>

        <Section title="XI. Governing Law and Amendment">
          <p>
            This Disclaimer is governed by English law. KAIO reserves the right to amend this Disclaimer at any time without prior notice. The version published at the time of access governs. Continued access constitutes acceptance.
          </p>
        </Section>

        <div className="mt-10 pt-6 border-t border-border/40">
          <p className="font-semibold text-foreground text-sm uppercase tracking-wide mb-4">
            By Continuing to Access This Platform, You Confirm That:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You have read and understood this Disclaimer in full;</li>
            <li>You understand that KAIO operates solely as a tokenization service provider and that this Platform does not constitute marketing, distribution, or promotion of any fund or financial product;</li>
            <li>You are not a U.S. Person and are not accessing this Platform from the United States or any other restricted jurisdiction;</li>
            <li>You qualify as a professional, accredited, sophisticated, or institutional investor under applicable law in your jurisdiction;</li>
            <li>You will not rely on any data or information on this Platform as the basis for any investment decision, and you will obtain and rely upon the relevant Fund Issuer's current official offering documentation before making any investment; and</li>
            <li>Your access and use is in full compliance with all laws and regulations applicable to you.</li>
          </ul>
        </div>
      </article>
    </main>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3">
    <h2 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">{title}</h2>
    {children}
  </section>
);

export default Legal;
