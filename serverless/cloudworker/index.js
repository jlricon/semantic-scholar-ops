addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event.request.url))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request, url) {
  // let cache1 = caches.default
  // response = await cache1.match(request)
  // if (response) {
  //   return response
  // }

  const splitted = url.split('/').pop()
  if (splitted === '') {
    return new Response('You must provide an ID', { code: 500 })
  }

  const bla = await fetch(
    'https://0vzq3bx4h4.execute-api.eu-west-1.amazonaws.com/dev/webhook?id=' +
      splitted,
    {
      headers: { 'X-API-KEY': 'cbhPc2BG94BTA1rJu5UJdf1' },
      cf: { cacheEverything: true },
    },
  ).then(response => response.json())
  resp = new Response(JSON.stringify(bla), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
  // await cache1.put(request, resp)

  return resp
}
