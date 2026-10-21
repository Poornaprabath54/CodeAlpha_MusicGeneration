@echo off
setlocal
cd /d "%~dp0"
set "NODE_DIR=%ProgramFiles%\nodejs"
if exist "%NODE_DIR%\node.exe" set "PATH=%NODE_DIR%;%PATH%"
if not exist "%NODE_DIR%\npm.cmd" (
  echo Could not find npm at "%NODE_DIR%\npm.cmd".
  echo Install Node.js 20 or later from https://nodejs.org/ and reopen this folder.
  pause
  exit /b 1
)
if not exist "node_modules\express" (
  echo Installing SONORA dependencies. This needs an internet connection...
  call "%NODE_DIR%\npm.cmd" install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
if not exist ".env" (
  copy ".env.example" ".env" >nul
  echo.
  echo A local .env file was created. Add your MiniMax key there; never share it.
  start "SONORA environment file" notepad.exe "%~dp0.env"
  echo Save and close Notepad, then double-click START-SONORA.bat again.
  pause
  exit /b 0
)
echo Starting SONORA...
call "%NODE_DIR%\npm.cmd" start
pause
