const net = require('net');
var sockets = new Array();

function enviaMensaje(mensaje){
    console.log(mensaje);
    for(var i = 0; i < sockets.length; i++){
        sockets[i].write(mensaje);
    }
}

function posicionSocket(socket){
    for (var i = 0; i < sockets.length; i++){
        if(sockets[i] == socket){
            return i;
        }
    }
    return null;
}


function inicio(socket){
    socket.on('data', data => {
        peticion = data.toString('utf-8');
        peticion = peticion.replace(/[^A-Za-z0-9.@\^\-\s]/g, '');

        tokens = peticion.split('^');

        if(tokens[0] == 'j'){
            msg = 'm^server@localhost^-^' + tokens[1].split('@')[0] + ' se unió desde ' + tokens[1].split('@')[1]+ "\n";
        }else if(tokens[0] == 'p'){
            pos = posicionSocket(socket);
            if(pos != null){
                sockets.splice(pos, 1);
                socket.end();
            }
            msg = 'm^server@localhost^-^' + tokens[1].split('@')[0] + ' se marchó desde ' + tokens[1].split('@')[1]+ "\n";
        }else{
            msg = peticion;
        }
        enviaMensaje(msg);
    })
    socket.on('close', () =>{
        console.log("Se cerro la conexión del cliente");
    })
    socket.on('error', (err) =>{
        console.log(err);
        process.exit(0);
    })
}

const server = net.createServer(socket => {
    sockets.push(socket);
    inicio(socket);
}).on('close', () =>{
    console.log("Conexión cerrada");
    server.end();
}).on('error', err => {
    console.log("HAY UN ERROR");
    throw err;
})

server.listen(1090, 'localhost', () => {
    console.log('Active Server!');
});