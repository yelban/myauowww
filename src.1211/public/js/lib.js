import 'whatwg-fetch';

import db from '../../../db.json';

export function loadJsCssUrl(url, type, callback, location) {
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

// export function ajaxJSON(url, callback, data, xhr) {
//   try {
//     var http = xhr || new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
//     http.open(data ? 'POST' : 'GET', url, 1);
//     http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//     // http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//     http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
//     http.onreadystatechange = function () {
//       http.readyState > 3 && callback && callback(JSON.parse(http.responseText), http);
//     };
//     http.send(JSON.stringify(data));
//   } catch (e) {
//     window.console && console.log(e);
//   }
// }

// export function getData(ob) {
//   ajaxJSON('http://localhost:3000/profile', (data) => {
//     console.log('profile', data);
//     ob.setProfile(data);
//   });

//   ajaxJSON('http://localhost:3000/links', (data) => {
//     console.log('links', data);
//     ob.setLinks(data);
//   });
// }

export function isDevServer() {
  const url = new URL(window.location.href);
  const env = url.searchParams.get('env');
  return env === 'dev';
}

export async function fetchData(endpoint) {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const json = await response.json();
  console.log('json', json);

  return db[endpoint];

//   const response = await fetch(`http://localhost:3000/${endpoint}`);
//   // const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//   console.log(response);
//   const json = await response.json();
//   return json;
}

export function renderSwiper(ab) {
  console.log('renderSwiper(ab)');

  if (!ab.links) {
    if (ab.retry > 1) {
      return;
    }

    setTimeout(() => {
      ab.addRetry();
      renderSwiper(ab);
    }, 1000);

    return;
  }

  console.log('123');

  // const swiper = new Swiper('.swiper-container', {
  //   // Navigation arrows
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  // });

  //   var swiper = new Swiper('.swiper-container', {
  //     slidesPerView: 10,
  //     //   spaceBetween: 30,
  //     keyboard: {
  //       enabled: true,
  //     },
  //     mousewheel: {
  //       // invert: true,
  //     },
  //     // simulateTouch: false,
  //     // shortSwipes: false,
  //     //   pagination: {
  //     //     el: '.swiper-pagination',
  //     //     clickable: true,
  //     //   },
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //     breakpoints: {
  //       // when window width is <= 300px
  //       300: {
  //         slidesPerView: 1,
  //         // spaceBetween: 20
  //       },
  //       // when window width is <= 390px
  //       390: {
  //         slidesPerView: 3,
  //         // spaceBetween: 20
  //       },
  //       // when window width is <= 500px
  //       500: {
  //         slidesPerView: 4,
  //         // spaceBetween: 20
  //       },
  //       // when window width is <= 650px
  //       650: {
  //         slidesPerView: 5,
  //         // spaceBetween: 40
  //       },
  //       // when window width is >= 800px
  //       800: {
  //         slidesPerView: 6,
  //         // spaceBetween: 40
  //       },
  //       1000: {
  //         slidesPerView: 7,
  //         // spaceBetween: 40
  //       },
  //       1200: {
  //         slidesPerView: 9,
  //         // spaceBetween: 40
  //       },
  //     },
  //   });

  //   const swiperEl = document.querySelector('.swiper-container');
  //   swiperEl.style.visibility = 'visible';
}
