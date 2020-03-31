module.exports = class dbStub {
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