export const publicPages: Record<string, { title: string; description: string }> = {
  '/discover': {
    title: 'Descubre música de Cali | KORΛ',
    description:
      'Explora artistas y lanzamientos de Cali, conoce sus historias y escucha desde sus fuentes oficiales.',
  },
  '/studio': {
    title: 'Studio para artistas | KORΛ',
    description:
      'Presenta tus lanzamientos con historia, enlaces oficiales y códigos QR desde KORΛ Studio.',
  },
  '/planes': {
    title: 'Planes para tu escena musical | KORΛ',
    description: 'Conoce Curador Pro, Artist, Scout y Launch Kit, sus condiciones y herramientas.',
  },
  '/fuentes': {
    title: 'Fuentes del catálogo musical | KORΛ',
    description: 'Consulta la procedencia de la música y los límites de uso del catálogo de KORΛ.',
  },
  '/legal/terminos': {
    title: 'Términos de uso | KORΛ',
    description: 'Condiciones de acceso y uso de KORΛ.',
  },
  '/legal/privacidad': {
    title: 'Privacidad | KORΛ',
    description: 'Información sobre datos personales, servicios externos y privacidad en KORΛ.',
  },
  '/legal/licencia-musical': {
    title: 'Derechos musicales | KORΛ',
    description: 'Condiciones para compartir música y respetar los derechos de sus creadores.',
  },
};
export function routeMetadata(pathname: string) {
  return (
    publicPages[pathname] ?? {
      title: pathname === '/acceso' ? 'Accede a tu cuenta | KORΛ' : 'Tu espacio | KORΛ',
      description: 'Accede a tu espacio personal en KORΛ.',
    }
  );
}
