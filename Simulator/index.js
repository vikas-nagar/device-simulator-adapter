const express = require('express');
const app = new express();
const morgan = require('morgan');
const axios = require('axios');

app.use(morgan('dev')); // Can monitor the called api's

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended : false }));
 
// parse application/json
app.use(express.json());

app.get("/",(req,res)=>{
    res.json("Welcome to Simulator");
})

sendLoginPacket = async () => {
    try {
        let loginPacketData = { packet : '78 78 11 01 03 51 60 80 80 77 92 88 22 03 32 01 01 AA 53 36 0D 0A'};
        console.log("Sending the login packets as \n",loginPacketData);
        //Sending the login packet to Adapter
        let options = {
            method: 'post',
            url: 'http://localhost:4000/loginPacket',
            timeout: 1000 * 5, // Wait for 5 seconds
            data: loginPacketData
        }
        let loginResponse = await axios(options);    
        if(loginResponse.data.success){
            console.log(loginResponse.data);
            sendHearBeatPacket();
            sendGpsPacket();
        }else{
            sendLoginPacket();
            console.log(`Some error occured in login packets-->`, loginResponse.data, loginResponse.error);
        }
    } catch(e) {
        console.log("Error occured ", e);
    }
}

sendHearBeatPacket = async () => {
    try {
        let heartBeatPacketData = { packet : '78 78 0B 23 C0 01 22 04 00 01 00 08 18 72 0D 0A' };
        let options = {
            method: 'post',
            url: 'http://localhost:4000/heartBeatPacket',
            data: heartBeatPacketData
        }
        let hearBeatResponse = await axios(options);
        if(hearBeatResponse.data.success){
            console.log(hearBeatResponse.data);
            console.log("Sending the heart beat packets as \n", heartBeatPacketData);
            await sendHearBeatPacket();
        }else{
            console.log(`Some error occured in heartbeat packets`, hearBeatResponse.data, hearBeatResponse.error);
        }
    } catch(e) {
        console.log("Error occured ", e);
    }
}

sendGpsPacket = async () => {
    try {
        let gpsPacketData = { packet : '78 78 22 22 0F 0C 1D 02 33 05 C9 02 7A C8 18 0C 46 58 60 00 14 00 01 CC 00 28 7D 00 1F 71 00 00 01 00 08 20 86 0D 0A' };
        let options = {
            method: 'post',
            url: 'http://localhost:4000/gpsPacket',
            data: gpsPacketData
        }
        let gpsPacketResponse = await axios(options);
        if(gpsPacketResponse.data.success){
            console.log(gpsPacketResponse.data);
            console.log("Sending the GPS packets as \n", gpsPacketData);
            await sendGpsPacket();
        }else{
            console.log(`Some error occured in GPS packets`, gpsPacketResponse.data, gpsPacketResponse.error);
        }
    } catch(e) {
        console.log("Error occured ", e);
    }
}

sendLoginPacket(); //Initiating the login

app.listen(3000, (err,res)=>{
    if(err)console.log("Error while starting the server");
    console.log("Simulator Server successfully started at 3000");
})