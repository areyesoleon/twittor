importScripts('js/sw-utils.js');
const staticCache = 'static-v2';
const dynamicCache = 'dynamic-v1';
const inmutableCache = 'inmutable-v1';

const appShell = [
  // '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js'
];


const appShellInmutable = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

self.addEventListener('install', (e) => {
  const cacheStatic = caches.open(staticCache)
    .then(cache => cache.addAll(appShell));

  const cacheInmutable = caches.open(inmutableCache)
    .then(cache => cache.addAll(appShellInmutable));


  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', (e) => {
  const respuesta = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== staticCache && key.includes('static')) {
        return caches.delete(key);
      }
      if (key !== dynamicCache && key.includes('dynamic')) {
        return caches.delete(key);
      }
    })
  });
  e.waitUntil(respuesta);
});

self.addEventListener('fetch', (e) => {
  const respuesta = caches.match(e.request).then((res) => {
    if (res) {
      return res;
    } else {
      return fetch(e.request).then((newRes) => {
        return actualizaCacheDinamico(dynamicCache, e.request, newRes);
      });
    }
  })
  e.respondWith(respuesta);
})