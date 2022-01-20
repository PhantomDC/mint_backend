const { Schema, model } = require('mongoose');

const WhiteListSchema = new Schema({
	walletId: { type: String, required: true, unique: true },
	isActive: { type: Boolean, default: false },
	updatedAt: { type: Number, default: Date.now() },
});

const WhiteList = model('WhiteList', WhiteListSchema);

module.exports = WhiteList;
