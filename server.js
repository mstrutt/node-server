var config = {
		ip: '0.0.0.0',
		port: '9001',
		root: 'testsite',
		index: 'index.html'
	},
	tools = require('./tools'),
	http = require('http'),
	url = require('url'),
	fs = require('fs');

var routes = [{
		url: '/',
		template: config.index,
		title: 'Home'
	},{
		url: '/other',
		template: 'other.html',
		title: 'Other'
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

	function createPage (route) {
		response.write(tools.template(config.root+'/'+route.template, {page: {title: route.title}}));
		response.end();
	}

	var path = url.parse(request.url).pathname;

	tools.setMimeTypes(request, response);

	if (!routes.some(function (route) {
		if (route.url === path) {
			createPage(route);
			return true;
		}
	})) {
		serveFile(path);
	}

}).listen(config.port, config.ip);

console.log('Server running at http://'+config.ip+':'+config.port+'/');