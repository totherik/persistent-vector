'use strict';

var BITS = 1;
var WIDTH = 1 << BITS;
var MASK = WIDTH - 1;
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);



function Vector(arrlike) {
    var nodes, depth, lowerNodes, i, node;

    arrlike = arrlike || [];

    nodes = arrlike;
    depth = 0;

    while (nodes.length > 1) {
        lowerNodes = nodes;
        nodes = [];
        for (i = 0; i < lowerNodes.length; i += WIDTH) {
            node = slice(lowerNodes, i, i + WIDTH);
            nodes.push(node);
        }
        depth++;
    }

    this.length = arrlike.length;
    this._root = nodes[0] || [];
    this._shift = depth ? BITS * (depth - 1) : 0;
}

Vector.prototype = {

    get: function get(idx) {
        var node, level;

        if (idx >= 0 && idx < this.length) {
            node = this._root;
            level = this._shift;

            while (level) {
                node = node[(idx >> level) & MASK];
                level -= BITS;
            }

            return node[idx & MASK];
        }
    },

    set: function assoc(idx, data) {
        if (idx < 0 || idx >= this.length) {
            throw new Error('Index out of bounds.');
        }

        return this._doSet(idx, data);
    },

    push: function insert(data) {
        var copy, node, level;

        // Length is less than max number of available leaves.
        if (this.length < (WIDTH << this._shift)) {
            // Set or Generate Nodes
            copy = this._doSet(this.length, data);
            copy.length += 1;

        } else {
            // Root Overflow
            node = [];

            copy = this.clone();
            copy.length += 1;
            copy._root = [copy._root, node];
            copy._shift += BITS;

            level = copy._shift;
            while (level > BITS) {
                node = (node[0] = []);
                level -= BITS;
            }

            node[0] = data;
        }

        return copy;
    },

    pop: function pop() {
        var copy;

        if (this.length === 0) {
            return this;
        }

        if (this.length === 1) {
            return new Vector();
        }

        copy = this.clone();
        copy.length -= 1;
        copy._root = this._doPop(copy.length, copy._shift, copy._root);

        if (copy._shift > 0 && !copy._root[1]) {
            copy._root = copy._root[0];
            copy._shift -= BITS;
        }

        return copy;
    },

    clone: function () {
        var copy = new Vector();
        copy.length = this.length;
        copy._root = this._root;
        copy._shift = this._shift;
        return copy;
    },

    _doSet: function _doSet(idx, data) {
        var copy, level, node, loc;

        copy = this.clone();
        level = copy._shift;
        node = copy._root = slice(copy._root);

        while (level) {
            loc = (idx >>> level) & MASK;
            node = (node[loc] = slice(node[loc] || []));
            level -= BITS;
        }

        node[idx & MASK] = data;
        return copy;
    },

    _doPop: function _doPop(idx, level, node) {
        var loc, child;

        loc = (idx >> level) & MASK;

        if (level) {
            child = _doPop(idx, level - BITS, node[loc]);
            if (child) {
                node = slice(node);
                node[loc] = child;
                return node;
            }
        }

        return loc ? slice(node, 0, -1) : null;
    }

};

module.exports = Vector;