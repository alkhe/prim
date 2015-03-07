module.exports.use = function(config) {
	var parse = config.parser.parse;
	config.parser.parse = function(input, context) {
		return parse(input, {}, context);
	};
}
