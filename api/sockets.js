module.exports = function Sockets(io, sessions, sockets){

    var chat = require('./chat')();
    var session = require('./sessions')();


    io.on('connection', function(socket){

        socket.on('createRoom', function(){
            
        });
    });
}