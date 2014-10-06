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
            this.updateMem();
            //shift the focus back and forth
        };

        memory.prototype.updateMem = function () {
            _MemoryElement.value = "";
            for (var i = 0; i < _Memory.length; i++) {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
