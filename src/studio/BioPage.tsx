import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { StudioGate } from './StudioGate';
import { ReleaseCard } from '../components/ReleaseCard';
import { Icon } from '../components/Icon';
import { download } from '../core/storage';
export function BioPage() {
  const { account, store, update, notify } = useApp();
  const [bio, setBio] = useState(account?.bio || '');
  const releases = store.releases.filter((r) => r.ownerId === account?.id && r.status === 'active');
  return (
    <StudioGate>
      <div className="page">
        <p className="eyebrow">MÁS QUE UNA CANCIÓN</p>
        <div className="intro-line">
          <h1>Tu historia, en un lugar.</h1>
          {releases.length > 0 && (
            <Link className="button secondary" to={'/artista/a-' + account?.id}>
              Ver mi bio page <Icon name="external" size={17} />
            </Link>
          )}
        </div>
        <div className="bio-layout">
          <form
            className="panel"
            onSubmit={async (e) => {
              e.preventDefault();
              const saved = await update((s) => ({
                ...s,
                accounts: s.accounts.map((a) =>
                  a.id === account?.id ? { ...a, bio: bio.trim() } : a,
                ),
              }));
              if (saved) notify('Bio guardada en tu perfil.');
            }}
          >
            <h2>Preséntate a tu manera.</h2>
            <label>
              Biografía de tu perfil privado
              <textarea
                rows={7}
                maxLength={700}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Qué te mueve, de dónde vienes, a dónde suena tu música…"
              />
            </label>
            <p className="micro">
              Tu nombre viene del perfil. La página pública reúne los lanzamientos activos y usa la
              historia del primero como presentación. Esta biografía se conserva en tu cuenta.
            </p>
            <button className="button" type="submit">
              Guardar biografía
            </button>
            <button
              className="text-link"
              type="button"
              onClick={() =>
                download(
                  'KORΛ-mi-bio.json',
                  JSON.stringify(
                    {
                      artist: account?.name,
                      bio,
                      releases: releases.map((r) => ({
                        title: r.title,
                        url: location.origin + '/lanzamiento/' + r.slug,
                        links: r.links,
                      })),
                      scope: 'Enlaces de esta instalación de KORΛ.',
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              <Icon name="download" size={16} />
              Exportar ficha de artista
            </button>
          </form>
          <div className="panel bio-preview">
            <div className="bio-monogram">{account?.name[0]}</div>
            <span className="eyebrow">KORΛ · ARTISTA</span>
            <h2>{account?.name}</h2>
            <p>{bio || 'Tu historia empieza aquí.'}</p>
            <p className="micro">{releases.length} lanzamientos activos · Página de artista</p>
          </div>
        </div>
        <div className="section-heading">
          <h2>En tu página</h2>
        </div>
        {releases.length ? (
          <div className="release-grid">
            {releases.map((r) => (
              <ReleaseCard key={r.id} release={r} />
            ))}
          </div>
        ) : (
          <p className="empty-state">Activa un lanzamiento para habilitar tu página de artista.</p>
        )}
      </div>
    </StudioGate>
  );
}
