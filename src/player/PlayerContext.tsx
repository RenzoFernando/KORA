import { capsuleDuration, capsulePosition } from './capsule';
import { Context } from './usePlayer';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Release } from '../core/types';
import { useApp } from '../core/useApp';
import { readFile } from '../core/media';
import { embedUrl } from '../core/catalog';
export function PlayerProvider({ children }: { children: ReactNode }) {
  const { catalog, metric, notify, store, resolvedTheme } = useApp();
  const [current, setCurrent] = useState<Release>();
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, changeVolume] = useState(0.75);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const playCounted = useRef(false);
  const autoStart = useRef(false);
  const currentId = current?.id;
  useEffect(() => {
    let dead = false;
    let objectUrl = '';
    audio.current?.pause();
    setPlaying(false);
    setElapsed(0);
    setDuration(0);
    setError('');
    setMediaUrl('');
    playCounted.current = false;
    autoStart.current = current?.playback === 'file';
    setLoading(current?.playback === 'file');
    if (current?.playback === 'file' && current.audioKey)
      void readFile(current.audioKey)
        .then((blob) => {
          if (dead) return;
          if (!blob) {
            setLoading(false);
            setError('El audio no está disponible.');
            return;
          }
          objectUrl = URL.createObjectURL(blob);
          setMediaUrl(objectUrl);
        })
        .catch(() => {
          if (!dead) {
            setLoading(false);
            setError('No pudimos cargar el audio. Revisa tu conexión.');
          }
        });
    return () => {
      dead = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [currentId, current?.audioKey, current?.playback]);
  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume, mediaUrl]);
  useEffect(() => {
    if (
      current &&
      !catalog.some((r) => r.id === current.id) &&
      !store.releases.some((r) => r.id === current.id && r.ownerId === store.sessionId)
    ) {
      audio.current?.pause();
      setCurrent(undefined);
      setExpanded(false);
      setIframeSrc('');
    }
  }, [catalog, current, store.releases, store.sessionId]);
  useEffect(() => {
    if (!playing || current?.playback !== 'file' || !duration) return;
    const timer = window.setInterval(() => {
      const element = audio.current;
      if (element && element.currentTime >= duration) {
        element.pause();
        element.currentTime = duration;
        setElapsed(duration);
      }
    }, 40);
    return () => window.clearInterval(timer);
  }, [playing, current?.playback, duration]);
  function select(r: Release) {
    if (current?.id === r.id) {
      if (r.playback === 'file' && !loading) void toggle();
      else if (r.playback === 'bandcamp')
        document.querySelector<HTMLIFrameElement>('.dock-official-frame')?.focus();
      return;
    }
    audio.current?.pause();
    setCurrent(r);
    setExpanded(false);
    setIframeSrc(r.playback === 'bandcamp' ? embedUrl(r, resolvedTheme === 'dark') : '');
    if (r.playback === 'bandcamp') metric(r.id, 'embed_open');
  }
  async function toggle() {
    const element = audio.current;
    if (!element || current?.playback !== 'file' || loading) return;
    if (!element.paused) {
      element.pause();
      return;
    }
    try {
      if (duration > 0 && element.currentTime >= duration) element.currentTime = 0;
      await element.play();
      setError('');
    } catch {
      setError('Pulsa reproducir para volver a intentarlo.');
    }
  }
  function seek(value: number) {
    if (audio.current && Number.isFinite(duration) && duration > 0) {
      audio.current.currentTime = capsulePosition(value, duration);
      setElapsed(audio.current.currentTime);
    }
  }
  function step(direction: number) {
    if (!current || !catalog.length) return;
    const index = catalog.findIndex((r) => r.id === current.id);
    select(catalog[(index + direction + catalog.length) % catalog.length]);
  }
  function close() {
    audio.current?.pause();
    setCurrent(undefined);
    setExpanded(false);
    setIframeSrc('');
    setLoading(false);
  }
  function loadEmbed() {
    if (current?.playback === 'bandcamp' && !iframeSrc) {
      setIframeSrc(embedUrl(current, resolvedTheme === 'dark'));
      metric(current.id, 'embed_open');
    }
  }
  return (
    <Context.Provider
      value={{
        current,
        playing,
        elapsed,
        duration,
        volume,
        error,
        expanded,
        setExpanded,
        select,
        toggle,
        seek,
        setVolume: changeVolume,
        step,
        close,
        iframeSrc,
        loadEmbed,
        embedReady: !!iframeSrc,
        loading,
      }}
    >
      {children}
      <audio
        ref={audio}
        src={mediaUrl || undefined}
        preload="auto"
        onPlay={() => {
          setPlaying(true);
          setError('');
          if (current && !playCounted.current) {
            metric(current.id, 'audio_play');
            playCounted.current = true;
          }
        }}
        onPause={() => setPlaying(false)}
        onTimeUpdate={() => {
          const element = audio.current;
          if (!element) return;
          const end = capsuleDuration(element.duration);
          if (end && element.currentTime >= end) {
            element.pause();
            if (element.currentTime > end) element.currentTime = end;
          }
          setElapsed(capsulePosition(element.currentTime, element.duration));
        }}
        onLoadedMetadata={() => {
          const value = audio.current?.duration || 0;
          setDuration(capsuleDuration(value));
          setLoading(false);
        }}
        onCanPlay={() => {
          if (autoStart.current && audio.current) {
            autoStart.current = false;
            void audio.current
              .play()
              .catch(() => setError('Pulsa reproducir para iniciar la canción.'));
          }
        }}
        onEnded={() => {
          setPlaying(false);
          notify('Terminó la cápsula. Descubre otro lanzamiento o visita su fuente oficial.');
        }}
        onError={() => {
          if (mediaUrl) {
            setLoading(false);
            setError('No se pudo leer este formato de audio.');
          }
        }}
      />
    </Context.Provider>
  );
}
