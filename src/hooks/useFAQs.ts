'use client';

import { useState, useEffect } from 'react';

export interface FAQ {
  id: string;
  question: {
    cs: string;
    en: string;
  };
  answer: {
    cs: string;
    en: string;
  };
  order: number;
  isFeatured: boolean;
}

interface UseFAQsOptions {
  locale: string;
  featuredOnly?: boolean;
}

export function useFAQs({ locale, featuredOnly = false }: UseFAQsOptions) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // For now, return mock data to avoid Payload configuration issues
    // TODO: Implement proper Payload integration when environment is configured
    const mockFAQs: FAQ[] = [
      {
        id: '1',
        question: {
          cs: 'Kolik stojí Vaše služby?',
          en: 'How much do your services cost?'
        },
        answer: {
          cs: 'Ceny našich služeb se liší podle rozsahu a složitosti projektu. Nabízíme transparentní cenové struktury s jasně definovanými balíčky služeb. Pro přesnou cenovou nabídku nás kontaktujte a domluvíme si bezplatnou konzultaci.',
          en: 'Our service prices vary depending on the scope and complexity of the project. We offer transparent pricing structures with clearly defined service packages. For an accurate price quote, contact us and we will arrange a free consultation.'
        },
        order: 1,
        isFeatured: true
      },
      {
        id: '2',
        question: {
          cs: 'Jak probíhá spolupráce?',
          en: 'How does the collaboration work?'
        },
        answer: {
          cs: 'Naše spolupráce začíná úvodním meetingem, kde analyzujeme vaše potřeby. Následuje podpis smlouvy, sdílení přístupů a implementace řešení. Celý proces je transparentní s pravidelnými reporty a komunikací.',
          en: 'Our collaboration begins with an initial meeting where we analyze your needs. This is followed by signing a contract, sharing access, and implementing solutions. The entire process is transparent with regular reports and communication.'
        },
        order: 2,
        isFeatured: true
      },
      {
        id: '3',
        question: {
          cs: 'Kdy uvidím první výsledky?',
          en: 'When will I see the first results?'
        },
        answer: {
          cs: 'První výsledky obvykle vidíte během 2-4 týdnů od začátku implementace. Časový rámec závisí na složitosti projektu a typu služby. Pravidelně vás informujeme o pokroku a dosažených výsledcích.',
          en: 'You usually see the first results within 2-4 weeks of implementation start. The timeframe depends on project complexity and type of service. We regularly inform you about progress and achieved results.'
        },
        order: 3,
        isFeatured: true
      },
      {
        id: '4',
        question: {
          cs: 'Pracujete s klienty ze zahraničí?',
          en: 'Do you work with international clients?'
        },
        answer: {
          cs: 'Ano, pracujeme s klienty z celého světa. Nabízíme služby v češtině i angličtině a máme zkušenosti s mezinárodními projekty. Komunikujeme flexibilně podle vašich časových pásem.',
          en: 'Yes, we work with clients from around the world. We offer services in Czech and English and have experience with international projects. We communicate flexibly according to your time zones.'
        },
        order: 4,
        isFeatured: true
      },
      {
        id: '5',
        question: {
          cs: 'Co vše nabízí vaše agentura?',
          en: 'What does your agency offer?'
        },
        answer: {
          cs: 'Specializujeme se na AI agenty, vývoj webových stránek a e-shopů, a implementaci AI do business procesů. Nabízíme také konzultace, optimalizaci a dlouhodobou podporu našich řešení.',
          en: 'We specialize in AI agents, web development and e-commerce, and AI implementation into business processes. We also offer consultations, optimization, and long-term support for our solutions.'
        },
        order: 5,
        isFeatured: true
      },
      {
        id: '6',
        question: {
          cs: 'Jak s vámi mohu začít spolupracovat?',
          en: 'How can I start working with you?'
        },
        answer: {
          cs: 'Začít je jednoduché! Kontaktujte nás přes náš web nebo si zarezervujte bezplatnou konzultaci. Provedeme analýzu vašich potřeb a navrhneme nejlepší řešení pro váš business.',
          en: 'Getting started is simple! Contact us through our website or book a free consultation. We will analyze your needs and propose the best solution for your business.'
        },
        order: 6,
        isFeatured: true
      },
      {
        id: '7',
        question: {
          cs: 'Jak řešíte bezpečnost při spolupráci?',
          en: 'How do you handle security in collaboration?'
        },
        answer: {
          cs: 'Bezpečnost je naší prioritou. Používáme šifrované komunikace, dodržujeme GDPR a máme přísné bezpečnostní protokoly. Všechna data jsou chráněna a přístupy jsou řízeny podle principu nejmenších oprávnění.',
          en: 'Security is our priority. We use encrypted communications, comply with GDPR, and have strict security protocols. All data is protected and access is controlled according to the principle of least privilege.'
        },
        order: 7,
        isFeatured: true
      }
    ];

    // Filter by featured if requested
    const filteredFAQs = featuredOnly 
      ? mockFAQs.filter(faq => faq.isFeatured)
      : mockFAQs;

    // Sort by order
    const sortedFAQs = filteredFAQs.sort((a, b) => a.order - b.order);

    setFaqs(sortedFAQs);
    setLoading(false);
  }, [locale, featuredOnly]);

  return { faqs, loading, error };
}
