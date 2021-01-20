const autoprefixer = require('autoprefixer');
const settings = require('./scripts/settings');

module.exports = {
  plugins: [
    require('postcss-import'),
    
    require('postcss-flexbugs-fixes'),
    autoprefixer(settings.autoprefixer),
  ]
}
