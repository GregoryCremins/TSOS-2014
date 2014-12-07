/**
* Created by Greg on 10/7/2014.
* Class to hadle the values of a current process
*/
var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB() {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.PID = 0;
            this.base = 0;
            this.limit = 0;
            this.priority = 0;
        }
        PCB.prototype.PCB = function (PC, Acc, Xreg, Yreg, Zflag) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        };

        PCB.prototype.getPID = function () {
            return this.PID;
        };

        PCB.prototype.setPID = function (val) {
            this.PID = val;
        };

        PCB.prototype.setPCval = function (val) {
            this.PC = val;
        };

        PCB.prototype.setLimit = function (val) {
            this.limit = val;
        };

        PCB.prototype.setBase = function (val) {
            this.base = val;
        };
        PCB.prototype.setPriority = function (val) {
            this.priority = val;
        };

        /**
        * Function to load the values of this PCB to the CPU
        */
        PCB.prototype.loadToCPU = function () {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.base, this.limit);
        };

        /**
        * Method to store the parameters to this PCB
        * @param PC
        * @param Acc
        * @param Xreg
        * @param Yreg
        * @param Zflag
        */
        PCB.prototype.storeVals = function (PC, Acc, Xreg, Yreg, Zflag) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        };

        /**
        * Function to print the PCB's contents to the screen
        */
        PCB.prototype.printToScreen = function () {
            //new PCB writer
            var newRow = _PCBElement.insertRow();
            for (var j = 0; j < 9; j++) {
                var targetCell = newRow.insertCell(j);
                switch (j) {
                    case 0: {
                        targetCell.innerHTML = "" + this.PID;
                        break;
                    }
                    case 1: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.PC);
                        break;
                    }
                    case 2: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Acc);
                        break;
                    }
                    case 3: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Xreg);
                        break;
                    }
                    case 4: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Yreg);
                        break;
                    }
                    case 5: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Zflag);
                        break;
                    }
                    case 6: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.base);
                        break;
                    }
                    case 7: {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.limit);
                        break;
                    }
                    case 8: {
                        targetCell.innerHTML = "" + this.priority;
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };

        /**
        * Function to convert a number to hex
        * @param dec the decimal number to be converted
        * @returns {string} the string of the hexedecimal equivalenbt
        */
        PCB.prototype.toHexDigit = function (dec) {
            return dec.toString(16);
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
