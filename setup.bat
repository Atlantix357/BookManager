@echo off
echo Setting up Local Book Management Application...
echo.

:: Check if node_modules exists
if not exist "node_modules" (
  echo First run detected. Installing dependencies...
  call npm install
  if %errorlevel% neq 0 (
    echo Error installing dependencies. Please make sure Node.js is installed.
    pause
    exit /b 1
  )
  echo Dependencies installed successfully.
)

echo Setup complete! Now run start_app.bat to launch the application.
pause
