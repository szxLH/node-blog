var express = require('express')
var router = express.Router()
var async = require('async')
var category = require('../proxy/category')
var post = require('../proxy/post')
var moment = require('moment')
var url = require('url')
var tool = require('../utility/tool')
// 1. 获取分类、文章列表、文章页数
// 2. 根据分类alias获取分类对象
// 3. 根据分类对象查询文章列表、文章页数
router.post('/getPosts', function (req, res, next) {
	async.parallel([
        //获取文章列表和文章页数
		function (cb) {
			async.waterfall([
                //1. 根据分类alias获取分类对象
				function (cb) {
					category.getByAlias(req.body.CateAlias, function (err, category) {
						if (err) {
							cb(err)
						} else {
							cb(null, category)
						}
					})
				},
                //2. 传入分类对象查询文章
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
                        //文章列表
                    	function (cb) {
                    		post.getPosts(params, function (err, posts) {
		                    	if (err) {
		                    		cb(err)
		                    	} else {
		                    		cb(null, posts)
		                    	}
		                    })
                    	},
                        //文章页数
                    	function (cb) {
                    		post.getPageCount(params, function (err, count) {
                    			if (err) {
		                    		cb(err)
		                    	} else {
		                    		cb(null, count)
		                    	}
                    		})
                    	}], function (err, results) {
                    		if (err) {
	                    		cb(err)
	                    	} else {
	                    		cb(null, results)
	                    	}
                    })
				}], function (err, result) {
					if (err) {
	                    cb(err);
	                } else {
	                    cb(null, result);
	                }
			})
		},
		//获取分类
        function (cb) {
            category.getAll(function (err, data) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            })
        }
		],function (err, results) {
			var posts,
				pageCount,
				categories,
				i,
				len,
				cateId,
				cateItem,
				result = []
			if (err) {
				next(err)
			} else {
				posts = results[0][0]
				pageCount = results[0][1]
				categories = results[1]
				i = 0
				len = posts.length
				for (; i < len; i++) {
					result[i] = {
						Source: posts[i].Source,
						Alias: posts[i].Alias,
						Title: posts[i].Title,
						Url: posts[i].Url,
						PublishDate: moment(posts[i].CreateTime).format('YYYY-MM-DD'),
						Host: posts[i].Url ? url.parse(posts[i].Url).host : '',
						Summary: posts[i].Summary,
						UniqueId: posts[i].UniqueId,
						ViewCount: posts[i].ViewCount
					}
					cateId = posts[i].CategoryId
					cateItem = tool.jsonQuery(categories, {"_id": cateId})
					if (cateItem) {
						result[i].CategoryAlias = cateItem.Alias
						result[i].CateName = cateItem.CateName
					}
				}
				res.send({
					posts: result,
					pageCount: pageCount
				})
			}
// results:
// 	[ 
// 		[ [], 0 ],
//   		[ 
// 	  		{
// 	  			_id: '',
// 			    Alias: '',
// 			    CateName: 'All Category',
// 			    Img: '/images/全部分类.svg' 
// 			},
// 		    { 
// 		    	_id: 'other',
// 		        Alias: 'other',
// 		        CateName: 'Uncategorized',
// 		        Img: '/images/未分类.svg' 
// 		    } 
// 	    ] 
// 	]

		})
})

module.exports = router
