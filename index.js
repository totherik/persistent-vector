'use strict';

var Vector = require('./lib/vector');
var Iterator = require('./lib/iterator');


function of(arr) {
    return new Vector(arr);
}


function create() {
    return of(arguments);
}


function clone(vector) {
    var clone = create();
    clone.length = vector.length;
    clone._root = vector._root;
    clone._shift = vector._shift;
    return clone;
}


function iter(vector) {
    return new Iterator(vector);
}


function conj(vector, data) {
    return vector.push(data);
}

function assoc(vector, idx, data) {
    return vector.set(idx, data);
}

module.exports = {

    of: of,

    create: create,

    clone: clone,

    iter: iter,

    conj: conj,

    assoc: assoc

};
