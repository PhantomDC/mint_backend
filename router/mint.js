const { Router } = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const Mint = require('../shemas/mint.schema');
const Params = require('../shemas/params.schema');

const mintRouter = Router();

const getMintsList = async () => {
	const response = await Mint.find().exec();
	const responseParams = await Params.findOne({ paramName: 'maxMintCount' }).exec();

	const normilized = response.reduce((acc, item) => {
		const availableMints = Number(responseParams.paramValue) - Number(item.mintsCount);

		acc[item._id] = {
			walletId: item.walletId,
			mintsCount: item.mintsCount,
			lastUpdateAt: item.lastUpdateAt,
			availableMints: availableMints >= 0 ? availableMints : 0,
		};
		return acc;
	}, {});

	return normilized;
};

mintRouter.get('/get', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const walletId = req.query?.walletId;
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.walletId === walletId) {
			const response = await Mint.findOne({ walletId }).exec();
			const count = response ? response.mintsCount : 0;

			const paramResponse = await Params.findOne({ paramName: 'maxMintCount' }).exec();
			const paramPreSaleResponse = await Params.findOne({ paramName: 'preSaleCountMints' }).exec();
			const userMintsCount = Number(paramResponse.paramValue) - count;

			const totalMintsCount =
				userMintsCount < Number(paramPreSaleResponse.paramValue)
					? userMintsCount
					: Number(paramPreSaleResponse.paramValue);

			return res.json({ count: totalMintsCount });
		}

		return res.status(401).json({ status: 'error', message: 'not authorized' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

mintRouter.post('/add', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const { walletId } = req.body;
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		const isAlive = verified.exp * 1000 - Date.now() > 0;

		if (isAlive) {
			if (verified.walletId === walletId) {
				const prevMints = await Mint.findOne({ walletId }).exec();

				await Mint.updateOne({ walletId }, { mintsCount: prevMints.mintsCount + 1, lastUpdateAt: Date.now() });
				const count = prevMints ? prevMints.mintsCount + 1 : 0;

				const paramResponse = await Params.findOne({ paramName: 'maxMintCount' }).exec();
				const prevPreSaleMints = await Params.findOne({ paramName: 'preSaleCountMints' }).exec();

				const nextPrevPreSaleMints = Number(prevPreSaleMints.paramValue) - 1;
				await Params.updateOne({ paramName: 'preSaleCountMints' }, { paramValue: nextPrevPreSaleMints });

				return res.json({
					count: Number(paramResponse.paramValue) - count,
					presaleTokens: nextPrevPreSaleMints,
				});
			}

			return res.status(404).json({ status: 'error', message: 'walletId is not signible' });
		}

		return res.status(401).json({ status: 'error', message: 'token expired' });
	} catch (err) {
		const mint = new Mint({ walletId, mintsCount: 1, lastUpdateAt: Date.now() });
		try {
			await mint.save();
			const paramResponse = await Params.findOne({ paramName: 'maxMintCount' }).exec();
			const prevPreSaleMints = await Params.findOne({ paramName: 'preSaleCountMints' }).exec();
			const nextPrevPreSaleMints = Number(prevPreSaleMints.paramValue) - 1;

			await Params.updateOne({ paramName: 'preSaleCountMints' }, { paramValue: nextPrevPreSaleMints });
			res.json({ count: Number(paramResponse.paramValue) - 1, presaleTokens: nextPrevPreSaleMints });
		} catch (err) {
			res.json({ status: 'error', message: 'something went wrong' });
		}
	}
});

mintRouter.get('/list', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.mode === 'admin') {
			const normilized = await getMintsList();

			return res.json(normilized);
		}

		res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

mintRouter.post('/updateMints', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();
	const { id, count } = req.body;

	try {
		const verified = jwt.verify(token, jwtSecret);

		if (verified.mode === 'admin') {
			await Mint.findByIdAndUpdate(id, { mintsCount: count });

			const normilized = await getMintsList();

			return res.json(normilized);
		}

		res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

mintRouter.post('/cleanMints', async (req, res) => {
	const jwtSecret = config.get('jwtSecret');
	const token = req.headers.authorization.split('Bearer ')[1].trim();

	try {
		const verified = jwt.verify(token, jwtSecret);
		if (verified.mode === 'admin') {
			await Mint.updateMany({}, { mintsCount: 0 });

			const normilized = await getMintsList();

			return res.json(normilized);
		}
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	} catch (err) {
		res.status(500).json({ status: 'error', message: 'something went wrong' });
	}
});

module.exports = mintRouter;
