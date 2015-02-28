/* jshint globalstrict: true */
/* global Scope: false */
'use strict';

describe('prim', function() {
	describe('parse', function() {
		it('takes empty values', function() {
			expect(prim.parse('').toString()).toBe('');
		});

		it('parses a simple tag', function() {
			expect(prim.parse('html')).toBe('<html></html>');
		});

		it('parses a nested tag', function() {
			expect(prim.parse('html { body }')).toBe('<html><body></body></html>');
		});

		it('parses a double nested tag', function() {
			expect(prim.parse('html { body { div } }')).toBe('<html><body><div></div></body></html>');
		});

		it('parses two tags', function() {
			expect(prim.parse('div div')).toBe('<div></div><div></div>');
		});

		it('parses three distinct tags', function() {
			expect(prim.parse('div i span')).toBe('<div></div><i></i><span></span>');
		});

		it('parses mixed nested and distinct tags', function() {
			expect(prim.parse('div { span } i span')).toBe('<div><span></span></div><i></i><span></span>');
		});

		it('parses mixed doubled nested and distinct tags', function() {
			expect(prim.parse('div { span div { hr }} i span { u b { span } }')).toBe('<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>');
		});

		it('parses mixed doubled nested and distinct tags with mimimal spaces', function() {
			expect(prim.parse('div{span div{hr}}i span{u b{span}}')).toBe('<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>');
		});

		it('parses empty nested tag', function() {
			expect(prim.parse('html {}').toString()).toBe('<html></html>');
		});
	});

});
