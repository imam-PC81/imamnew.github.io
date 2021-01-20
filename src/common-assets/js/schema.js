(function ($) {
  // rcrumbs-listを取得する
  setTimeout(function () {
    // 個札のinternatonalかどうかを判定
    // 条件は「/〇/jp/の後ろにinternationalが付くもの」と「/be/か/be1/の後ろにintが付くもの」のどちらか
    // eslint-disable-next-line max-len
    var isKosatsuInternational = /^\/(.*?)\/jp\/.*?international.*?$|^.*?\/(be1|be)\/.*?int.*?$/.test(
      location.pathname
    );

    // パンくずを取得
    var $rcrumbs = $('.rcrumbs-list');
    var $list_link = $('.rcrumbs-list a');

    // HOMEのURL数が複数あるかどうか
    var isHomeUrlMoreThanOne = $('.rcrumbs-list li:first-child a').length > 1;

    // 取得したテキストとURLを配列に入れる
    var _SchemeText = [];
    var _SchemeUrl = [];
    var s = 0;
    for (var i = 0; i < $list_link.length; i++) {
      // もし個札internatonalでHOMEのURL数が複数なら以下実行
      if (isKosatsuInternational && isHomeUrlMoreThanOne) {
        if (i === 0) continue; // パンくずの1つ目は国内HOMEなので無視

        // もし個札internatonalでなくHOMEのURL数が複数なら以下実行
      } else if (!isKosatsuInternational && isHomeUrlMoreThanOne) {
        if (i === 1) continue; // パンくずの2つ目は国際HOMEなので無視
      }
      s++;
      _SchemeText.push($list_link.eq(i).text());
      _SchemeUrl.push($list_link.eq(i).attr('href'));
    }
    var _list_len = s;

    var key;
    var _DataUrl = {};
    for (key in _SchemeUrl) {
      _DataUrl[key] = _SchemeUrl[key];
    }

    var _DateText = {};
    for (key in _SchemeText) {
      _DateText[key] = _SchemeText[key];
    }

    // jsold生成

    var _script = document.createElement('script');
    _script.setAttribute('type', 'application/ld+json');

    if (_list_len == 3) {
      _script.innerText =
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"itemListElement": [' +
        '{' +
        '"@type": "ListItem",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[0] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[0] +
        '"' +
        '  }' +
        '},' +
        '{' +
        '"@type": "ListItem",' +
        '"position": 2,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[1] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[1] +
        '"' +
        '}' +
        '}, {' +
        '"@type": "ListItem",' +
        '"position": 3,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[2] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[2] +
        '"' +
        '}' +
        '}' +
        ']' +
        '}';
    }
    if (_list_len == 2) {
      _script.innerText =
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"itemListElement": [' +
        '{' +
        '"@type": "ListItem",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[0] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[0] +
        '"' +
        '  }' +
        '},' +
        '{' +
        '"@type": "ListItem",' +
        '"position": 2,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[1] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[1] +
        '"' +
        '}' +
        '}' +
        ']' +
        '}';
    }
    if (_list_len == 1) {
      _script.innerText =
        '{' +
        '"@context": "http://schema.org",' +
        '"@type": "BreadcrumbList",' +
        '"itemListElement": [' +
        '{' +
        '"@type": "ListItem",' +
        '"position": 1,' +
        '"item": {' +
        '"@id": "https://ana.co.jp' +
        _DataUrl[0] +
        '"' +
        ',' +
        '"name":' +
        '"' +
        _DateText[0] +
        '"' +
        '  }' +
        '}' +
        ']' +
        '}';
    }
    $rcrumbs.parent().append(_script);
  }, 1000);
  // eslint-disable-next-line no-undef
})(jQuery);
