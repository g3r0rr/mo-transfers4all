// Country dial codes for the phone fields on the public booking form and
// the hotel portal. Greece first (the default), then the countries our
// customers most commonly travel from. The selected dial code is prepended
// to the number on submit so passenger_phone lands already dialable
// (e.g. "+30 6936475451"). Shared here because both forms use the same list;
// each form keeps its own small styled CountrySelect (matching that form's
// field styling), the same way each already keeps its own AutocompleteInput.
export const COUNTRIES = [
  { f: '🇬🇷', n: 'Greece', d: '+30' },
  { f: '🇬🇧', n: 'United Kingdom', d: '+44' },
  { f: '🇺🇸', n: 'United States', d: '+1' },
  { f: '🇩🇪', n: 'Germany', d: '+49' },
  { f: '🇫🇷', n: 'France', d: '+33' },
  { f: '🇮🇹', n: 'Italy', d: '+39' },
  { f: '🇪🇸', n: 'Spain', d: '+34' },
  { f: '🇳🇱', n: 'Netherlands', d: '+31' },
  { f: '🇨🇭', n: 'Switzerland', d: '+41' },
  { f: '🇦🇹', n: 'Austria', d: '+43' },
  { f: '🇧🇪', n: 'Belgium', d: '+32' },
  { f: '🇸🇪', n: 'Sweden', d: '+46' },
  { f: '🇳🇴', n: 'Norway', d: '+47' },
  { f: '🇩🇰', n: 'Denmark', d: '+45' },
  { f: '🇵🇱', n: 'Poland', d: '+48' },
  { f: '🇷🇴', n: 'Romania', d: '+40' },
  { f: '🇧🇬', n: 'Bulgaria', d: '+359' },
  { f: '🇨🇾', n: 'Cyprus', d: '+357' },
  { f: '🇦🇪', n: 'United Arab Emirates', d: '+971' },
  { f: '🇮🇱', n: 'Israel', d: '+972' },
  { f: '🇹🇷', n: 'Türkiye', d: '+90' },
  { f: '🇦🇺', n: 'Australia', d: '+61' },
  { f: '🇨🇦', n: 'Canada', d: '+1' },
]
