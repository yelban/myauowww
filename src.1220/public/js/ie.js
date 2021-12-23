// Is dev only, production use "pbcopy < node_modules/abscroll/dist/js/abscroll.min.js"
// import Swiper from 'abscroll/dist/js/abscroll.esm.bundle';
import Swiper from 'abscroll4/dist/js/swiper.esm.bundle';// ✔
// import 'abscroll4/dist/js/swiper'; // ✔ load Swiper globally, need no "window.Swiper = Swiper;"
// import Swiper from 'abscroll5/js/swiper'; // ✔
// import 'abscroll/dist/css/abscroll.min.css'; // ✔
import 'abscroll4/dist/css/swiper.css'; // ✔
// import 'abscroll5/css/swiper.css'; // ✔

window.Swiper = Swiper;
