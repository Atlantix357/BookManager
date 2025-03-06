@echo off
echo Building Local Book Management Application...

:: Check if node_modules exists
if not exist "node_modules" (
  echo First run detected. Installing dependencies...
  npm install
  if %errorlevel% neq 0 (
    echo Error installing dependencies. Please make sure Node.js is installed.
    pause
    exit /b 1
  )
  echo Dependencies installed successfully.
)

:: Build the application
echo Creating production build...
npm run build
if %errorlevel% neq 0 (
  echo Error building the application.
  pause
  exit /b 1
)

echo Production build created successfully in the "dist" folder.
echo.
echo To run the application:
echo 1. Double-click on "run_production.bat"
echo.
pause
