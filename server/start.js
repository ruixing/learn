const fs = require('fs');
const http2 = require('http2');
const path = require('path');

const {
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;

const server = http2.createSecureServer({
  key: fs.readFileSync(__dirname + '/certificate/localhost-privkey.pem'),
  cert: fs.readFileSync(__dirname + '/certificate/localhost-cert.pem')
});

server.on('error', (err) => console.error(err));

server.on('stream', (stream, headers) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const search = headers[HTTP2_HEADER_PATH];

  console.log(method, search);
  switch (true) {
    case search === '/favicon.ico': return webFavicon(stream);
    case /\/[\-\w]+\.(html|js|css)/.test(search): return webCharacterFile(stream, search);
    default: return noMatchError(stream);
  }
});

server.listen(443);

function webFavicon(stream) {
  fs.promises.readFile(path.resolve('favicon.ico')).then((ico) => {
    stream.respond({ [HTTP2_HEADER_STATUS]: 200 });
    stream.end(ico);
  });
}

function webCharacterFile(stream, search) {
  fs.promises.readFile(path.resolve('build' + search.replace(/\?.+/, ''))).then((html) => {
    stream.respond({ [HTTP2_HEADER_STATUS]: 200 });
    stream.end(html);
  }).catch(() => {
    noMatchError();
  });
}

function noMatchError(stream) {
  stream.respond({ [HTTP2_HEADER_STATUS]: 404 });
  stream.end('<h1>404 Not Found</h1>');
}