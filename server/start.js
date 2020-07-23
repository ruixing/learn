const fs = require('fs');
const http2 = require('http2');

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

server.on('stream', (stream, headers, ...args) => {
  const method = headers[HTTP2_HEADER_METHOD];
  const path = headers[HTTP2_HEADER_PATH];

  console.log(method, path);
  console.log(...args);

  stream.respond({
    [HTTP2_HEADER_STATUS]: 200,
    [HTTP2_HEADER_CONTENT_TYPE]: 'text/html; charset=utf-8'
  });
  stream.end('<h1>Hello World</h1>');
});

server.listen(443);
