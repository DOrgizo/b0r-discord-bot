const excelsior = require('./excelsior.js')
const caraota = require('./caraota.js')
const elplazas = require('./elplazas.js')
const fetch = require('node-fetch')
const TIME = 8.64e+7 // 8.64e+7 = 24 hours


const test = async () => {

	let data = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
	let dolar = await data.json()

	console.time('test')
	await elplazas(dolar.USD.promedio_real)
	await caraota(dolar.USD.promedio_real)
	await excelsior(dolar.USD.promedio_real) 
	console.timeEnd('test')

	
}


setInterval(() => test(), TIME)