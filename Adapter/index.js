const express = require('express');
const app = new express();
const morgan = require('morgan');
const fs = require('fs');

app.use(morgan('dev')); // Can monitor the called api's

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : false }));
 
// parse application/json
app.use(express.json());

app.get("/",(req,res)=>{
    res.json("Welcome to Adapter");
});

app.post("/loginPacket",(req,res)=>{
    try {
        let data = req.body.packet; // Login packet we are getting    
        //Decoding goes here..............................
        res.json({ success : true, resPacket : "78 78 05 01 00 05 9F F8 0D 0A" });
    } catch(e) {
        console.log("Some Error occured ", e);
    }
});

app.post("/heartBeatPacket",(req,res)=>{
    try {
        let data = req.body.packet; // Hearbeat packet we are getting
        //Decoding goes here..............................
        res.json({ success : true, resPacket : "78 78 05 23 01 00 67 0E 0D 0A" });
    } catch(e) {
        console.log("Some Error occured ", e);
    }    
});

app.post("/gpsPacket",(req,res)=>{
    try {
        let data = req.body.packet; // GPS packet we are getting
        //saving the decoded data in file ......
        //Decoding goes here..............................
        fs.writeFileSync('tracker.txt', `\n ${new Date().toISOString()} --> ${data}`,{ flag: 'a' });
        res.json({ success : true, resPacket : "78 78 22 22 0F 0C 1D 02 33 05 C9 02 7A C8 18 0C 46 58 60 00 14 00 01 CC 00 28 7D 00 1F 71 00 00 01 00 08 20 86 0D 0A" });
    } catch(e) {
        console.log("Some error occured ", e);
    }    
});

app.listen(4000, (err,res)=>{
    if(err)console.log("Error while starting the server");
    console.log("Adapter Server successfully started at 4000");
});