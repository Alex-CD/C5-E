var assert = require('chai').assert;
var crypto = require('crypto');
var moment = require('moment');

var Session = require('../sessions')
var dbStub = require('./stubs/dbStub');
var redisStub = require('./stubs/redisStub');




describe('sessions', function () {
    var db;
    var redis;
    var session;

    beforeEach(function(){
        db = new dbStub();
        redis = new redisStub();
        session = new Session(db, redis);
    });

    

    describe('#createSession', function () {
        it('should create redis and db records for this new session', function () {
        
        });
    });
});