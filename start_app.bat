@echo off
echo Starting Local Book Management Application...
echo.
echo If browser doesn't open automatically, go to http://localhost:3501
echo.
echo Press Ctrl+C to stop the application when finished.
echo.

:: Force the window to stay open
cmd /k "npm run dev"
