const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
 

let onlineCount = 0;
 
app.get('/', (req, res) => {
    res.sendFile( __dirname + '/chatroom.html');
});
 
io.on('connection', (socket) => {
   
    onlineCount++;
   
    io.emit("online", onlineCount);
 
    socket.on("greet", () => {
        socket.emit("greet", onlineCount);
    });
 
    socket.on("send", (msg) => {
        // msg content key is less than 2,terminate execution.
        if (Object.keys(msg).length < 2) return;
 
        
        io.emit("msg", msg);
    });
 
    socket.on('disconnect', () => {
      
        onlineCount = (onlineCount < 0) ? 0 : onlineCount-=1;
        io.emit("online", onlineCount);
    });
});
 
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});