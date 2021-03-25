const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const puppeteer = require('puppeteer');
const websites = require('./indices.json');
const fs = require('fs');
let dbBolsa;
let dbEstimadores;

//console.log(new Date().toLocaleTimeString());

const port = process.env.PORT || 3000;

// Archivos Estáticos
app.use(express.static(__dirname + '/public'));

// Helpers
require('./hbs/helpers');

// Express HBS Engine
app.set('view engine', 'hbs');

const scraper = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    const page = await browser.newPage({waitUntil: 'domcontentloaded'});
    await page.setDefaultNavigationTimeout(0)
    let count = 0;
    let total = websites.length;
    let bolsa = {};
    let estimadores = {};
    let estimadores2 = {};
    for(const web of websites){
        await page.goto(web.url);
        for(const indice of web.indices){
            await page.waitForSelector(indice.selector);
            const parametro = indice.selector;
            const value = await page.evaluate((parametro) => {
                const value = document.querySelector(parametro).textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
                return parseFloat(value);
            }, parametro);
            console.log(indice.name + `: ${value}`);
            if(indice.type == "bolsa") bolsa[indice.name] = value;
            else estimadores[indice.name] = value;
        }
        console.log("contador: ",count);
        count++;
    }
    if(count == total){
        console.log("Cierrate browser");
        await browser.close();
        console.log(bolsa);
        console.log(estimadores);
    }

    const estimadorA1 = estimatorA(bolsa);
    estimadores2["estimadorA1"] = estimadorA1;

    // SE ALMACENAN LOS DATOS EN UN FICHERO
    const fileName = 'data.json';
    fs.writeFile(fileName, JSON.stringify({
        bolsa,
        estimadores,
        estimadores2,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }), (err) => {
        if (err) throw new Error('Error al grabar', err);
    });

    // Escribo a todos los sockets
    io.sockets.emit('test:message', {
        data: {
            bolsa,
            estimadores,
            estimadores2,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    });
    //estimatorA(bolsa);
    dbBolsa = bolsa;
    dbEstimadores = estimadores;
    console.log("SCRAPER DONE!");
};

setInterval(function (){
    scraper().catch(error => { 
        console.error("Something bad happend in SCRAPER", error); 
    });
}, 50000);

const estimatorA = (bolsa) => {
    let resultado = (((((((((bolsa.nikkei+bolsa.shanghai)/2)*1.2+bolsa.dax*0.5+bolsa.eurostoxx*0.5)/2)+bolsa.acwi)/2)+bolsa.dolarAvg)*0.67)+0.18*bolsa.dolarAvg+0.15*bolsa.syp+((bolsa.acwi+bolsa.dolarAvg)/2+bolsa.syp/6))/2;
    io.sockets.emit('estimatorA', {
        bolsa: resultado.toFixed(3)
    });
    return resultado.toFixed(3);
}

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/data', function (req, res) {
    const db = require('./data.json');
    res.status(200).json({
        data: db
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