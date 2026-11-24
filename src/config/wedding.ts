import type { WeddingConfig } from '../types/wedding';

/**
 * All client-specific content lives here. UI components never hard-code
 * wedding details. To reuse this site for another couple, edit only this
 * file (plus the assets in /public).
 *
 * Names and parents are exactly as confirmed by the client. Do not edit
 * their spelling.
 */
export const wedding: WeddingConfig = {
  couple: {
    groom: {
      title: '',
      name: 'Asber',
      relation: 'S/O',
      parents: ['Dr Mohammed Saleem K', 'Dr Fathimathul Zohara K'],
    },
    bride: {
      title: '',
      name: 'Jennifer',
      relation: 'D/O',
      parents: ['Mr Abdul Majid Kanhirandy', 'Saira Majid'],
    },
    order: 'groom-first',
  },

  event: {
    label: 'Nikah',
    startsAt: '2027-01-02T11:30:00+05:30',
    endsAt: '2027-01-02T14:30:00+05:30',
    weekday: 'Saturday',
    dateShort: '02.01.2027',
    dateLong: '2 January 2027',
    time: '11:30 AM',
  },

  venue: {
    name: 'Parappan Square International Convention Centre',
    locality: 'Venniyur, Malappuram',
    addressLines: ['NH 66, Venniyur, Malappuram,', 'Kerala 676508, India'],
    mapsUrl: 'https://maps.app.goo.gl/hX7stQEbChDZGxU96?g_st=iw',
    illustration: '',
  },

  invitation: {
    invocation: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
    inviteLine: 'We cordially invite you to the Nikah of',
  },

  quote: null,

  blessing: {
    dua: 'May Allah bless you, and bless your union, and bring you together in goodness.',
    closing: 'With Duas, Love & Blessings',
    family: ['SAFA, ADAM, MOIDEEN', 'AND THE ENTIRE FAMILY'],
  },

  // Example: { time: '12:00 PM', title: 'Guests Arrival', icon: 'arrival' }
  schedule: [],

  contacts: [
    {
      role: "Groom's Father",
      name: 'Dr Saleem',
      whatsapp: '919846100134',
      phone: '+91 98461 00134',
    },
  ],

  // Music disabled per groom's request
  music: null,

  rsvp: {
    endpoint: import.meta.env.VITE_RSVP_API_URL || '/api/rsvp',
    maxGuests: 10,
    deadline: null,
    heading: 'Kindly RSVP',
    lines: ['We would be most grateful', 'for your response.', 'Thank you.'],
  },

  meta: {
    // Keep index.html (page title + link-preview tags) in sync with these.
    title: 'Asber & Jennifer · Nikah',
    description:
      'You are warmly invited to the Nikah of Asber & Jennifer on Saturday, 2 January 2027 at Parappan Square International Convention Centre, Venniyur, Malappuram.',
    footerCredit: 'With love, Asber & Jennifer · 2027',
    designer: {
      label: 'Digital invitation by',
      handle: '@niaal._',
      url: 'https://www.instagram.com/niaal._/',
    },
  },
};

/** The couple in display order. */
export function coupleInOrder() {
  const { bride, groom, order } = wedding.couple;
  return order === 'bride-first' ? [bride, groom] as const : [groom, bride] as const;
}
