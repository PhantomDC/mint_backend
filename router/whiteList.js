const config = require('config');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const Users = require('../shemas/users.schema');
const WhiteList = require('../shemas/whiteList.schema');

const whiteListRouter = Router();

const getWhiteList = async () => {
	try {
		const response = await WhiteList.find().exec();

		return response.reduce((acc, item) => {
			acc[item._id] = {
				walletId: item.walletId,
				isActive: item.isActive,
				updatedAt: item.updatedAt,
			};

			return acc;
		}, {});
	} catch (err) {
		return null;
	}
};

whiteListRouter.post('/has', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const { walletId } = req.body;
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		const isAlive = verified.exp * 1000 - Date.now() > 0;

		if (isAlive) {
			if (verified.walletId === walletId) {
				const candidate = await WhiteList.findOne({ walletId, isActive: true }).exec();
				if (candidate) {
					return res.json({ walletId, status: 'ok' });
				}

				return res.status(404).json({ status: 'error', message: 'wallet is not in white list' });
			}

			return res.status(404).json({ status: 'error', message: 'walletId is not signable' });
		}

		return res.status(401).json({ status: 'error', message: 'token expired' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

whiteListRouter.post('/add', async (req, res) => {
	const token = req.headers.authorization.split('Bearer ')[1].trim();
	const jwtSecret = config.get('jwtSecret');
	const { walletId } = req.body;

	try {
		const verified = jwt.verify(token, jwtSecret);
		const isAlive = verified.exp * 1000 - Date.now() > 0;

		if (isAlive) {
			const user = await Users.findOne({ _id: verified.id }).exec();

			if (user.mode === 'admin' && user.active && walletId) {
				const checkWalletId = await WhiteList.findOne({ walletId }).exec();
				if (!checkWalletId) {
					const newWallet = new WhiteList({ walletId, isActive: true });
					const response = await newWallet.save();
					return res.json({
						id: response._id,
						walletId: response.walletId,
						isActive: response.isActive,
						updatedAt: response.updatedAt,
					});
				}

				return res.status(401).json({ status: 'error', message: 'wallet id is not unique' });
			}
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

whiteListRouter.post('/update', async (req, res) => {
	const token = req.headers.authorization.split('Bearer ')[1].trim();
	const jwtSecret = config.get('jwtSecret');
	const { id, isActive } = req.body;

	try {
		const verified = jwt.verify(token, jwtSecret);
		const isAlive = verified.exp * 1000 - Date.now() > 0;

		if (isAlive) {
			const user = await Users.findOne({ _id: verified.id }).exec();

			if (user.mode === 'admin' && user.active && id) {
				await WhiteList.findByIdAndUpdate(id, { isActive, updatedAt: Date.now() });
				const response = await getWhiteList();

				return res.json(response);
			}
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

whiteListRouter.delete('/delete', async (req, res) => {
	const token = req.headers.authorization.split('Bearer ')[1].trim();
	const jwtSecret = config.get('jwtSecret');
	const { id } = req.body;

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.mode === 'admin') {
			await WhiteList.findByIdAndDelete(id);
			const response = await getWhiteList();

			return res.json(response);
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

whiteListRouter.get('/list', async (req, res) => {
	const token = req.headers.authorization.split('Bearer ')[1].trim();
	const jwtSecret = config.get('jwtSecret');

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.mode === 'admin') {
			const response = await getWhiteList();

			return res.json(response);
		}

		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

module.exports = whiteListRouter;
