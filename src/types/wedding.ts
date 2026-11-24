export interface Person {
  /** Honorific shown before the name, e.g. "Dr". */
  title: string;
  name: string;
  /** Relation prefix, e.g. "D/O" or "S/O". */
  relation: string;
  /** Parents exactly as provided by the client, one entry per person (kept unbroken on screen). */
  parents: string[];
  /** Optional grandparents line, e.g. { relation: 'Grand D/O', names: ['Late …', 'Late …'] }. */
  grandparents?: { relation: string; names: string[] };
}

export type ScheduleIconName = 'arrival' | 'rings' | 'cake' | 'camera' | 'dining' | 'car';

export interface ScheduleItem {
  time: string;
  title: string;
  icon: ScheduleIconName;
}

export interface Contact {
  /** e.g. "Groom's Father" */
  role: string;
  name: string;
  /** International format without "+" or spaces, e.g. "919876543210". */
  whatsapp: string;
  phone?: string;
}

export interface Blessing {
  dua: string;
  closing: string;
  family: string[];
}

export interface WeddingConfig {
  couple: {
    bride: Person;
    groom: Person;
    /** Which name appears first on the cover and hero. */
    order: 'bride-first' | 'groom-first';
  };
  event: {
    label: string;
    /** ISO 8601 with timezone offset. The countdown targets this. */
    startsAt: string;
    endsAt: string;
    weekday: string;
    /** Short numeric date shown in the hero, e.g. "04.01.2027". */
    dateShort: string;
    /** Long date, e.g. "4 January 2027". */
    dateLong: string;
    time: string;
  };
  venue: {
    name: string;
    /** Locality shown after the venue name on the invitation card, e.g. "Mele Champad, Thalassery". */
    locality: string;
    addressLines: string[];
    mapsUrl: string;
    /** Path to a line-art image of the venue. Empty = built-in stand-in drawing. */
    illustration: string;
  };
  invitation: {
    invocationArabic?: string;
    invocationEnglish?: string;
    invocation: string;
    hosts?: string[];
    leadLines?: string[];
    inviteLine: string;
    brideParents?: {
      relation: string;
      names: string[];
    };
  };
  quote: { text: string; source: string } | null;
  blessing?: Blessing | null;
  /** Leave empty to hide the Event Flow section. */
  schedule: ScheduleItem[];
  /** Leave empty to hide the Contact block. */
  contacts: Contact[];
  music: {
    /**
     * YouTube video ID to play as background music (from youtu.be/<ID>).
     * Takes priority over `src`. Leave empty to use an audio file instead.
     */
    youtubeId: string;
    /** Path to an audio file in /public, used when `youtubeId` is empty. */
    src: string;
    title: string;
  } | null;
  rsvp: {
    endpoint: string;
    maxGuests: number;
    /** e.g. { weekday: "Monday", date: "21 December 2026" }. null = no deadline line. */
    deadline: { weekday: string; date: string } | null;
    heading: string;
    lines: string[];
  };
  meta: {
    title: string;
    description: string;
    footerCredit: string;
    /** Small designer credit under the footer. null to hide. */
    designer: { label: string; handle: string; url: string } | null;
  };
}
