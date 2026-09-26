import { Ionicons } from '@expo/vector-icons';
import { ConcentricTheme } from '@/components/podcast/ConcentricArtwork';

export interface PodcastItem {
  id: string;
  title: string;
  subtitle?: string;
  broadcaster?: string;
  show?: string;
  meta?: string;
  theme: ConcentricTheme;
  badgeText: string;
  duration?: string;
  episode?: string;
  videoId?: string;
}

export interface PodcastCategory {
  id: string;
  title: string;
  count: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

export interface AuthorItem {
  id: string;
  name: string;
  role: string;
  image: string;
}

export const TOP_PODCASTS: PodcastItem[] = [
  {
    id: 'step-1',
    title: 'How This Roadmap Gets You Hired in Dubai',
    show: 'Step 1 • Master Introduction',
    meta: 'Full Guide • 25 Steps • ₹6,000',
    theme: 'peach',
    badgeText: 'Dubai Roadmap',
    duration: '08:30',
    episode: 'Step 1: Introduction',
    videoId: 'o9ul995BlGw',
  },
  {
    id: 'step-12',
    title: 'The 2-Month Dubai Visit Budget Reality',
    show: 'Step 12 • Living & Metro Cost',
    meta: 'Budget Breakdown • 14 Min • Essential',
    theme: 'teal',
    badgeText: 'Budget Guide',
    duration: '14:40',
    episode: 'Step 12: Living Costs',
    videoId: 'YP9JitxUAYU',
  },
  {
    id: 'step-5',
    title: 'Professional UAE CV That Gets Shortlisted',
    show: 'Step 5 • ATS Optimization',
    meta: 'CV Template • 14 Min • Step 5',
    theme: 'violet',
    badgeText: 'CV Master',
    duration: '14:10',
    episode: 'Step 5: UAE Format',
    videoId: 'FYZooVdW0Ek',
  },
];

export const CATEGORIES: PodcastCategory[] = [
  {
    id: 'basics',
    title: 'Basics',
    count: '4 Lessons',
    iconName: 'globe-outline',
    accentColor: '#4ECDC4',
  },
  {
    id: 'cv',
    title: 'CV Master',
    count: '6 Lessons',
    iconName: 'document-text-outline',
    accentColor: '#FF6B6B',
  },
  {
    id: 'visa',
    title: 'Visa & Trip',
    count: '7 Lessons',
    iconName: 'airplane-outline',
    accentColor: '#38A3A5',
  },
  {
    id: 'jobhunt',
    title: 'Job Hunt',
    count: '4 Lessons',
    iconName: 'briefcase-outline',
    accentColor: '#D4AF37',
  },
  {
    id: 'attestation',
    title: 'Attestation',
    count: '4 Lessons',
    iconName: 'shield-checkmark-outline',
    accentColor: '#9B5DE5',
  },
];

export const CATEGORY_DETAILS: Record<
  string,
  {
    title: string;
    subtitle: string;
    ambientColor: string;
    episodes: PodcastItem[];
  }
> = {
  basics: {
    title: 'Dubai Basics & Eligibility',
    subtitle:
      'Understand communication languages in Dubai, expected salary bands, and eligibility for Indian job seekers.',
    ambientColor: '#0E3233',
    episodes: [
      {
        id: 'o9ul995BlGw',
        title: 'Step 1. Introduction',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 1: Intro',
        duration: '08:30',
        episode: 'Roadmap & Mindset',
        videoId: 'o9ul995BlGw',
      },
      {
        id: 'f47Xeb5J03A',
        title: 'Step 2. Dubai me Language',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 2: Language',
        duration: '07:15',
        episode: 'Workplace Communication',
        videoId: 'f47Xeb5J03A',
      },
      {
        id: 'PXep2wfGiW8',
        title: 'Step 3. Salary & Minimum Education',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 3: Salary',
        duration: '11:20',
        episode: 'Eligibility & Earnings',
        videoId: 'PXep2wfGiW8',
      },
      {
        id: '5qQ1dUDo024',
        title: 'Step 4. Freshers & Experienced Roles',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 4: Roles',
        duration: '12:45',
        episode: 'Hiring Sectors in UAE',
        videoId: '5qQ1dUDo024',
      },
    ],
  },
  cv: {
    title: 'Professional CV & Interview',
    subtitle:
      'Write an ATS-clearing Dubai standard CV, format keywords, send applications at peak hours, and crack video interviews.',
    ambientColor: '#3D1216',
    episodes: [
      {
        id: 'FYZooVdW0Ek',
        title: 'Step 5. Professional CV Writing',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 5: CV Write',
        duration: '14:10',
        episode: 'ATS Formatting Rules',
        videoId: 'FYZooVdW0Ek',
      },
      {
        id: 'ncn7Xq4t6CI',
        title: 'Step 6. CV Modification',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 6: CV Mod',
        duration: '10:15',
        episode: 'Keyword Optimization',
        videoId: 'ncn7Xq4t6CI',
      },
      {
        id: 'zTYZ7o6rUVM',
        title: 'Step 7. Right Time to Send CV',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 7: Timing',
        duration: '06:50',
        episode: 'UAE Recruiter Hours',
        videoId: 'zTYZ7o6rUVM',
      },
      {
        id: 'NIbUOef93XM',
        title: 'Step 8. Video Calling Apps',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 8: Video Apps',
        duration: '08:40',
        episode: 'Interview Setup in UAE',
        videoId: 'NIbUOef93XM',
      },
      {
        id: 'daLmuKAw_Us',
        title: 'Step 9. Email Writing for Jobs',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'peach',
        badgeText: 'Step 9: Email',
        duration: '09:30',
        episode: 'Cover Note Templates',
        videoId: 'daLmuKAw_Us',
      },
      {
        id: '1Tns8Dtrydk',
        title: 'Step 10. Google Job Search Hacks',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 10: Google',
        duration: '13:05',
        episode: 'Direct HR Search',
        videoId: '1Tns8Dtrydk',
      },
    ],
  },
  visa: {
    title: 'Visit Visa, Travel & Budget Setup',
    subtitle:
      'Plan your 60-day living budget, compare visit visa types, book return tickets, find bedspaces, and arrange currency.',
    ambientColor: '#0F3335',
    episodes: [
      {
        id: 'Nf36pw5Cez0',
        title: 'Step 11. Extra Money Visit Decision',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 11: Visit Plan',
        duration: '09:20',
        episode: 'Trip Feasibility',
        videoId: 'Nf36pw5Cez0',
      },
      {
        id: 'YP9JitxUAYU',
        title: 'Step 12. Total Expense for 2 Months',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 12: Budget',
        duration: '14:40',
        episode: 'Cost & References',
        videoId: 'YP9JitxUAYU',
      },
      {
        id: 'ZiTSusI1Z9U',
        title: 'Step 13. Types of Visit Visa',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 13: Visa Types',
        duration: '08:50',
        episode: '30 vs 60 Day Visas',
        videoId: 'ZiTSusI1Z9U',
      },
      {
        id: '8cfZLi_WPUk',
        title: 'Step 14. Flight Ticket Booking Guide',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 14: Flights',
        duration: '07:35',
        episode: 'Return Ticket Rules',
        videoId: '8cfZLi_WPUk',
      },
      {
        id: 'LxXBHBfEiOk',
        title: 'Step 15. Apply for Passport',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'peach',
        badgeText: 'Step 15: Passport',
        duration: '10:00',
        episode: 'Tatkal & Document Prep',
        videoId: 'LxXBHBfEiOk',
      },
      {
        id: 'kjIzTg9DT2k',
        title: 'Step 16. Room & Bedspace Search',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 16: Rooms',
        duration: '11:15',
        episode: 'Accommodation in Dubai',
        videoId: 'kjIzTg9DT2k',
      },
      {
        id: 'jNJTkXoaCL8',
        title: 'Step 17. Food & Currency Exchange',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 17: Currency',
        duration: '08:25',
        episode: 'Mess & AED Exchange',
        videoId: 'jNJTkXoaCL8',
      },
    ],
  },
  jobhunt: {
    title: 'On-Ground Job Hunt & Joining',
    subtitle:
      'Learn online & offline application techniques in Dubai, walk-in interview methods, and your essential first 7-day checklist.',
    ambientColor: '#3A2E10',
    episodes: [
      {
        id: 'pUv3hN6vJk0',
        title: 'Step 18. Online & Offline Apply',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 18: Apply',
        duration: '15:20',
        episode: 'Drop-in CV & Digital Portals',
        videoId: 'pUv3hN6vJk0',
      },
      {
        id: 'm_Y9gb1G7s4',
        title: 'Step 19. Interview to Joining Process',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 19: Full Process',
        duration: '16:45',
        episode: 'Medical, Visa & Emirates ID',
        videoId: 'm_Y9gb1G7s4',
      },
      {
        id: 'tyO1SuzpEmk',
        title: 'Step 20. Fast-Track Job Secrets',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 20: Fast Track',
        duration: '12:30',
        episode: 'High Leverage Hacks',
        videoId: 'tyO1SuzpEmk',
      },
      {
        id: 'MbO9U-O1Plw',
        title: 'Step 21. 1st Week Preparations',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 21: 1st Week',
        duration: '09:55',
        episode: 'Day 1 to 7 On-Ground Plan',
        videoId: 'MbO9U-O1Plw',
      },
    ],
  },
  attestation: {
    title: 'Attestation, Offers & Scams',
    subtitle:
      'Complete degree attestation from India to UAE, detect fake offer letters, avoid scams, and finalize your master action plan.',
    ambientColor: '#241536',
    episodes: [
      {
        id: 'S6TVFtifQrw',
        title: 'Step 22. Degree Attestation Process',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'teal',
        badgeText: 'Step 22: Attest',
        duration: '11:40',
        episode: 'HRD, MEA & UAE Embassy',
        videoId: 'S6TVFtifQrw',
      },
      {
        id: 'Y-o8dmPrgcA',
        title: 'Step 23. Offer Letter Analysis',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 23: Offer Letter',
        duration: '13:10',
        episode: 'MOHRE Contract Terms',
        videoId: 'Y-o8dmPrgcA',
      },
      {
        id: 'hUstNbqet10',
        title: 'Step 24. Mistakes to Avoid in Dubai',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'violet',
        badgeText: 'Step 24: Avoid Traps',
        duration: '10:50',
        episode: 'Overstay, Scams & Etiquette',
        videoId: 'hUstNbqet10',
      },
      {
        id: 'LwFd22xa1Mo',
        title: 'Step 25. Master Revision & Action Plan',
        broadcaster: 'DubaiJob Masterclass',
        theme: 'peach',
        badgeText: 'Step 25: Revision',
        duration: '14:20',
        episode: 'Final Confidence & Execution',
        videoId: 'LwFd22xa1Mo',
      },
    ],
  },
};

export const AUTHORS: AuthorItem[] = [
  {
    id: '1',
    name: 'Amit Narwal',
    role: 'Dubai Career Mentor',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '2',
    name: 'Sarah Lin',
    role: 'UAE HR Director',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '3',
    name: 'Vikram Patel',
    role: 'Tech Lead (Placed in Dubai)',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: '4',
    name: 'Farah Al-Noor',
    role: 'Aviation Recruiter',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];
