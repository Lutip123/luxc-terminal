@echo off
title Luxc - Arch Linux Hacker Web Terminal
cls
echo ====================================================
echo Starting Luxc Web Terminal...
echo ====================================================
cd /d "%~dp0"
node server.js
pause
