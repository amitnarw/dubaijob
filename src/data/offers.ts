/**
 * Proof stats band — OWNER EDITABLE. Keep numbers modest and defensible.
 */
export const STATS = {
  students: 4800,
  studentsLabel: 'Students placed',
  rating: 4.9,
  ratingLabel: 'Average rating',
  reviewCount: 2300,
  years: 5,
  yearsLabel: 'Years running',
} as const;

/**
 * Offers & pricing — OWNER EDITABLE.
 * FULL_PRICE is fixed ₹6,000. Set DISCOUNT_PRICE when the offer is decided.
 */
export const FULL_PRICE_INR = 6000;
export const DISCOUNT_PRICE_INR: number | null = null; // e.g. 3999
export const DISCOUNT_SEATS_LEFT = 14;
export const OFFER_DURATION_HOURS = 48;

/** Play product IDs — MUST match Play Console exactly. */
export const PRODUCT_COURSE_FULL = 'course_full';
export const PRODUCT_COURSE_DISCOUNT = 'course_full_discount';
