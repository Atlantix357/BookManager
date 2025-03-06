@echo off
echo Starting Local Book Management Application...

:: Check if dist folder exists
if not exist "dist" (
  echo Production build not found. Running build process first...
  call build_app.bat
  if %errorlevel% neq 0 (
    echo Error building the application.
    pause
    exit /b 1
  )
)

:: Start a simple HTTP server to serve the production build
echo Starting application server...
echo.
echo If browser doesn't open automatically, go to http://localhost:3500
echo.
echo Press Ctrl+C to stop the application when finished.
echo.

:: Install serve if not already installed
if not exist "node_modules\serve" (
  echo Installing serve package...
  npm install serve
  if %errorlevel% neq 0 (
    echo Error installing serve package.
    pause
    exit /b 1
  )
)

:: Serve the production build
cmd /k "npx serve dist -s -l 3500"
