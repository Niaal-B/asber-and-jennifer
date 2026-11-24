import { wedding } from '../config/wedding';
import { Frame } from '../components/Frame';
import { Reveal } from '../components/Reveal';
import './Invitation.css';

function PinIcon() {
  return (
    <svg className="invite__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 21s-6-5.6-6-10a6 6 0 1 1 12 0c0 4.4-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="invite__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="invite__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 13.5" />
    </svg>
  );
}

/** Formal invitation card — layout matches client reference image. */
export function Invitation() {
  const { event, venue, couple } = wedding;
  const groom = couple.groom;
  const bride = couple.bride;

  return (
    <section className="invite" aria-label="Invitation">
      <Reveal>
        <Frame variant="invite" aspect={0.575} className="invite__frame">

          {/* 1. Bismillah Arabic calligraphy — high in the arch */}
          <div className="invite__bismillah">
            <picture>
              <source srcSet="/images/bismillah.webp" type="image/webp" />
              <img src="/images/bismillah.png" alt="Bismillah Ar-Rahman Ar-Raheem" />
            </picture>
          </div>

          {/* 2. Groom's parents as hosts */}
          <div className="invite__hosts">
            <p className="invite__host-name">{groom.parents[0]}</p>
            <p className="invite__host-amp amp">&amp;</p>
            <p className="invite__host-name">{groom.parents[1]}</p>
          </div>

          {/* 3. Lead line */}
          <p className="caps invite__lead">
            TOGETHER WITH OUR FAMILY, WE CORDIALLY INVITE YOU TO CELEBRATE THE WEDDING OF OUR BELOVED SON
          </p>

          {/* 4. Couple script names */}
          <div className="invite__couple">
            <p className="script invite__name">{groom.name}</p>
            <p className="invite__couple-amp amp">&amp;</p>
            <p className="script invite__name">{bride.name}</p>
          </div>

          {/* 5. Bride's parents */}
          <div className="invite__bride-parents">
            <p>
              <span className="invite__relation">{bride.relation}: </span>
              <span className="invite__parent-name">{bride.parents[0]}</span>
            </p>
            <p>
              <span className="invite__amp-small amp">&amp; </span>
              <span className="invite__parent-name">{bride.parents[1]}</span>
            </p>
          </div>

          {/* 6. 3-column event details */}
          <div className="invite__details-box">
            <div className="invite__col">
              <CalendarIcon />
              <p className="caps invite__col-label">{event.weekday}</p>
              <p className="invite__col-num">2</p>
              <p className="caps invite__col-sub">JANUARY</p>
              <p className="invite__col-year">2027</p>
            </div>

            <div className="invite__vsep" aria-hidden="true" />

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

            <div className="invite__col">
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
