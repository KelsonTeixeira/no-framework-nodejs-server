const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require('./replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/db/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

  const {query, pathname } = url.parse(req.url, true);

  if (pathname === '/overview' || pathname === '/') {

    const cardsHTML = dataObj.map(product => replaceTemplate(templateCard, product)).join('');

    const templateOverviewCards = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });

    res.end(templateOverviewCards);

  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    const productHTML = replaceTemplate(templateProduct, product);

    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(productHTML);

  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end('<h1>Not Found</>');
  }

});

server.listen(3333, '127.0.0.1', () => {
  console.log('Listening to request on port 3333');
})