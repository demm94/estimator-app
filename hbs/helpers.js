const hbs = require('hbs');
const data = require('../data.json');

hbs.registerHelper('estimatorA', () => {
    let resultado = (((((((((data.nikkei+data.shanghai)/2)*1.2+data.dax*0.5+data.eurostoxx*0.5)/2)+data.acwi)/2)+data.dolarAvg)*0.67)+0.18*data.dolarAvg+0.15*data.sp+((data.acwi+data.dolarAvg)/2+data.sp/6))/2;
    return resultado.toFixed(3);
});