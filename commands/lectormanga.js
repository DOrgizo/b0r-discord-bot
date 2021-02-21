const SetInterval = require('set-interval') 
const fs = require('fs')
const json = fs.readFileSync('./gayDump.json')
const gayDump = JSON.parse(json)
const TIME = 5.4e+6 //3.6e+6 = 60 minutes (1 hour), 7.2e+6 = 120 minutes (2 hours), 5.4e+6 = 90 minutes (1.5 hours)
const gayNum = 5142 // number of gay mangas or just gayDump.length

module.exports = function(activeServers , msg) {

	if(activeServers[msg.channel.id]) msg.channel.send('**' + "¿Pendiente de que te coja 2 veces maldito marico?.\nYa esta activa la vaina deja la mariquera." + '**')
	else {	
		msg.channel.send(":hot_face:")

		SetInterval.start(function(msg) {

			let rand = Math.floor(Math.random() * gayNum)
			msg.channel.send('```' + gayDump[rand].title + '\n\n' + gayDump[rand].description + '```')

		}, TIME, msg.channel.id)

		activeServers[msg.channel.id] = true
		}
}