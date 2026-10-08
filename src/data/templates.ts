export interface DecisionTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  options: string[];
  context: string;
  priorities: string[];
  riskTolerance: 'low' | 'moderate' | 'high';
  timeHorizon: 'short' | 'medium' | 'long';
}

export const DECISION_TEMPLATES: DecisionTemplate[] = [
  {
    id: 'career-startup-vs-corp',
    category: 'Career',
    title: 'Accept Series-B Startup Lead Role vs. Stay as Senior Dev in Big Tech',
    description: 'High-upside risk and equity vs. predictable high compensation and stability.',
    options: ['Join Seed-to-B Startup as Eng Lead', 'Stay as Senior SWE at Big Tech'],
    context: 'Current compensation is $215k base + RSUs. Startup offers $175k base + 0.8% equity grant with 4-year vest. Have 18 months emergency fund. No dependents currently.',
    priorities: ['Accelerated Leadership Growth', 'Long-term Financial Upside', 'Autonomy & Agency', 'Work-Life Balance'],
    riskTolerance: 'high',
    timeHorizon: 'medium',
  },
  {
    id: 'housing-buy-vs-rent',
    category: 'Life & Finance',
    title: 'Buy a $650k Suburban Home vs. Rent Apartment & Invest Difference',
    description: 'Commit to 30-year mortgage and equity building vs. financial liquidity and mobility.',
    options: ['Buy $650k Suburban Home (20% Down)', 'Rent Modern 2-BR Apartment & Invest Delta in Index Funds'],
    context: 'Have $150k cash for downpayment. Current mortgage rates are 6.8%. Planning to stay in the metro area for at least 4-6 years.',
    priorities: ['Total Net Worth in 10 Years', 'Peace of Mind & Fixed Housing Cost', 'Geographic Flexibility', 'Low Maintenance Overhead'],
    riskTolerance: 'moderate',
    timeHorizon: 'long',
  },
  {
    id: 'relocation-city-vs-country',
    category: 'Lifestyle',
    title: 'Relocate to a Lower Cost-of-Living Mountain Town vs. Remain in New York',
    description: 'Nature, lower cost, and relaxed lifestyle vs. career network, culture, and social density.',
    options: ['Relocate to Boulder / Mountain Town', 'Keep Rent-Controlled NYC Apartment'],
    context: 'Company allows permanent remote work. Social circle is largely in NYC, but burnout and noise are wearing on well-being.',
    priorities: ['Mental Health & Outdoor Access', 'Cost of Living', 'Social Connections & Dating Scene', 'Spontaneous Cultural Opportunities'],
    riskTolerance: 'moderate',
    timeHorizon: 'medium',
  },
  {
    id: 'tech-stack-build-vs-buy',
    category: 'Business & Tech',
    title: 'Build Custom Internal Billing Engine vs. Integrate Stripe Billing Enterprise',
    description: 'Full custom control and no ongoing platform fee percentage vs. rapid time-to-market and compliance.',
    options: ['Build Custom In-House Billing System', 'Integrate Third-Party SaaS (Stripe Billing)'],
    context: 'Product is growing 25% MoM with complex multi-tier usage metering. Engineering team has 4 backend developers.',
    priorities: ['Speed to Market', 'Regulatory/PCI Compliance Overhead', 'Platform Fee Margins', 'Developer Focus on Core Product'],
    riskTolerance: 'low',
    timeHorizon: 'short',
  },
  {
    id: 'education-degree-vs-bootcamp',
    category: 'Personal Development',
    title: 'Pursue 2-Year Master’s Degree vs. Aggressive Self-Directed Portfolio Sprint',
    description: 'Institutional prestige and research credentials vs. zero debt and immediate market execution.',
    options: ['Full-Time Master of Science Degree', '6-Month Intensive Self-Taught & Open-Source Portfolio'],
    context: 'Tuition is $45k total. Have 3 years of junior industry experience wanting to specialize in AI systems engineering.',
    priorities: ['Credibility with Top Labs', 'Immediate Earning Power', 'Deep Theoretical Foundations', 'Financial Debt Avoidance'],
    riskTolerance: 'moderate',
    timeHorizon: 'long',
  },
];
