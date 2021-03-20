const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const puppeteer = require('puppeteer');

const port = process.env.PORT || 3000;

// Archivos Estáticos
app.use(express.static(__dirname + '/public'));

// Helpers
require('./hbs/helpers');

// Express HBS Engine
app.set('view engine', 'hbs');

const dax = async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
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

app.get('/', function (req, res) {
    //dax().then( value => console.log(value));
    //usd().then( value => console.log(value));
    //suma().then( value => console.log(value));    
    //res.sendFile(path.join(__dirname + '/index.html'));
    res.render('home');
});

app.get('/sumar', function (req, res) {
    //dax().then( value => console.log(value));
    //usd().then( value => console.log(value));
    suma().then( value => {
        res.render('home', {
            value
        });
    });    
    //res.sendFile(path.join(__dirname + '/index.html'));
    
});

app.get('/dax', function (req, res) {
    dax().then(value => {
        res.status(200).json({
            dax: value
        });
    }).catch(error => console.log('Error DAX' + error));
});

app.get('/acwi', function (req, res) {
    acwi().then(value => {
        res.json({
            acwi: value
        });
    });
});

app.get('/sp500', function (req, res) {
    sp500().then(value => {
        res.json({
            sp500: value
        });
    });
});

app.get('/nasdaq', function (req, res) {
    nasdaq().then(value => {
        res.json({
            nasdaq: value
        });
    });
});
 
app.listen(port);

console.log(`Running at port ${port}`);