/**
 * Add-on packages — OWNER EDITABLE.
 * productId MUST match the exact ID created in Play Console.
 * Prices are display-only; the real charge comes from Play Console.
 */
export interface CoursePackage {
  productId: string;
  name: string;
  tagline: string;
  bullets: string[];
  priceInr: number;
  badge?: 'MOST POPULAR';
}

export const PACKAGES: CoursePackage[] = [
  {
    productId: 'pkg_1on1',
    name: '1-on-1 Guidance Call',
    tagline: '30 minutes, personal roadmap',
    bullets: [
      '30-min video call with a Dubai-placed mentor',
      'Personal job-role roadmap for your profile',
      'CV review + next-3-steps action plan',
    ],
    priceInr: 1499,
    badge: 'MOST POPULAR',
  },
  {
    productId: 'pkg_cv',
    name: 'Dubai CV Creation',
    tagline: 'Done-for-you, recruiter-ready',
    bullets: [
      'Professionally rewritten Dubai-format CV',
      'ATS-friendly + photo guidelines included',
      '2 revision rounds within 7 days',
    ],
    priceInr: 999,
  },
  {
    productId: 'pkg_book',
    name: 'Dubai Job Playbook (eBook)',
    tagline: 'The full system in writing',
    bullets: [
      '120+ pages: portals, scripts, checklists',
      'Copy-paste cover letters that get replies',
      'Lifetime updates included',
    ],
    priceInr: 499,
  },
  {
    productId: 'pkg_qa',
    name: 'Priority Q&A Access',
    tagline: 'Answers within 24 hours',
    bullets: [
      'Ask unlimited questions for 30 days',
      'Replies within 24 hours, guaranteed',
      'Salary & offer-letter reviews included',
    ],
    priceInr: 799,
  },
];
