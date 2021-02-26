const SetInterval = require('set-interval') 
const gayDump = require('./gayDump.json')
const TIME = 7.2e+6 // 3.6e+6 = 60 minutes (1 hour), 7.2e+6 = 120 minutes (2 hours), 5.4e+6 = 90 minutes (1 hours and 30 minutes)
const gayNum = gayDump.length // number of gay mangas or just gayDump.length
const {masterId} = require('../config.json')
module.exports = {
	name: 'awake',
	description: "comando para enviar un manga tipo 'boys love' cada x cantidad de tiempo",
	execute(msg, args) {

		if(msg.author.id !== masterId) return

		if(activeServers[msg.channel.id]) msg.channel.send("**¿Pendiente de que te coja 2 veces maldito marico?.\nYa esta activa la vaina deja la mariquera.**")

		else {	
		msg.channel.send(':hot_face:')

		SetInterval.start(() => {

			let rand = Math.floor(Math.random() * gayNum)
			msg.channel.send('```' + gayDump[rand].title + '\n\n' + gayDump[rand].description + '```') 

		}, TIME, msg.channel.id)

		activeServers[msg.channel.id] = true
		}
	}
}