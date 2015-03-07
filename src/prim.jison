%lex
%%

\s+						/* skip whitespace */
[a-zA-Z]+				return 'name'
[a-zA-Z]				return 'char'
'{'						return 'lb'
'}'						return 'rb'
'('						return '('
')'						return ')'

'"'(\\['"'"'"bfnrt]|[^'"'])*'"'		return 'dstring'
"'"(\\["'"'"'bfnrt]|[^"'"])*"'"		return 'sstring'

/*'"'(?:\\[\'"'bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^'"'\\])*'"' return 'dstring'
"'"(?:\\[\"'"bfnrt/\\]|\\u[a-fA-F0-9]{4}|[^"'"\\])*"'" return 'sstring'*/

<<EOF>>					return 'EOF'

/lex

%start expressions

%%

expressions
	: root EOF
		{ console.log($1); return $1; }
	;

root
	: nodes
	;

nodes
	: nodes node { $$ = $1 + $2; }
	| { $$ = ''; }
	;

node
	: name lb nodes rb { $$ = '<' + $1 + '>' + $3 + '</' + $1 + '>'; }
 	| name { $$ = '<' + $1 + '></' + $1 + '>'; }
	| string
	;

string
	: dstring { $$ = eval($1); }
	| sstring { $$ = eval($1); }
	;
