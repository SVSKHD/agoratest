const express = require("express")
const {RtcTokenBuilder, RtcRole} = require('agora-access-token');
const Server = express()
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const appId = process.env.APPID
const appCertificate = process.env.Certificate


const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
  }


const generateToken = (req,res) =>{
    res.header('Access-Control-Allow-Origin', '*');
    const channelName = req.query.channelName;
    if(!channelName){
        return res.status(500).json({'error':'Channel is Required'})
    }
    let uid = req.query.uid
    if(!uid || uid==''){
        uid = 0 
    }
    let role = RtcRole.SUBSCRIBER
    if(req.query.role == 'publisher'){
        role = RtcRole.PUBLISHER
    }
    let expiryTime = req.query.expiryTime
    if(!expiryTime || expiryTime == ""){
        expiryTime == 3600
    }else{
        expiryTime = parseInt(expiryTime , 10)
    }
    const currentTime = Math.floor(Date.now()/1000)
    const privelageExpireTime = currentTime + expiryTime
    const token = RtcTokenBuilder.buildTokenWithUid(appId , appCertificate , channelName , uid , role , privelageExpireTime)
    
    return res.json({'token' : token})
}

Server.get("/access-token" , nocache , generateToken)


const PORT = process.env.PORT
Server.listen(PORT , ()=>{
    console.log(`Server is up at ${PORT}`)
})