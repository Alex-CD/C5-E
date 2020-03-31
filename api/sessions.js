var session = require('./model/session');

module.exports = class Session {

    constructor(db, redis){
        this.db = db;
        this.redis = redis;
    }

    async createSession(sessionName, sessionPassword, creatorIP){
        var queryText = "";
        this.db.query('', {sessionName, sessionPassword, creatorIP, callback})
    }

    async joinSession(){
    }

    async getSession(){
    }

    async leaveSession(){
    }

    async kickUsers(){
    }

}