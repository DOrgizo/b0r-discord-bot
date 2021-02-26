module.exports = {
	name: 'echo',
	description: "repite lo que el usuario dice",
	execute(msg, args) {
		msg.channel.send(args.join(' '))
	}
}