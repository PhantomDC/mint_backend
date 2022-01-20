const { Router } = require('express');
const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const config = require('config');
const Users = require('../shemas/users.schema');
const WhiteList = require('../shemas/whiteList.schema');

const authRouter = Router();
const jwtSecret = config.get('jwtSecret');

authRouter.post('/check', async (req, res) => {
	const { accept } = req.body;
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		if (accept) {
			switch (accept) {
				case 'user':
					const candidateWL = await WhiteList.findOne({ walletId: verified.walletId, isActive: true }).exec();
					if (candidateWL) {
						return res.json({ status: 'ok' });
					}
					break;
				case 'admin':
					const candidateUser = await Users.findOne({ _id: verified.id, mode: 'admin', active: true }).exec();
					if (candidateUser) {
						return res.json({ status: 'ok' });
					}
					break;
			}
		}

		return res.status(401).json({ status: 'error', message: 'not authorized' });
	} catch (err) {
		res.status(401).json({ status: 'error', message: 'not authorized' });
	}
});

authRouter.post('/login', async (req, res) => {
	const { login, password } = req.body;
	const candidate = await Users.findOne({ login }).exec();

	if (candidate && candidate.password === crypto.MD5(password).toString() && candidate.active) {
		const token = jwt.sign({ login, mode: candidate.mode, id: candidate._id }, jwtSecret, { expiresIn: '1h' });
		return res.status(200).json({ token });
	}

	return res.status(404).json({ status: 'error', message: 'User not found' });
});

authRouter.post('/register', async (req, res) => {
	const { login, password } = req.body;
	const encryptedPassword = crypto.MD5(password).toString();

	const user = new Users({ login, password: encryptedPassword });

	try {
		await user.save();
		return res.json({ status: 'ok', message: 'User successfully added' });
	} catch (err) {
		return res.status(500).json({ status: 'error', message: "Can't add user" });
	}
});

authRouter.post('/verify', (req, res) => {
	const { walletId } = req.body;

	if (walletId) {
		return res.json({ token: jwt.sign({ walletId }, jwtSecret, { expiresIn: '1h' }) });
	}

	return res.status(404).json({ status: 'error', message: 'wallet id missed' });
});

module.exports = authRouter;
