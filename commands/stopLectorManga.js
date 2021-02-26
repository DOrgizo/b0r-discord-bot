const SetInterval = require('set-interval')
const {masterId} = require('../config.json')

module.exports = {
	name: 'sleep',
	description: "Para detener al intervalo de lectormanga.js",
	execute(msg, args) {
		if(msg.author.id !== masterId) return

		if(activeServers[msg.channel.id]) {
			msg.channel.send(':pleading_face:')
			SetInterval.clear(msg.channel.id)
			delete activeServers[msg.channel.id]	
		}
		else {
			msg.channel.send("**No hay :hot_face: activos**")
		}
		
	}
}