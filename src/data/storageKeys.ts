/** AsyncStorage keys — versioned. Bump suffix on schema change. */
export const Keys = {
  auth: '@dubaijob_auth_v1',
  profile: '@dubaijob_profile_v1',
  entitlements: '@dubaijob_entitlements_v1',
  playTokens: '@dubaijob_play_tokens_v1',
  homeVisits: '@dubaijob_home_visits_v1',
  offerDeadline: '@dubaijob_offer_deadline_v1',
  offerExtended: '@dubaijob_offer_extended_v1',
  courseProgress: '@dubaijob_course_progress_v1',
  toastSession: '@dubaijob_toast_session_v1',
} as const;
