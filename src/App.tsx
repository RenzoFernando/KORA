import { useEffect, Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AppProvider } from './core/AppContext';
import { PlayerProvider } from './player/PlayerContext';
import { Layout } from './components/Layout';
import { DiscoverPage } from './discover/DiscoverPage';
import { ReleasePage } from './discover/ReleasePage';
import { ArtistPage } from './discover/ArtistPage';
import { LibraryPage } from './discover/LibraryPage';
import { CommunityPage } from './discover/CommunityPage';
import { AuthPage } from './account/AuthPage';
import { AccountPage } from './account/AccountPage';
import { PlansPage } from './account/PlansPage';
import { StudioPage } from './studio/StudioPage';
import { ReleasesPage } from './studio/ReleasesPage';
import { ReleaseEditor } from './studio/ReleaseEditor';
import { AnalyticsPage } from './studio/AnalyticsPage';
import { BioPage } from './studio/BioPage';
import { ScoutPage } from './scout/ScoutPage';
import { LegalPage } from './legal/LegalPage';
import { SourcesPage } from './legal/SourcesPage';
import { AdminPage } from './admin/AdminPage';
function RouteFocus() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector<HTMLElement>('#contenido')?.focus({ preventScroll: true });
    document.title =
      'KORΛ · ' +
      (pathname.startsWith('/studio')
        ? 'Studio'
        : pathname.startsWith('/legal')
          ? 'Legal y privacidad'
          : 'La música está cerca');
  }, [pathname]);
  return null;
}
class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de interfaz KORΛ', error, info.componentStack);
  }
  render() {
    return this.state.error ? (
      <div className="page empty-state">
        <h1>No pudimos abrir esta vista.</h1>
        <p>Tus archivos locales no se han eliminado. Recarga la página para volver a intentarlo.</p>
        <button className="button" onClick={() => location.reload()}>
          Recargar KORΛ
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <PlayerProvider>
            <RouteFocus />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/discover" replace />} />
                <Route path="discover" element={<DiscoverPage />} />
                <Route path="guardados" element={<LibraryPage />} />
                <Route path="comunidad" element={<CommunityPage />} />
                <Route path="lanzamiento/:slug" element={<ReleasePage />} />
                <Route path="artista/:artistId" element={<ArtistPage />} />
                <Route path="acceso" element={<AuthPage />} />
                <Route path="cuenta" element={<AccountPage />} />
                <Route path="planes" element={<PlansPage />} />
                <Route path="studio" element={<StudioPage />} />
                <Route path="studio/lanzamientos" element={<ReleasesPage />} />
                <Route path="studio/nuevo" element={<ReleaseEditor />} />
                <Route path="studio/editar/:id" element={<ReleaseEditor />} />
                <Route path="studio/analitica" element={<AnalyticsPage />} />
                <Route path="studio/bio" element={<BioPage />} />
                <Route path="scout" element={<ScoutPage />} />
                <Route path="legal/:document" element={<LegalPage />} />
                <Route path="fuentes" element={<SourcesPage />} />
                <Route path="interno" element={<AdminPage />} />
                <Route
                  path="*"
                  element={
                    <div className="page empty-state">
                      <h1>Este camino aún no suena.</h1>
                      <Link className="button" to="/discover">
                        Volver a Discover
                      </Link>
                    </div>
                  }
                />
              </Route>
            </Routes>
          </PlayerProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
