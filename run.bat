@echo off
ECHO Select an option:
ECHO 1. Install backend and frontend (For Frist time)
ECHO 2. Run npm run dev (Run the site)

:CHOICE
SET /P choice="Enter choice (1 or 2): "
IF "%choice%"=="1" GOTO BUILD
IF "%choice%"=="2" GOTO DEV
ECHO Invalid choice, please enter 1 or 2.
GOTO CHOICE

:BUILD
echo Starting full Install process...
cd backend
CALL npm install
CALL npm audit fix
cd ..
cd frontend
CALL npm install
CALL npmx audit fix
cd ..
echo Full isntall complete.
goto DEV

:DEV
echo Starting development server...
CALL npm run dev
GOTO END

:END
echo Operation finished.