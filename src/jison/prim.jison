%{

%}

%lex

startchar										[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]
regchar											{startchar} | [-\.0-9\u00B7\u0300-\u036F\u203F-\u2040]

%x code raw dstring sstring
%%

\s+								/* skip whitespace */
{startchar}{regchar}*			return 'name'
'{'								return 'lb'
'}'								return 'rb'
'('								return 'lp'
')'								return 'rp'
'='								return 'eq'
'/'								return 'solid'

'#{'							%{
									this.begin('code');
									this.codelevel = 1;
									this.codebuf = '';
								%}
<code>[^\{\}]+					this.codebuf += yytext;
<code>\{						%{
									this.begin('code');
									this.codelevel++;
									this.codebuf += yytext;
								%}
<code>\}						%{
									this.popState();
									this.codelevel--;
									if (this.codelevel == 0) {
										yytext = this.codebuf;
										return 'code';
									}
									else {
										this.codebuf += yytext;
									}
								%}

'|'								%{
									this.begin('raw');
									this.rawtext = '';
								%}
<raw>[^\\\|]+					this.rawtext += yytext;
<raw>\\\|						this.rawtext += '|';
<raw>\\							this.rawtext += '\\';
<raw>'|'						%{
									this.popState();
									yytext = this.rawtext;
									return 'raw';
								%}

\"								%{
									this.begin('dstring');
									this.stringtext = '"';
								%}
<dstring>(\\[\'\"bfnrt]|[^\"\\])+	this.stringtext += yytext;
<dstring>\"						%{
									this.popState();
									yytext = this.stringtext + yytext;
									return 'dstring';
								%}

\'								%{
									this.begin('sstring');
									this.stringtext = "'";
								%}
<sstring>(\\[\'\"bfnrt]|[^\'\\])+	this.stringtext += yytext;
<sstring>\'						%{
									this.popState();
									yytext = this.stringtext + yytext;
									return 'sstring';
								%}

<<EOF>>							return 'EOF'
.								return yytext

/lex

%start expressions
%parse-param __undef vm
%%


expressions
	: root EOF { return $1; }
	;

root
	: nodes
	;

nodes
	: nodes node -> $1 + $2
	| -> ''
	;

node
	: nodebuilder -> ($1.selfclosing ? '<' + $1.name + $1.attributes + ' />' : '<' + $1.name + $1.attributes + '>' + $1.children + '</' + $1.name + '>')
	| code -> vm($1)
	| rawstring
	;

nodebuilder
	: nodebuilder lb nodes rb { console.log(JSON.stringify(@3)); $$ = $1; $$.children += $3; }
	| nodebuilder lp attributes rp { $$ = $1; $$.attributes += $3; }
	| nodebuilder raw { $$ = $1; $$.children += $2; }
	| nodebuilder solid { $$ = $1; $$.selfclosing = true; }
	| name { $$ = { name: $1, children: '', attributes: '', selfclosing: false }; }
	;

attributes
	: attributes attribute -> $1 + ' ' + $2
	| -> ''
	;

attribute
	: name eq string -> $1 + $2 + $3
	| name
	;

string
	: dstring
	| sstring
	;

rawstring
	: string -> $1.substring(1, $1.length - 1)
	;
