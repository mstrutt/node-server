var config = {
		ip: '0.0.0.0',
		port: '9001',
		index: 'index.html',
		root: 'testsite/'
	},
	tools = require('./tools'),
	http = require('http'),
	url = require('url'),
	fs = require('fs');

var routes = [{
		url: '/',
		template: config.index
	},{
		url: '/other',
		template: 'other.html'
	}];

http.createServer(function (request, response) {

	function fourOhFour () {
		response.statusCode = 404;
		response.end('404');
		console.log(path+' went 404 :(');
	}

	function serveFile (path) {
		var data;
		path = config.root+path;
		fs.exists(path, function (exists) {
			if (exists) fs.readFile(path, function (err, data) {
				/*header.headers['Last-Modified'] = (fs.statSync(path)).mtime;*/
				response.end(data);
				console.log('serving '+path);
			});
			else fourOhFour();
		});
	}

	var path = url.parse(request.url).pathname;

	tools.setMimeTypes(request, response);

	if (!routes.some(function (route) {
		if (route.url === path) {
			serveFile(route.template);
			return true;
		}
	})) {
		serveFile(path.substring(1));
	}

}).listen(config.port, config.ip);

console.log('Server running at http://'+config.ip+':'+config.port+'/');