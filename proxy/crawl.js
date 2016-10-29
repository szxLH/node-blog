var http = require('http')
var superagent = require('superagent')
var async = require('async')
var cheerio = require('cheerio')
var shortid = require('shortid')

var pageUrls = []
var pageNum = 1
var pageSize = 20
var postsArray = []

for (var i = 1; i <= pageNum; i++) {
	pageUrls.push('http://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&PageIndex=' + i + '&ParentCategoryId=0')
}

exports.fetchInternetPosts = function (callback) {
	async.mapLimit(pageUrls, 1, function (url, callback) {
		superagent.get(url)
			.end(function (err, data) {
				var $ = cheerio.load(data.text)
				var curPageUrls = $('.titlelnk')
				for (var i = 0; i < curPageUrls.length; i++) {
					var href = curPageUrls.eq(i).attr('href')
					var title = curPageUrls.eq(i).text()
					var summary = $('.post_item_summary').eq(i).text()	// replace <a>
					postsArray.push({
						Title: title,
						Summary: summary,
						Url: href
					})
				}
				callback(null, postsArray)
			})
	}, function (err, results) {
		if (err) {
			callback(err)
		}
		callback(null, results)
	})	
}
