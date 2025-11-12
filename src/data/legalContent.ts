import {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  FileText,
  Globe,
  Lock,
  Shield,
  Truck,
  Users,
  Eye,
} from 'lucide-react';

const iconLibrary = {
  AlertTriangle,
  CheckCircle,
  CreditCard,
  FileText,
  Globe,
  Lock,
  Shield,
  Truck,
  Users,
  Eye,
};

type IconName = keyof typeof iconLibrary;

type LegalSection = {
  key: string;
  title: string;
  body: string[];
  icon: IconName;
};

type LegalContent = {
  title: string;
  subtitle: string;
  updated: string;
  companyInfo: string[];
  sections: LegalSection[];
};

type LegalContentByLocale = Record<'cs' | 'en', LegalContent>;

export const legalContent: {
  terms: LegalContentByLocale;
  privacy: LegalContentByLocale;
} = {
  terms: {
    cs: {
      title: 'Obchodní podmínky',
      subtitle: 'Expand Matrix, s.r.o.',
      updated: 'Aktualizováno: 16. září 2025',
      companyInfo: [
        'Expand Matrix, s.r.o.',
        'Příčná 1892/4, Nové Město, 110 00 Praha',
        'IČO: 23530596',
      ],
      sections: [
        {
          key: 'intro',
          title: 'Úvodní ustanovení',
          icon: 'FileText',
          body: [
            'Tyto obchodní podmínky upravují vztahy mezi společností Expand Matrix, s.r.o., se sídlem Příčná 1892/4, Nové Město, 110 00 Praha, IČO: 23530596 (dále jen „Poskytovatel") a jejími klienty.',
            'Platí pro všechny služby včetně konzultací, vývoje řešení na míru, školení, webového vývoje a komunitních platforem.',
          ],
        },
        {
          key: 'services',
          title: 'Služby',
          icon: 'Shield',
          body: [
            'AI konzultace a strategie: Analýza potřeb, návrh řešení, implementační plány.',
            'Vývoj AI řešení na míru: Chatboty, automatizace procesů, integrace s existujícími systémy.',
            'Školení a vzdělávání: Kurzy AI pro firmy, workshopy, individuální mentoring.',
            'Webový vývoj: Tvorba webových stránek a aplikací s AI funkcionalitami.',
            'Komunitní platformy: Přístup k exkluzivním komunitám a zdrojům.',
          ],
        },
        {
          key: 'order',
          title: 'Objednávka a uzavření smlouvy',
          icon: 'CheckCircle',
          body: [
            'Smlouva se uzavírá potvrzením objednávky Poskytovatelem.',
            'Ceny jsou uvedeny včetně DPH, pokud není uvedeno jinak.',
            'Poskytovatel si vyhrazuje právo odmítnout objednávku bez udání důvodu.',
          ],
        },
        {
          key: 'pricing',
          title: 'Ceny a platební podmínky',
          icon: 'CreditCard',
          body: [
            'Ceny služeb jsou uvedeny v aktuálním ceníku nebo individuální nabídce.',
            'Platba je splatná do 14 dnů od vystavení faktury.',
            'Akceptujeme platby bankovním převodem, PayPalem a Stripe.',
            'V případě prodlení s platbou si vyhrazujeme právo účtovat zákonné úroky z prodlení.',
          ],
        },
        {
          key: 'delivery',
          title: 'Dodání služeb',
          icon: 'Truck',
          body: [
            'Termíny dodání jsou orientační a závisí na složitosti projektu.',
            'O průběhu prací informujeme klienta pravidelně.',
            'Klient je povinen poskytnout potřebnou součinnost a podklady.',
          ],
        },
        {
          key: 'warranty',
          title: 'Záruka a odpovědnost',
          icon: 'AlertTriangle',
          body: [
            'Na vývoj poskytujeme záruku 12 měsíců od předání.',
            'Záruka se nevztahuje na škody způsobené nesprávným používáním.',
            'Odpovědnost za škody je omezena na výši uhrazené částky za službu.',
          ],
        },
        {
          key: 'ownership',
          title: 'Duševní vlastnictví',
          icon: 'Users',
          body: [
            'Práva k vytvořeným řešením přecházejí na klienta po úplném uhrazení.',
            'Poskytovatel si vyhrazuje právo použít obecné know-how pro další projekty.',
            'Klient nesmí bez souhlasu předávat řešení třetím stranám.',
          ],
        },
        {
          key: 'privacy',
          title: 'Ochrana osobních údajů',
          icon: 'Lock',
          body: [
            'Zpracování osobních údajů se řídí našimi Zásadami ochrany osobních údajů.',
            'Klientská data jsou chráněna podle GDPR a dalších platných předpisů.',
          ],
        },
        {
          key: 'final',
          title: 'Závěrečná ustanovení',
          icon: 'FileText',
          body: [
            'Tyto podmínky se řídí českým právem.',
            'Případné spory budou řešeny u věcně příslušného soudu v Praze.',
            'Poskytovatel si vyhrazuje právo změnit tyto podmínky s 30denní výpovědní lhůtou.',
          ],
        },
      ],
    },
    en: {
      title: 'Terms of Service',
      subtitle: 'Expand Matrix, s.r.o.',
      updated: 'Last updated: January 15, 2024',
      companyInfo: [
        'Expand Matrix, s.r.o.',
        'Příčná 1892/4, Nové Město, 110 00 Prague',
        'Company ID: 23530596',
      ],
      sections: [
        {
          key: 'intro',
          title: 'Introduction',
          icon: 'FileText',
          body: [
            'These Terms of Service govern the relationship between Expand Matrix, s.r.o., Příčná 1892/4, 110 00 Prague, Company ID: 23530596 ("Provider") and its clients.',
            'They apply to all services including consulting, custom AI development, training, web development, and community platforms.',
          ],
        },
        {
          key: 'services',
          title: 'Services',
          icon: 'Shield',
          body: [
            'AI consulting and strategy: Needs analysis, solution design, implementation plans.',
            'Custom AI development: Chatbots, process automation, integration with existing systems.',
            'Training and education: Corporate AI courses, workshops, individual mentoring.',
            'Web development: Creation of websites and applications with AI functionalities.',
            'Community platforms: Access to exclusive communities and resources.',
          ],
        },
        {
          key: 'order',
          title: 'Orders and Contract Formation',
          icon: 'CheckCircle',
          body: [
            'A contract is formed upon confirmation of the order by the Provider.',
            'Prices are listed including VAT unless stated otherwise.',
            'The Provider reserves the right to refuse orders without giving reasons.',
          ],
        },
        {
          key: 'pricing',
          title: 'Pricing and Payment Terms',
          icon: 'CreditCard',
          body: [
            'Service prices are listed in the current price list or individual offer.',
            'Payment is due within 14 days of invoice issuance.',
            'We accept payments via bank transfer, PayPal, and Stripe.',
            'In case of payment delay, we reserve the right to charge late payment interest.',
          ],
        },
        {
          key: 'delivery',
          title: 'Service Delivery',
          icon: 'Truck',
          body: [
            'Delivery times are indicative and depend on project complexity.',
            'We inform clients regularly about work progress.',
            'The client is obligated to provide necessary cooperation and materials.',
          ],
        },
        {
          key: 'warranty',
          title: 'Warranty and Liability',
          icon: 'AlertTriangle',
          body: [
            'We provide a 12-month warranty on development deliverables.',
            'The warranty does not cover damages caused by improper use.',
            'Liability for damages is limited to the amount paid for the service.',
          ],
        },
        {
          key: 'ownership',
          title: 'Intellectual Property',
          icon: 'Users',
          body: [
            'Rights to created solutions transfer to the client upon full payment.',
            'The Provider reserves the right to reuse general know-how for other projects.',
            'The client may not transfer solutions to third parties without consent.',
          ],
        },
        {
          key: 'privacy',
          title: 'Data Protection',
          icon: 'Lock',
          body: [
            'Personal data processing is governed by our Privacy Policy.',
            'Client data is protected according to GDPR and other applicable regulations.',
          ],
        },
        {
          key: 'final',
          title: 'Final Provisions',
          icon: 'FileText',
          body: [
            'These terms are governed by Czech law.',
            'Any disputes will be resolved by the competent court in Prague.',
            'The Provider reserves the right to change these terms with 30 days notice.',
          ],
        },
      ],
    },
  },
  privacy: {
    cs: {
      title: 'Zásady ochrany osobních údajů',
      subtitle: 'Expand Matrix, s.r.o.',
      updated: 'Aktualizováno: 16. září 2025',
      companyInfo: [
        'Expand Matrix, s.r.o.',
        'Příčná 1892/4, Nové Město, 110 00 Praha',
        'IČO: 23530596',
      ],
      sections: [
        {
          key: 'intro',
          title: 'Úvod',
          icon: 'FileText',
          body: [
            'Tyto Zásady ochrany osobních údajů vysvětlují, jak společnost Expand Matrix, s.r.o., se sídlem Příčná 1892/4, Nové Město, 110 00 Praha, IČO: 23530596 (dále jen „Poskytovatel"), shromažďuje, používá a chrání osobní údaje.',
            'Platí pro všechny služby Poskytovatele, včetně konzultací, vývoje AI řešení na míru, školení, webového vývoje a komunitních platforem.',
          ],
        },
        {
          key: 'dataCollection',
          title: 'Jaké údaje shromažďujeme',
          icon: 'Eye',
          body: [
            'Identifikační údaje: jméno, příjmení, fakturační údaje.',
            'Kontaktní údaje: e-mail, telefon.',
            'Platební údaje: číslo účtu, údaje k platbám (přes banku, PayPal, Stripe).',
            'Technické údaje: IP adresy, cookies, přihlašovací údaje, analytická data.',
            'Provozní údaje: podklady a dokumenty poskytnuté klientem, interakce s platformou a chatboty.',
          ],
        },
        {
          key: 'purposes',
          title: 'Účely zpracování a právní základy',
          icon: 'CheckCircle',
          body: [
            'Uzavření a plnění smlouvy (poskytování služeb, platby).',
            'Plnění zákonných povinností (účetnictví, daně).',
            'Oprávněný zájem (zlepšování služeb, ochrana proti zneužití, technická bezpečnost).',
            'Souhlas (zasílání marketingové komunikace).',
          ],
        },
        {
          key: 'retention',
          title: 'Uchovávání údajů',
          icon: 'AlertTriangle',
          body: [
            'Účetní a daňové údaje: 10 let.',
            'Smluvní a projektová dokumentace: po dobu trvání spolupráce + 3 roky.',
            'Marketingová data: do odvolání souhlasu.',
          ],
        },
        {
          key: 'sharing',
          title: 'Sdílení a třetí strany',
          icon: 'Users',
          body: [
            'Vaše údaje mohou být zpracovávány důvěryhodnými třetími stranami:',
            'Platební brány: Stripe, PayPal, bankovní převody.',
            'Technologické služby: OpenAI, n8n, Make.com, Google.',
            'Komunitní platformy: Whop.',
          ],
        },
        {
          key: 'transfers',
          title: 'Přenos údajů mimo EU',
          icon: 'Globe',
          body: [
            'Pokud dochází k přenosu do zemí mimo EU (např. USA – OpenAI, Stripe, Google), používáme standardní smluvní doložky a další záruky podle GDPR.',
          ],
        },
        {
          key: 'rights',
          title: 'Vaše práva',
          icon: 'Shield',
          body: [
            'Máte právo na přístup, opravu, výmaz, omezení zpracování, námitku a přenositelnost údajů. Svá práva můžete uplatnit na info@expandmatrix.com.',
          ],
        },
        {
          key: 'security',
          title: 'Bezpečnost údajů',
          icon: 'Lock',
          body: [
            'Používáme šifrování, řízení přístupů, trezor tajemství (1Password/Vault), anonymizaci testovacích dat a audit přístupů.',
          ],
        },
        {
          key: 'contact',
          title: 'Kontakt a stížnosti',
          icon: 'FileText',
          body: [
            'Pro dotazy: info@expandmatrix.com.',
            'Máte právo podat stížnost u Úřadu pro ochranu osobních údajů: www.uoou.cz.',
          ],
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'Expand Matrix, s.r.o.',
      updated: 'Last updated: January 15, 2024',
      companyInfo: [
        'Expand Matrix, s.r.o.',
        'Příčná 1892/4, Nové Město, 110 00 Prague',
        'Company ID: 23530596',
      ],
      sections: [
        {
          key: 'intro',
          title: 'Introduction',
          icon: 'FileText',
          body: [
            'This Privacy Policy explains how Expand Matrix, s.r.o., Příčná 1892/4, 110 00 Prague, Company ID No.: 23530596 ("Provider"), collects, uses, and protects personal data.',
            'It applies to all services, including consulting, custom AI solutions, training, web development, and community platforms.',
          ],
        },
        {
          key: 'dataCollection',
          title: 'Data We Collect',
          icon: 'Eye',
          body: [
            'Identification data: name, surname, invoicing details.',
            'Contact data: email, phone.',
            'Payment data: bank account details, payment information (via bank transfer, PayPal, Stripe).',
            'Technical data: IP addresses, cookies, login data, analytics.',
            'Operational data: client-provided documents, project inputs, chatbot interactions.',
          ],
        },
        {
          key: 'purposes',
          title: 'Purpose of Processing and Legal Basis',
          icon: 'CheckCircle',
          body: [
            'Contract performance (service provision, payments).',
            'Legal obligations (accounting, taxation).',
            'Legitimate interest (service improvement, fraud prevention, security).',
            'Consent (marketing communication).',
          ],
        },
        {
          key: 'retention',
          title: 'Data Retention',
          icon: 'AlertTriangle',
          body: [
            'Accounting and tax records: 10 years.',
            'Contractual and project documentation: for the duration of cooperation + 3 years.',
            'Marketing data: until consent is withdrawn.',
          ],
        },
        {
          key: 'sharing',
          title: 'Sharing with Third Parties',
          icon: 'Users',
          body: [
            'The Provider may engage trusted processors and service providers for purposes such as technical support, payments, hosting, or analytics. We ensure these partners provide an adequate level of protection and sign data processing agreements. A current list of processors is available upon request.',
          ],
        },
        {
          key: 'transfers',
          title: 'Data Transfers Outside the EU',
          icon: 'Globe',
          body: [
            'If data is transferred outside the EU (e.g. to the USA – OpenAI, Stripe, Google), we use Standard Contractual Clauses and other GDPR safeguards.',
          ],
        },
        {
          key: 'rights',
          title: 'Your Rights',
          icon: 'Shield',
          body: [
            'You have the right to access, rectify, delete, restrict processing, object, and data portability. To exercise your rights, contact info@expandmatrix.com.',
          ],
        },
        {
          key: 'security',
          title: 'Data Security',
          icon: 'Lock',
          body: [
            'We implement encryption, access control, secret vaults (1Password/Vault), anonymization of test data, and access audits.',
          ],
        },
        {
          key: 'contact',
          title: 'Contact and Complaints',
          icon: 'FileText',
          body: [
            'For inquiries: info@expandmatrix.com.',
            'You have the right to lodge a complaint with the Czech Data Protection Authority: www.uoou.cz.',
          ],
        },
      ],
    },
  },
};

export const getSectionIcon = (icon: IconName) => iconLibrary[icon] ?? FileText;
