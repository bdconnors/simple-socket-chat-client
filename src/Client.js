const io = require('socket.io-client');

class Client{
    constructor(url){
        this.url = url;
        this.socket = null;
        this.update = null;
        this.messages = [];
    }
    connect(update){
        this.update = update;
        this.socket = io(this.url);
        this.socket.on("connect_failed", () => {
            console.log('connection to chat failed retrying in 1000 ms');
            setTimeout(this.connect.bind(this), 1000);
        });
        this.socket.on("load", this.load.bind(this));
    }
    load(data){
        this.messages = data.map((item)=>{
            return {id:item.id,authorId:item.authorId,message:item.message,createdOn:new Date(item.createdOn)};
        });
        this.update(this.messages);
    }
    submit(data){
        this.socket.emit("submit",data);
    }
}
module.exports = Client;