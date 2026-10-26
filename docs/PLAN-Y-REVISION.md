# Plan y revisión de KORΛ-2

Fecha de trabajo: 25 de octubre de 2026, zona America/Bogota.

## Revisión previa

Se consultaron en modo lectura C:\Users\renzi\WebstormProjects\KORA, el reporte exacto Reporte_KORA_v1(4).md recuperado de la caché de adjuntos local y Rediseño integral de KORA.zip del escritorio. El ZIP se extrajo en el directorio de trabajo de Codex para revisar sus fuentes sin modificarlo. La landing C:\Users\renzi\WebstormProjects\kora-discover queda fuera del alcance de escritura.

El reporte es una instantánea de fuentes de 19.004 líneas. El proyecto existente usa HTML/CSS/JavaScript clásico, archivos por responsabilidad y 26 SVG de diseño. El rediseño propone React/Vite, pero App.tsx concentra unas 1.200 líneas y combina catálogo ficticio, perfiles precargados, formularios y reproductor. No se reutilizaron su configuración de Figma ni sus rutas internas de despliegue.

## Conservar y ajustar

| Pieza revisada | Decisión de implementación |
|---|---|
| 26 SVG de branding | Copia binaria, sin modificación. Manifest con SHA-256. |
| Naranja #F1871C y paleta complementaria | Tokens corporativos y temas claro/oscuro. |
| Reproductor del rediseño | Adaptar progreso basado en audio, volumen, cola, anterior/siguiente, mini reproductor y ventana ampliada con foco y Escape. |
| Fallback de osciladores del original | Excluir: no aparentar música real si un audio falla. |
| Historias y guardados | Mantener como memoria musical con notas y colecciones. |
| Perfiles precargados y embajador | Excluir del producto; cuentas locales creadas por cada persona. Curador es plan Pro del explorador. |
| Catálogo ficticio y WAV sin procedencia explícita | No migrar al catálogo. Sustituir por fuentes oficiales verificadas. |
| Leyes/documentos | Archivar los originales y ajustar texto vigente a la operación local. |
| Preventa/pagos antiguos | Sustituir por interés local y simulación rotulada; sin promesa de activación en noviembre ni ingresos simulados. |
| Diseño integral | Conservar claridad del reproductor y orden de descubrimiento; separar módulos y crear composición editorial propia. |

## Plan comunicado antes del desarrollo

1. React + Vite + TypeScript y módulos por experiencia, con catálogo compartido.
2. Catálogo verificable y reproductor autorizado; sin audio de relleno atribuido a artistas.
3. Registro local por rol, biblioteca, ciudad y preferencias.
4. Studio con editor, smart link, bio page, QR, archivos propios y medición real.
5. Límites de planes, derechos, privacidad y adaptadores para dos hojas sin conectar.
6. Validación de dominio, compilación, recorridos y diseño adaptable.

Se ejecutó este plan en el proyecto independiente KORA-2. No se necesitó crear una rama en el repositorio de KORA. Si el usuario decide iniciar Git en KORA-2 más adelante, codex/kora-2 sigue siendo una propuesta de nombre local; no fue creada ni enviada.

## Referencia de producto

Se revisaron los patrones generales de enlaces de artista, enlaces de lanzamiento y analítica de [Feature.fm](https://www.feature.fm/products). No se copió código, marca, imágenes, CSS ni una composición exacta. KORΛ usa un recorrido Discover/Studio propio, naranja corporativo, arte editorial geométrico y una portada de descubrimiento con un disco creado con CSS.

## Alcance final y dependencias reales

La aplicación funciona en el navegador local. El catálogo inicial funciona por fuentes externas oficiales y su disponibilidad depende de Bandcamp. Los archivos propios se guardan y reproducen localmente. La distribución pública de páginas, las operaciones privadas en Sheets, el cobro y cualquier identidad de producción requieren conexiones y decisiones adicionales del usuario. No se sustituyen por contadores inventados ni por servicios conectados sin autorización.
