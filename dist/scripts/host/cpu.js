///<reference path="../globals.ts" />
/* ------------
CPU.ts
Requires global.ts.
Routines for the host CPU simulation, NOT for the OS itself.
In this manner, it's A LITTLE BIT like a hypervisor,
in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
TypeScript/JavaScript in both the host and client environments.
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };

        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');

            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            this.handleCommand(_Memory[this.PC]);
        };

        Cpu.prototype.updateConsole = function () {
            _MemoryElement.value += "\n \n";
            _MemoryElement.value += "PC: " + this.PC + "\n";
            _MemoryElement.value += "Acc: " + this.Acc + "\n";
            _MemoryElement.value += "Xreg: " + this.Xreg + "\n";
            _MemoryElement.value += "Yreg: " + this.Yreg + "\n";
            _MemoryElement.value += "Zflag: " + this.Zflag + "\n";
        };
        Cpu.prototype.load = function (PC, Acc, Xreg, Yreg, Zflag) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Yreg;
            this.Zflag = Zflag;
        };

        Cpu.prototype.handleCommand = function (command) {
            switch (command) {
                case "A9": {
                    //load a constant
                    this.Acc = parseInt("0x" + (_Memory[this.PC + 1]));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AD": {
                    //load from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    this.Acc = parseInt("0x" + _Memory[this.PC]);
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "8D": {
                    //store to memory
                    var memLoc = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    if (this.Acc < 16) {
                        _Memory[memLoc] = "0" + this.Acc;
                    } else {
                        _Memory[memLoc] = this.Acc;
                    }
                    this.PC += 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "6D": {
                    //add with carry
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    this.Acc += parseInt("0x" + _Memory[this.PC]);
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "A2": {
                    //load constant into x register
                    this.Xreg = parseInt("0x" + (_Memory[this.PC + 1]));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AE": {
                    //load x register from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    this.Xreg = parseInt("0x" + _Memory[this.PC]);
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "A0": {
                    //load constant into y register
                    this.Yreg = parseInt("0x" + (_Memory[this.PC + 1]));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AC": {
                    //load y register from memory
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    this.Yreg = parseInt("0x" + _Memory[this.PC]);
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "EA": {
                    //Nothing op code
                    this.PC = this.PC + 1;
                    break;
                }
                case "00": {
                    //Break
                    this.isExecuting = false;
                    _MemoryHandler.updateMem();
                    document.getElementById("btnStep").disabled = true;
                    break;
                }
                case "EC": {
                    //Equals compare of memory to the Xreg
                    //first get memory variable
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    var temp = parseInt("0x" + _Memory[this.PC]);
                    if (temp = this.Xreg) {
                        this.Zflag = 1;
                    }
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "D0": {
                    //BEQ if z flag is not set, branch
                    if (this.Zflag == 0) {
                        this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    } else {
                        this.PC = this.PC + 1;
                    }
                    _MemoryHandler.updateMem();
                    break;
                }
                case "EE": {
                    //increment the byte
                    //first read it
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _Memory[this.PC + 2] + _Memory[this.PC + 1]);
                    var temp = parseInt("0x" + _Memory[this.PC]);
                    temp = temp + 0x0001;
                    _Memory[this.PC] = temp.toString().replace("0x", "");
                    _MemoryHandler.updateMem();
                    break;
                }
                case "FF": {
                    //System Call, check the Xreg
                    if (this.Xreg == 0x01) {
                        //print the yreg to the screen
                        _DrawingContext.putText(this.Yreg);
                        _DrawingContext.advanceLine();
                    }
                    if (this.Xreg == 0x02) {
                        _DrawingContext.putText(this.Yreg.toString());
                        _DrawingContext.advanceLine();
                    }
                    _MemoryHandler.updateMem();
                    break;
                }
                default: {
                    //NOT A VALID HEXCODE
                    //THROW AN ERROR BITCH
                    alert("SHIT FUCKED UP HERE " + _Memory[this.PC]);
                    this.isExecuting = false;
                    _MemoryHandler.updateMem();
                    break;
                }
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
