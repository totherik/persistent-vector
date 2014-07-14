'use strict';

var vector = require('../');
var util = require('util');


function ins(obj) {
    console.log(util.inspect(obj, { showHidden: false, depth: null }));
}

var v = vector.create();

while (v.length < 50) {
    ins(v);
    v = v.push(v.length);
}

var iter, current;
iter = vector.iter(v);
while ((current = iter.next()) && !current.done) {
    console.log(current.value);
}

while (v.length) {
    ins(v);
    v = v.pop();
}

ins(v);