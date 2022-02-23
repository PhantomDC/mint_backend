const { Schema, model } = require('mongoose');

const ParamsSchema = new Schema({ paramName: String, paramValue: Schema.Types.Mixed, paramDescription: String });

const Params = model('Params', ParamsSchema);

module.exports = Params;
