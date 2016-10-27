var express = require('express')
var router = express.Router()
var async = require('async')
var category = require('../proxy/category')
var post = require('../proxy/post')
// 1. 获取分类、文章列表、文章页数
// 2. 根据分类alias获取分类对象
// 3. 根据分类对象查询文章列表、文章页数
router.post('/getPosts', function (req, res, next) {
	console.log(req.body)
	async.parallel([

		function (cb){
			async.fallwater([
				function (cb) {
					category.getByAlias(req.body.CateAlias, function (err, category) {
						if (err) {
							cb(err)
						} else {
							cb(null, category)
						}
					})
				},
				function (category, cb) {
					var params = {
                        cateId: category._id,
                        pageIndex: req.body.PageIndex,
                        pageSize: req.body.PageSize,
                        sortBy: req.body.SortBy,
                        keyword: req.body.Keyword,
                        filterType: req.body.FilterType
                    }
                    async.parallel([
                    	function (cb) {
                    		post.getPosts(params, function (err, posts) {
		                    	if (err) {
		                    		cb(err)
		                    	} else {
		                    		cb(null, posts)
		                    	}
		                    })
                    	},
                    	function (cb) {
                    		post.getPageCount(params, function (err, posts) {
                    			
                    		})
                    	}
                    	], function (err, results) {

                    })
                    
				}

				], function (err, ) {

			})
		},

		],function (err, result) {})
})

module.exports = router
