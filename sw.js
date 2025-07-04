/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
// I have modified only this list from original file from google
const PRECACHE_URLS = [
  'index.html',
  'Base_Converter.html'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
       if (event.request.url === 'https://pyscript.net/releases/2025.7.2/core.js'){
         
        return caches.open(RUNTIME).then(cache => {
          const pysrequest = new Request('https://pyscript.net/releases/2025.7.2/core.js', {mode: 'no-cors'});
          return fetch(pysrequest).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(pysrequest, response.clone()).then(() => {
              return response;
            });
          });
        });
        }
        
       
        if (event.request.url === 'https://pyscript.net/releases/2025.7.2/core-3crqT3rt.js'){
         
        return caches.open(RUNTIME).then(cache => {
          const pysrequest = new Request('https://pyscript.net/releases/2025.7.2/core-3crqT3rt.js', {mode: 'no-cors'});
          return fetch(pysrequest).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(pysrequest, response.clone()).then(() => {
              return response;
            });
          });
        });
         
        }else{
        
        if (event.request.url === 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.asm.data'){
         
        return caches.open(RUNTIME).then(cache => {
          const pysrequest = new Request('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.asm.data', {mode: 'cors'});
          return fetch(pysrequest).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(pysrequest, response.clone()).then(() => {
              return response;
            });
          });
        });
         }else{
        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      }};
       
      }))})
