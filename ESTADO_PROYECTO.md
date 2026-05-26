# Mburucuyá App — Estado del Proyecto

**Fecha:** 25 de mayo de 2026  
**App:** Gestión del edificio Mburucuyá, Torre A — Punta del Este

---

## Qué existe hoy

### Estructura de archivos

```
mburucuya-app/
├── index.html          ← toda la app (HTML + CSS + JS en un solo archivo, ~50 KB)
├── supabase-auth-setup.sql  ← setup de BD y políticas de seguridad
├── package.json
└── .claude/
    └── launch.json     ← config para correr con `npx serve -p 3000`
```

### Tecnologías
- **Frontend:** HTML / CSS / JavaScript puro (sin frameworks)
- **Backend:** Supabase (base de datos PostgreSQL + autenticación)
- **Servidor de desarrollo:** `npx serve -p 3000`
- **Deploy:** Netlify (configurado pero con problema de clave)

### Supabase
- **URL del proyecto:** `https://vdsrhoomfmseduyszrts.supabase.co`
- **Tablas creadas:** `apartamentos`, `perfiles`, `comunicados`, `reservas`, `gastos`, `publicaciones`
- **Datos de prueba:** 4 apartamentos (4B, 7A, 3C, 2A)

---

## Funcionalidades implementadas

| Módulo | Estado | Notas |
|--------|--------|-------|
| Login / Registro | Funciona con Supabase Auth | Crea perfil automáticamente |
| Información del edificio | Funciona | Carga comunicados desde BD |
| Reserva de salón | Interfaz completa | Guarda en BD, pendiente aprobar por admin |
| Gastos comunes | Funciona | Muestra gastos por apartamento |
| Compra/Venta/Alquiler | Funciona | Carga publicaciones desde BD |
| Mi perfil | Funciona | Muestra nombre, rol, apartamento |
| Panel admin | Interfaz completa | Publicar novedades, aprobar reservas, cargar gastos |

### Roles de usuario
- **Administrador** — acceso total, panel de gestión
- **Propietario** — ve gastos, puede publicar propiedades
- **Inquilino** — ve comunicados, reserva salón
- **Visitante** — solo información pública

---

## Problema principal que bloquea Netlify

La app **funciona localmente** pero **no funciona en Netlify** porque la clave de Supabase usada en el código es la `sb_publishable_...` (formato corto). Netlify necesita la clave **`anon`** en formato JWT largo (`eyJ...`).

**Cómo resolverlo:**
1. Ir a [supabase.com](https://supabase.com) → tu proyecto → Settings → API
2. Copiar el valor de **"anon public"** (empieza con `eyJ...`)
3. Reemplazarlo en `index.html` línea ~428:
   ```javascript
   const sb = createClient(
     'https://vdsrhoomfmseduyszrts.supabase.co',
     'eyJ...'  ← pegar aquí la clave anon
   );
   ```
4. Hacer deploy nuevo en Netlify

---

## Próximos pasos (en orden de prioridad)

### 1. Arreglar deploy en Netlify (urgente)
- Reemplazar clave Supabase por la clave `anon` correcta
- Hacer deploy y confirmar que funciona desde celular

### 2. Crear usuarios reales
- Registrar a Gustavo como administrador
- Ejecutar en Supabase el SQL de promoción a admin:
  ```sql
  UPDATE perfiles 
  SET rol = 'administrador', apartamento_id = (SELECT id FROM apartamentos WHERE numero = '4B')
  WHERE email = 'gdalmas@gmail.com';
  ```
- Registrar 2–3 vecinos de prueba (propietarios/inquilinos)

### 3. Datos reales en la base de datos
- Completar la lista de apartamentos del edificio (hoy solo hay 4 de prueba)
- Cargar gastos comunes reales del mes actual
- Publicar el primer comunicado real

### 4. Pulir el panel de administrador
- Probar flujo completo: publicar novedad → vecino la ve
- Probar flujo de reserva: vecino pide → admin aprueba → aparece en calendario
- Probar carga de gasto: admin carga → vecino ve deuda

### 5. Información del edificio
- Actualizar los teléfonos de contacto reales (plomero, electricista, admin)
- Agregar el reglamento del edificio como comunicado fijo o sección propia

### 6. Mejoras opcionales (después del MVP)
- Subir fotos a publicaciones de venta/alquiler (Supabase Storage)
- Notificaciones por email al aprobar/rechazar reservas (Supabase Edge Functions)
- Resumen mensual de gastos en PDF
- Filtro de reservas del salón por apartamento (vista admin)

---

## Cómo correr la app localmente

```powershell
# Desde la carpeta del proyecto
npx serve -p 3000
# Abrir en el navegador: http://localhost:3000
```

O usar la configuración de Claude Code (botón de run).

---

## Notas técnicas para continuar

- Toda la app está en **un solo archivo** `index.html`. Al editar, buscar por nombre de función o sección (las secciones empiezan con `sec-`).
- Los datos se cargan **de forma lazy**: cada sección carga sus datos la primera vez que se abre.
- El estado se guarda en variables globales: `usuario`, `perfil`, `aptId`, `calFecha`.
- Las **políticas de seguridad (RLS)** están activas en Supabase: cada usuario solo ve sus propios datos; solo admins pueden modificar comunicados, gastos y reservas.
- El archivo `supabase-auth-setup.sql` contiene el trigger que crea el perfil automáticamente al registrarse.
