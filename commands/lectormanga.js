const SetInterval = require('set-interval') 
const fs = require('fs')
const json = fs.readFileSync('./gayDump.json')
const gayDump = JSON.parse(json)
const TIME = 7.2e+6 //3.6e+6 = 60 minutes (1 hour), 7.2e+6 = 120 minutos (2 hours)
const gayNum = 5142 // number of gay mangas or just gayDump.length

module.exports = (activeServers , msg) => {

	if(activeServers[msg.channel.id] === true) msg.channel.send("Pendiente de que te coja 2 veces maldito marico?\nYa esta activa la vaina deja la mariquera")
	else {	
		msg.channel.send(":hot_face:")

		SetInterval.start(() => {

		let rand = Math.floor(Math.random() * gayNum)
		msg.channel.send('```' + gayDump[rand].title + '\n\n' + gayDump[rand].description + '```')
			}, TIME, msg.channel.id)

		activeServers[msg.channel.id] = true
		}
}