# Mburucuyá App — Estado del Proyecto

**Fecha:** 26 de mayo de 2026  
**App:** Gestión del edificio Mburucuyá, Torre A — Punta del Este  
**URL pública:** https://mburucuya-app-ab053.web.app

---

## Qué existe hoy

### Estructura de archivos

```
mburucuya-app/
├── index.html              ← toda la app (HTML + CSS + JS en un solo archivo)
├── manifest.json           ← configuración PWA
├── sw.js                   ← service worker (app instalable offline)
├── icon-192.png            ← ícono de la app (192x192)
├── icon-512.png            ← ícono de la app (512x512)
├── supabase-auth-setup.sql ← setup de BD y políticas de seguridad
├── firebase.json           ← configuración Firebase Hosting
├── .firebaserc             ← proyecto Firebase: mburucuya-app-ab053
└── .gitignore
```

### Tecnologías
- **Frontend:** HTML / CSS / JavaScript puro (sin frameworks)
- **Backend:** Supabase (base de datos PostgreSQL + autenticación)
- **Hosting:** Firebase Hosting (gratuito, estable)
- **Repositorio:** GitHub — github.com/gdalmas1973/mburucuya-app (público)
- **PWA:** App instalable en iPhone (Safari) y Android (Chrome)

### Supabase
- **URL del proyecto:** `https://vdsrhoomfmseduyszrts.supabase.co`
- **Site URL configurada:** `https://mburucuya-app-ab053.web.app`
- **Tablas:** `apartamentos`, `perfiles`, `comunicados`, `reservas`, `gastos`, `publicaciones`
- **Apartamentos cargados:** 28 reales (101–107, 201–207, 301–307, 401–407)

---

## Estado de funcionalidades

| Módulo | Estado | Notas |
|--------|--------|-------|
| Login / Registro | ✅ Funciona | Crea perfil automáticamente |
| Cerrar sesión | ✅ Funciona | |
| Información del edificio | ✅ Funciona | Carga comunicados desde BD |
| Reserva de salón | ✅ Funciona | Guarda en BD, admin aprueba |
| Gastos comunes | ✅ Funciona | Muestra gastos por apartamento |
| Compra/Venta/Alquiler | ✅ Funciona | Carga publicaciones desde BD |
| Mi perfil | ✅ Funciona | Nombre, rol, apartamento |
| Panel admin — Novedades | ✅ Funciona | Publica comunicados |
| Panel admin — Reservas | ✅ Funciona | Aprueba/rechaza reservas |
| Panel admin — Gastos | ✅ Funciona | Carga gastos por apartamento |
| Panel admin — Usuarios | ✅ Funciona | Asigna rol y apartamento |
| PWA instalable | ✅ Funciona | iPhone y Android |
| Cambio de contraseña | ⏸ Pendiente | Por ahora se hace por SQL en Supabase |

---

## Usuarios actuales

| Email | Rol | Apartamento |
|-------|-----|-------------|
| gdalmas@gmail.com | Administrador | 107 |

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

Desde Claude Code, cualquier cambio en el código se publica con:

```
firebase deploy --only hosting
```

Se ejecuta desde acá automáticamente — Gustavo no necesita tocar la consola.

---

## Cómo agregar vecinos

1. El vecino entra a **https://mburucuya-app-ab053.web.app** y se registra
2. Gustavo abre el panel admin → pestaña **Usuarios**
3. Le asigna el rol (Propietario / Inquilino) y el apartamento
4. Guardar

---

## Próximos pasos

1. **Compartir con vecinos** — mandar el link por WhatsApp del edificio
2. **Cargar datos reales** — primer comunicado, gastos del mes actual
3. **Cambio de contraseña desde la app** — mejorar el flujo de recuperación
4. **Dominio propio** — ej: `mburucuya.com` (~15 USD/año) cuando la app esté validada
5. **Subir fotos** a publicaciones de venta/alquiler (Supabase Storage)
6. **Notificaciones** al aprobar reservas (Supabase Edge Functions)
