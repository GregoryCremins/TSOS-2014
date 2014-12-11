/* ------------
Queue.ts
A simple Queue, which is really just a dressed-up JavaScript Array.
See the Javascript Array documentation at
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
Look at the push and shift methods, as they are the least obvious here.
------------ */
var TSOS;
(function (TSOS) {
    var Queue = (function () {
        function Queue(q) {
            if (typeof q === "undefined") { q = new Array(); }
            this.q = q;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };

        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };

        Queue.prototype.enqueue = function (element) {
            this.q.push(element);
        };

        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };

        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };
        Queue.prototype.sortQueue = function () {
            //first store all of the pcb's to an array
            var temp = new Array();
            while (this.getSize() > 0) {
                var target = this.dequeue();
                temp[temp.length] = target;
            }

            alert(temp.length);

            while (temp.length > 0) {
                var maxIndex = -1;
                var maxVal = -1;
                for (var i = 0; i < temp.length; i++) {
                    if (temp[i].getPriority() > maxVal) {
                        maxIndex = i;
                        maxVal = temp[i].getPriority();
                    }
                }
                this.enqueue(temp[maxIndex]);
                temp.splice(maxIndex, 1);
            }
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
