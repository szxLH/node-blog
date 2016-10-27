var express = require('express');
var router = express.Router();
var path = require('path')
var async = require('async')
var tool = require('../utility/tool')
var category = require('../proxy/category')

/* GET home page. */
router.get('/', function(req, res, next) {
	async.parallel([
		// 获取配置
		function(cb){
			tool.getConfig(path.resolve(__dirname, '../config/settings.json'), function(err, settings){
				if (err) {
					cb(err)
				} else {
					cb(null, settings)
				}
			})
		}, function(cb){
			category.getAll(function (err, categories) {
				if (err) {
					cb(err)
				} else {
					cb(null, categories)
				}
			})
		}], function(err, results){
			if (err) {
				next(err)
			} else {
	            settings = results[0];
	            categories = results[1];
	            res.render('blog/index', {
	                cateData: categories,
	                settings: settings,
	                title: settings['SiteName'],
	                currentCate: '',
	                isRoot: true
	            });
	        }
		})  
});

module.exports = router
