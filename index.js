const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const config = require('config');
const apiRouter = require('./router');
const app = express();

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, 'client', 'build')));
	app.get('*', function (req, res) {
		res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(config.get('backPort'), async (err) => {
	err ? console.error(err) : console.log('server running on port', config.get('backPort'));
	try {
		await mongoose.connect(
			`mongodb+srv://${config.get('dbUser')}:${config.get(
				'dbPassword',
			)}@cluster0.cpqkv.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
		);
		console.log('db connected');
	} catch (dbErr) {
		console.error('DB ERROR', dbErr);
	}
});
