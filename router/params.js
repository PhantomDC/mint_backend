const { Router } = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const Params = require('../shemas/params.schema');
const Users = require('../shemas/users.schema');

const paramsRouter = Router();

paramsRouter.get('/get', async (req, res) => {
	const { paramName } = req.query;
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		const isAlive = verified.exp * 1000 - Date.now() > 0;

		if (isAlive) {
			const user = await Users.findOne({ _id: verified.id }).exec();
			if (user.mode === 'admin' && user.active && paramName) {
				const response = await Params.findOne({ paramName }).exec();
				if (response) {
					return res.status(200).json(response);
				} else {
					return res.status(404).json({ status: 'error', message: 'param not found' });
				}
			}
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(404).json({ status: 'error', message: 'not found' });
	}
});

paramsRouter.post('/update', async (req, res) => {
	const { paramName, paramValue, paramDescription } = req.body;
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		const user = await Users.findOne({ _id: verified.id }).exec();

		if (user.mode === 'admin' && user.active && paramName) {
			const response = await Params.findOne({ paramName }).exec();
			const updateResponse = await Params.updateOne(
				{ paramName },
				{
					paramValue: paramValue ?? response.paramValue,
					paramDescription: paramDescription ?? response.paramDescription,
				},
			);
			if (updateResponse) {
				return res.status(200).json({ status: 'ok' });
			} else {
				return res.status(404).json({ status: 'error', message: 'param not found' });
			}
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

paramsRouter.get('/list', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.mode === 'admin') {
			const response = await Params.find().exec();

			const normilized = response.reduce((acc, item) => {
				acc[item._id] = {
					paramName: item.paramName,
					paramValue: item.paramValue,
					paramDescription: item.paramDescription,
				};

				return acc;
			}, {});

			return res.json(normilized);
		}
		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

module.exports = paramsRouter;
