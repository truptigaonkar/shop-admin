var itemController = require('../controllers/itemController')

var express = require('express');
var itemRouter = express.Router();

itemRouter.route('/')
    .post(itemController.add);

itemRouter.route('/')
    .get(itemController.get);

itemRouter.route('/search')
    .get(itemController.search);

itemRouter.route('/getByCategory')
          .post(itemController.getItemsByCategory);

module.exports = itemRouter;