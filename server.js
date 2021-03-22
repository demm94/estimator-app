const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const puppeteer = require('puppeteer');
const websites = require('./indices.json');
const fs = require('fs');
let db;
let estimators = {
    "estimatorA": 0
}

const port = process.env.PORT || 3000;

// Archivos Estáticos
app.use(express.static(__dirname + '/public'));

// Helpers
require('./hbs/helpers');

// Express HBS Engine
app.set('view engine', 'hbs');

const dax = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.goto('https://es.investing.com/indices/germany-30', { waitUntil: 'domcontentloaded' });
    const dax = await page.evaluate(() => {
        const h1 = document.querySelector('.pid-172-pcp').textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
        return parseFloat(h1)
    });
    await browser.close();
    return dax;
};

const acwi = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.goto('https://es.investing.com/etfs/ishares-msci-acwi-index-fund', { waitUntil: 'domcontentloaded' });
    const acwi = await page.evaluate(() => {
        const h1 = document.querySelector('.pid-40659-pcp').textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
        return parseFloat(h1);
    });
    await browser.close();
    return acwi;
};

const sp500 = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.goto('https://es.investing.com/indices/us-spx-500', { waitUntil: 'domcontentloaded' });
    const sp500 = await page.evaluate(() => {
        const h1 = document.querySelector('.pid-166-pcp').textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
        return parseFloat(h1);
    });
    await browser.close();
    return sp500;
};

const nasdaq = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
      });
    const page = await browser.newPage();
    await page.goto('https://es.investing.com/indices/nq-100', { waitUntil: 'domcontentloaded' });
    const nasdaq = await page.evaluate(() => {
        const h1 = document.querySelector('.pid-20-pcp').textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
        return parseFloat(h1);
    });
    await browser.close();
    return nasdaq;
};

const suma = async () => {
    let DAX = await dax();
    let ACWI = await acwi();
    let SP500 = await sp500();
    let NASDAQ = await nasdaq();
    console.log(DAX + ACWI + SP500 + NASDAQ);
    return DAX + ACWI + SP500 + NASDAQ;
};

const scraper = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage({waitUntil: 'domcontentloaded'});
    let count = 0;
    let total = websites.length;
    let data = {};
    for(const web of websites){
        await page.goto(web.url);
        for(const indice of web.indices){
            await page.waitForSelector(indice.selector);
            const parametro = indice.selector;
            const value = await page.evaluate((parametro) => {
                console.log("holaaaa XD");
                const value = document.querySelector(parametro).textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
                return parseFloat(value);
            }, parametro);
            console.log(indice.name + `: ${value}`);
            data[indice.name] = value;
        }
        console.log("contador: ",count);
        count++;
    }
    if(count == total){
        console.log("Cierrate browser");
        await browser.close();
        console.log(data);
    }
    /* const fileName = 'data.json';
    fs.writeFile(fileName, JSON.stringify(data), (err) => {
        if (err) throw new Error('Error al grabar', err);

    }); */

    // Escribo a todos los sockets
    io.sockets.emit('test:message', {
        data: data
    });
    estimatorA(data);
    db = data;
    console.log("SCRAPER DONE!");
};

function estimatorA(data){
    let resultado = (((((((((data.nikkei+data.shanghai)/2)*1.2+data.dax*0.5+data.eurostoxx*0.5)/2)+data.acwi)/2)+data.dolarAvg)*0.67)+0.18*data.dolarAvg+0.15*data.sp+((data.acwi+data.dolarAvg)/2+data.sp/6))/2;
    io.sockets.emit('estimatorA', {
        data: resultado.toFixed(3)
    });
    estimators.estimatorA = resultado.toFixed(3);
}

setInterval(scraper, 120000);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/data', function (req, res) {
    res.status(200).json({
        data: db
    });
});

app.get('/estimatorA', function (req, res) {
    res.status(200).json({
        data: estimators.estimatorA
    });
});
 
const server = app.listen(port);

console.log(`Running at port ${port}`);

const SocketIO = require('socket.io');
const io = SocketIO(server);    // pasamos el servidor a SocketIO

// Websockets
io.on('connection', (socket) => {
    console.log("New Connection ", socket.id);
});