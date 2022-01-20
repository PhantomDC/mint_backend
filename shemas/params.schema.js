const { Schema, model } = require('mongoose');

const ParamsSchema = new Schema({ paramName: String, paramValue: String, paramDescription: String });

const Params = model('Params', ParamsSchema);

module.exports = Params;
