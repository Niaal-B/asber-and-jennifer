import { wedding } from '../config/wedding';
import { Reveal } from '../components/Reveal';
import './Quote.css';

/** S5 (bottom): dark band with the blessings / prayer or quote. */
export function Quote() {
  const { blessing, quote } = wedding;
  if (!blessing && !quote) return null;

  return (
    <section className="section section--band quote" aria-label="Blessings and Duas">
      <Reveal className="column">
        {blessing ? (
          <div className="blessing">
            <div className="blessing__crest" aria-hidden="true">
              <picture>
                <source srcSet="/images/crest.webp" type="image/webp" />
                <img src="/images/crest.png" alt="" width="110" height="70" />
              </picture>
            </div>
            <p className="blessing__dua">
              {blessing.dua}
            </p>
            <p className="script blessing__closing">
              {blessing.closing}
            </p>
            <div className="caps blessing__family">
              {blessing.family.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        ) : quote ? (
          <figure className="quote__figure">
            <blockquote className="quote__text">
              <p className="script">
                <span className="quote__mark" aria-hidden="true">“</span>
                {quote.text.charAt(0).toLowerCase() + quote.text.slice(1)}
                <span className="quote__mark" aria-hidden="true">”</span>
              </p>
            </blockquote>
            <figcaption className="caps quote__source">{quote.source}</figcaption>
          </figure>
        ) : null}
      </Reveal>
    </section>
  );
}
