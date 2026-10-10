import { TrainingItem } from '../types';

export interface InterviewPreset {
  id: string;
  label: string;
  interviewerTitle: string;
  targetRole: string;
  companyType: string;
  interviewStage: string;
  candidateBackground: string;
}

export interface TrainingPreset {
  id: string;
  label: string;
  currentRoleOrLevel: string;
  targetGoal: string;
  trainings: TrainingItem[];
}

export const INTERVIEW_PRESETS: InterviewPreset[] = [
  {
    id: 'growth-cmo',
    label: 'CMO ile Mülakat (Kıdemli Dijital Pazarlama)',
    interviewerTitle: 'Chief Marketing Officer (CMO)',
    targetRole: 'Kıdemli Dijital Pazarlama & Büyüme Uzmanı',
    companyType: 'Hızlı Büyüyen E-Ticaret / B2C Scale-Up',
    interviewStage: 'Yönetici & Strateji Final Görüşmesi',
    candidateBackground: 'Performans pazarlaması, Google/Meta reklam yönetimi, GA4 analitiği ve ROAS optimizasyonunda 4 yıllık tecrübe.',
  },
  {
    id: 'tech-lead-dev',
    label: 'Engineering Lead ile Mülakat (Full Stack Dev)',
    interviewerTitle: 'Engineering Manager & Tech Lead',
    targetRole: 'Senior Full-Stack Developer (React & Node.js)',
    companyType: 'B2B SaaS Bulut Platformu',
    interviewStage: 'Teknik Derinlik & Mimari Mülakatı',
    candidateBackground: 'React, TypeScript, Express/Nest.js, PostgreSQL ve mikroservisler üzerinde uygulamalar geliştirmiş geliştirici.',
  },
  {
    id: 'cpo-pm',
    label: 'CPO ile Mülakat (Ürün Yöneticisi / PM)',
    interviewerTitle: 'Chief Product Officer (CPO)',
    targetRole: 'Product Manager (Büyüme & Kullanıcı Deneyimi)',
    companyType: 'FinTech Mobil Uygulama',
    interviewStage: 'Ürün Vizyonu ve Stratejik Uyum',
    candidateBackground: 'Veri odaklı ürün geliştirme, kullanıcı araştırması, A/B testleri ve sprint yönetimi tecrübesi.',
  },
  {
    id: 'hr-director-lead',
    label: 'İK Direktörü ile Mülakat (Kültür & Liderlik)',
    interviewerTitle: 'İnsan Kaynakları & Yetenek Direktörü (HR VP)',
    targetRole: 'Takım Lideri / Departman Yöneticisi',
    companyType: 'Global Çok Uluslu Teknoloji Şirketi',
    interviewStage: 'Kültürel Uyum, Liderlik & Kriz Yönetimi',
    candidateBackground: 'Farklı disiplinlerden ekipleri koordine etme ve mentorluk deneyimi.',
  },
];

export const TRAINING_PRESETS: TrainingPreset[] = [
  {
    id: 'digital-marketing-growth',
    label: 'Dijital Pazarlama, GA4 & Büyüme Eğitim Paketi',
    currentRoleOrLevel: 'Orta Seviye Dijital Pazarlama Uzmanı (2-3 Yıl)',
    targetGoal: 'Head of Growth / Kıdemli Performans & Veri Odaklı Pazarlama Lideri',
    trainings: [
      {
        id: '1',
        title: 'İleri Seviye Google Ads & GA4 Ölçümleme Uzmanlığı',
        institution: 'Google Digital Academy & BTK',
        syllabusOrContent:
          'Dönüşüm hunisi (Conversion Funnel) analizi, GTM (Google Tag Manager) ile gelişmiş e-ticaret etiketleme, GA4 Exploration raporları, Smart Bidding stratejileri, Data-Driven Attribution modelleri, ROAS & CAC hesaplamaları.',
        keySkills: 'GA4, Google Ads, GTM, Looker Studio, ROAS Optimizasyonu, A/B Testi',
        projectsCompleted:
          '1.5M TL bütçeli e-ticaret markasının GA4 server-side etiket kurulumu ve ROAS %35 artıran dönüşüm hunisi optimizasyon projesi.',
      },
      {
        id: '2',
        title: 'Growth Marketing & Veri Tabanlı Müşteri Kazanımı Masterclass',
        institution: 'Reforge / Coursera',
        syllabusOrContent:
          'Büyüme döngüleri (Growth Loops), Retention (Elde Tutma) kohort analizi, E-posta & CRM otomasyon kurguları, Viral katsayı (K-factor), landing page CRO deneyleri.',
        keySkills: 'Kullanıcı Tutundurma (Retention), LTV/CAC Modellemesi, Kohort Analizi, CRO, Segmentasyon',
        projectsCompleted:
          'Kullanıcı onboarding terk oranını %40 azaltan 5 adımlı otomatik etkileşim serisi ve A/B test raporu.',
      },
    ],
  },
  {
    id: 'fullstack-cloud',
    label: 'Modern Full-Stack & Bulut Mimari Eğitimleri',
    currentRoleOrLevel: 'Frontend Geliştirici (React Odaklı)',
    targetGoal: 'Senior Full-Stack & Bulut Odaklı Yazılım Mühendisi',
    trainings: [
      {
        id: '1',
        title: 'Enterprise React, Next.js & TypeScript Bootcamp',
        institution: 'Patika & Udemy',
        syllabusOrContent:
          'Server Components, Zustand/Redux Toolkit, Tailwind CSS, API Entegrasyonları, WebSockets, Performans profiling, SSR/SSG stratejileri, Jest testleri.',
        keySkills: 'React 19, TypeScript, Next.js, State Management, API Tasarımı, Vitest',
        projectsCompleted:
          'Gerçek zamanlı iş birliği sağlayan Kanban panosu ve bildirim sistemi uygulaması.',
      },
      {
        id: '2',
        title: 'Node.js, PostgreSQL & Docker Backend Masterclass',
        institution: 'BTK Akademi & Coursera',
        syllabusOrContent:
          'REST & GraphQL mimarisi, Drizzle/Prisma ORM, PostgreSQL indeksleme ve optimizasyon, JWT yetkilendirme, Docker container yönetimi, CI/CD pipeline temelleri.',
        keySkills: 'Node.js, Express, PostgreSQL, Docker, CI/CD, Güvenlik (OAuth/JWT)',
        projectsCompleted:
          'Mikroservis yapısında authentication servisi ve ürün kataloğu REST API backend altyapısı.',
      },
    ],
  },
];
