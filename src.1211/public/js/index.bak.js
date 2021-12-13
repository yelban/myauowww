import '../css/index.scss';

console.log('index.js');

const ab = {
  retry: 0,
  links: null,
};

function loadJsCssUrl(url, type, callback, location) {
  console.log('loadJsCssUrl', url);
  var el;
  if (type === 'js') { // if filename is a external JavaScript file
    el = document.createElement('script');
    el.setAttribute('type', 'text/javascript');
    el.setAttribute('src', url);
  } else if (type === 'css') { // if filename is an external CSS file
    el = document.createElement('link');
    el.setAttribute('rel', 'stylesheet');
    el.setAttribute('type', 'text/css');
    el.setAttribute('href', url);
  }

  if (typeof el !== 'undefined') {
    el.onload = callback;
    el.onreadystatechange = callback;
    if (location) {
      location.appendChild(el);
    } else {
      document.getElementsByTagName('head')[0].appendChild(el);
    }
  }
}

var loadJS = function (url, implementationCode, location) {
  // url is URL of external file, implementationCode is the code
  // to be called from the file, location is the location to
  // insert the <script> element

  var scriptTag = document.createElement('script');
  scriptTag.src = url;

  scriptTag.onload = implementationCode;
  // scriptTag.onreadystatechange = implementationCode;

  location.appendChild(scriptTag);
};

/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 *
 * @param string url
 * @param object callback
 * @param mixed data
 * @param null xhr
 */
function ajaxJSON(url, callback, data, xhr) {
  try {
    var http = xhr || new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    http.open(data ? 'POST' : 'GET', url, 1);
    http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    http.onreadystatechange = function () {
      http.readyState > 3 && callback && callback(JSON.parse(http.responseText), http);
    };
    http.send(JSON.stringify(data));
  } catch (e) {
    window.console && console.log(e);
  }
}

function getData() {
  ajaxJSON('http://localhost:3000/profile', (data) => {
    console.log('profile', data);
  });

  ajaxJSON('http://localhost:3000/links', (data) => {
    console.log('links', data);
  });
}

function renderSwiper() {
  // const swiper = new Swiper('.swiper-container', {
  //   // Navigation arrows
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  // });

  if (!ab.links) {
    if (ab.retry > 3) {
      return;
    }
    setTimeout(() => {
      ab.retry += 1;
      renderSwiper();
    }, 1000);
  }

  var swiper = new Swiper('.swiper-container', {
    slidesPerView: 10,
    //   spaceBetween: 30,
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      // invert: true,
    },
    // simulateTouch: false,
    // shortSwipes: false,
    //   pagination: {
    //     el: '.swiper-pagination',
    //     clickable: true,
    //   },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      // when window width is <= 300px
      300: {
        slidesPerView: 1,
        // spaceBetween: 20
      },
      // when window width is <= 390px
      390: {
        slidesPerView: 3,
        // spaceBetween: 20
      },
      // when window width is <= 500px
      500: {
        slidesPerView: 4,
        // spaceBetween: 20
      },
      // when window width is <= 650px
      650: {
        slidesPerView: 5,
        // spaceBetween: 40
      },
      // when window width is >= 800px
      800: {
        slidesPerView: 6,
        // spaceBetween: 40
      },
      1000: {
        slidesPerView: 7,
        // spaceBetween: 40
      },
      1200: {
        slidesPerView: 9,
        // spaceBetween: 40
      },
    },
  });

  const swiperEl = document.querySelector('.swiper-container');
  swiperEl.style.visibility = 'visible';

  // var swiperWrapper = document.querySelector('.swiper-wrapper');
  // swiperWrapper.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('ready');

  // renderSwiper();
  const swiperEl = document.querySelector('.swiper-container');
  swiperEl.style.visibility = 'hidden';

  const url = new URL(window.location.href);
  var env = url.searchParams.get('env');
  console.log('env', env);

  if (env !== 'dev') {
    if (window.document.documentMode) {
      loadJsCssUrl('css/ie.css', 'css', () => {
        loadJsCssUrl('css/scroll.css', 'css', () => {
          loadJsCssUrl('ie.js', 'js', renderSwiper, document.body);
        });
      });
    } else {
      loadJsCssUrl('css/popular.css', 'css', () => {
        loadJsCssUrl('css/scroll.css', 'css', () => {
          loadJsCssUrl('popular.js', 'js', renderSwiper, document.body);
        });
      });
    }
  } else {
    setTimeout(() => {
      renderSwiper();
      // loadJsCssUrl('css/scroll.css', 'css', () => {
      //   renderSwiper();
      // });
    }, 1000);
  }
});

window.addEventListener('load', (event) => {
  console.log('load', event);

  // getData();
});
