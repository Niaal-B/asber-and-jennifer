import { coupleInOrder, wedding } from '../config/wedding';
import { Frame } from '../components/Frame';
import { Reveal } from '../components/Reveal';
import type { Person } from '../types/wedding';
import './Invitation.css';

/**
 * "D/O Name One & Name Two": each name stays on one line (so "Dr" never gets
 * separated from its name), and lines only break between people, after the "&".
 */
function NameList({ relation, names }: { relation: string; names: string[] }) {
  return (
    <>
      {names.map((n, i) => (
        <span key={n}>
          <span className="invite__nowrap">
            {i === 0 && `${relation} `}
            {n}
            {i < names.length - 1 && '\u00a0&'}
          </span>
          {i < names.length - 1 && ' '}
        </span>
      ))}
    </>
  );
}

function PersonBlock({ person }: { person: Person }) {
  return (
    <div className="invite__person">
      <p className="script invite__name">
        {person.title ? `${person.title} ` : ''}{person.name}
      </p>
      <p className="caps invite__parents">
        <NameList relation={person.relation} names={person.parents} />
      </p>
      {person.grandparents && (
        <p className="caps invite__grandparents">
          <NameList relation={person.grandparents.relation} names={person.grandparents.names} />
        </p>
      )}
    </div>
  );
}

/** S3 (bottom): the formal invitation inside the finer floral frame. */
export function Invitation() {
  const [first, second] = coupleInOrder();
  const { event, venue, invitation } = wedding;
  return (
    <section className="invite" aria-label="Invitation">
      <Reveal>
        <Frame variant="invite" aspect={0.575} className="invite__frame">
          <p className="invite__invocation" lang="ar" dir="rtl">{invitation.invocation}</p>
          <p className="caps invite__small invite__lead">{invitation.inviteLine}</p>
          <PersonBlock person={first} />
          <p className="invite__amp amp">&amp;</p>
          <PersonBlock person={second} />
          <div className="caps invite__details">
            <p>
              {event.weekday}, {event.dateShort}
            </p>
            <p>{event.time}</p>
            <p>{venue.name}</p>
            <p>{venue.locality}</p>
          </div>
        </Frame>
      </Reveal>
    </section>
  );
}
