//IMPORTS 
const express = require('express');
const mongoose = require('mongoose');
const Messages = require('./dbMessages')
const Pusher = require('pusher')
const cors = require ('cors')


//init the app
const app = express();
const PORT = process.env.PORT || 5000
const pusher = new Pusher({
    appId: "1164543",
    key: "1c250ec44e4381894730",
    secret: "7a85c3e625513d1e05f4",
    cluster: "us2",
    useTLS: true
  });
  
  
//middlewares
app.use(express.json());
//DO NOT USE THIS IN PRODUCTION !! WE BREAK ALL ENCRYPTION HERE BY GIVING ANYONE ACCESS TO CALL OUR SERVER this is something to do with cors header.
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","*");
    next();
});

//db connections 
const connectionURL = "mongodb+srv://admin:nirrep98@cluster0.yazsk.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connectionURL,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
});


mongoose.connection.once('open',function()
{
    console.log("The DB is Connected 🟢");
    const msgCollection = db.collection('messages');
    const changeStream = msgCollection.watch();
    changeStream.on('change',(change)=>{

        if(change.operationType ==='insert')
        {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',{
                name:messageDetails.name,
                message:messageDetails.message,
                timestamp:messageDetails.timestamp,
                received:messageDetails.received
            })
        }
        else
        {
            console.log("Error Triggering Pusher 🔴")
        }
        
    })
})

//???

//api routes 
app.get('/',(req,res)=>{
    res.status(200).send("Hello World 🟢")
})

app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send("Could Not Create Entry 🔴",err)
        }
        else
        {
            res.status(201).send(`Message is created 🟢 ${data}`)
        }
    })
})

app.get('/messages/sync',(req,res)=>
{
    Messages.find({},(err,data)=>{
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
            res.status(200).send(data)
        }
    })
})

//app listen 
app.listen(PORT,()=>{
    console.log("The Server Is Up And Running: 🟢", )
})

//  nirrep98