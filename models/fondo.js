const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fondoSchema = new Schema({
    aefpa: Number,
    estacta: Number,
    time: Number
}, { versionKey: false });

const Fondo = mongoose.model('Fondo', fondoSchema);

module.exports = Fondo;