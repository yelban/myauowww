import * as l from './lib';
import 'the-new-css-reset/css/reset.css';
import '../css/index.scss';

console.log('index.js');
const ab = {
  retry: 0,
  links: null,
  profile: null,
  dropDown: [],
  isTodoVisible: null,

  addRetry() {
    this.retry += 1;
  },

  setProperty(entry, data) {
    console.log('setProperty()', entry);
    this[entry] = data;
  },
  setProfile(data) {
    this.profile = data;
  },

  setLinks(data) {
    this.links = data;
  },
};

function buildLinks() {
  console.log('buildLinks()');

  // until the ab.links is ready
  if (!ab.links) {
    setTimeout(() => {
      buildLinks();
    }, 100);

    return;
  }

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
      link.below.forEach((sub) => {
        ab.dropDown[index].push(sub.link);
      });
    }
  });

  // console.log('ab.dropDown', ab.dropDown);

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
  // dropdownEl.classList.add('dropdown-6');
  dropdownEl.style.cssText = 'visibility: hidden';
  // dropdownEl.innerHTML = '';

  slideEl.parentNode.insertBefore(dropdownEl, slideEl.nextSibling);

  document.querySelector('.swiper-wrapper').addEventListener('click', (event) => {
    console.log('event.clientX', event.clientX);
    if (event.target.classList.contains('swiper-slide')) {
      // exclude when swiperButton is disabled
      const swiperButtonPrev = document.querySelector('.swiper-button-prev');
      const swiperButtonPrevX = swiperButtonPrev.getBoundingClientRect().right;
      const swiperButtonNext = document.querySelector('.swiper-button-next');
      const swiperButtonNextX = swiperButtonNext.getBoundingClientRect().left;
      console.log('swiperButtonPrevX', swiperButtonPrevX);

      if ((event.clientX <= swiperButtonPrevX) || (event.clientX >= swiperButtonNextX)) {
        return;
      }

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
      // console.log('ab.dropDown[id]', ab.dropDown[id]);

      let innerHTML = '';

      ab.dropDown[id].forEach((v) => {
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
      // console.log('innerHTML', innerHTML);

      const x = event.target.getBoundingClientRect().left;
      const y = event.target.getBoundingClientRect().top;
      // console.log('event.target', x, y);

      // const abDropdown = document.getElementById('ab-dropdown');
      abDropdown.innerHTML = innerHTML;
      l.placeDiv(abDropdown, x, (y + 50));
      abDropdown.style.visibility = 'visible';
      abDropdown.classList.add('dropdown-6');
    }
  });

  document.getElementById('ab-dropdown').addEventListener('mouseleave', (event) => {
    // console.log('mouseleave');
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

  const panelELs = document.querySelectorAll('#block-block-2 li a');

  for (let i = 0; i < panelELs.length; i += 1) {
    if (panelELs[i].textContent.indexOf('MY TO DO') > -1) {
      const todoButtonEl = panelELs[i];

      let abMyToDo = document.getElementById('ab-mytodo');

      if (!abMyToDo) {
        abMyToDo = document.createElement('div');
        abMyToDo.id = 'ab-mytodo';
        abMyToDo.classList.add('ab-popup');
        // abMyToDo.style.visibility = 'hidden';

        let entryContent = '';

        ab.profile.todo.forEach((todo) => {
          entryContent += `<li>${todo.system}
          <span class="ab-badge">${todo.num}</span>
          </li>`;
        });

        // * development only
        // entryContent += '<li>ESH</li>';
        // entryContent += '<li>Windows 11</li>';

        abMyToDo.innerHTML = `<div class="ab-popup-todo-wrap">
        <ul class="ab-popup-todo">
          ${entryContent}
          </div>
        </div>`;

        // document.body.appendChild(abMyToDo);
        todoButtonEl.appendChild(abMyToDo);
      }

      todoButtonEl.addEventListener('mouseenter', (event) => {
        console.log('mouseenter', event.target, abMyToDo);

        ab.isTodoVisible = true;
        abMyToDo.style.visibility = 'visible';
        abMyToDo.classList.add('dropdown-6');
        // abMyToDo.classList.remove('retire-wrap-6');
        const abPopupTodoWrap = document.querySelector('.ab-popup-todo-wrap');
        abPopupTodoWrap.classList.remove('retire-wrap-6');

        // abMyToDo.classList.adremove('retire-wrap-6');

        // let entryContent = '';

        // ab.profile.todo.forEach((todo) => {
        //   entryContent += `<li>${todo.system}
        //   <span class="ab-badge">${todo.num}</span>
        //   </li>`;
        // });

        // entryContent += '<li>螺螄粉</li>';
        // entryContent += '<li>酸辣粉</li>';

        // const x = panelELs[i].getBoundingClientRect().left;
        // // console.log('x', x);
        // const y = panelELs[i].getBoundingClientRect().bottom;
        // // console.log('y', y);

        // if (abMyToDo) {
        //   abMyToDo.style.cssText = 'visibility: hidden';
        // } else {
        //   // abMyToDo = document.createElement('div');
        //   // abMyToDo.id = 'ab-mytodo';
        //   // abMyToDo.classList.add('ab-popup');
        //   // abMyToDo.style.visibility = 'hidden';

        //   // // document.body.appendChild(abMyToDo);
        //   // panelELs[i].appendChild(abMyToDo);

        //   abMyToDo.addEventListener('mouseleave', (event) => {
        //     console.log('mouseleave', event);

        //     abMyToDo.classList.add('retire-wrap-6');
        //     abMyToDo.style.cssText = 'visibility: hidden';
        //     // abMyToDo.classList.remove('dropdown-6');
        //     abMyToDo.classList.remove('retire-wrap-6');

        //     // setTimeout(() => {
        //     //   abMyToDo.classList.add('retire-wrap-6');
        //     //   setTimeout(() => {
        //     //     abMyToDo.style.cssText = 'visibility: hidden';
        //     //     abMyToDo.classList.remove('dropdown-6');
        //     //     abMyToDo.classList.remove('retire-wrap-6');
        //     //   }, 500);
        //     // }, 250);
        //   });
        // }

        // abMyToDo.innerHTML = `<div class="ab-popup-todo-wrap">
        // <ul class="ab-popup-todo">
        //   ${entryContent}
        //   </div>
        // </div>`;

        // // console.log('abMyToDo.innerHTML', abMyToDo.innerHTML);

        // abMyToDo.style.visibility = 'visible';
        // abMyToDo.classList.add('dropdown-6');

        // use css instead of l.placeDiv();
        // l.placeDiv(abMyToDo, x, y);
      });

      todoButtonEl.addEventListener('mouseleave', (event) => {
        console.log('mouseleave', event.target);

        console.log('ab.isTodoVisible', ab.isTodoVisible);
        if (ab.isTodoVisible) {
          const abPopupTodoWrap = document.querySelector('.ab-popup-todo-wrap');
          abPopupTodoWrap.classList.add('retire-wrap-6');
          setTimeout(() => {
            ab.isTodoVisible = false;
            abMyToDo.style.visibility = 'hidden';
            abMyToDo.classList.remove('dropdown-6');
          }, 500);
        }
      });

      abMyToDo.addEventListener('mouseleave', (event) => {
        console.log('mouseleave', event.target);

        const abPopupTodoWrap = document.querySelector('.ab-popup-todo-wrap');
        abPopupTodoWrap.classList.add('retire-wrap-6');
        setTimeout(() => {
          ab.isTodoVisible = false;
          abMyToDo.style.visibility = 'hidden';
          abMyToDo.classList.remove('dropdown-6');
        }, 500);

        // abMyToDo.classList.add('retire-wrap-6');
        // abMyToDo.style.visibility = 'hidden';
        // abMyToDo.classList.remove('dropdown-6');
      });

      break;
    }
  }

  l.renderSwiper(links.length);
}

async function crossLoader() {
  console.log('crossLoader()');

  // // * development
  // import('./popular');
  // await buildLinks();

  // * production
  if (window.document.documentMode) {
    l.loadJsCssUrl('auowidget/ie.css', 'css', () => {
      l.loadJsCssUrl('auowidget/scroll.css', 'css', () => {
        l.loadJsCssUrl('auowidget/ie.js', 'js', buildLinks, document.body);
      });
    });
  } else {
    l.loadJsCssUrl('auowidget/popular.css', 'css', () => {
      l.loadJsCssUrl('auowidget/scroll.css', 'css', () => {
        l.loadJsCssUrl('auowidget/popular.js', 'js', buildLinks, document.body);
      });
    });
  }
}

async function getData() {
  console.log('getData()');

  const localProfile = JSON.parse(localStorage.getItem('ab_profile'));
  // console.log('localProfile', localProfile);

  const currentTS = Date.now() / 1000;

  if (localProfile) {
    ab.setProperty('profile', localProfile);
    // ab.setProfile(localProfile);

    const localProfileTS = parseInt(JSON.parse(localStorage.getItem('ab_profile_ts')), 10);
    // console.log('localProfileTS', localProfileTS);

    if (localProfileTS && ((localProfileTS + (1 * 60 * 60)) < currentTS)) {
      console.log('renew', 'profile');
      l.setData('profile', ab);
    }
  } else {
    l.setData('profile', ab);
    // try {
    //   const profile = await l.fetchData('profile');
    //   console.log('profile', profile);
    //   ab.setProfile(profile);
    //   localStorage.setItem('ab_profile', JSON.stringify(profile));
    //   // await l.fetchData('profile').then((data) => { ab.profile = data; });
    // } catch (error) {
    //   console.log('error', error);
    // }
  }

  const localLinks = JSON.parse(localStorage.getItem('ab_links'));
  // console.log('localLinks', localLinks);

  if (localLinks) {
    ab.setProperty('links', localLinks);
    // ab.setLinks(localLinks);

    const localLinksTS = parseInt(JSON.parse(localStorage.getItem('ab_links_ts')), 10);
    // console.log('localLinksTS', localLinksTS);

    if (localLinksTS && ((localLinksTS + (12 * 60 * 60)) < currentTS)) {
      console.log('renew', 'links');
      l.setData('links', ab);
    }
  } else {
    l.setData('links', ab);
    // try {
    //   const links = await l.fetchData('links');
    //   console.log('links', links);
    //   ab.setLinks(links);
    //   localStorage.setItem('ab_links', JSON.stringify(links));
    //   // l.fetchData('links').then((data) => { ab.links = data; });
    // } catch (error) {
    //   console.log('error', error);
    // }
  }

  console.log('ab', ab);

  await crossLoader();
  // await buildLinks();
}

getData();

window.addEventListener('DOMContentLoaded', () => {
  console.log('ready');

  // document.body.addEventListener('click', (event) => {
  //   console.log(event.target.parentNode.parentNode.parentNode.id);
  //   if (event.target.parentNode.parentNode.parentNode.id !== 'ab-mytodo') {
  //     const abMyToDo = event.target.parentNode.parentNode.parentNode;
  //     const abPopupTodoWrap = document.querySelector('.ab-popup-todo-wrap');
  //     abPopupTodoWrap.classList.add('retire-wrap-6');
  //     setTimeout(() => {
  //       abMyToDo.style.visibility = 'hidden';
  //       abMyToDo.classList.remove('dropdown-6');
  //     }, 500);
  //   }
  // });
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
