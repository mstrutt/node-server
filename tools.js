module.exports = {
	setMimeTypes: function (request, response) {
		var url = require('url'),
			path = url.parse(request.url).pathname;
			
		switch (path.substring(path.lastIndexOf('.'))) {
			case '.ico':
				response.setHeader('Content-Type', 'image/x-icon');
				response.setHeader('Cache-Control', 'public, max-age=2592000');
				break;
			case '.css':
				response.setHeader('Content-Type', 'text/css');
				response.setHeader('Cache-Control', 'public, max-age=2592000');
				break;
			case '.js':
				response.setHeader('Content-Type', 'text/javascript');
				response.setHeader('Cache-Control', 'public, max-age=2592000');
				break;
			default: // '.html'
				response.setHeader('Content-Type', 'text/html');
		}
	},
	template: function template (path, data) {
		var fs = require('fs'),
			url = require('url'),
			html = fs.readFileSync(path);

		function match () {
			var keys = arguments[1].split('.'),
				drill = data;
			keys.forEach(function (key) {
				drill = drill[key];
			});
			return drill;
		}

		function include () {
			return template(url.resolve(path, arguments[1]), data);
		}

		return html.toString()
			.replace(/<%=.((\.?[a-z]*)*).%>/g, match)
			.replace(/<%@.include\(['"](.*)['"']\).%>/g, include);
	}
};