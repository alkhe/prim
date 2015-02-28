/* jshint globalstrict: true */
/* global Scope: false */
'use strict';

describe('prim', function() {
	describe('parse', function() {
		it('parses mixed strings and tags', function() {
			expect(prim.parse('div "Hello" img/')).toBe('<div></div>Hello<img />');
		});

		it('parses strings inside tags', function() {
			expect(prim.parse('div { "Hello" }')).toBe('<div>Hello</div>');
		});

		it('parses plain strings', function() {
			expect(prim.parse('"Hello"')).toBe('Hello');
		});

		it('parses mixed self closing and nested tags', function() {
			expect(prim.parse('img(src="/img/logo.png")/ div { img(src="/img/logo.png")/ } img/img/')).toBe('<img src="/img/logo.png" /><div><img src="/img/logo.png" /></div><img /><img />');
		});

		it('parses attributes with solidi on self closing tags', function() {
			expect(prim.parse('img(src="/img/logo.png")/')).toBe('<img src="/img/logo.png" />');
		});

		it('cannot parse tags starting with solidi', function() {
			expect(function() {
				prim.parse('/div');
			}).toThrow();
		});

		it('parses self closing tags', function() {
			expect(prim.parse('img/')).toBe('<img />');
		});

		it('parses multiple mixed attribute lists', function() {
			expect(prim.parse('div(attr="value" value="text" checked href="#" focused)')).toBe('<div attr="value" value="text" checked href="#" focused></div>');
		});

		it('parses single boolean attribute lists', function() {
			expect(prim.parse('div(attr)')).toBe('<div attr></div>');
		});

		it('parses multiple attribute lists', function() {
			expect(prim.parse('div(attr="value" value="text" href="#")')).toBe('<div attr="value" value="text" href="#"></div>');
		});

		it('parses single attribute lists', function() {
			expect(prim.parse('div(attr="value")')).toBe('<div attr="value"></div>');
		});

		it('parses empty attribute lists', function() {
			expect(prim.parse('div()')).toBe('<div></div>');
		});

		it('parses newlines between braces', function() {
			expect(prim.parse('html {\n\n}')).toBe('<html></html>');
		});

		it('parses empty nested tag', function() {
			expect(prim.parse('html {}')).toBe('<html></html>');
		});

		it('parses mixed doubled nested and distinct tags with mimimal spaces', function() {
			expect(prim.parse('div{span div{hr}}i span{u b{span}}')).toBe('<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>');
		});

		it('parses mixed doubled nested and distinct tags', function() {
			expect(prim.parse('div { span div { hr }} i span { u b { span } }')).toBe('<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>');
		});

		it('parses mixed nested and distinct tags', function() {
			expect(prim.parse('div { span } i span')).toBe('<div><span></span></div><i></i><span></span>');
		});

		it('parses three distinct tags', function() {
			expect(prim.parse('div i span')).toBe('<div></div><i></i><span></span>');
		});

		it('parses two tags', function() {
			expect(prim.parse('div div')).toBe('<div></div><div></div>');
		});

		it('parses a double nested tag', function() {
			expect(prim.parse('html { body { div } }')).toBe('<html><body><div></div></body></html>');
		});

		it('parses a nested tag', function() {
			expect(prim.parse('html { body }')).toBe('<html><body></body></html>');
		});

		it('parses a simple tag', function() {
			expect(prim.parse('html')).toBe('<html></html>');
		});

		it('takes empty values', function() {
			expect(prim.parse('')).toBe('');
		});
	});
});
