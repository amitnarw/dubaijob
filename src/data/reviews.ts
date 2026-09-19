/**
 * Reviews & proof content — OWNER EDITABLE.
 * Replace with REAL student reviews, photos, and success images.
 * Specific outcomes ("Got Dubai job in 3 months") beat generic praise.
 */
export interface Review {
  id: string;
  name: string;
  city: string;
  outcome: string;
  stars: number;
  text: string;
  // photo: local require() or remote URL; null → initials avatar
  photo: string | null;
}

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Rahul Sharma',
    city: 'Delhi',
    outcome: 'Got Dubai job in 3 months',
    stars: 5,
    text: 'The CV module alone changed everything. I went from zero replies to 4 interview calls in two weeks. Joined as a sales executive in Deira.',
    photo: null,
  },
  {
    id: 'r2',
    name: 'Priya Nair',
    city: 'Kochi',
    outcome: 'AED 4,500 salary, hospitality',
    stars: 5,
    text: 'I was scared to apply abroad with no experience. The portal routine and cover-letter templates made it so simple. My offer letter came in month two.',
    photo: null,
  },
  {
    id: 'r3',
    name: 'Amit Patel',
    city: 'Ahmedabad',
    outcome: 'Warehouse supervisor, JAFZA',
    stars: 5,
    text: 'The visa module saved me from a fake agent asking 80,000 rupees. Everything my employer had to pay for — I knew it before signing.',
    photo: null,
  },
  {
    id: 'r4',
    name: 'Sneha Kulkarni',
    city: 'Pune',
    outcome: 'HR executive, Business Bay',
    stars: 4,
    text: 'Interview prep videos are gold. I practiced the 12 questions daily and walked into my video interview fully confident. Cleared round one same day.',
    photo: null,
  },
];

export interface SuccessImage {
  id: string;
  // image: local require() or remote URL
  image: string;
  caption: string;
}

export const SUCCESS_IMAGES: SuccessImage[] = [
  { id: 's1', image: '', caption: 'Offer letter — Sales Executive, Deira' },
  { id: 's2', image: '', caption: 'Landed in Dubai — first day' },
  { id: 's3', image: '', caption: 'Work visa stamped — JAFZA' },
  { id: 's4', image: '', caption: 'Team lunch, Business Bay office' },
];

export interface TimelineEvent {
  year: string;
  title: string;
  detail: string;
}

export const TIMELINE: TimelineEvent[] = [
  { year: '2021', title: 'First batch', detail: '50 students, WhatsApp-based guidance.' },
  { year: '2022', title: '500 placed', detail: 'Crossed 500 Dubai placements across 6 sectors.' },
  { year: '2023', title: 'Video course launched', detail: 'Full curriculum recorded, Hindi + English.' },
  { year: '2024', title: '4,000+ students', detail: 'CV service and 1-on-1 mentoring added.' },
  { year: '2026', title: 'This app', detail: 'Everything in one place — learn anywhere.' },
];

export const HERO_STORY = {
  name: 'Vikram Singh',
  city: 'Jaipur',
  result: 'AED 6,000/month',
  role: 'Logistics Coordinator, Dubai',
  text: 'I was earning ₹18,000 in Jaipur. Six months after this course I signed an offer for AED 6,000 with housing. My family still cannot believe it.',
};
