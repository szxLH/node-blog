var express = require('express')
var Router = express.Router()

Router.get('/', function (req, res, next) {
	console.log('welcome admin')
	res.render('admin/temp')
})

module.exports = Router