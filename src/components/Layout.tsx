import { PaymentFollowup } from './PaymentFollowup';
import { CityPicker } from './CityPicker';
import { TermsGate } from './TermsGate';
import { Notifications } from './Notifications';
import { PwaStatus } from './PwaStatus';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../core/useApp';
import { usePlayer } from '../player/usePlayer';
import { PlayerDock } from '../player/PlayerDock';
import { cities } from '../core/catalog';
import { Icon } from './Icon';
export function Layout() {
  const {
    store,
    account,
    update,
    notice,
    storageWarning,
    isAdmin,
    resolvedTheme,
    connection,
    refresh,
  } = useApp();
  const player = usePlayer();
  const { pathname } = useLocation();
  const studio = pathname.startsWith('/studio');
  const [menu, setMenu] = useState(false);
  const links = studio
    ? [
        ['/studio', 'studio', 'Mi espacio'],
        ['/studio/lanzamientos', 'music', 'Lanzamientos'],
        ['/studio/analitica', 'chart', 'Analítica'],
        ['/studio/bio', 'user', 'Mi bio page'],
      ]
    : [
        ['/discover', 'compass', 'Descubrir'],
        ['/guardados', 'bookmark', 'Mi biblioteca'],
        ['/comunidad', 'list', 'Curaduría'],
        ...(account?.role === 'scout' ? [['/scout', 'chart', 'Radar de talento']] : []),
      ];
  return (
    <div className={'app-shell ' + (player.current ? 'has-player' : '')}>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <aside id="primary-sidebar" className={'sidebar ' + (menu ? 'mobile-open' : '')}>
        <Link className="brand" to="/discover" onClick={() => setMenu(false)}>
          <img
            src={
              resolvedTheme === 'dark'
                ? '/branding/02_isotipo_negativo.svg'
                : '/branding/01_isotipo_positivo.svg'
            }
            alt=""
          />
          <span>
            KORΛ<small>MÚSICA QUE CONECTA</small>
          </span>
        </Link>
        <div
          className={'experience-switch ' + (account && account.role !== 'artist' ? 'single' : '')}
          aria-label="Experiencia"
        >
          <Link className={!studio ? 'active' : ''} to="/discover" onClick={() => setMenu(false)}>
            Discover
          </Link>
          {(!account || account.role === 'artist') && (
            <Link className={studio ? 'active' : ''} to="/studio" onClick={() => setMenu(false)}>
              Studio <span>↗</span>
            </Link>
          )}
        </div>
        <p className="nav-label">{studio ? 'TU MÚSICA, MÁS LEJOS' : 'TU ESCENA'}</p>
        <nav aria-label="Navegación principal">
          {links.map(([to, icon, label]) => (
            <NavLink end to={to} key={to} onClick={() => setMenu(false)}>
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/planes" onClick={() => setMenu(false)}>
            <Icon name="plus" />
            Planes KORΛ
          </NavLink>
          <NavLink to="/legal/terminos" onClick={() => setMenu(false)}>
            <Icon name="shield" />
            Legal y privacidad
          </NavLink>
          {isAdmin && (
            <NavLink to="/interno" onClick={() => setMenu(false)}>
              <Icon name="settings" />
              Administración
            </NavLink>
          )}
          <Link
            className="account-link"
            to={account ? '/cuenta' : '/acceso'}
            onClick={() => setMenu(false)}
          >
            <span className="avatar">
              {account ? account.name.charAt(0).toUpperCase() : <Icon name="user" />}
            </span>
            <span>
              <strong>{account ? account.name : 'Entra a tu escena'}</strong>
              <small>
                {account
                  ? account.isTest
                    ? 'Cuenta de prueba'
                    : account.plan === 'free'
                      ? 'Acceso gratuito'
                      : 'Acceso ' + account.plan
                  : 'Crear cuenta o iniciar sesión'}
              </small>
            </span>
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </aside>
      {menu && (
        <button
          className="menu-shade"
          aria-label="Cerrar navegación"
          onClick={() => setMenu(false)}
        />
      )}
      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir navegación"
              aria-expanded={menu}
              aria-controls="primary-sidebar"
              onClick={() => setMenu(!menu)}
            >
              <Icon name="menu" />
            </button>
            <span className="topbar-section">{studio ? 'Studio' : 'Discover'}</span>
            <span className="topbar-slash">/</span>
            <CityPicker
              value={store.settings.city}
              cities={['Colombia', ...cities, ...catalogCities()]}
              onChange={(city) => {
                void update((s) => ({ ...s, settings: { ...s.settings, city } }));
              }}
            />
          </div>
          <div className="topbar-right">
            <Notifications />
            <button
              className="icon-button theme-button"
              aria-label={resolvedTheme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
              onClick={() =>
                update((s) => ({
                  ...s,
                  settings: { ...s.settings, theme: resolvedTheme === 'dark' ? 'light' : 'dark' },
                }))
              }
            >
              <Icon name={resolvedTheme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <Link
              className="button small secondary account-top"
              to={account ? '/cuenta' : '/acceso'}
            >
              {account ? 'Mi cuenta' : 'Iniciar sesión'} <Icon name="arrow" size={16} />
            </Link>
          </div>
        </header>
        <PwaStatus />
        {connection === 'error' && (
          <div className="connection-banner" role="alert">
            No pudimos conectar las cuentas. El catálogo sigue disponible.{' '}
            <button className="text-link" onClick={() => void refresh()}>
              Reintentar conexión
            </button>
          </div>
        )}
        {storageWarning && (
          <div role="alert" className="storage-warning">
            {storageWarning}
          </div>
        )}
        <main id="contenido" tabIndex={-1}>
          <PaymentFollowup />
          <Outlet />
        </main>
        <footer className="app-footer">
          <Link className="footer-brand" to="/discover">
            KORΛ
          </Link>
          <span>Desde Cali, para lo que viene.</span>
          <div>
            <Link to="/legal/terminos">Términos</Link>
            <Link to="/legal/privacidad">Privacidad</Link>
            <Link to="/legal/licencia-musical">Derechos musicales</Link>
          </div>
        </footer>
      </div>
      <TermsGate />
      <PlayerDock />
      {notice && (
        <div className="toast" role="status">
          <Icon name="check" />
          {notice}
        </div>
      )}
    </div>
  );
  function catalogCities() {
    return [...new Set(store.releases.map((r) => r.city))].filter(
      (c) => !cities.includes(c) && c !== 'Colombia',
    );
  }
}
