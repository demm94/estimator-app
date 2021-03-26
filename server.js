const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const puppeteer = require('puppeteer');
const websites = require('./indices.json');
const fs = require('fs');
let dbBolsa;
let dbEstimadores;

//const time = new Date().valueOf();
//console.log(time);
//console.log(new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

const port = process.env.PORT || 3000;

// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

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
    await page.setDefaultNavigationTimeout(0);
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
            if(indice.type == "bolsa") bolsa[indice.name] = {
                value,
                name: indice.name2
            };
            else estimadores[indice.name] = {
                value,
                name: indice.name2
            };
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
    const fileName = path.join(__dirname, 'data.json');
    fs.writeFile(fileName, JSON.stringify({
        bolsa,
        estimadores,
        estimadores2,
        time: new Date().valueOf()
    }), (err) => {
        if (err) throw new Error('Error al grabar', err);
    });

    // Escribo a todos los sockets
    io.sockets.emit('test:message', {
        data: {
            bolsa,
            estimadores,
            estimadores2,
            time: new Date().valueOf()
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
}, 80000);

const estimatorA = (bolsa) => {
    let resultado = (((((((((bolsa.nikkei.value+bolsa.shanghai.value)/2)*1.2+bolsa.dax.value*0.5+bolsa.eurostoxx.value*0.5)/2)+bolsa.acwi.value)/2)+bolsa.dolarAvg.value)*0.67)+0.18*bolsa.dolarAvg.value+0.15*bolsa.syp.value+((bolsa.acwi.value+bolsa.dolarAvg.value)/2+bolsa.syp.value/6))/2;
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
    console.log("ENVIANDO DB");

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