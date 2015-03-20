var prim = require('./lib/prim.js');

var VM = function(o) {
		eval((function() {
			var src = '';
			for (var prop in o) {
				if (o.hasOwnProperty(prop)) {
					src += 'var ' + prop + '=o[\'' + prop + '\'];';
				}
			}
			return src;
		})());
		return function() {
			return eval(arguments[0]);
		};
	},
	EmptyVM = function() {
		return function() {
			return eval(arguments[0]);
		};
	};

module.exports.parse = function(template, args) {
	return prim.parse(template, {}, args ? new VM(args) : new EmptyVM());
};
