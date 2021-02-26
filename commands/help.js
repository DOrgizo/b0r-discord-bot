const helpM = `
COMANDOS DEL BOT: 

Atención los comandos van sin corchetes SIN CORCHETES
SIN CORCHETES
SIN C O R C H E T E S

$help
$version
$echo [texto a repetir por el bot]
$price [criptomoneda]
$calc [expresión]
$calc help
$localbtc [divisa en formato ISO]
$dice [caras del dado] [cantidad de dados]
$dolartoday
$awake (solo disponible para Nanone)
$sleep (solo disponible para Nanone) 
b0r cuanto cuesta [producto]
`

module.exports = {
	name: 'help',
	description: "lista de comandos",
	execute(msg, args) {
		msg.channel.send(`\`\`\`${helpM}\`\`\``)
	}
}