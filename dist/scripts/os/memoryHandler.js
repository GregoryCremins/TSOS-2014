/**
* Created by Greg on 10/5/2014.
* class to handle the memory array
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

        /**
        * Function to convert the given hex digit to a string
        * @param digit the hex digit to be converted
        * @returns {string} the string which is generated
        * @constructor
        */
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

        /**
        * Function to read a value from memory at the given index
        * @param index the index which we which to read from memory
        * @returns {Object} the value at that given index
        */
        memory.prototype.read = function (index) {
            return _Memory[index];
        };

        /**
        * Function to update memory on the UI
        */
        memory.prototype.updateMem = function () {
            _CPUElement.value = "";
            while (_MemoryElement2.rows.length > 0) {
                _MemoryElement2.deleteRow(0);
            }
            var offset = 256 * (_currentProcess - 1);
            if (offset < 0) {
                offset = 0;
            }
            var curRow = null;
            for (var i = 0; i < 256; i++) {
                if ((i % 16) == 0) {
                    //alert("HODOR");
                    curRow = _MemoryElement2.insertRow();
                    var indexCell = curRow.insertCell();
                    indexCell.innerHTML = "0x" + (i + offset).toString(16);
                }
                var targetCell2 = curRow.insertCell();
                targetCell2.innerHTML = "" + _Memory[i + offset];
            }

            _CPU.updateUI();
            while (_PCBElement.rows.length > 1) {
                _PCBElement.deleteRow(_PCBElement.rows.length - 1);
            }
            if (_Processes.length > 0) {
                for (var j = 0; j < _Processes.length; j++) {
                    _CPUElement.value += "\n";
                    _Processes[j].printToScreen();
                }
            }

            var readyQueueTable = document.getElementById("readyqueue");
            while (readyQueueTable.rows.length > 1) {
                readyQueueTable.deleteRow(readyQueueTable.rows.length - 1);
            }
            var resultQueue2 = new TSOS.Queue();
            while (_ReadyQueue.getSize() > 0) {
                var testProcess = _ReadyQueue.dequeue();
                resultQueue2.enqueue(testProcess);
                var row = readyQueueTable.insertRow();
                for (var j = 0; j < 8; j++) {
                    var targetCell = row.insertCell(j);
                    switch (j) {
                        case 0: {
                            targetCell.innerHTML = "" + testProcess.PID;
                            break;
                        }
                        case 1: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.PC);
                            break;
                        }
                        case 2: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.Acc);
                            break;
                        }
                        case 3: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.Xreg);
                            break;
                        }
                        case 4: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.Yreg);
                            break;
                        }
                        case 5: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.Zflag);
                            break;
                        }
                        case 6: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.base);
                            break;
                        }
                        case 7: {
                            targetCell.innerHTML = "0x" + testProcess.toHexDigit(testProcess.limit);
                            break;
                        }
                        default: {
                            alert("HURDUR");
                            break;
                        }
                    }
                }
            }
            _ReadyQueue = resultQueue2;
        };
        return memory;
    })();
    TSOS.memory = memory;
})(TSOS || (TSOS = {}));
