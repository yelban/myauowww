import * as l from './lib';

console.log('l', l);

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
}

getData(ab);

console.log('ab', ab);

// l.getData(ab);

// l.renderSwiper(ab);
