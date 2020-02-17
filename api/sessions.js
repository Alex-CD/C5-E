var session = require('./model/session');

module.exports = class Session {

    constructor(db, redis){
        this.db = db;
        this.redis = redis;
    }

    createSession(sessionName, sessionPassword, creatorIP, callback){
        var queryText = "";
        this.db.query('', {sessionName, sessionPassword, creatorIP, callback})
        callback();
    }

    joinSession(callback){
        
        callback();
    }

    getSession(callback){
        callback();
    }

    leaveSession(callback){
        callback();
    }

    kickUsers(callback){
        callback();
    }

}