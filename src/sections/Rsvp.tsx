import { useCallback, useState } from 'react';
import { coupleInOrder, wedding } from '../config/wedding';
import { Reveal } from '../components/Reveal';
import { RsvpDialog } from '../components/RsvpDialog';
import { loadStoredRsvp, type StoredRsvp } from '../services/rsvp';
import './Rsvp.css';

/** S6 (top): RSVP prompt and form dialog. */
export function Rsvp() {
  const { rsvp } = wedding;
  const [first, second] = coupleInOrder();
  const [open, setOpen] = useState(false);
  const [stored, setStored] = useState<StoredRsvp | null>(loadStoredRsvp);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="rsvp" id="rsvp">
      <Reveal>
        {rsvp.deadline ? (
          <>
            <p className="rsvp__small">{rsvp.heading} by</p>
            <p className="script rsvp__script">{rsvp.deadline.weekday}</p>
            <p className="rsvp__date">{rsvp.deadline.date}</p>
          </>
        ) : (
          <h2 className="script rsvp__script">{rsvp.heading}</h2>
        )}

        <div className="rsvp__lines">
          {stored ? (
            <>
              <p>
                Thank you!
                <br />
                Your response has been received.
              </p>
              <p className="rsvp__thanks rsvp__signoff">
                With love, {first.name} <span className="amp">&amp;</span> {second.name}
              </p>
            </>
          ) : (
            rsvp.lines.map((line, i) => (
              <p key={line} className={i === rsvp.lines.length - 1 ? 'rsvp__thanks' : undefined}>
                {line}
              </p>
            ))
          )}
        </div>

        <button type="button" className="btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
          {stored ? 'Update RSVP' : 'RSVP here'}
        </button>
      </Reveal>

      <RsvpDialog open={open} onClose={close} onSubmitted={setStored} initial={stored} />
    </div>
  );
}
