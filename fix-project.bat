@echo off
echo Corrigiendo incompatibilidades de proyecto EducStation...

rem Eliminando módulos y caché
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force

rem Instalando dependencias específicas compatibles
echo Instalando dependencias compatibles...
npm install react@17.0.2 react-dom@17.0.2 --save-exact
npm install react-router-dom@6.3.0 --save-exact
npm install webpack@5.75.0 webpack-dev-server@4.9.3 --save-dev --save-exact
npm install react-scripts@5.0.1 --save-dev --save-exact

rem Instalando resto de dependencias con las versiones exactas especificadas en package.json
npm install --no-save

echo Corrección completada. Intenta ejecutar npm start ahora.