var fs = require('fs');

exports.getConfig = function (filename, key, callback) {
	if (typeof key === 'function') {
		callback = key
		key = undefined
	}
	fs.readFile(filename, 'utf-8', function (err, file) {
		if (err) {
			console.log('读取文件%s出错：' + err, filePath);
            return callback(err);
		}
		var data = JSON.parse(file)
		if (typeof key === 'string') {
			data = data[key]
		}
		return callback(null, data)
	})
}