import { Pause, Play } from 'lucide-react';
import { useMusic } from '../music/musicContext';
import { wedding } from '../config/wedding';
import './VinylPlayer.css';

/** Spinning record with tonearm (S2): play/pause for the background music. Hidden when no song is configured. */
export function VinylPlayer() {
  const { available, playing, toggle } = useMusic();
  if (!available) return null;
  const title = wedding.music?.title || 'song';

  return (
    <div className={`vinyl ${playing ? 'is-playing' : ''}`}>
      <div className="vinyl__stage">
        <div className="vinyl__disc" aria-hidden="true">
          <div className="vinyl__grooves" />
          <div className="vinyl__label" />
        </div>
        <div className="vinyl__sheen" aria-hidden="true" />
        <button
          type="button"
          className="vinyl__button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        >
          {playing ? (
            <Pause size={30} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play size={30} fill="currentColor" strokeWidth={0} className="vinyl__play-icon" />
          )}
        </button>
        <picture className="vinyl__arm" aria-hidden="true">
          <source srcSet="/images/tonearm.webp" type="image/webp" />
          <img src="/images/tonearm.png" alt="" draggable={false} />
        </picture>
      </div>
      <button type="button" className="vinyl__caption caps" onClick={toggle}>
        {playing ? 'Pause song' : 'Play song'}
      </button>
    </div>
  );
}
