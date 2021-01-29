module.exports =  function diceRoll(dice, msg) {

	const [diceFaces, numDices] = dice.slice(6).split(' ')
		let array = []

		if(diceFaces > 50) {msg.channel.send("no vas a lanzar una maldita mierda mayor a 50")}
		else if(numDices > 50) {msg.channel.send("no vas a lanzar mas de 50 dados a la vez desgraciado")}
		else {
			for(let i = 0; i < numDices; i++) {
				array.push(Math.floor(Math.random() * ((parseInt(diceFaces) + 1) - 1) + 1 ))
			}

			// esto de aqui es para que se vea como un array con corchetes y espacios
			msg.channel.send('``[' + array.join(", ") + ']``') 
		}
}