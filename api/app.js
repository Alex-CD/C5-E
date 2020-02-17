var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var redis = require("redis").createClient(6379);
const { Client } = require('pg')
const client = new Client()



console.log("Server stopping.");