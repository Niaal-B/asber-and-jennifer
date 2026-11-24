import { coupleInOrder, wedding } from '../config/wedding';
import { Reveal } from '../components/Reveal';
import { VinylPlayer } from '../components/VinylPlayer';
import './Hero.css';

/** S2: names, date and the music player. */
export function Hero() {
  const [first, second] = coupleInOrder();
  const hasMusic = Boolean(wedding.music && (wedding.music.youtubeId || wedding.music.src));
  return (
    <section className="hero" id="top">
      <Reveal className="hero__heading">
        <p className="caps hero__eyebrow">The wedding of</p>
        <h1 className="script hero__names">
          {first.name} <span className="hero__amp amp">&amp;</span> {second.name}
        </h1>
        <p className="hero__date">{wedding.event.dateShort}</p>
      </Reveal>
      {hasMusic && (
        <Reveal delay={0.25} className="hero__player">
          <VinylPlayer />
        </Reveal>
      )}
    </section>
  );
}
