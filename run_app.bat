@echo off
echo Starting Local Book Management Application...

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

:: Start the application
echo Starting development server...
echo If browser doesn't open automatically, go to http://localhost:3501
npm run dev

:: Keep the window open if there's an error
if %errorlevel% neq 0 (
  echo Error starting the application.
  pause
  exit /b 1
)
