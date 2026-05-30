# Mburucuyá App — Estado del Proyecto

**Fecha:** 30 de mayo de 2026  
**App:** Gestión del edificio Mburucuyá, Torre A — Punta del Este  
**URL pública:** https://mburucuya-app-ab053.web.app

---

## Qué existe hoy

### Estructura de archivos

```
mburucuya-app/
├── index.html                          ← toda la app (HTML + CSS + JS)
├── manifest.json                       ← configuración PWA
├── sw.js                               ← service worker (push + auto-update)
├── sw-ver.js                           ← versión del SW (actualizado en cada deploy)
├── version.json                        ← versión de la app (para auto-reload)
├── deploy.ps1                          ← script de deploy (actualiza versiones + publica)
├── icon-192.png / icon-512.png         ← íconos de la app
├── supabase-auth-setup.sql             ← setup de BD y políticas
├── firebase.json                       ← configuración Firebase Hosting
├── .firebaserc                         ← proyecto: mburucuya-app-ab053
├── supabase/functions/
│   └── notify-comunicado/index.ts      ← Edge Function para push notifications
└── .gitignore
```

### Tecnologías
- **Frontend:** HTML / CSS / JavaScript puro (sin frameworks)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Hosting:** Firebase Hosting (gratuito)
- **Repositorio:** GitHub — github.com/gdalmas1973/mburucuya-app (público)
- **PWA:** App instalable en iPhone (Safari) y Android (Chrome)

### Supabase
- **URL:** `https://vdsrhoomfmseduyszrts.supabase.co`
- **Tablas:** `apartamentos`, `perfiles`, `comunicados`, `reservas`, `gastos`, `publicaciones`, `push_subscriptions`
- **Apartamentos:** 28 reales (101–107, 201–207, 301–307, 401–407)
- **Edge Functions:** `notify-comunicado` (envía push al publicar comunicado)
- **Webhook:** INSERT en `comunicados` → dispara Edge Function

---

## Estado de funcionalidades

| Módulo | Estado | Notas |
|--------|--------|-------|
| Login / Registro | ✅ Funciona | Crea perfil automáticamente |
| Cerrar sesión | ✅ Funciona | |
| Información del edificio | ✅ Funciona | Carga comunicados desde BD |
| Reserva de salón | ✅ Funciona | Horario 08:00–00:00, admin aprueba |
| Gastos comunes | ✅ Funciona | Muestra gastos por apartamento |
| Compra/Venta/Alquiler | ✅ Funciona | Con fotos (Supabase Storage) |
| Publicar (propietario) | ✅ Funciona | Propietario crea/edita/elimina sus propias publicaciones con foto |
| Mi perfil | ✅ Funciona | Nombre, rol, apartamento |
| Panel admin — Novedades | ✅ Funciona | Publica comunicados |
| Panel admin — Reservas | ✅ Funciona | Aprueba/rechaza reservas |
| Panel admin — Gastos | ✅ Funciona | Carga gastos + toggle pagado/pendiente por vecino |
| Panel admin — Usuarios | ✅ Funciona | Asigna rol y apartamento |
| Panel admin — Publicar | ✅ Funciona | Con fotos |
| PWA instalable | ✅ Funciona | iPhone y Android |
| Permisos por rol | ✅ Funciona | Navegación bloqueada por código |
| Notificaciones in-app | ✅ Funciona | Polling 20s + visibilitychange |
| Badge en nav Edificio | ✅ Funciona | Punto verde animado (pulso) cuando hay novedades sin leer |
| Push notifications web | ✅ Funciona | Vía Edge Function + webhook |
| Push notifications iOS | ✅ Funciona | Celular bloqueado, app cerrada — llega igual |
| Auto-actualización PWA | ✅ Funciona | SW versionado + version.json + postMessage |
| Cambio de contraseña | ⏸ Pendiente | Por ahora se hace por SQL en Supabase |

---

## Permisos por rol

| Sección | Admin | Propietario | Inquilino | Visitante |
|---------|-------|-------------|-----------|-----------|
| Edificio (avisos) | ✅ | ✅ | ✅ | ✅ |
| Salón (reservas) | ✅ | ✅ | ✅ | ❌ |
| Gastos | ✅ | ✅ | ❌ | ❌ |
| Propiedades (ver) | ✅ | ✅ | ❌ | ✅ |
| Propiedades (publicar) | ✅ | ✅ | ❌ | ❌ |
| Perfil | ✅ | ✅ | ✅ | ✅ |
| Panel admin ⚙️ | ✅ | ❌ | ❌ | ❌ |

---

## Usuarios actuales

| Email | Rol | Apartamento |
|-------|-----|-------------|
| gdalmas@gmail.com | Administrador | 107 |
| vecinos varios | Propietario / Inquilino | según apartamento |

---

## Cómo cambiar contraseña (por ahora)

Desde Supabase → SQL Editor:

```sql
UPDATE auth.users 
SET encrypted_password = crypt('nueva-contraseña', gen_salt('bf'))
WHERE email = 'email-del-usuario@ejemplo.com';
```

---

## Cómo publicar cambios

```powershell
.\deploy.ps1
```

Actualiza `version.json` y `sw-ver.js` con timestamp, y despliega a Firebase. Los vecinos reciben la actualización automáticamente la próxima vez que abran la app.

---

## Cómo desplegar Edge Function

```powershell
$env:SUPABASE_ACCESS_TOKEN = "tu-token"
npx supabase functions deploy notify-comunicado --no-verify-jwt
```

---

## Cómo agregar vecinos

1. El vecino entra a **https://mburucuya-app-ab053.web.app** y se registra
2. Gustavo abre el panel admin → pestaña **Usuarios**
3. Le asigna el rol (Propietario / Inquilino) y el apartamento
4. Guardar

---

## Próximos pasos

1. **Cambio de contraseña desde la app** — mejorar el flujo
2. **Dominio propio** — ej: `mburucuya.com` (~15 USD/año)
