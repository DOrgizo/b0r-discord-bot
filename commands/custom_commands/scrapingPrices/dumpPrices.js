const excelsior = require('./excelsior.js')
const caraota = require('./caraota.js')
const TIME = 8.64e+7 // 8.64e+7 = 24 hours

setInterval(() => {
	excelsior()
	caraota()
}, TIME)