"use strict";

var elaborate = function elaborate(fn) {
	try {
		fn();
	} catch (e) {
		console.log(JSON.stringify(e, null, 4));
	}
};

describe("prim", function () {
	describe("parse", function () {

		it("short circuits on EOM character and recurses", function () {
			expect(prim.parse("div { span { div { 'Hello'%div span { 'Hello'%")).toBe("<div><span><div>Hello</div></span></div><div></div><span>Hello</span>");
		});

		it("short circuits on EOM character and continues", function () {
			expect(prim.parse("div { span { div { 'Hello'%div span")).toBe("<div><span><div>Hello</div></span></div><div></div><span></span>");
		});

		it("short circuits on EOM character", function () {
			expect(prim.parse("div { span { div { 'Hello'%")).toBe("<div><span><div>Hello</div></span></div>");
		});

		it("retains state changes in context objects in evalnodes", function () {
			expect(prim.parse("#{ (prop = 5) && 3 } #{ prop }", { prop: 4 })).toBe("35");
		});

		it("parses and evaluates context arrays in evalnodes", function () {
			expect(prim.parse("#{ arr.join() }", { arr: [2, 3, 5] })).toBe("2,3,5");
		});

		it("parses and evaluates context function literals in evalnodes", function () {
			expect(prim.parse("#{ fun() }", { fun: function fun() {
					return 5;
				} })).toBe("5");
		});

		it("parses and evaluates function literals in evalnodes", function () {
			expect(prim.parse("#{ (function() { return 5; })() }")).toBe("5");
		});

		it("parses and evaluates functions in evalnodes", function () {
			expect(prim.parse("#{ Math.log(Math.E) }")).toBe("1");
		});

		it("parses and evaluates double property accesses in evalnodes", function () {
			expect(prim.parse("#{ prop1.prop2 }", { prop1: { prop2: 5 } })).toBe("5");
		});

		it("parses and evaluates expressions in evalnodes", function () {
			expect(prim.parse("#{ prop * 10 + 5 }", { prop: 5 })).toBe("55");
		});

		it("parses and evaluates variables in evalnodes", function () {
			expect(prim.parse("#{ prop }", { prop: 5 })).toBe("5");
		});

		it("parses raw pipe strings", function () {
			expect(prim.parse("\n\t\t\t\tdiv |Using Prim pipes with the pipe character: \\||\n\t\t\t")).toBe("<div>Using Prim pipes with the pipe character: |</div>");
		});

		it("parses strings with escape characters", function () {
			expect(prim.parse("\"Hello\n\t\t\t\"")).toBe("Hello\n\t\t\t");
		});

		it("parses nested tags with new lines", function () {
			expect(prim.parse("\n\t\t\t\thtml {\n\t\t\t\t\tbody {\n\t\t\t\t\t\tdiv(class=\"test\")\n\t\t\t\t\t\timg/\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t")).toBe("<html><body><div class=\"test\"></div><img /></body></html>");
		});

		it("parses mixed strings and tags", function () {
			expect(prim.parse("div \"Hello\" img/")).toBe("<div></div>Hello<img />");
		});

		it("parses strings inside tags", function () {
			expect(prim.parse("div { \"Hello\" }")).toBe("<div>Hello</div>");
		});

		it("parses plain strings", function () {
			expect(prim.parse("\"Hello\"")).toBe("Hello");
		});

		it("parses mixed self closing and nested tags", function () {
			expect(prim.parse("img(src=\"/img/logo.png\")/ div { img(src=\"/img/logo.png\")/ } img/img/")).toBe("<img src=\"/img/logo.png\" /><div><img src=\"/img/logo.png\" /></div><img /><img />");
		});

		it("parses attributes with solidi on self closing tags", function () {
			expect(prim.parse("img(src=\"/img/logo.png\")/")).toBe("<img src=\"/img/logo.png\" />");
		});

		it("cannot parse tags starting with solidi", function () {
			expect(function () {
				prim.parse("/div");
			}).toThrow();
		});

		it("parses self closing tags", function () {
			expect(prim.parse("img/")).toBe("<img />");
		});

		it("parses multiple mixed attribute lists", function () {
			expect(prim.parse("div(attr=\"value\" value=\"text\" checked href=\"#\" focused)")).toBe("<div attr=\"value\" value=\"text\" checked href=\"#\" focused></div>");
		});

		it("parses single boolean attribute lists", function () {
			expect(prim.parse("div(attr)")).toBe("<div attr></div>");
		});

		it("parses multiple attribute lists", function () {
			expect(prim.parse("div(attr=\"value\" value=\"text\" href=\"#\")")).toBe("<div attr=\"value\" value=\"text\" href=\"#\"></div>");
		});

		it("parses single attribute lists", function () {
			expect(prim.parse("div(attr=\"value\")")).toBe("<div attr=\"value\"></div>");
		});

		it("parses empty attribute lists", function () {
			expect(prim.parse("div()")).toBe("<div></div>");
		});

		it("parses newlines between braces", function () {
			expect(prim.parse("html {\n\n\t\t\t}")).toBe("<html></html>");
		});

		it("parses empty nested tag", function () {
			expect(prim.parse("html {}")).toBe("<html></html>");
		});

		it("parses mixed doubled nested and distinct tags with mimimal spaces", function () {
			expect(prim.parse("div{span div{hr}}i span{u b{span}}")).toBe("<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>");
		});

		it("parses mixed doubled nested and distinct tags", function () {
			expect(prim.parse("div { span div { hr }} i span { u b { span } }")).toBe("<div><span></span><div><hr></hr></div></div><i></i><span><u></u><b><span></span></b></span>");
		});

		it("parses mixed nested and distinct tags", function () {
			expect(prim.parse("div { span } i span")).toBe("<div><span></span></div><i></i><span></span>");
		});

		it("parses three distinct tags", function () {
			expect(prim.parse("div i span")).toBe("<div></div><i></i><span></span>");
		});

		it("parses two tags", function () {
			expect(prim.parse("div div")).toBe("<div></div><div></div>");
		});

		it("parses a double nested tag", function () {
			expect(prim.parse("html { body { div } }")).toBe("<html><body><div></div></body></html>");
		});

		it("parses a nested tag", function () {
			expect(prim.parse("html { body }")).toBe("<html><body></body></html>");
		});

		it("parses a simple tag", function () {
			expect(prim.parse("html")).toBe("<html></html>");
		});

		it("takes empty values", function () {
			expect(prim.parse("")).toBe("");
		});
	});
});
/* jshint globalstrict: true */