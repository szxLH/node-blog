var redisClient = require('../utility/redisClient')
var categoryModel = require('../models/category').CategoryModel
var i18n = require('../models/i18n')

//全部分类
var cateAll = {
    "_id": "",
    "Alias": "",
    "CateName": i18n.__("Category.all"),
    "Img": "/images/全部分类.svg"
}
//未分类
var cateOther = {
    "_id": "other",
    "Alias": "other",
    "CateName": i18n.__("Category.uncate"),
    "Img": "/images/未分类.svg"
}



/**
 * @Author   szxlh
 * @DateTime 2016-10-26T16:26:18+0800
 * @param [isAll] 是否包含全部分类和未分类
 * @param [cached] 是否读取缓存
 * @param callback 回调函数
 */
exports.getAll = function (isAll, cached, callback) {
	if (typeof cached === 'function') {
		callback = cached
	} else if(typeof isAll === 'function') {
		callback = isAll
		isAll = true
		cached = true
	}
    //缓存的key名称
	var cache_key = isAll ? 'categories_all' : 'categories'

	if (cached) {
		redisClient.getItem(cache_key, function (err, categories) {
			if (err) {
				return callback(err)
			}
			if (categories) {
				return callback(null, categories)
			}
			console.log('categoryModel=', categoryModel)
			categoryModel.find(function (err, categories) {
				if (err) {
					return callback(err)
				}
				if (isAll) {
					categories.unshift(cateAll)
					categories.push(cateOther)
				}
				if (categories) {
					redisClient.setItem(cache_key, categories, redisClient.defaultExpired, function (err) {
						if (err) {
							return callback(err)
						}
					})
					callback(null, categories)
				}
			})
		})
	} else {
		categoryModel.find(function (err, categories) {
			if (err) {
				return callback(err)
			}
			if (isAll) {
				categories.unshift(cateAll)
				categories.push(cateOther)
			}
			callback(null, categories)
		})
	}
}