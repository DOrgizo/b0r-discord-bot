const mexp = require('math-expression-evaluator')

const calcHelp = `
    Supported Maths Symbols
	+       Addition Operator eg. 2+3 results 5
	-       Subtraction Operator eg. 2-3 results -1
	/       Division operator eg 3/2 results 1.5 
	*       Multiplication Operator eg. 23 results 6
	Mod     Modulus Operator eg. 3 Mod 2 results 1
	(       Opening Parenthesis
	)       Closing Parenthesis
	Sigma   Summation eg. Sigma(1,100,n) results 5050
	Pi      Product eg. Pi(1,10,n) results 3628800
	n       Variable for Summation or Product
	pi      Math constant pi returns 3.14
	e       Math constant e returns 2.71
	C       Combination operator eg. 4C2 returns 6
	P       Permutation operator eg. 4P2 returns 12
	!       factorial operator eg. 4! returns 24
	log     logarithmic function with base 10 eg. log 1000 returns 3
	ln      natural log function with base e eg. ln 2 returns .3010 
	pow     power function with two operator pow(2,3) returns 8
	^       power operator eg. 2^3 returns 8
	root    underroot function root 4 returns 2`

module.exports = {
	name: 'calc',
	description: "Evaluador de expresiones matematicas",
	execute(msg, args) {
		if(args[0] === 'help') msg.channel.send(`\`\`\`${calcHelp}\`\`\``)

		else {
			const calc = args.join(' ')

			try {
				const result = mexp.eval(calc)
				msg.channel.send(`\`\`${result}\`\``)

			} catch(error) {
				msg.channel.send(`\`\`SYNTAX ERROR\`\``)
			}
		}
	}
}