/* eslint-disable max-len */
import 'whatwg-fetch';

// eslint-disable-next-line import/no-unresolved
// import chalk from 'chalk';

// console.log(chalk.blueBright('lib.js'));

window.isSlideChangeTransitioning = null;

window.isDropdownVisible = null;
window.isPopupVisible = null;

export function isDevServer() {
  const url = new URL(window.location.href);
  const env = url.searchParams.get('env');
  return env === 'dev';
}

export function loadJsCss(url, type, callback, location) {
  console.log('loadJsCss', url);
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

export async function fetchJSON(url) {
  console.log('fetchJSON(url)', url);

  const response = await fetch(url);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const json = await response.json();
  console.log('json', json);

  return json;
}

function getSwiperButtonEdge() {
  // exclude when swiperButton is disabled
  const swiperButtonPrev = document.querySelector('.swiper-button-prev');
  const swiperButtonPrevX = swiperButtonPrev.getBoundingClientRect().right;
  const swiperButtonNext = document.querySelector('.swiper-button-next');
  const swiperButtonNextX = swiperButtonNext.getBoundingClientRect().left;

  return { prev: swiperButtonPrevX, next: swiperButtonNextX };
}

function placeDiv(el, xPos, yPos) {
  var d = el;
  d.style.position = 'absolute';
  d.style.left = `${xPos}px`;
  d.style.top = `${yPos}px`;
}

function activeSwiperDropdown(links) {
  console.log('activeSwiperDropdown()', links);

  function showDropdown(el) {
    console.log('showDropdown(el)');
    if (window.isSlideChangeTransitioning) {
      setTimeout(() => {
        showDropdown(el);
      }, 100);

      return;
    }

    const { id } = el.dataset;
    console.log('id', id);

    let innerHTML = '';

    links[id].forEach((value) => {
      innerHTML += `<div>
        <a href="${value.link_path}">${value.link_title}</a>
        </div>`;
    });
    console.log('innerHTML', innerHTML);

    const abDropdown = document.getElementById('ab-dropdown');

    abDropdown.innerHTML = innerHTML;

    let x = el.getBoundingClientRect().left;
    x = (x < 0) ? 0 : x;
    const y = el.getBoundingClientRect().top;
    console.log('el', x, y);
    placeDiv(abDropdown, x, (y + 50));

    //   abDropdown.style.visibility = 'visible';
    abDropdown.classList.remove('ab-dropdown-hidden');
    abDropdown.classList.remove('dropdown-6-hide');
    abDropdown.classList.add('ab-dropdown-visible');
    abDropdown.classList.add('dropdown-6');
    window.isDropdownVisible = true;
  }

  function hideDropdown() {
    const el = document.getElementById('ab-dropdown');
    el.classList.remove('ab-dropdown-visible');
    el.classList.remove('dropdown-6');
    el.classList.add('dropdown-6-hide');
    // el.classList.add('ab-dropdown-hidden');

    window.isDropdownVisible = false;
  }

  const abDropdown = document.getElementById('ab-dropdown');

  abDropdown.addEventListener('mouseleave', (event) => {
    console.log('#ab-dropdown, mouseleave', event.target);

    hideDropdown();
  });

  abDropdown.addEventListener('mouseover', (event) => {
    console.log('#ab-dropdown, mouseover', event.target);
  });

  document.querySelector('.swiper-wrapper').addEventListener('click', (event) => {
    console.log('.swiper-wrapper, click', event.target);
  });

  document.querySelector('.swiper').addEventListener('mouseover', (event) => {
    console.log('.swiper, mouseover', event.target);

    if (event.target.classList.contains('swiper-button-next')) {
      hideDropdown();

      return;
    }

    if (event.target.classList.contains('swiper-button-prev')) {
      hideDropdown();
    }
  });

  document.querySelector('.swiper').addEventListener('mouseleave', (event) => {
    console.log('.swiper, mouseleave', event.target);
  });

  const slides = document.getElementsByClassName('swiper-slide');
  console.log('slides', slides);

  Array.from(slides).forEach((slide) => {
    // console.log('slide', slide);
    slide.addEventListener('mouseleave', (event) => {
      console.log('.swiper-slide, mouseleave', event.target);
    });

    slide.addEventListener('mouseover', (event) => {
      console.log('swiper-slide, mouseover', event.target);

      hideDropdown();

      showDropdown(event.target);

      // const { id } = event.target.dataset;
      // console.log('id', id);

      // let innerHTML = '';

      // links[id].forEach((value) => {
      //   innerHTML += `<div>
      //   <a href="${value.link_path}">${value.link_title}</a>
      //   </div>`;
      // });
      // console.log('innerHTML', innerHTML);

      // abDropdown.innerHTML = innerHTML;

      // let x = event.target.getBoundingClientRect().left;
      // x = (x < 0) ? 0 : x;
      // const y = event.target.getBoundingClientRect().top;
      // console.log('event.target', x, y);
      // placeDiv(abDropdown, x, (y + 50));

      // //   abDropdown.style.visibility = 'visible';
      // abDropdown.classList.remove('ab-dropdown-hidden');
      // abDropdown.classList.add('ab-dropdown-visible');
      // abDropdown.classList.add('dropdown-6');
      // window.isDropdownVisible = true;
    });
  });
}

function renderSwiper(count) {
  console.log('renderSwiper(count)', count);

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

  swiper.on('slideChangeTransitionStart', () => {
    console.log('slide Change Transition Start');

    window.isSlideChangeTransitioning = true;
  });

  swiper.on('slideChangeTransitionEnd', () => {
    console.log('slide Change Transition End');

    window.isSlideChangeTransitioning = false;
  });

  const swiperEl = document.querySelector('.swiper-container');
  swiperEl.style.visibility = 'visible';
}

export async function buildLinks(ob) {
  console.log('buildLinks(ab)', ob);

  if (!ob.link && (ob.retry < 6)) {
    // eslint-disable-next-line no-param-reassign
    ob.retry += 1;
    // console.log(100 * ob.retry * ob.retry);
    setTimeout(() => {
      buildLinks(ob);
    }, 100 * ob.retry * ob.retry);
  }

  const { link } = ob;
  console.log('link', link);

  let slideContent = '';
  const dropDown = [];

  link.forEach((value, index) => {
    // console.log(value, index);
    const hotLinkClass = (index) ? '' : 'hotlink';

    // const el = Object.values(value)[0];
    // console.log('el', el);

    slideContent += `<div class="swiper-slide ${hotLinkClass}" data-id="${index}">
    ${value.link.link_title}
    </div>`;

    dropDown[index] = [];

    // console.log('value.below', value.below);

    value.below.forEach((val) => {
      // console.log('val.link', val.link);
      dropDown[index].push(val.link);
    });
  });
  // console.log('slideContent', slideContent);
  // console.log('dropDown', dropDown);

  const abScroll = document.getElementById('abScroll');
  if (abScroll) {
    abScroll.remove();
  }

  const slideEl = document.createElement('div');
  slideEl.id = 'abScroll';

  // 沃草！IE 11 不支援
  // slideEl.classList.add('swiper', 'swiper-container');
  slideEl.classList.add('swiper');
  slideEl.classList.add('swiper-container');

  // slideEl.style.cssText = 'visibility: hidden';

  slideEl.innerHTML = `<div class="swiper-wrapper">
  ${slideContent}
  </div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>`;

  // 沃草！IE 11 不支援
  // document.body.prepend(slideEl);
  document.body.insertBefore(slideEl, document.body.childNodes[0]);
  // console.log('slideEl', slideEl);

  const dropdownEl = document.createElement('div');
  dropdownEl.id = 'ab-dropdown';
  dropdownEl.classList.add('ab-dropdown');

  // dropdownEl.style.cssText = 'visibility: hidden';
  dropdownEl.classList.add('ab-dropdown-hidden');

  slideEl.parentNode.insertBefore(dropdownEl, slideEl.nextSibling);

  renderSwiper(link.length);

  activeSwiperDropdown(dropDown);
}

export function loadScroll(ob) {
  console.log('loadScroll(ob)');

  if (window.document.documentMode) {
    loadJsCss('auowidget/ie.css', 'css', () => {
      loadJsCss('auowidget/scroll.css', 'css', () => {
        loadJsCss('auowidget/ie.js', 'js', buildLinks(ob), document.body);
      });
    });
  } else {
    loadJsCss('auowidget/popular.css', 'css', () => {
      loadJsCss('auowidget/scroll.css', 'css', () => {
        loadJsCss('auowidget/popular.js', 'js', buildLinks(ob), document.body);
      });
    });
  }
}

export function renderTodo(ob) {
  console.log('renderTodo(ob)', ob);

  function hidePopup() {
    console.log('hidePopup()');

    const abTodoPopup = document.getElementById('ab-todo-popup');

    abTodoPopup.classList.remove('ab-visible');
    abTodoPopup.classList.remove('popup-6');
    abTodoPopup.classList.add('popup-6-hide');
    // abTodoPopup.classList.add('ab-hidden');
    window.isPopupVisible = false;
  }

  let abTodoPopup = document.getElementById('ab-todo-popup');

  if (!abTodoPopup) {
    abTodoPopup = document.createElement('div');
    abTodoPopup.id = 'ab-todo-popup';
    abTodoPopup.classList.add('ab-todo-popup');
    document.body.appendChild(abTodoPopup);
    // event.target.appendChild(abTodoPopup);

    abTodoPopup.addEventListener('mouseleave', (e) => {
      console.log('#ab-todo-popup, mouseleave', e.target);
      hidePopup();
    });
  }

  let popupContent = '';

  let count = 0;
  ob.todo.todo.forEach((todo) => {
    count += todo.num;
    popupContent += `<a href="${todo.link}">
      <li>${todo.system}
        <div class="ab-popup-badge">
          <div class="ab-badge-wrap">
            <span class="ab-badge">${todo.num}</span>
          </div>
        </div>
      </li>
    </a>`;
  });

  // * development only
  // *
  popupContent += '<a href=""><li>ESH <div class="ab-popup-badge"><div class="ab-badge-wrap"><span class="ab-badge">25</span></div></div></li></li></a>';
  popupContent += '<a href=""><li>Windows <div class="ab-popup-badge"><div class="ab-badge-wrap"><span class="ab-badge">950</span></div></div></li></a>';

  abTodoPopup.innerHTML = `<div>
    <ul class="ab-todo-popup-ul">
      ${popupContent}
    </ul>
  </div>`;

  let abTodoBadge = document.getElementById('ab-todo-badge');
  if (!abTodoBadge) {
    abTodoBadge = document.createElement('div');
    abTodoBadge.id = 'ab-todo-badge';
    abTodoBadge.classList.add('ab-todo-badge');
    const abTodo = document.getElementById('ab-todo-a');
    abTodo.appendChild(abTodoBadge);
    // document.body.appendChild(abTodoBadge);
  }

  const todoBadgeContent = `<div class="ab-badge-wrap">
    <span class="ab-badge">
      ${count}
    </span>
  </div>`;

  abTodoBadge.innerHTML = todoBadgeContent;
  abTodoBadge.style.display = 'inline-block';

  // const abTodoIcon = document.getElementById('ab-todo-icon');
  // const x1 = abTodoIcon.getBoundingClientRect().left;
  // console.log('x1', x1);
  // const y1 = abTodoIcon.getBoundingClientRect().top;
  // console.log('y1', y1);

  // placeDiv(abTodoBadge, x1, y1);

  const labelTodo = document.getElementById('ab-todo-a');

  labelTodo.addEventListener('mouseenter', (event) => {
    console.log('#ab-todo-a, mouseenter', event.target);

    const x = labelTodo.getBoundingClientRect().left;
    console.log('x', x);
    const y = labelTodo.getBoundingClientRect().top;
    console.log('y', y);
    const h = labelTodo.offsetHeight;
    console.log('h', h);

    placeDiv(abTodoPopup, x, y + h);
    abTodoPopup.style.display = 'block';
    abTodoPopup.classList.remove('ab-hidden');
    abTodoPopup.classList.remove('popup-6-hide');
    abTodoPopup.classList.add('popup-6');
    abTodoPopup.classList.add('ab-visible');
    window.isPopupVisible = true;
  });

  labelTodo.addEventListener('mouseout', (event) => {
    console.log('#ab-todo-a, mouseout', event.target);

    const y = labelTodo.getBoundingClientRect().top;
    console.log('y', y);
    const h = labelTodo.offsetHeight;
    console.log('h', h);

    console.log('event.clientY', event.clientY);

    if (event.clientY < (y + h - 1)) {
      hidePopup();
    }
  });
}

export function alert(text) {
  const el = document.createElement('div');
  el.classList.add('modal-wrapper');
  el.dataset.modal = 'wrapper';
  el.innerHTML = `<div class="modal-content">
    <div class="relative">
      <div class="text">
        ${text}
      </div>
    </div>
  </div>`;
  document.body.appendChild(el);

  const wrapEl = document.querySelector('[data-modal="wrapper"]');
  wrapEl.classList.add('modal-opened');
  el.addEventListener('click', (event) => {
    console.log(event);
    if (event.target.className.indexOf('modal-opened') > -1) {
      wrapEl.classList.remove('modal-opened');
    }
  });

  setTimeout(() => {
    wrapEl.classList.remove('modal-opened');
  }, 2500);
}
