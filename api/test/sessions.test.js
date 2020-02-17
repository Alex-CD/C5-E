var assert = require('chai').assert;
var crypto = require('crypto');
var moment = require('moment');

var Session = require('../sessions')

class dbStub {
    constructor() {
        this.sessionID;
        this.queryText;
        this.queryValues;
    }

    query(text, values, callback) {
        this.queryText = text;
        this.queryValues = values;
    }
}

class redisStub {

    constructor() {
        this.keyText;
        this.valueText;
    }

    set(key, value, response) {
        this.keyText = key;
        this.valueText = value;
        response = true;
    }

    hset() {

    }

    hkeys() {

    }


}

describe('sessions', function () {

    describe('#createSession', function () {
        it('should create redis and db records for this new session', function () {
            var db = new dbStub();
            var redis = new redisStub();

            var session = new Session(db, redis);

            session.createSession("Hello", "world", "192.168.0.1", function (err) {
                assert.isNotOk(err, 'an error should not have occured');
                assert.isOk(db.queryText, 'A query has been submitted to the DB');
                assert.isOk(db.queryValues.length, 'Values have been included in the query');
            });
        });

        it('should submit a redis record for this new session', function (err) {
            var db = new dbStub();
            var redis = new redisStub();
            var session = new Session(db, redis);

            session.createSession("Hiworld", "pass2", "192.168.0.1", function (err) {
                assert.isNotOk(err, 'an error should not have occured');
                assert.isOk(redis.keyText, 'a key should have been set');
                assert.isOk(redis.valueText, 'a value should have set');
            });
        });

        it('session should have a unique UID', function () {
            var db = new dbStub();
            var session = new Session(db);

            session.createSession("TestName1", "TestPass", "192.168.0.1", function (err) {
                var testSessionID = session.sessionID;

                session.createSession("TestName2", "TestPass", "192.168.0.2", function (err) {
                    assert.notEqual(testSessionID, session.sessionID, 'the UIDs of the two sessions should be different');
                });
            })
        }
        );

        it('sessions should have a creation time', function () {
            var db = new dbStub();
            var session = new Session(db);

            var startTime = moment();
            session.createSession("Testname", "TestPassword", "192.168.0.1", function (err) {
                var delta = moment().diff(startTime, 'seconds', true);
                assert.isTrue(delta > 5, 'session creation time is accurate to within 5 seconds');
            });
        });

        it('should reject empty parameters', function () {
            var db = new dbStub();
            var session = new Session(db);

            var sessionName = "";
            var sessionPassword = "";
            var creatorIP = "";

            var creationTime = moment();
            session.createSession(sessionName, sessionPassword, creatorIP, function (err) {
                assert.isNotOk(err);
            });
        });

    });
});