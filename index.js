const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const data = JSON.parse(json);

const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  const id = url.parse(req.url, true).query.id;

  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      'utf-8',
      (err, html) => {
        let overview = html;
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          'utf-8',
          (err, html) => {
            const card = data
              .map((item) => replaceTemplate(html, item))
              .join('');
            overview = overview.replace('{%CARDS%}', card);
            res.end(overview);
          }
        );
      }
    );
  } else if (pathName === '/laptop' && id < data.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      'utf-8',
      (err, html) => {
        const item = data[id];
        const output = replaceTemplate(html, item);

        res.end(output);
      }
    );
  } else if (/\.(jpg|jpeg|gif|png)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img/${pathName}`, (err, data) => {
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(data);
    });
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('404 Not found');
  }
});

server.listen(1337, '127.0.0.1', () => {
  console.log('Server listening.');
});

function replaceTemplate(html, item) {
  let output = html.replace(/{%PRODUCTNAME%}/g, item.productName);
  output = output.replace(/{%IMAGE%}/g, item.image);
  output = output.replace(/{%PRICE%}/g, item.price);
  output = output.replace(/{%SCREEN%}/g, item.screen);
  output = output.replace(/{%CPU%}/g, item.cpu);
  output = output.replace(/{%STORAGE%}/g, item.storage);
  output = output.replace(/{%RAM%}/g, item.ram);
  output = output.replace(/{%DESCRIPTION%}/g, item.description);
  output = output.replace(/{%ID%}/g, item.id);
  return output;
}
