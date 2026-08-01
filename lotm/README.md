# Archivo de Misterios

Un juego web de combinación y descubrimiento de ambientación victoriana y
esotérica, inspirado en la mecánica de Little Alchemy. Combinas dos elementos
(que nunca se gastan: son conceptos) para descubrir otros nuevos, hasta cruzar
la frontera de lo mundano.

El proyecto también incluye el generador de cartas para TikTok en `/cartas`.
Está migrando a `apps/card-studio` (ver `REFACTOR_PLAN.md`).

## Stack

- Next.js (App Router) + React + TypeScript estricto
- Tailwind CSS 4
- Prisma ORM 7 + PostgreSQL mediante `@prisma/adapter-pg` (Supabase en producción)
- Zod para validación
- `node:test` + `tsx` para pruebas
- MCP de cartas por `stdio` y Streamable HTTP
- Sin servicios externos: todo corre en tu máquina

## 1 · Instalar dependencias

```bash
npm install
```

## 2 · Configurar el entorno

Copia el ejemplo y ajusta los valores:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env
# Linux / macOS
cp .env.example .env
```

Variables:

| Variable | Descripción |
| --- | --- |
| `DATABASE_URL` | URL de conexión al pool PostgreSQL de la base del juego |
| `DIRECT_URL` | URL directa PostgreSQL para migraciones Prisma |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Valores heredados. El despliegue actual omite la autenticación administrativa; no son necesarios mientras siga vigente esa decisión del propietario. |
| `CARDS_DB_PATH` | SQLite textual independiente de cartas; por defecto `./data/cards.db` |
| `CARDS_EXPORT_DIR` | Carpeta de ZIP generados; por defecto `./data/card-exports` |
| `CARDS_IMAGE_DIR` | Carpeta de imágenes subidas desde el editor; por defecto `./data/card-images` |
| `CARDS_MCP_HOST` / `CARDS_MCP_PORT` | Escucha HTTP del MCP; por defecto `127.0.0.1:3101` |
| `CARDS_MCP_TOKEN` | Bearer token obligatorio al exponer el MCP fuera de localhost |
| `CARDS_MCP_PUBLIC_URL` | URL base publica para construir enlaces de descarga |
| `CARDS_MCP_ALLOWED_HOSTS` | Hostnames publicos del MCP, separados por comas |
| `CARDS_LIVE_VIEW_URL` | Pagina que se abre en el navegador al primer guardado/edicion de la sesion; por defecto `http://localhost:3000/cartas/vivo` (requiere `npm run dev` activo) |

## 3 · Crear o migrar la base de datos

```bash
npm run db:migrate
```

Esto aplica las migraciones PostgreSQL configuradas en Prisma. El sistema
actual no tiene script `db:seed`; el contenido se administra mediante el panel
administrativo y las herramientas de importación/exportación.

## 5 · Iniciar la aplicación

```bash
npm run dev        # desarrollo (http://localhost:3000)
# o bien
npm run build && npm run start   # producción
```

Rutas principales:

| Ruta | Qué es |
| --- | --- |
| `/` | El juego |
| `/coleccion` | Enciclopedia y progreso |
| `/cartas` | Generador de cartas (en migración a `apps/card-studio`) |
| `/admin` | Panel administrativo; acceso sin login en el despliegue local y de usuario único actual |

## MCP del generador de cartas

El servidor MCP administra solo la creación de cartas. Guarda nombres,
descripciones, universos, partes, contenido y referencias de imagen en
`data/cards.db`; las imágenes nunca se guardan como binarios en SQLite.

Instala una vez el Chromium usado para renderizar con los mismos componentes
y CSS de `/cartas`:

```bash
npm run cards:browser
```

`opencode.json` registra automáticamente el servidor local por `stdio`. Cierra
y vuelve a abrir OpenCode después de instalarlo.

| Herramienta | Qué hace |
| --- | --- |
| `save_card_batch` | Crea o reutiliza un universo y una sección, y añade hasta 100 cartas |
| `list_card_library` | Lista la biblioteca agrupada por universo y sección |
| `update_card` | Reemplaza el contenido de una carta, sin moverla |
| `move_cards` | Reagrupa cartas ya guardadas en otra sección, creándola si hace falta |
| `save_card_image` | Guarda una imagen (base64) y devuelve la ruta que se pone en `imageUrl` |
| `delete_cards` | Elimina cartas definitivamente |
| `export_cards_zip` | Renderiza a PNG 960×1280 y genera el ZIP |

`export_cards_zip` acepta los mismos filtros: `{ part: "nombre-o-slug" }` exporta
una sola sección, y sin filtro exporta todo agrupado en carpetas
`universo/NN-seccion/`. En el editor, cada sección del carrusel tiene su propio
botón de descarga, y el botón general agrupa por carpeta cuando hay más de una.

Las **secciones** son las "partes" en que se divide un universo. `move_cards`
es lo que permite dividir una sección grande en varias, o reordenarla, sin
borrar y volver a crear: las cartas conservan su id, su contenido y su fecha de
creación, y el orden de `cardIds` es el que tendrán dentro de la sección.

Los lotes admiten `Character`, `Artifact`, `Cover`, `Full Image Cover`, `Tier`,
`Tier Explanation` y `General Explanation`. Las cartas `Tier` pueden evaluar
el pathway completo o una secuencia concreta, añadir texto destacado al pie y
usar una imagen de fondo con overlay oscuro. `Tier Explanation` es general y
también admite una imagen de fondo opcional con overlay oscuro;
`General Explanation` puede ser general o asociarse a uno de los 22 pathways.

Para ofrecer el mismo MCP por Streamable HTTP:

```bash
npm run cards:mcp:http
```

El endpoint queda en `http://127.0.0.1:3101/mcp`. Cada exportación crea un ZIP
en `data/card-exports` con PNG de 960x1280 ordenados por universo y parte, y un
`manifest.json` v3. El servidor HTTP también devuelve una URL `/downloads/...`.
Si se enlaza a una interfaz no local, es obligatorio definir
`CARDS_MCP_TOKEN`; el cliente debe enviarlo como `Authorization: Bearer ...`.

### Sesión compartida

`cards.db` es la única fuente de verdad. El editor `/cartas`, la vista
`/cartas/vivo` y el MCP trabajan sobre la misma sesión; el editor no guarda
cartas por su cuenta, solo refleja el servidor y le manda cambios.

| Ruta | Uso |
| --- | --- |
| `GET /api/cards/session` | Sesión completa: `revision` y cartas ya ordenadas |
| `GET /api/cards/revision` | Revisión actual de `cards.db`, sin leer las cartas |
| `POST /api/cards` | Crea una carta desde el editor |
| `PUT`/`DELETE /api/cards/:id` | Edita o borra |
| `POST /api/cards/reorder` | Reordena una parte completa |
| `POST /api/cards/images` | Sube una imagen; devuelve la ruta que se guarda en la carta |

El navegador pide la revisión cada segundo y solo recarga la sesión cuando
cambia. Al mirar la revisión de la base y no al proceso que escribe, refleja por
igual al MCP stdio, al MCP HTTP y al propio editor. El sondeo se detiene con la
pestaña en segundo plano.

Antes esto era un stream SSE, pero los temporizadores que necesitaba para
vigilar la base no se ejecutan dentro de un `ReadableStream` en el build de
producción: el evento inicial llegaba y después nada, ni siquiera el keep-alive.

Cada edición se aplica al instante en pantalla y se envía al servidor. Mientras
una carta tenga una escritura sin confirmar, lo que llegue del servidor no la
pisa; el resto se adopta al momento. Un guardado rechazado se muestra en la
barra de estado en vez de perderse en silencio.

Las imágenes que se suben desde el editor se guardan en `data/card-images` y en
la carta queda solo su ruta, igual que con las que referencia el MCP: la base
nunca almacena binarios. Una IA que genere una imagen la sube con
`save_card_image` (base64) y usa la ruta devuelta en `imageUrl`, `topImageUrl`,
`mainImageUrl` o `backgroundImageUrl`; los campos de imagen rechazan el binario
en línea, así que ese es el único camino. Las cartas que quedaran en IndexedDB de versiones
anteriores se suben al servidor la primera vez que se abre el editor.

### Despliegue automático

El servidor se actualiza solo. Un timer de systemd ejecuta
`/usr/local/bin/autodeploy.sh` cada 2 minutos: por cada proyecto compara su
`HEAD` con la rama remota y, si el remoto avanzó, hace `pull --ff-only`,
reconstruye y levanta. Publicar es empujar a `main`.

```bash
systemctl list-timers autodeploy.timer   # cuándo toca la próxima
tail -f /var/log/autodeploy.log          # qué desplegó y qué falló
sudo systemctl start autodeploy.service  # forzar una pasada ahora
```

Solo hace fast-forward: si la copia del servidor diverge o tiene cambios en
archivos versionados, lo anota en el log y no despliega, en vez de descartar
trabajo. Nunca ejecuta `reset --hard` ni `clean`, porque en producción hay
archivos sin versionar que deben sobrevivir. Si el build falla, sigue corriendo
lo anterior.

### Producción y ChatGPT

El contenedor `cards-mcp` del archivo `docker-compose.production.yml` ejecuta
este servidor por separado del sitio web. Configura el proxy inverso del
servidor para enviar el dominio HTTPS elegido al destino `cards-mcp:3101` sin
eliminar el prefijo `/mcp`. Define en `.env` `CARDS_MCP_TOKEN`,
`CARDS_MCP_PUBLIC_URL` y `CARDS_MCP_ALLOWED_HOSTS` con ese dominio antes de
desplegar. La URL que se registra en ChatGPT es:

```text
https://mcp.tu-dominio.com/mcp
```

Usa como autenticación el esquema Bearer y el valor de `CARDS_MCP_TOKEN`.

## 6 · Abrir el panel administrativo

Abre `http://localhost:3000/admin`. La autenticación administrativa está
desactivada por decisión explícita del propietario para este despliegue local,
confiable y de un solo usuario. No expongas el panel públicamente ni reactives
la autenticación dentro de esta refactorización sin aprobación expresa.

## 7 · Crear un elemento

1. Panel → **Elementos** → «Nuevo elemento».
2. Rellena nombre visible (p. ej. «Espejo») e identificador (`espejo`,
   minúsculas y sin acentos — es inmutable una vez usado).
3. Elige tipo, icono, categorías y si estará oculto hasta descubrirse.
4. Guarda. No hace falta reiniciar nada.

## 8 · Crear una receta

1. Panel → **Recetas** → «Nueva receta».
2. Busca y añade ingredientes (puedes repetir el mismo: Ojo × 2). La primera
   versión del juego exige exactamente **dos unidades** en total.
3. Elige el resultado y, si quieres, un texto de éxito y una pista.
4. La previsualización muestra `Ojo × 2 → Visión` y la clave interna
   calculada automáticamente; si ya existe una receta equivalente (sin
   importar el orden), te avisará.
5. Puedes pulsar «Probar combinación» antes de guardar.
6. Al guardar, la receta **funciona inmediatamente** en el juego.

Consejo: la página **Combinaciones fallidas** lista lo que los jugadores ya
intentaron sin éxito, con un botón que abre el formulario de receta con los
ingredientes precargados.

## Reglas de avance entre fases

En Panel → **Árbol de habilidades** → **Editor de fases**, cada fase define
una regla explícita de apertura. Puede exigir una cantidad descubierta, un
porcentaje del cierre alcanzable de la fase anterior, elementos concretos o
grupos `AND`/`OR` anidados. El runtime evalúa las fases en orden y no permite
que un elemento reservado a una fase futura la abra por sí mismo.

El backup completo usa el formato v3 y siempre incluye `fases` con su
`advancementRule`; el importador también acepta backups v2 y convierte sus
umbrales antiguos a reglas de conteo. La exportación nominal v4 incluye la
misma expresión en una forma orientada a lectura humana o LLM.

## 9 · Copia de seguridad

- **Contenido del juego** (fases, reglas, elementos, recetas, categorías, caminos): Panel →
  **Importar / Exportar** → «Descargar JSON». Ese archivo se puede volver a
  importar en modo *fusionar* o *reemplazar*.
- **Todo, incluido el progreso de jugadores**: usa `pg_dump` o las copias de
  seguridad de Supabase sobre la base PostgreSQL configurada.

## 10 · ¿Dónde están los datos persistentes?

- Juego y progresión: PostgreSQL (configurable con `DATABASE_URL`).
- Biblioteca textual del MCP de cartas: `./data/cards.db` (configurable con
  `CARDS_DB_PATH`). Los PNG y ZIP quedan en `./data/card-exports`.

La carpeta `data/` está fuera del control de versiones.

## 11 · Reiniciar el progreso de prueba

- Como jugador: botón «Reiniciar progreso» en la cabecera del juego (borra
  descubrimientos, desbloqueos y estadísticas de TU perfil y vuelve a
  entregar Ojo, Moneda, Tierra y Humano).
- Reinicio completo del juego: usa una operación explícita de mantenimiento
  PostgreSQL; no existe un archivo local `game.db` que borrar.

## 12 · Despliegue con almacenamiento persistente

Todo el estado persistente vive bajo `data/`; monta la carpeta completa en un
volumen para conservar el juego, la biblioteca de cartas y sus exportaciones.

Con Docker:

```bash
docker build -t archivo-de-misterios .
docker run -p 3000:3000 \
  -v archivo_datos:/app/data \
  archivo-de-misterios
```

El contenedor aplica las migraciones PostgreSQL al arrancar. En cualquier VPS
o PaaS que soporte volúmenes (Fly.io, Railway con volumen, etc.), persiste
`/app/data` para el estado de Card Studio; el juego usa PostgreSQL.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Servir la compilación |
| `npm run lint` | ESLint |
| `npm run test` | Pruebas con `node:test`; las de persistencia usan una BD temporal propia |
| `npm run cards:mcp` | MCP de cartas local por `stdio` |
| `npm run cards:mcp:http` | MCP de cartas por Streamable HTTP |
| `npm run cards:browser` | Instalar Chromium para renderizar los ZIP |
| `npm run db:migrate` | Crear/actualizar la base de datos (desarrollo) |
| `npm run db:deploy` | Aplicar migraciones (producción) |
| `npm run db:studio` | Prisma Studio para inspeccionar la BD |

## Arquitectura (resumen)

- `src/server/domain/` — lógica pura del juego (normalización de recetas,
  combinación, diagnóstico). No conoce Next ni la base concreta.
- `src/server/services/` — casos de uso de administración (recetas,
  import/export).
- `src/server/actions/` — Server Actions. La autenticación administrativa está
  desactivada intencionalmente por decisión del propietario; no la re-actives
  dentro de esta refactorización.
- `src/app/api/` — Route Handlers del juego (perfil por cookie HTTP-only).
- PostgreSQL entra por `src/server/db.ts` mediante `@prisma/adapter-pg`.
- SQLite queda aislado en Card Studio (`src/cards/repository.ts` y
  `data/cards.db`).
