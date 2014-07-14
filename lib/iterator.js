'use strict';


function Iterator(vector) {
    this.iteratedObject = vector;
    this.index = 0;
}

Iterator.prototype = {

    next: function () {
        var object, index;

        if (this.iteratedObject === undefined) {
            return { value: undefined, done: true };
        }

        object = this.iteratedObject;
        index = this.index;

        if (index >= (object.length || 0)) {
            this.iteratedObject = undefined;
            return { value: undefined, done: true };
        }

        this.index += 1;

        return { value: [ index, object.get(index) ], done: false };
    }

};

module.exports = Iterator;