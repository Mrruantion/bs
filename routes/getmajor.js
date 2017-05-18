var express = require('express');
var router = express.Router();
var app = express();
var data=require('../database/dbConnect');
// var sessionId;  //存储session值
// var sessionName;
var router = require('./index');

router.get('/major',function(res,req,next){
	var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from major ", function(result){
        console.log(result)
        res.json(result)
    });
})