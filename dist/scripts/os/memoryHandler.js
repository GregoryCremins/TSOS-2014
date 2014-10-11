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
        memory.prototype.load = function (mem, index) {
            if (typeof (mem) == typeof (123)) {
                //it is a hex digit, we need to do conversion
                var first = 0;
                if (mem > 16) {
                    first = Math.floor(mem / 16);
                } else {
                    first = 0;
                }
                var second = mem % 16;
                var firstChar = this.ConvertToString(first);
                var secondChar = this.ConvertToString(second);

                _Memory[index] = firstChar + secondChar;
                this.updateMem();
            } else {
                //otherwise, its already disassembly
                _Memory[index] = mem;
                this.updateMem();
            }
        };

        memory.prototype.ConvertToString = function (digit) {
            switch (digit) {
                case 15: {
                    return "F";
                    break;
                }
                case 14: {
                    return "E";
                    break;
                }
                case 13: {
                    return "D";
                    break;
                }
                case 12: {
                    return "C";
                    break;
                }
                case 11: {
                    return "B";
                    break;
                }
                case 10: {
                    return "A";
                    break;
                }
                default: {
                    return "" + digit;
                    break;
                }
            }
        };

        //read a hex code from memory
        memory.prototype.read = function (index) {
            return _Memory[index];
        };

        memory.prototype.updateMem = function () {
            _MemoryElement.value = "";
            for (var i = 0; i < _Memory.length; i++) {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
            _CPU.updateConsole();
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
