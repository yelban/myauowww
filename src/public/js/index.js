import * as l from './lib';
import '../css/index.scss';

console.log('index.js');
const ab = {
  retry: 0,
  links: null,
  profile: null,
  dropDown: [],

  addRetry() {
    this.retry += 1;
  },

  setProfile(data) {
    this.profile = data;
  },

  setLinks(data) {
    this.links = data;
  },
};

async function buildLinks() {
  console.log('buildLinks()');

  const links = ab.links[0];
  if (!links) {
    return;
  }

  const abScroll = document.getElementById('abScroll');
  if (abScroll) {
    abScroll.remove();
  }

  let slideContent = '';
  links.forEach((link, index) => {
    // console.log(link, index);
    const hotLinkClass = (index) ? '' : 'hotlink';
    slideContent += `<div class="swiper-slide ${hotLinkClass}" data-id="${index}">
    ${link.link.link_title}
    </div>`;

    ab.dropDown[index] = [];
    if (link.below.length > 1) {
      link.below.forEach((sub, key) => {
        ab.dropDown[index].push(sub.link);
      });
    }
  });

  console.log('ab.dropDown', ab.dropDown);

  const slideEl = document.createElement('div');
  slideEl.id = 'abScroll';
  // 沃草！IE 11 不支援
  // slideEl.classList.add('swiper', 'swiper-container');
  slideEl.classList.add('swiper');
  slideEl.classList.add('swiper-container');

  slideEl.style.cssText = 'visibility: hidden';
  slideEl.innerHTML = `<div class="swiper-wrapper">
  ${slideContent}
  </div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>`;

  document.body.insertBefore(slideEl, document.body.childNodes[0]);
  // document.body.prepend(slideEl);
  console.log('slideEl', slideEl);

  const dropdownEl = document.createElement('div');
  dropdownEl.id = 'ab-dropdown';
  dropdownEl.classList.add('ab-dropdown');
  // dropdownEl.classList.add('dropdown-6');
  dropdownEl.style.cssText = 'visibility: hidden';
  // dropdownEl.innerHTML = '';

  slideEl.parentNode.insertBefore(dropdownEl, slideEl.nextSibling);

  document.querySelector('.swiper-wrapper').addEventListener('click', (event) => {
    if (event.target.classList.contains('swiper-slide')) {
      const { id } = event.target.dataset;
      const url = ab.links[0][id].below[0].link.link_path;
      if (url) {
        window.location.href = url;
      }
    }
  });

  document.querySelector('.swiper').addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('swiper-slide')) {
      const abDropdown = document.getElementById('ab-dropdown');
      abDropdown.style.visibility = 'hidden';
      abDropdown.classList.remove('dropdown-6');
      const { id } = event.target.dataset;
      console.log('ab.dropDown[id]', ab.dropDown[id]);

      let innerHTML = '';

      ab.dropDown[id].forEach((v, k) => {
        innerHTML += `<div>
        <a href="${v.link_path}">${v.link_title}</a>
        </div>`;
      });

      // ab.dropDown[id].forEach((v, k) => {
      //   innerHTML += `<li>
      //   <a href="${v.link_path}">${v.link_title}</a>
      //   </li>`;
      // });

      // innerHTML = `<ul class="dropdown-menu dropdown-menu-animated dropdown-6">
      // ${innerHTML}
      // </ul>`;
      console.log('innerHTML', innerHTML);

      const x = event.target.getBoundingClientRect().left;
      const y = event.target.getBoundingClientRect().top;
      console.log('event.target', x, y);

      // const abDropdown = document.getElementById('ab-dropdown');
      abDropdown.innerHTML = innerHTML;
      l.placeDiv(abDropdown, (x - 5), (y + 50));
      abDropdown.style.visibility = 'visible';
      abDropdown.classList.add('dropdown-6');
    }
  });

  document.getElementById('ab-dropdown').addEventListener('mouseleave', (event) => {
    console.log('mouseleave');
    const el = event.target;
    el.style.visibility = 'hidden';
    el.classList.remove('dropdown-6');
  });

  // document.querySelector('.swiper').addEventListener('mouseout', (event) => {
  //   if (event.target.classList.contains('swiper-slide')) {
  //     const abDropdown = document.getElementById('ab-dropdown');
  //     abDropdown.style.visibility = 'hidden';
  //   }
  // });

  l.renderSwiper(links.length);
}

async function crossLoader() {
  console.log('crossLoader()');

  // // development
  // import('./popular');
  // await buildLinks();

  // production
  if (window.document.documentMode) {
    l.loadJsCssUrl('css/ie.css', 'css', () => {
      l.loadJsCssUrl('css/scroll.css', 'css', () => {
        l.loadJsCssUrl('ie.js', 'js', buildLinks, document.body);
      });
    });
  } else {
    l.loadJsCssUrl('css/popular.css', 'css', () => {
      l.loadJsCssUrl('css/scroll.css', 'css', () => {
        l.loadJsCssUrl('popular.js', 'js', buildLinks, document.body);
      });
    });
  }
}

async function getData() {
  try {
    const profile = await l.fetchData('profile');
    console.log('profile', profile);
    ab.setProfile(profile);
    // await l.fetchData('profile').then((data) => { ab.profile = data; });
  } catch (error) {
    console.log('error', error);
  }

  try {
    const links = await l.fetchData('links');
    console.log('links', links);
    ab.setLinks(links);
    // l.fetchData('links').then((data) => { ab.links = data; });
  } catch (error) {
    console.log('error', error);
  }

  console.log('ab', ab);

  await crossLoader();
  // await buildLinks();
}

getData(ab);

window.addEventListener('DOMContentLoaded', () => {
  console.log('ready');
});

window.addEventListener('load', (event) => {
  console.log('load');
});

// const promise1 = new Promise((resolve, reject) => {
//   setTimeout(() => resolve('done'), 1000);
// });

// promise1.then(
//   (result) => console.log(`Fulfilled: ${result}`),
//   (error) => console.log(`Rejected: ${error}`),
// );
