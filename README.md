# 💊 MedicApp — Recordatorio de medicación

## Opción elegida

**💊 Recordatorio de medicación**: la app permite cargar medicamentos con su dosis y hora de toma, y avisa con una notificación local.

En el **Parcial 2** se sumó: foto del medicamento, ubicación de la farmacia, contacto relacionado (médico/familiar), evento en el calendario del teléfono para la toma y estado global con **Zustand**.

## Video demo

- ▶️ **Parcial 2:** [Ver demo en YouTube](https://youtube.com/shorts/ghPrZyj5OSc?feature=share)
- Parcial 1: [Ver demo en YouTube](https://youtube.com/shorts/Uozc7lTIdHM?si=fzGGHvS70_0Edoih)

## Cómo ejecutar la app

Requisitos: [Node.js LTS](https://nodejs.org) y la app **Expo Go** en el celular (o un emulador de Android Studio).

```bash
git clone https://github.com/LucasSuarezIstea/medicapp.git
cd medicapp
npm install
npx expo start
```

- **Celular:** escanear el QR con Expo Go (PC y celular en la misma red Wi‑Fi).
- **Emulador:** con el emulador de Android Studio abierto, apretar `a` en la terminal.

### Instalar la APK (sin Expo Go)

Cada push a `main` genera la APK automáticamente con GitHub Actions. Para instalarla, abrí la sección **Releases** del repositorio, descargá `app-release.apk` del último build y abrila en el celular. Si Android lo pide, permití instalar apps de origen desconocido.

## Cómo correr los tests

```bash
npm test
```
### Captura TEST

<img width="1362" height="717" alt="image" src="https://github.com/user-attachments/assets/4c38b803-e060-45d7-ad54-2d03ef0eccd3" />


Los tests usan **Jest** (preset `jest-expo`) y **React Native Testing Library**. Se testean:

| Archivo | Qué prueba |
|---|---|
| `__tests__/medicamentosStore.test.js` | Store global (Zustand): agregar, actualizar (foto/ubicación/contacto), eliminar, cargar por usuario y cierre de sesión |
| `__tests__/permisos.test.js` | Manejo de permisos: concedido, pendiente, denegado y bloqueado (con mensaje al usuario) |
| `__tests__/MedicamentoItem.test.js` | El ítem muestra foto, farmacia, contacto y calendario; eliminar y abrir el detalle |
| `__tests__/validaciones.test.js` | Validaciones, formateo de hora, próxima fecha del evento y formato de dirección |
| `__tests__/storage.test.js` | Usuarios, sesión y medicamentos en AsyncStorage |
| `__tests__/BotonPersonalizado.test.js` | Componente de botón reutilizable |
### Captura TEST

<img width="1362" height="717" alt="image" src="https://github.com/user-attachments/assets/4c38b803-e060-45d7-ad54-2d03ef0eccd3" />
<img width="1090" height="578" alt="image" src="https://github.com/user-attachments/assets/8bd15fc6-f00f-4a86-9ff2-b7ae35fec458" />



## Funcionalidades nuevas (Parcial 2)

### 🔐 Permisos
Cada recurso pide su permiso **antes** de usarse, con un helper común (`src/permisos/permisos.js`) que maneja los tres estados:
- **Concedido:** se usa el recurso directamente, sin volver a preguntar.
- **Pendiente:** se muestra el diálogo del sistema.
- **Denegado:** se muestra un mensaje claro. Si el sistema ya no deja volver a preguntar, se ofrece un botón para **abrir la configuración** del teléfono.

Los textos de cada permiso están configurados en `app.json` (plugins de Expo).

### 📷 Cámara y galería (`expo-image-picker`)
Al crear un medicamento (o desde su detalle) se puede **sacar una foto** de la caja o **elegirla de la galería**. La foto se ve en miniatura en la lista y grande en el detalle.

### 📍 Ubicación (`expo-location`)
Botón "Usar mi ubicación actual" para guardar la **farmacia** donde se compra el medicamento. Se muestran la dirección aproximada (geocodificación inversa) y las coordenadas, con un link para **verla en el mapa**.

### 👤 Contactos (`expo-contacts`)
Se elige un **médico o familiar** de la agenda del teléfono (lista con buscador). En el detalle se puede **llamarlo** con un toque.

### 📅 Calendario (`expo-calendar`)
Al guardar un medicamento se crea un **evento diario** en el calendario del teléfono a la hora de la toma, con alarma. Desde el detalle se puede agregar o quitar. Al eliminar el medicamento también se borra el evento.

### 🧠 Estado global con Zustand
Se migró el estado de la app a dos stores (`src/store/`):
- **`useMedicamentosStore`**: lista de medicamentos con las acciones `cargar`, `agregar`, `actualizar`, `eliminar` y `limpiar`. Cada acción actualiza el estado y lo guarda en AsyncStorage.
- **`useAuthStore`**: usuario logueado con `restaurarSesion`, `iniciarSesion` y `salir`.

Reemplazan al `useState` de `HomeScreen`/`App.js` y al `AuthContext` del Parcial 1. Las pantallas leen y modifican el estado solo con los hooks del store, por ejemplo `useMedicamentosStore((s) => s.medicamentos)`. Gracias a esto, cuando se cambia la foto en el detalle, la lista se actualiza sola.

### 🔎 Pantalla de detalle
Nueva pantalla **Detalle** (tocando un medicamento) con foto, farmacia, contacto y calendario, editables.

## Funcionalidades del Parcial 1

- **Registro e inicio de sesión** locales, con usuarios guardados en AsyncStorage. No se puede acceder a la app sin iniciar sesión, y la sesión se mantiene al cerrarla.
- **Alta de medicamentos** con nombre, dosis (opcional) y hora del recordatorio, con validación de los datos.
- **Lista de medicamentos** ordenada por hora, con opción de **eliminar**.
- **Persistencia**: los medicamentos de cada usuario quedan guardados en AsyncStorage al cerrar la app.
- **Notificaciones locales** (expo-notifications): un recordatorio diario a la hora elegida y un aviso de prueba 10 segundos después de guardar. Al eliminar un medicamento se cancela su recordatorio.
- **Navegación** con React Navigation (Stack): Login, Registro, Home, Detalle y Nuevo medicamento.
- **Componentes reutilizables**: `BotonPersonalizado`, `MedicamentoItem`, `SeccionRecursos` y `SelectorContacto`, con estilos en `StyleSheet`.
- **Tests con Jest + React Native Testing Library**: componentes reutilizables, validaciones y formateo de hora, y almacenamiento.

## Estructura

```
App.js                      Navegación (lee la sesión del store)
src/
  screens/                  Login, Registro, Home, Detalle, AgregarMedicamento
  components/               BotonPersonalizado, MedicamentoItem, SeccionRecursos, SelectorContacto
  store/                    Stores globales con Zustand (medicamentos y sesión)
  permisos/permisos.js      Manejo de permisos (concedido / denegado / pendiente)
  recursos/                 Cámara/galería, ubicación, contactos y calendario
  storage/storage.js        Usuarios, sesión y medicamentos (AsyncStorage)
  notifications/            Permisos y programación de notificaciones
  utils/validaciones.js     Validaciones y formateo (lógica pura)
__tests__/                  Tests con Jest
```

## Punto extra: IA aplicada al desarrollo

**Herramienta usada:** Claude (asistente de IA de Anthropic) para generar y refactorizar código.
Utilizada para Arreglar Problema de notificaciones y contactos

> Contexto: app de recordatorio de medicación en React Native + Expo (repo adjunto), con login, AsyncStorage y notificaciones.
> Tarea: agregar foto (cámara/galería), ubicación de la farmacia, contacto (médico/familiar) y evento de calendario a cada medicamento, migrar el estado a Zustand y sumar tests con Jest.
> Restricciones: respetar la estructura y los nombres en español del proyecto, sin backend, manejar los 3 estados de permisos con mensajes claros y que la lógica testeable quede separada de los componentes.

**Lo que funcionó para mejores resultados:** dar el código real como contexto (no solo la consigna), pedir que siga el estilo existente y fijar las restricciones de antemano.

## Autor

Lucas Suarez — Tecnicatura Superior en Desarrollo de Software, Istea.
