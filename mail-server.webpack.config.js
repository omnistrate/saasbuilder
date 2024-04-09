const path = require('path');

module.exports = {
  target: 'node', 
  entry: './mail-server.js', 
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/mail-server'),
  },
};
