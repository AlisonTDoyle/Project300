# TimetableApplication
## Building and Deploying
🌐 Web
```
Build:
ng build

Serve:
ng serve
```
📱 Mobile (Android)
```
# Syncing with Android Studio
Build:
npm run build-mobile

# Running a Dev build on Android Studio
Serve:
npm run serve-mobile
```
🖥️ Desktop
```
Serve (development):
ng build; npx electron .

Package (production):
electron-packager ./ TimetableApplication --platform=win32 --overwrite
```