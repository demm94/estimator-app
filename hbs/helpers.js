const hbs = require('hbs');
const fetch = require('node-fetch');

hbs.registerHelper('valorDolar', () => {
    fetch('https://apps.bolchile.com/api/v1/dolarstatd2/#')
        .then(response => response.json())
        .then(data => console.log(data));
});