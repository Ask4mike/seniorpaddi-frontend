@echo off
REM Double-click this file to LOOK AT the revamped SeniorPadi pages. No database needed.
REM It shows the real pages with made-up sample people and events. Nothing is saved and forms do not submit.
REM (To run the real app you need a database, see README.md.)
cd /d "%~dp0\..\..\.."

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download the LTS version from https://nodejs.org, install it, then double-click this file again.
  pause
  exit /b
)

if not exist node_modules (
  echo First time only: installing the project's packages. This can take a few minutes...
  call npm install
)

echo Starting the preview. Your browser will open in a moment.
echo Close this window to stop it.
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:4100/__pages"
node docs\ui-revamp\tools\preview-server.mjs --port 4100
pause
