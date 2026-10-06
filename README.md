# 💊 MedicApp — Recordatorio de medicación

## Opción elegida

**💊 Recordatorio de medicación**: la app permite cargar medicamentos con su dosis y hora de toma, y avisa con una notificación local.

## Video demo

▶️ [Ver demo en YouTube](PEGAR_ACA_EL_LINK_DEL_VIDEO)

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

Para correr los tests:

```bash
npm test
```

## Funcionalidades implementadas

- **Registro e inicio de sesión** locales, con usuarios guardados en AsyncStorage. No se puede acceder a la app sin iniciar sesión, y la sesión se mantiene al cerrarla.
- **Alta de medicamentos** con nombre, dosis (opcional) y hora del recordatorio, con validación de los datos.
- **Lista de medicamentos** ordenada por hora, con opción de **eliminar**.
- **Persistencia**: los medicamentos de cada usuario quedan guardados en AsyncStorage al cerrar la app.
- **Notificaciones locales** (expo-notifications): un recordatorio diario a la hora elegida y un aviso de prueba 10 segundos después de guardar. Al eliminar un medicamento se cancela su recordatorio.
- **Navegación** con React Navigation (Stack): Login, Registro, Home y Nuevo medicamento.
- **Componentes reutilizables**: `BotonPersonalizado` y `MedicamentoItem`, con estilos en `StyleSheet`.
- **Tests con Jest + React Native Testing Library** (16 tests): componentes reutilizables, validaciones y formateo de hora, y almacenamiento.

## Estructura

```
App.js                      Navegación y manejo de sesión
src/
  screens/                  Login, Registro, Home, AgregarMedicamento
  components/               BotonPersonalizado, MedicamentoItem
  storage/storage.js        Usuarios, sesión y medicamentos (AsyncStorage)
  notifications/            Permisos y programación de notificaciones
  utils/validaciones.js     Validaciones y formateo (lógica pura)
  context/AuthContext.js    Usuario logueado compartido entre pantallas
__tests__/                  Tests con Jest
```

## Autor

Lucas Suarez — Tecnicatura Superior en Desarrollo de Software, Istea.
