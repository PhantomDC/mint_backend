const { Schema, model } = require('mongoose');

const UsersSchema = new Schema({
	login: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	mode: { type: String, default: 'user' },
	active: { type: Boolean, default: false },
});

const Users = model('Users', UsersSchema);

module.exports = Users;
