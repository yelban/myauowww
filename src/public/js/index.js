// eslint-disable-next-line import/no-unresolved
// import chalk from 'chalk';

import * as l from './lib';

import 'the-new-css-reset/css/reset.css';
import '../css/index.scss';

// * 沃草！IE 11 不支援
// *
import db from '../../../db.json';
// const db = {};

const isLocalData = true;

const isLocaleHost = true;

// console.log(chalk.blueBright('index.js'));

const ab = {
  link: null,
  todo: null,
  app: null,
  url: {},
  retry: 0,

  setProperty(entry, data) {
    console.log('setProperty()', entry);
    this[entry] = data;
  },

  async getData(endpoint) {
    console.log('getData(endpoint)', endpoint);

    console.log('this.url[endpoint]', this.url[endpoint]);

    if (isLocalData) {
      ab.setProperty(endpoint, db[endpoint]);
      return;
    }

    try {
      const result = await l.fetchJSON(this.url[endpoint]);
      ab.setProperty(endpoint, result);
      localStorage.setItem(`ab_${endpoint}`, JSON.stringify(result));
      localStorage.setItem(`ab_${endpoint}_ts`, parseInt(Date.now() / 1000, 10));
    } catch (error) {
      console.log('error', error);
    }
  },

  async setData(endpoint, ttl) {
    console.log('setData(endpoint, ttl)', endpoint, ttl);

    const hora = ttl || 1;

    const data = JSON.parse(localStorage.getItem(`ab_${endpoint}`));

    if (data) {
      const currentTS = Date.now() / 1000;

      this.setProperty(endpoint, data);

      const localDataTS = parseInt(JSON.parse(localStorage.getItem(`ab_${endpoint}_ts`)), 10);
      console.log('localDataTS', localDataTS);

      if (localDataTS) {
        if ((localDataTS + (hora * 60 * 60)) < currentTS) {
          console.log('renew', endpoint);
          this.getData(endpoint, hora);
        }
      } else {
        this.getData(endpoint, hora);
      }
    } else {
      this.getData(endpoint, hora);
    }
  },
};

console.log('ab', ab);

async function crossLoader() {
  console.log('crossLoader()');

  console.log('window.NTName', window.NTName);

  if (!window.NTName) {
    console.log('user not login!');
    l.alert('無法確認的使用者，請與系統管理者聯絡。');

    return true;
  }

  let hostData = '';

  if (isLocaleHost) {
    hostData = 'http://localhost:3000';

    ab.url = {
      link: `${hostData}/link`,
      todo: `${hostData}/todo`,
      app: `${hostData}/app`,
    };
  } else {
    hostData = 'http://test-myauo3.ab1.corpnet.auo.com/sites/all/modules/custom/auo_myauo_ws';

    ab.url = {
      link: `${hostData}/getMenu.php`,
      todo: `${hostData}/getMyTodo.php?id=${window.NTName}`,
      app: `${hostData}/getMyApp.php?id=${window.NTName}`,
    };
  }

  console.log('ab', ab);

  await ab.setData('link', 12);

  // // * development
  // import('./popular');
  // await buildLinks();

  l.loadScroll(ab);

  await ab.setData('todo');
  console.log('ab', ab);

  l.renderTodo(ab);
  // setTimeout(() => {
  //   console.log('ab', ab);
  //   l.renderTodo(ab);
  // }, 1000);

  await ab.setData('app');
  console.log('ab', ab);

  return true;
}

// * production url
// *
let getUserURL = `http://10.86.15.32:81/user.js?t=${Date.now()}`;

if (isLocaleHost) {
  getUserURL = 'auowidget/user.js';
}

l.loadJsCss(getUserURL, 'js', crossLoader, document.body);

// const hostData = 'http://test-myauo3.ab1.corpnet.auo.com/sites/all/modules/custom/auo_myauo_ws/',
// const urlNTN = 'http://10.86.15.32:81/user.js'

// const isDevserver = l.isDevServer();

// if (isDevserver) {
//   ab.url = {
//     link: 'http://localhost:3000/link',
//     todo: 'http://localhost:3000/todo',
//     app: 'http://localhost:3000/app',
//     ntn: 'http://localhost:3000/ntn',
//   };
// }

// url: {
//   link: 'http://test-myauo3.ab1.corpnet.auo.com/sites/all/modules/custom/auo_myauo_ws/getMenu.php',
//   todo: 'http://test-myauo3.ab1.corpnet.auo.com/sites/all/modules/custom/auo_myauo_ws/getMyTodo.php?id=',
//   app: 'http://test-myauo3.ab1.corpnet.auo.com/sites/all/modules/custom/auo_myauo_ws/getMyApp.php?id=',
//   ntn: 'http://10.86.15.32:81/user.js?t=',
// },
