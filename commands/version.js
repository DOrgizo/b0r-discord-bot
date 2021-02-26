const {version} = require('../config.json')

module.exports = {
	name: 'version',
	description: "Vesion del bot",
	execute(msg, args) {
		msg.channel.send(`\`\`${version}\`\``)
	}
}