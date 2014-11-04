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

        PCB.prototype.printToScreen = function () {
            _MemoryElement.value += "PCBID: " + this.PID;
            _MemoryElement.value += "\n";

            _MemoryElement.value += "PC: " + this.PC + "|";
            _MemoryElement.value += "Acc: " + this.Acc + "|";
            _MemoryElement.value += "Xreg: " + this.Xreg + "|";
            _MemoryElement.value += "Yreg: " + this.Yreg + "|";
            _MemoryElement.value += "Zflag: " + this.Zflag + "|";
            _MemoryElement.value += "Base: " + this.base + "|";
            _MemoryElement.value += "Limit: " + this.limit + "|";
        };
        return PCB;
    })();
    TSOS.PCB = PCB;
})(TSOS || (TSOS = {}));
