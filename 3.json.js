var http = require("http")
var ws = require("nodejs-websocket")
var fs = require("fs")

http.createServer(function (req, res) {
	fs.createReadStream("index.html").pipe(res)
}).listen(process.env.PORT)

var server = ws.createServer(function (connection) {
	connection.on("text", function (str) {
		console.log(str)
		var objJSON = JSON.parse(str);
		if (connection.nickname === null) {
			connection.nickname = objJSON.id
			var nick = "{\"id\":\""+objJSON.id+"\", \"msg\":\" connected!\"}"
			console.log(nick)
			broadcast(nick)
		} else{
			var mensaje = "{\"id\":\""+objJSON.id+"\",\"msg\":\""+objJSON.msg+"\",\"privado\":\""+objJSON.privado+"\",\"dst\":\""+objJSON.dst+"\"}"
			broadcast(mensaje)
		}
	})
	connection.on("close", function () {
		broadcast("{id:"+connection.nickname+" left\"")
	})
})
server.listen(8081)

function broadcast(str) {
	server.connections.forEach(function (connection) {
		connection.sendText(str)
	})
}

console.log(process.env.PORT)