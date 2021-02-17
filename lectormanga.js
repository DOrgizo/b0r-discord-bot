const fs = require('fs')
const json = fs.readFileSync('./gayDump.json')
const gayDump = JSON.parse(json)
const TIME = 2.4e+6

module.exports = msg => {

	interval = setInterval(() => {
		let rand = Math.floor(Math.random() * 5180)
		msg.channel.send('```' + gayDump[rand].title + '\n\n' + gayDump[rand].description + '```')
	}, TIME)
}