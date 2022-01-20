const { Router } = require('express');
const mintRouter = require('./mint.js');
const paramsRouter = require('./params.js');
const authRouter = require('./auth.js');
const whiteListRouter = require('./whiteList.js');

const apiRouter = Router();

apiRouter.use('/mint', mintRouter);
apiRouter.use('/params', paramsRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/wl', whiteListRouter);

module.exports = apiRouter;
