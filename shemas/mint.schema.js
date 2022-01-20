const { Schema, model } = require('mongoose');

const MintSchema = new Schema({ walletId: String, mintsCount: Number, lastUpdateAt: Number });

const Mint = model('Mint', MintSchema);

module.exports = Mint;
