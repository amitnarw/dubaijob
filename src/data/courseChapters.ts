/**
 * Localized course data model.
 * Titles/hindi in Record<Lang,string>: en = English, hi = owner's Hindi,
 * other languages = modern colloquial translations.
 */
import type { Lang } from '@/i18n/LocaleContext';

export type L10n = Record<Lang, string>;

export interface CourseChapter {
  id: string;
  title: L10n;
  hindiTitle: string;
  section: 1 | 2;
  description: string;
  stepRange: string;
}

export interface CourseVideo {
  id: string; // YouTube video id
  stepNumber: number;
  title: L10n;
  hindiTitle: string;
  section: 1 | 2;
  sectionTitle: string;
  chapterId: string;
  chapterTitle: string;
  duration: string;
  description: string;
  freePreview: boolean;
}

export const COURSE_SECTIONS = [
  {
    id: 1,
    title: '1st Section: India Preparation & CV Strategy',
    hindiTitle: 'भाग 1: भारत से तैयारी और CV स्ट्रैटेजी',
    stepCount: 10,
    steps: 'Steps 1 - 10',
  },
  {
    id: 2,
    title: '2nd Section: Dubai Visit, Budget & Landing the Job',
    hindiTitle: 'भाग 2: दुबई विजिट, खर्च और जॉब जॉइनिंग',
    stepCount: 15,
    steps: 'Steps 11 - 25',
  },
];

export const COURSE_CHAPTERS: CourseChapter[] = [
  {
    id: 'ch-1',
    title: {
      en: 'Dubai Basics & Eligibility',
      hi: 'दुबई बेसिक्स और पात्रता',
      si: 'දුබායි මූලික කරුණු සහ සුදුසුකම්',
      ta: 'துபாய் அடிப்படை & தகுதி',
      ur: 'دبئی بنیادی باتیں اور اہلیت',
      bn: 'দুবাই বেসিক ও যোগ্যতা',
    },
    hindiTitle: 'दुबई बेसिक्स और पात्रता',
    section: 1,
    description: 'Language, salary expectations, education requirements, and roles for freshers & experienced.',
    stepRange: '1-4',
  },
  {
    id: 'ch-2',
    title: {
      en: 'Professional CV & Interview Strategy',
      hi: 'प्रोफेशनल CV और इंटरव्यू स्ट्रैटेजी',
      si: 'වෘත්තීය CV සහ සම්මුඛ පරීක්ෂණ උපාය',
      ta: 'தொழில்முறை CV & நேர்காணல் உத்தி',
      ur: 'پروفیشنل CV اور انٹرویو حکمتِ عملی',
      bn: 'প্রফেশনাল CV ও ইন্টারভিউ স্ট্র্যাটেজি',
    },
    hindiTitle: 'प्रोफेशनल CV और इंटरव्यू स्ट्रैटेजी',
    section: 1,
    description: 'Dubai-format CV writing, modification, optimal timings, video apps, email etiquette, and Google search.',
    stepRange: '5-10',
  },
  {
    id: 'ch-3',
    title: {
      en: 'Visit Visa, Travel & Budget Setup',
      hi: 'विजिट वीज़ा, ट्रेवल और बजट',
      si: 'දුබායි විසිට් වීසා, ගමන් සහ අයවැය',
      ta: 'விசிட் விசா, பயணம் & பட்ஜெட்',
      ur: 'وزٹ ویزا، سفرو بجٹ',
      bn: 'ভিজিট ভিসা, ভ্রমণ ও বাজেট',
    },
    hindiTitle: 'विजिट वीज़ा, ट्रेवल और बजट',
    section: 2,
    description: '2-month living budget, visit visa categories, flight booking, passport application, rooms, and currency exchange.',
    stepRange: '11-17',
  },
  {
    id: 'ch-4',
    title: {
      en: 'On-Ground Job Hunt & Joining Process',
      hi: 'दुबई में जॉब सर्च और जॉइनिंग',
      si: 'දුබායි රැකියා සොයන්නීම සහ එකතු වීම',
      ta: 'துபாயில் வேலை தேடல் & சேரும் முறை',
      ur: 'دبئی میں جاب سرچ اور جوائننگ',
      bn: 'দুবাইয়ে জব খোঁজা ও জয়েনিং',
    },
    hindiTitle: 'दुबई में जॉब सर्च और जॉइनिंग',
    section: 2,
    description: 'Online and offline application techniques, complete interview to offer process, fast-track tips, and 1st week plan.',
    stepRange: '18-21',
  },
  {
    id: 'ch-5',
    title: {
      en: 'Attestation, Offer Red Flags & Scams',
      hi: 'डिग्री अटेस्टेशन, ऑफर लेटर और सावधानियां',
      si: 'උපාධි සහතික කිරීම, ඔෆර් අවවාද සහ වංචා',
      ta: 'பட்டம் சான்று, ஆஃபர் எச்சரிக்கைகள் & மோசடிகள்',
      ur: 'ڈگری اٹیسٹیشن، آفر لیٹر اور احتیاطیں',
      bn: 'ডিগ্রি অ্যাটেস্টেশন, অফার সতর্কতা ও প্রতারণা',
    },
    hindiTitle: 'डिग्री अटेस्टेशन, ऑफर लेटर और सावधानियां',
    section: 2,
    description: 'Degree attestation, offer letter breakdown, crucial mistakes to avoid in Dubai, and master course revision.',
    stepRange: '22-25',
  },
];

/** Localized chapter title for current lang; Hindi subtitle kept separately. */
export function chapterTitle(ch: CourseChapter, lang: Lang): string {
  return ch.title[lang] ?? ch.title.en;
}