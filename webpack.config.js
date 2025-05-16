const path = require('path');

module.exports = {
  // Configuración básica de webpack
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  // Configuración específica para el servidor de desarrollo
  devServer: {
    // Usar WebSocket en localhost en lugar de www.educstation.com
    webSocketServer: 'ws',
    host: 'localhost',
    // Configuración para evitar que intente conectarse a educstation.com
    client: {
      webSocketURL: {
        hostname: 'localhost',
        pathname: '/ws',
        port: 3000,
        protocol: 'ws',
      },
    },
    // Otras configuraciones útiles
    hot: true,
    historyApiFallback: true,
    port: 3000,
    open: true,
  },
  // Resto de la configuración de webpack
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}; 