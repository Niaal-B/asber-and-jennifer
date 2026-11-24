import { wedding } from '../config/wedding';
import { Frame } from '../components/Frame';
import { Reveal } from '../components/Reveal';
import './Invitation.css';

function CalendarIcon() {
  return (
    <svg
      className="invite__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8" cy="14" r="1.1" fill="currentColor" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" />
      <circle cx="16" cy="14" r="1.1" fill="currentColor" />
      <circle cx="8" cy="18" r="1.1" fill="currentColor" />
      <circle cx="12" cy="18" r="1.1" fill="currentColor" />
      <circle cx="16" cy="18" r="1.1" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      className="invite__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="invite__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DiamondDivider() {
  return (
    <div className="invite__divider" aria-hidden="true">
      <span className="invite__divider-line" />
      <span className="invite__divider-diamond">✦</span>
      <span className="invite__divider-line" />
    </div>
  );
}

/** S3: Formal invitation matching client card layout. */
export function Invitation() {
  const { event, venue, invitation, couple } = wedding;
  const groom = couple.groom;
  const bride = couple.bride;

  return (
    <section className="invite" aria-label="Invitation">
      <Reveal>
        <Frame variant="invite" aspect={0.575} className="invite__frame">
          {/* 1. Arabic Bismillah */}
          <div className="invite__bismillah">
            <picture>
              <source srcSet="/images/bismillah.webp" type="image/webp" />
              <img src="/images/bismillah.png" alt="Bismillah Ar-Rahman Ar-Raheem" />
            </picture>
          </div>

          {/* 2. English Invocation */}
          <p className="caps invite__invocation-en">
            {invitation.invocationEnglish || 'IN THE NAME OF ALLAH, THE MOST GRACIOUS, THE MOST MERCIFUL.'}
          </p>

          {/* 3. Groom's Parents (Hosts) */}
          <div className="invite__hosts">
            <p className="invite__host-name">{groom.parents[0]}</p>
            <p className="invite__hosts-amp amp">&amp;</p>
            <p className="invite__host-name">{groom.parents[1]}</p>
          </div>

          {/* 4. Small Ornament Divider */}
          <DiamondDivider />

          {/* 5. Invite Lead */}
          <div className="caps invite__lead">
            {invitation.leadLines ? (
              invitation.leadLines.map((line) => <p key={line}>{line}</p>)
            ) : (
              <p>{invitation.inviteLine}</p>
            )}
          </div>

          {/* 6. Couple Names */}
          <div className="invite__couple">
            <p className="script invite__name">{groom.name}</p>
            <p className="invite__names-amp amp">&amp;</p>
            <p className="script invite__name">{bride.name}</p>
          </div>

          {/* 7. Bride's Parents */}
          <div className="invite__bride-parents">
            <p>
              <span className="invite__relation">{bride.relation} </span>
              <span className="invite__parent-italic">{bride.parents[0]}</span>
            </p>
            <p>
              <span className="invite__amp amp">&amp; </span>
              <span className="invite__parent-italic">{bride.parents[1]}</span>
            </p>
          </div>

          {/* 8. 3-Column Event Details Box */}
          <div className="invite__details-box">
            {/* Column 1: Date */}
            <div className="invite__col invite__col--date">
              <CalendarIcon />
              <p className="caps invite__col-label">{event.weekday}</p>
              <p className="invite__col-num">2</p>
              <p className="caps invite__col-sub">JANUARY</p>
              <p className="invite__col-year">2027</p>
            </div>

            <div className="invite__vsep" aria-hidden="true" />

            {/* Column 2: Venue */}
            <div className="invite__col invite__col--venue">
              <PinIcon />
              <p className="caps invite__col-label">VENUE</p>
              <p className="invite__venue-name">{venue.name}</p>
              <div className="invite__venue-address">
                {venue.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div className="invite__vsep" aria-hidden="true" />

            {/* Column 3: Time */}
            <div className="invite__col invite__col--time">
              <ClockIcon />
              <p className="caps invite__col-label">AT</p>
              <p className="invite__time-val">{event.time}</p>
            </div>
          </div>
        </Frame>
      </Reveal>
    </section>
  );
}
