import 'whatwg-fetch';

import db from '../../../db.json';

export function isDevServer() {
  const url = new URL(window.location.href);
  const env = url.searchParams.get('env');
  return env === 'dev';
}

let urlUserData = 'http://localhost:3000';

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

export async function fetchData(endpoint) {
  const isDev = isDevServer();
  if (isDev) {
    urlUserData = 'https://jsonplaceholder.typicode.com/todos/1';
  } else {
    urlUserData = 'https://jsonplaceholder.typicode.com/todos/1';
    // urlUserData += `/${endpoint}`;
  }

  const response = await fetch(urlUserData);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const json = await response.json();
  console.log('json', json);

  if (isDev) {
    return db[endpoint];
  }
  return db[endpoint];
  // return json;
}

export function renderSwiper() {
  console.log('renderSwiper()');

  // if (!ab.links) {
  //   if (ab.retry > 1) {
  //     return;
  //   }

  //   setTimeout(() => {
  //     ab.addRetry();
  //     renderSwiper(ab);
  //   }, 1000);
  // }

  const swiper = new Swiper('.swiper-container', {
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
    // Navigation arrows
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
}
