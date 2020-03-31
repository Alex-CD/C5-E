module.exports = class redisStub {

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