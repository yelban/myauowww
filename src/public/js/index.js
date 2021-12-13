import * as l from './lib';
import '../css/index.scss';

console.log('index.js');
const ab = {
  retry: 0,
  links: null,
  profile: null,

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

  l.renderSwiper(ab);
}

async function crossLoader() {
  console.log('crossLoader()');

  // development
  import('./popular');
  await buildLinks();

  // // production
  // if (window.document.documentMode) {
  //   l.loadJsCssUrl('css/ie.css', 'css', () => {
  //     l.loadJsCssUrl('css/scroll.css', 'css', () => {
  //       l.loadJsCssUrl('ie.js', 'js', buildLinks, document.body);
  //     });
  //   });
  // } else {
  //   l.loadJsCssUrl('css/popular.css', 'css', () => {
  //     l.loadJsCssUrl('css/scroll.css', 'css', () => {
  //       l.loadJsCssUrl('popular.js', 'js', buildLinks, document.body);
  //     });
  //   });
  // }
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
