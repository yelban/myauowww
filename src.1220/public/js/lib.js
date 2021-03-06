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

export async function setData(endpoint, ab) {
  console.log('setData(endpoint, ab)', endpoint);
  try {
    const result = await fetchData(endpoint);
    console.log(endpoint, result);
    ab.setProperty(endpoint, result);
    localStorage.setItem(`ab_${endpoint}`, JSON.stringify(result));
    localStorage.setItem(`ab_${endpoint}_ts`, parseInt(Date.now() / 1000, 10));
    // l.fetchData('links').then((data) => { ab.links = data; });
  } catch (error) {
    console.log('error', error);
  }
}

export function renderSwiper(count) {
  console.log('renderSwiper(count)', count);

  // if (!ab.links) {
  //   if (ab.retry > 1) {
  //     return;
  //   }

  //   setTimeout(() => {
  //     ab.addRetry();
  //     renderSwiper(ab);
  //   }, 1000);
  // }

  // until the Swiper is ready
  if (typeof Swiper === 'undefined') {
    setTimeout(() => {
      renderSwiper(count);
    }, 100);

    return;
  }

  const swiper = new Swiper('.swiper-container', {
    slidesPerView: count,
    //   spaceBetween: 30,
    keyboard: {
      enabled: true,
    },
    mousewheel: {
      // invert: true,
    },
    // longSwipes: false,
    // longSwipesMs: 500,
    // longSwipesRatio: 0.1,
    // shortSwipes: false,
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
      950: {
        slidesPerView: 7,
        // spaceBetween: 40
      },
      1100: {
        slidesPerView: 8,
        // spaceBetween: 40
      },
      1250: {
        slidesPerView: 9,
        // spaceBetween: 40
      },
      1400: {
        slidesPerView: 10,
        // spaceBetween: 40
      },
      1550: {
        slidesPerView: 11,
        // spaceBetween: 40
      },
      1700: {
        slidesPerView: 12,
        // spaceBetween: 40
      },
      1850: {
        slidesPerView: 13,
        // spaceBetween: 40
      },
      2000: {
        slidesPerView: 14,
        // spaceBetween: 40
      },
      2150: {
        slidesPerView: 15,
        // spaceBetween: 40
      },
      2300: {
        slidesPerView: 16,
        // spaceBetween: 40
      },
    },
  });

  const swiperEl = document.querySelector('.swiper-container');
  swiperEl.style.visibility = 'visible';
}

export function getPosition(el) {
  var x = 0;
  var y = 0;
  var d = el;
  while (d) {
    x += d.offsetLeft - d.scrollLeft + d.clientLeft;
    y += d.offsetTop - d.scrollLeft + d.clientTop;
    d = d.offsetParent;
  }

  return { x, y };
}

export function placeDiv(el, xPos, yPos) {
  var d = el;
  d.style.position = 'absolute';
  d.style.left = `${xPos}px`;
  d.style.top = `${yPos}px`;
}
