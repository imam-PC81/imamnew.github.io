// Parachute edit JS

import carousel01 from './carousel-01';

const ready = () => {
  document.removeEventListener('DOMContentLoaded', ready);
  // ---
  carousel01.init();
};
const load = () => {
  window.removeEventListener('load', load);
};

console.log('main', new Date().toLocaleString());
document.addEventListener('DOMContentLoaded', ready, false);
window.addEventListener('load', load, false);
