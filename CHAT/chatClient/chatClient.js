const {Socket} = require('net');
const readline = require('readline').createInterface({
    input:process.stdin,
    output:process.stdout,

});

const chat = (host, port, user) =>{
    const net = new Socket();
    net.connect({host, port});
    net.setEncoding("utf-8");

    net.on('connect', () =>{
        console.log("Conectado");
        let info = 'j^' + user + '@192.168.0.1^-^-^';
        net.write(info);
        console.log("Escriba 'SALIR' para terminar");
    })
    net.on('data', (mensaje) =>{
        console.log(mensaje);
    })
    readline.on('line', (mensaje) =>{
        var txt = 'm^' + user + '@' + host + '^-^' + mensaje + '^';
        if(mensaje == 'SALIR'){
            txt = 'p^' + user + '@' + host + '^-^-^';
        }
        net.write(txt);
    })
    net.on('close', () =>{
        console.log("Disconnected");
        process.exit(0);
    })
    net.on('error', (err) => {
        console.log(err);
    })
}

const main = () => {
    if (process.argv.length != 5){
        console.log("node chatclient ipserver puerto usuario")
        process.exit(0);
    }
    let [ , , host, port, user] = process.argv;
    port = Number(port);
    chat(host, port, user);
}

if (module === require.main){
    main();
}