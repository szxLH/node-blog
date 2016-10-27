var postModel = require('../models/post').PostModel;
var redisClient = require('../utility/redisClient');
var tool = require('../utility/tool');

function getPostsQuery(params) {
	var query = {}
	query.IsActive = true
	query.IsDraft = false	//草稿
	if (params.cateId) {
		query.CateGoryId = params.cateId
	}
	if (params.keyword) {
		switch (params.filterType) {
			case '1':
				query.Title = {"$regex": params.keyword, "$options": "gi"}
				break
			case '2':
				query.Labels = {"$regex": params.keyword, "$options": "gi"}
				break
			case '3':
				query.CreateTime = {"$regex": params.keyword, "$options": "gi"}
				break
			default:
                query.$or = [{
                    "Title": {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Labels': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Summary': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }, {
                    'Content': {
                        "$regex": params.keyword,
                        "$options": "gi"
                    }
                }]
		}
	}
	return query
}

exports.getPosts = function (params, callback) {
	var cache_key = tool.generateKey('posts', params)
	redisClient.getItem(cache_key, function (err, posts) {
		if (err) {
			return callback(err)
		}
		if (posts) {
			return callback(null, posts)
		}
		var page = +params.pageIndex || 1
		var size = +params.pageSize || 10
		page = page > 0 ? page : 1
		var options = {}
		options.skip = (page - 1) * size
		options.limit = size
		options.sort = params.sortBy === 'title' ? 'Title -CreateTime' : '-CreateTime'
		var query = getPostsQuery(params)
		postModel.find(query, {}, options, function (err, posts) {
			if (err) {
				return callback(err)
			}
			if (posts) {
				redisClient.setItem(cache_key, posts, redisClient.defaultExpired, function (err) {
					if (err) {
						return callback(err)
					}
				})
			}
			return callback(null, posts)
		})
	})
}

exports.getPageCount = function (params, callback) {
    var cache_key = tool.generateKey('posts_count', params);
	redisClient.getItem(cache_key, function (err, pageCount) {
		if (err) {
			return callback(err)
		}
		if (pageCount) {
			return callback(null, pageCount)
		}
		var query = getPostsQuery(params)
		postModel.count(query, function (err, count) {
			if (err) {
				return callback(err)
			}
			if (count) {
				redisClient.setItme(cache_key, count, redisClient.defaultExpired, function (err) {
					if (err) {
						return callback(err)
					}
				})
			}
			return callback(null, count)
		})
	})
}