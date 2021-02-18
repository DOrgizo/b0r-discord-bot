const SetInterval = require('set-interval') 
const fs = require('fs')
const json = fs.readFileSync('./gayDump.json')
const gayDump = JSON.parse(json)
const TIME = 3.6e+6 // 60 minutes
const gayNum = 5142 // number of gay mangas or just gayDump.length

module.exports = msg => {

	SetInterval.start(() => {
		let rand = Math.floor(Math.random() * gayNum)
		msg.channel.send('```' + gayDump[rand].title + '\n\n' + gayDump[rand].description + '```')
	}, TIME, msg.channel.id)
}