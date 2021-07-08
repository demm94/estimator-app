require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const puppeteer = require('puppeteer');
const websites = require('./indices.json');
const fs = require('fs');

// CONEXIÓN A BASE DE DATOS
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(() => console.log('Base de datos conectada'))
.catch((e) => console.log(e));

const Fondo = require('./models/fondo');

/* Fondo.find({})
    .limit(12)
    .exec((err, data) => {
        if(err) console.log(err);
        io.sockets.emit('data:chart', {
            data
        });
    });  */

const port = process.env.PORT;

// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Helpers
require('./hbs/helpers');

// Express HBS Engine
app.set('view engine', 'hbs');


const scraper = async () => {
    
    const browser = await puppeteer.launch({
        headless: process.env.NO_VIEW_BROWSER,
        args: ['--no-sandbox','--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage({waitUntil: 'domcontentloaded'});
    await page.setDefaultNavigationTimeout(0);
    let count = 0;
    let total = websites.length;
    let bolsa = {};
    let estimadores = {};
    let estimadores2 = {};
    let otros = {}
    for(const web of websites){
        await page.goto(web.url);
        for(const indice of web.indices){
            await page.waitForSelector(indice.selector);
            const {value, isClose} = await page.evaluate((indice) => {
                let value;
                if(indice.name == "estActivaA" || indice.name == "estActivaE"){
                    let lengthArray = document.querySelectorAll(indice.selector2).length;
                    if(lengthArray > 0) value = document.querySelector(indice.selector2).textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
                    else value = document.querySelector(indice.selector).textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
                }else{
                    value = document.querySelector(indice.selector).textContent.replace(/[\(|\%\|)]/g,'').replace(',','.');
                }

                let isClose;
                if(indice.type == "bolsa" && indice.selectorClose !== null) isClose = $(indice.selectorClose).exists();
                else isClose = null;

                return {
                    value: parseFloat(value),
                    isClose
                }
            }, indice);
            console.log(indice.name + `: ${value} - ${isClose}`);
            if(indice.type == "bolsa") {
                bolsa[indice.name] = {
                    value,
                    name: indice.name2,
                    isClose,
                    url: indice.url
                };
            }
            else if(indice.type == "estimador"){
                estimadores[indice.name] = {
                    value,
                    name: indice.name2
                };
            }else{
                otros[indice.name] = {
                    value,
                    name: indice.name2
                }
            }
        }
        console.log("contador: ",count);
        count++;
    }
    if(count == total){
        console.log("Cierrate browser");
        await browser.close();
        console.log(bolsa);
        console.log(estimadores);
        console.log(otros);
    }

    // CÁLCULO DE ESTIMADORES
    
    estimadores2["estimadorA1"] = {
        name: "Estimador A1",
        value: estimatorA1(bolsa)
    };
    estimadores2["estimadorE1"] = {
        name: "Estimador E1",
        value: estimatorE1(otros)
    };
    estimadores2["estimadorA2"] = {
        name: "Estimador A2",
        value: estimatorA2(bolsa)
    };
    estimadores2["estimadorE2"] = {
        name: "Estimador E2",
        value: estimatorE2(otros)
    };

    // SE OBTIENE UN TIEMPO APROXIMADO DE TOMA DE DATA
    const time = new Date().valueOf();

    // SE ALMACENAN LOS DATOS EN UN FICHERO
    const fileName = path.join(__dirname, 'data.json');
    fs.writeFile(fileName, JSON.stringify({
        bolsa,
        estimadores,
        estimadores2,
        otros,
        time
    }), (err) => {
        if (err) throw new Error('Error al grabar', err);
    });

    // CREAMOS UN OBJETO FONDO
    Fondo.create({
        aefpa: estimadores.aefpA.value,
        estacta: estimadores.estActivaA.value,
        time
        }, (e, obj) => {
            if(e) console.log(e);
            // Ya creado el bojeto fondo
            // Escribo la data en socket para gráfico
            Fondo.find({}, 'aefpa estacta time')
            .sort({_id: -1})
            .limit(40)
            .exec((err, data) => {
                if(err) console.log(err);
                io.sockets.emit('data:chart', {
                    data: data.reverse()
                });
            })
    });

    // Escribo a todos los sockets
    io.sockets.emit('test:message', {
        data: {
            bolsa,
            estimadores,
            estimadores2,
            otros,
            time
        }
    });

    console.log("SCRAPER DONE!");
};

const estimatorA1 = (bolsa) => {
    let resultado = (((((((((bolsa.nikkei.value+bolsa.shanghai.value)/2)*1.2+bolsa.dax.value*0.5+bolsa.eurostoxx.value*0.5)/2)+bolsa.acwi.value)/2)+bolsa.dolarAvg.value)*0.67)+0.18*bolsa.dolarAvg.value+0.15*bolsa.ipsa.value+((bolsa.acwi.value+bolsa.dolarAvg.value)/2+bolsa.ipsa.value/6))/2;
    io.sockets.emit('estimatorA', {
        bolsa: resultado
    });
    return resultado.toFixed(2);
}

const estimatorA2 = (data) => {
    let resultado = 0.401*data.dolarAvg.value+0.099*((data.nikkei.value+data.shanghai.value)/2)+0.07*data.dax.value+0.056*data.eurostoxx.value+0.282*data.acwi.value+0.099*data.ipsa.value;
    return resultado.toFixed(2);
}

const estimatorE1 = (data) => {
    let resultado = -((data.bcu10Actual.value-data.bcu10Anterior.value)+data.chile10A.value)*2.5;
    return resultado.toFixed(2);
}

const estimatorE2 = (data) => {
    let resultado = -(data.bcu5var.value+data.bcu10var.value+data.bcu20var.value)*5/3;
    return resultado.toFixed(2);
}

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/data', function (req, res) {
    const pathFile = path.join(__dirname, 'data.json')
    fs.readFile(pathFile, 'utf8', function(err, data){
        if(err){
            res.status(400).json({
                error: "Error al leer DB"
            });
        }
        res.status(200).json({
            data: JSON.parse(data)
        });
    });
});

app.get('/fondos', function (req, res) {
    Fondo.find({}, 'aefpa estacta time')
        .sort({_id: -1})
        .limit(40)
        .exec((err, data) => {
            if(err) {
                res.status(400).json({
                    err
                });
            };
            res.status(200).json({
                data: data.reverse()
            })
        })
});
 
const server = app.listen(port);

console.log(`Running at port ${port}`);

const SocketIO = require('socket.io');
const io = SocketIO(server);    // pasamos el servidor a SocketIO

// Websockets
io.on('connection', (socket) => {
    console.log("New Connection ", socket.id);
});

setInterval(() => {
    scraper().
        catch((e) => {
            console.error("Something bad happend in SCRAPER", e);
            process.exit();
        })
}, process.env.TIME_EXECUTE);