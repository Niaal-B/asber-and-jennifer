import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { wedding } from '../config/wedding';
import { useAudio } from '../hooks/useAudio';
import { loadYouTubeApi, type YTPlayer } from './youtube';
import { MusicContext, type MusicApi } from './musicContext';

/**
 * Background music for the whole site. With `music.youtubeId` set, a hidden
 * YouTube player is prepared while the cover is showing, so the OPEN tap can
 * start it straight away (browsers only allow sound after a user gesture).
 * It loops endlessly. Otherwise it falls back to the `music.src` audio file.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const musicConfig = wedding.music;
  const youtubeId = musicConfig?.youtubeId ?? '';
  const src = musicConfig?.src ?? '';
  const youtube = useYouTubeMusic(youtubeId);
  const file = useAudio(youtubeId ? '' : src);
  const api = youtubeId ? youtube.api : file;

  // Pause while the guest is away (e.g. back in WhatsApp); resume on return.
  const resumeOnReturn = useRef(false);
  const playingRef = useRef(api.playing);
  playingRef.current = api.playing;
  const { play, pause } = api;
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        resumeOnReturn.current = playingRef.current;
        if (playingRef.current) pause();
      } else if (resumeOnReturn.current) {
        resumeOnReturn.current = false;
        play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [play, pause]);

  return (
    <MusicContext.Provider value={api}>
      {children}
      {youtubeId && youtube.host}
    </MusicContext.Provider>
  );
}

function useYouTubeMusic(videoId: string) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const wantPlay = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!videoId || !hostRef.current) return;
    let cancelled = false;
    const mount = document.createElement('div');
    hostRef.current.appendChild(mount);

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled) return;
        playerRef.current = new YT.Player(mount, {
          videoId,
          width: 200,
          height: 200,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            loop: 1,
            playlist: videoId, // required for loop=1 on a single video
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              e.target.setVolume(100);
              setReady(true);
              if (wantPlay.current) e.target.playVideo();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
              else if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
              else if (e.data === YT.PlayerState.ENDED) {
                // Belt and braces for the endless loop.
                e.target.seekTo(0, true);
                if (wantPlay.current) e.target.playVideo();
              }
            },
            onError: () => !cancelled && setFailed(true),
          },
        });
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      mount.remove();
    };
  }, [videoId]);

  // If the guest tapped OPEN before the player had loaded, the browser may block the
  // delayed start. Retry on their next tap/keypress anywhere (a fresh user gesture).
  useEffect(() => {
    if (!ready || playing) return;
    const retry = () => {
      if (wantPlay.current && playerRef.current) {
        playerRef.current.unMute();
        playerRef.current.playVideo();
      }
    };
    const events = ['pointerdown', 'touchend', 'keydown'] as const;
    events.forEach((t) => document.addEventListener(t, retry, { capture: true }));
    return () => events.forEach((t) => document.removeEventListener(t, retry, { capture: true }));
  }, [ready, playing]);

  const play = useCallback(() => {
    wantPlay.current = true;
    const p = playerRef.current;
    if (p && ready) {
      p.unMute();
      p.playVideo();
    }
  }, [ready]);

  const pause = useCallback(() => {
    wantPlay.current = false;
    playerRef.current?.pauseVideo();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => (playing ? pause() : play()), [playing, play, pause]);

  const api = useMemo<MusicApi>(
    () => ({ available: ready && !failed, playing, play, pause, toggle }),
    [ready, failed, playing, play, pause, toggle],
  );

  // Kept in the viewport (not display:none or far off-screen), because browsers may
  // refuse or throttle playback in hidden frames. Invisible and not interactive.
  const host = (
    <div
      ref={hostRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: 1,
        height: 1,
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: -2,
      }}
    />
  );

  return { api, host };
}
