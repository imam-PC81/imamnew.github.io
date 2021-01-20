(function () {
  const $body = document.body;
  const $header = document.getElementById('header-content');
  const $hamburger = document.querySelector('.sp-menu');
  const $chat = document.querySelector('.header-chat');

  $hamburger.addEventListener('click', function () {
    $header.classList.toggle('open');
    if ($header.classList.contains('open')) {
      $body.style.overflowY = 'hidden';
      $chat.style.zIndex = 1;
    } else {
      setTimeout(function () {
        $body.style.overflowY = '';
        $chat.style.zIndex = -1;
      }, 500);
    }
  });

  let $lastScrollTop = 0;
  window.addEventListener(
    'scroll',
    function () {
      let $st = window.pageYOffset || document.documentElement.scrollTop;

      if ($st > $lastScrollTop) {
        $header.classList.remove('scroll-up');
        $header.classList.add('scroll-down');
      } else {
        $header.classList.remove('scroll-down');
        $header.classList.add('scroll-up');
      }

      $lastScrollTop = $st <= 0 ? 0 : $st;
    },
    false
  );

  // グローバルメニュー マウスオーバー
  var parent = document.querySelectorAll('.sub-nav');
  var node = Array.prototype.slice.call(parent, 0);

  node.forEach(function (element) {
    element.addEventListener(
      'mouseover',
      function () {
        element.querySelector('.sub-nav-list').classList.add('active');
      },
      false
    );
    element.addEventListener(
      'mouseout',
      function () {
        element.querySelector('.sub-nav-list').classList.remove('active');
      },
      false
    );
  });
})();
require('../../../src-babels/ploom/main');
