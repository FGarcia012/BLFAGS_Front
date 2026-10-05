# BLFAGS Frontend

Un blog para compartir ideas e historias con un alias. No pedimos el nombre real; el correo no se muestra a la comunidad ni al administrador.

Backend: [BLFAGS_Back](https://github.com/FGarcia012/BLFAGS_Back).

## Desarrollo

Requiere Node.js 22.13+ o 24. Stack: React 19, Vite 7, Tailwind 4, React Router 7, Axios, TanStack Query v5, Lucide y react-hot-toast. Inter Variable se sirve desde el propio hosting.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

En PowerShell usa `Copy-Item`. Define `VITE_API_URL` con la API de tu entorno, por ejemplo una API local bajo `http://localhost:3020/BLFAGS/v1/`. El valor de desarrollo es público, nunca una credencial. Sin variable se usa la API del proyecto. Las pruebas del navegador interceptan llamadas o usan exclusivamente una API local aislada.

```sh
npm run lint
npm test
npm run build
npm run preview
npm audit --omit=dev
npx playwright install chromium
npm run test:e2e
```

Rollup está fijado en 4.59.0: el perfil de un build con 4.64.0 mostró crecimiento de memoria y bloqueo en el análisis de llamadas. La versión fijada produjo el build en unos dos segundos. Los iconos se importan individualmente.

## Datos y refresco

`src/services/api.jsx` tiene una sola instancia Axios, AbortSignal y manejo de 401. Los fallos lanzan errores; `getErrorMessage` produce mensajes seguros en español.
`src/shared/hooks/` concentra consultas y mutaciones. Claves:
- `['publications', {search, filter, uid}]`: feed paginado, debounce 400 ms, polling cada 60 s mientras la pestaña está activa.
- `['comments', pid, uid]`: comentarios que solo se leen al abrir el hilo.
- `['publication', pid, uid]`: detalle.
- `['user', uid, viewer]`, `['userPublications', uid, viewer]`, `['adminUsers']`: perfiles y moderación.
- `['hashtagPublications', tag, viewer]` y `['hashtags', viewer]`.

La caché tiene staleTime de 30 s, gcTime de 5 minutos y hasta dos reintentos solo de red/5xx.
Cada tarjeta toma los conteos y la reacción propia del feed. Una reacción envía una sola petición y actualiza la caché de forma optimista, con rollback ante fallo.
Añadir o borrar comentarios actualiza la lista y el conteo con la respuesta del servidor, sin otra lectura.
Crear, editar y borrar publicaciones reinicia la lista activa a una página e invalida la clave con sus filtros vigentes: una mutación y una lectura.
La carga de más páginas es explícita. El polling conserva el orden previo hasta aceptar «Hay publicaciones nuevas · Ver».

## Diseño y accesibilidad

Todos los estilos están en `src/index.css`: Tailwind 4, tokens `@theme`, un acento verde, modo oscuro/claro, bordes y superficies. Los estilos de componentes viven en esa misma hoja; no quedan hojas legadas ni objetos inline de estilo.
`src/components/ui/` contiene Button, IconButton, Input, Textarea, Select, Card, Avatar, Badge, Modal, Dropdown, Skeleton, Spinner, EmptyState, ErrorState y Tooltip.
Los diálogos usan `dialog.showModal()`, confinamiento de foco nativo y Escape. Hay foco visible, etiquetas de formularios, botones accesibles, menú móvil, enlace de salto y respeto de reduced-motion.
Los avatares sin foto usan una inicial local. Los archivos tienen no-referrer, imágenes lazy/async y videos preload none.
La Home se carga junto con la entrada para evitar una cascada de red en el contenido principal; las demás páginas usan lazy + Suspense. La ruta desconocida muestra 404 y no existe la demo de comentarios.

## Privacidad en el navegador

Se persiste únicamente `{uid, username, profilePicture, role, token}` y la preferencia de tema. Se eliminan campos personales de sesiones antiguas al normalizarlas. El correo propio se obtiene bajo demanda para ajustes y no se guarda en localStorage.
El token en localStorage sigue expuesto ante un XSS. Una cookie httpOnly requiere un cambio coordinado de autenticación, CORS y CSRF; está documentado como mejora opcional.
Ni los administradores pueden editar identidad/contraseña ajena ni se promete anonimato frente a los proveedores de hosting y archivos.

## Firebase Hosting

```sh
npm run build
firebase hosting:channel:deploy mejoras-preview
# Tras verificar la preview:
firebase deploy --only hosting
```

Estos comandos son pasos manuales; no se han ejecutado. Configura VITE_API_URL antes del build.
`firebase.json` añade CSP, nosniff, Referrer-Policy y Permissions-Policy; assets con caché immutable y HTML con no-cache.
CSP permite conexión a la API y archivos de Cloudinary. `style-src 'unsafe-inline'` se mantiene porque react-hot-toast/goober genera estilos al ejecutar; el código del proyecto no usa dangerouslySetInnerHTML.
Revisa las cabeceras reales y las métricas Lighthouse de nuevo en preview. Los resultados locales no verifican la configuración efectiva de Firebase.
Las capturas de prueba están previstas en [docs](docs/README.md); contienen únicamente datos ficticios.

## Estructura

`src/pages/`: Home, Auth, Registro, Feed, Detalle, Hashtags, Perfil y Ajustes.
`src/components/`: navegación, formularios, publicaciones, comentarios, moderación y UI.
`src/contexts/UserContext.jsx`: sesión normalizada y limpieza de caché al cambiar de usuario.
`tests/`: reacciones, credenciales, persistencia y pruebas Playwright del feed.
`firebase.json`, `vite.config.js`, `playwright.config.js`: hosting, compilación y navegador.

Autor: FGarcia012. El frontend no declaraba una licencia; el propietario debe definirla antes de redistribuirlo.
