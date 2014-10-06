/**
* Created by Greg on 10/5/2014.
*/
var TSOS;
(function (TSOS) {
    var memory = (function () {
        function memory() {
        }
        memory.prototype.memory = function () {
            var accumulator = 0;
        };

        //loads an item into memory
        memory.prototype.load = function (mem) {
            _Memory[_MemIndex] = mem;
            _MemIndex++;
            alert(_Memory);
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
