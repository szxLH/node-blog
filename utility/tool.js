var fs = require('fs')

exports.getConfig = function (filename, key, callback) {
	if (typeof key === 'function') {
		callback = key
		key = undefined
	}
	fs.readFile(filename, 'utf-8', function (err, file) {
		if (err) {
			console.log('读取文件%s出错：' + err, filePath)
            return callback(err)
		}
		var data = JSON.parse(file)
		if (typeof key === 'string') {
			data = data[key]
		}
		return callback(null, data)
	})
}

/**
 * 根据对象的属性和值拼装key
 * @param [prefix] key前缀
 * @param obj 待解析对象
 * @returns {string} 拼装的key，带前缀的形如：prefix_name_Tom_age_20，不带前缀的形如：name_Tom_age_20
 */
exports.generateKey = function (prefix, obj) {
    if (typeof prefix === 'object') {
        obj = prefix
        prefix = undefined
    }
    var attr,
        value,
        key = ''
    for (attr in obj) {
        value = obj[attr]
        //形如： _name_Tom
        key += '_' + attr.toString().toLowerCase() + '_' + value.toString()
    }
    if (prefix) {
        //形如：prefix_name_Tom_age_20
        key = prefix + key
    } else {
        //形如：name_Tom_age_20
        key = key.substr(1)
    }
    return key
}