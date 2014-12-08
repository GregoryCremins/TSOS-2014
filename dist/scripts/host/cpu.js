//<reference path="../globals.ts" />
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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, runningCycleCount, base, limit, isExecuting, scheduling) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof runningCycleCount === "undefined") { runningCycleCount = 0; }
            if (typeof base === "undefined") { base = 0; }
            if (typeof limit === "undefined") { limit = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            if (typeof scheduling === "undefined") { scheduling = "rr"; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.runningCycleCount = runningCycleCount;
            this.base = base;
            this.limit = limit;
            this.isExecuting = isExecuting;
            this.scheduling = scheduling;
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
            //context swap
            if ((this.runningCycleCount % _quantum) == 0 && _ReadyQueue.getSize() > 0 && this.runningCycleCount > 0 && this.scheduling == "rr") {
                if (_currentProcess == 0) {
                    _Kernel.krnTrace('Completed Program ' + _currentProcess);
                    var process = _ReadyQueue.dequeue();
                    process.loadToCPU();
                    _currentProcess = process.PID;
                    _Kernel.krnTrace('Loading Program ' + _currentProcess);
                    this.runningCycleCount = 0;
                } else {
                    //alert("CONTEXTSWAP");
                    _Kernel.krnTrace('Context Swap from ' + _currentProcess);

                    //alert(_currentProcess);
                    //alert("CONTEXT SWAPPIN ACTION");
                    this.contextSwitch();
                    this.runningCycleCount = 0;
                }
            } else {
                if (_currentProcess == 0 && _ReadyQueue.getSize() == 0) {
                    _Kernel.krnTrace('Completed all execution');
                    this.isExecuting = false;
                } else {
                    if (_currentProcess == 0 && _ReadyQueue.getSize() != 0) {
                        _Kernel.krnTrace('Completed Program ' + _currentProcess);
                        var process = _ReadyQueue.dequeue();
                        process.loadToCPU();
                        _currentProcess = process.PID;
                        _Kernel.krnTrace('Loading Program ' + _currentProcess);
                        this.runningCycleCount = 0;
                    } else {
                        _Kernel.krnTrace('CPU cycle');

                        // TODO: Accumulate CPU usage and profiling statistics here.
                        // Do the real work here. Be sure to set this.isExecuting appropriately.
                        this.handleCommand(_MemoryHandler.read(this.PC));
                        this.runningCycleCount = this.runningCycleCount + 1;
                    }
                }
            }
        };

        /**
        * Function to update the UI
        */
        Cpu.prototype.updateUI = function () {
            _CPUElement.value = "";
            _CPUElement.value += "CPU \n";
            _CPUElement.value += "PC: 0x" + this.toHexDigit(this.PC) + "\n";
            _CPUElement.value += "Acc: 0x" + this.toHexDigit(this.Acc) + "\n";
            _CPUElement.value += "Xreg: 0x" + this.toHexDigit(this.Xreg) + "\n";
            _CPUElement.value += "Yreg: 0x" + this.toHexDigit(this.Yreg) + "\n";
            _CPUElement.value += "Zflag: 0x" + this.toHexDigit(this.Zflag) + "\n";
            _CPUElement.value += "Scheduling: " + this.scheduling + "\n";
        };

        /**
        * Function to load the CPU with the specified values
        * @param PC
        * @param Acc
        * @param Xreg
        * @param Yreg
        * @param Zflag
        * @param base
        * @param limit
        */
        Cpu.prototype.load = function (PC, Acc, Xreg, Yreg, Zflag, base, limit) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
        };

        /**
        * Function to handle the dissasembly command
        * @param command the command written in 2 digit hex
        */
        Cpu.prototype.handleCommand = function (command) {
            switch (command) {
                case "A9": {
                    //load a constant
                    this.Acc = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AD": {
                    //load from memory
                    var oldPC = this.PC;
                    this.PC = (this.base) + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));

                    if (this.checkbounds(this.PC)) {
                        this.Acc = parseInt("0x" + _MemoryHandler.read(this.PC));
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("ERROR on AD: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "8D": {
                    //store to memory
                    var memLoc = (this.base) + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(memLoc)) {
                        if (this.Acc < 16) {
                            _MemoryHandler.load(("0" + this.Acc), memLoc);
                        } else {
                            _MemoryHandler.load(this.Acc, memLoc);
                        }
                        this.PC += 3;
                        _MemoryHandler.updateMem();
                    } else {
                        //alert(this.base);
                        //alert(this.limit);
                        _StdOut.putText("ERROR on 8D: Index out of bounds error on process " + _currentProcess + " PC: " + this.PC);
                        _StdOut.advanceLine();
                        _StdOut.putText("Memory Location: " + memLoc + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("MemoryOutOfBoundsError");
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "6D": {
                    //add with carry
                    var oldPC = this.PC;
                    this.PC = (this.base) + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Acc += parseInt("0x" + _MemoryHandler.read(this.PC));
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("ERROR on 6D: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("IndexOutOfBoundsError");
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "A2": {
                    //alert("Xregister loaded with: " + parseInt("0x" + (_MemoryHandler.read(this.PC + 1))));
                    //load constant into x register
                    this.Xreg = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AE": {
                    //load x register from memory
                    var oldPC = this.PC;
                    this.PC = (this.base) + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Xreg = parseInt("0x" + _Memory[this.PC]);
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("ERROR: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("IndexOutOfBoundsError");
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "A0": {
                    //load constant into y register
                    this.Yreg = parseInt("0x" + (_MemoryHandler.read(this.PC + 1)));
                    this.PC = this.PC + 2;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "AC": {
                    //load y register from memory
                    var oldPC = this.PC;
                    this.PC = this.base + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        this.Yreg = parseInt("0x" + _MemoryHandler.read(this.PC));
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("ERROR: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("IndexOutOfBoundsError");
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "EA": {
                    //Nothing op code
                    this.PC = this.PC + 1;
                    break;
                }
                case "00": {
                    //Break
                    //this.isExecuting = false;
                    _CPU.storeToPCB(_currentProcess);
                    _MemoryHandler.updateMem();
                    document.getElementById("btnStep").disabled = true;
                    _currentProcess = 0;
                    break;
                }
                case "EC": {
                    //Equals compare of memory to the Xreg
                    //first get memory variable
                    var oldPC = this.PC;
                    this.PC = this.base + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        var temp = parseInt("0x" + _MemoryHandler.read(this.PC));

                        // alert (this.Xreg + " = " + temp );
                        if (temp == this.Xreg) {
                            // alert("Zflag set to true!");
                            this.Zflag = 1;
                        } else {
                            this.Zflag = 0;
                        }
                        this.PC = oldPC + 3;
                        _MemoryHandler.updateMem();
                    } else {
                        _StdOut.putText("ERROR on EC: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("IndexOutOfBoundsError");
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "D0": {
                    //  alert("Z flag is " + this.Zflag);
                    //BEQ if z flag is not set, branch
                    if (this.Zflag == 0) {
                        // alert(_MemoryHandler.read(this.PC + 1) + ": Target in mem");
                        var offset = parseInt("0x" + _MemoryHandler.read(this.PC + 1));
                        this.PC = this.PC + offset;
                        if (this.PC > 255 + ((_currentProcess - 1) * 256)) {
                            this.PC = this.PC - 255;
                            if (!this.checkbounds(this.PC)) {
                                _StdOut.putText("ERROR on D0: Index out of bounds error on process " + _currentProcess);
                                _StdOut.advanceLine();
                                _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                                _Kernel.krnTrace("IndexOutOfBoundsError");
                                _StdOut.advanceLine();
                                this.PC = this.PC + 255;
                                this.storeToPCB(_currentProcess);
                                _currentProcess = 0;
                            }
                            // alert("PC = " + this.PC + " This process is: " + _currentProcess);
                        } else {
                            this.PC = this.PC + 1;
                            if (!this.checkbounds(this.PC)) {
                                _StdOut.putText("ERROR on D0: Index out of bounds error on process " + _currentProcess);
                                _StdOut.advanceLine();
                                _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                                _StdOut.advanceLine();
                                _Kernel.krnTrace("IndexOutOfBoundsError");
                                this.PC = this.PC - 1;
                                this.storeToPCB(_currentProcess);
                                _currentProcess = 0;
                            }
                            //   alert("PC = " + this.PC + " This process is: " + _currentProcess);
                        }
                        this.PC = this.PC + 1;
                    } else {
                        this.PC = this.PC + 2;
                        //   alert("NOT BRANCHING")
                    }
                    _MemoryHandler.updateMem();
                    break;
                }
                case "EE": {
                    //increment the byte
                    //first read it
                    var oldPC = this.PC;
                    this.PC = this.base + parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.checkbounds(this.PC)) {
                        var temp = parseInt("0x" + _MemoryHandler.read(this.PC));
                        temp = temp + 1;
                        if (temp < 256) {
                            _MemoryHandler.load(temp, this.PC);
                            _MemoryHandler.updateMem();
                            this.PC = oldPC + 3;
                        } else {
                            _StdOut.putText("ERROR on EE: overflow error on process: " + _currentProcess);
                            _StdOut.advanceLine();
                            _Kernel.krnTrace("OverFlowError");
                            this.PC = oldPC;
                            this.storeToPCB(_currentProcess);
                            _currentProcess = 0;
                        }
                    } else {
                        _StdOut.putText("ERROR on EE: Index out of bounds error on process " + _currentProcess);
                        _StdOut.advanceLine();
                        _StdOut.putText("PC: " + this.PC + " is not in the memory bounds of " + this.base + " and " + this.limit);
                        _StdOut.advanceLine();
                        _Kernel.krnTrace("IndexOutOfBoundsError");
                        this.PC = oldPC;
                        this.storeToPCB(_currentProcess);
                        _currentProcess = 0;
                    }
                    break;
                }
                case "FF": {
                    //System Call, check the Xreg
                    if (this.Xreg == 2) {
                        //_StdOut.advanceLine();
                        //print the yreg to the screen
                        var i = this.base;
                        while (_MemoryHandler.read(this.Yreg + i) != "00" && i < this.limit) {
                            //alert("Target = " + (this.Yreg + i));
                            //alert(_MemoryHandler.read(this.Yreg + i));
                            var charCode = (parseInt("0x" + _MemoryHandler.read(this.Yreg + i).toString()));
                            var char = String.fromCharCode(charCode);
                            _StdOut.putText(char);
                            i++;
                        }
                    }
                    if (this.Xreg == 1) {
                        //                       //_StdOut.advanceLine();
                        _StdOut.putText("" + this.Yreg);
                    }
                    _MemoryHandler.updateMem();
                    this.PC += 1;
                    break;
                }
                default: {
                    //NOT A VALID HEXCODE
                    //THROW AN ERROR
                    _DrawingContext.putText("Invalid Code");
                    _DrawingContext.advanceLine();
                    this.isExecuting = false;
                    _MemoryHandler.updateMem();
                    break;
                }
            }
        };

        /**
        * Function to store the current CPU values back to a given PID
        * @param PID the process to store the CPU contents in
        */
        Cpu.prototype.storeToPCB = function (PID) {
            _Processes[PID - 1].storeVals(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };

        /**
        * Function to make a context switch
        */
        Cpu.prototype.contextSwitch = function () {
            //alert("Swapping contexts");
            this.storeToPCB(_currentProcess);
            _ReadyQueue.enqueue(_Processes[_currentProcess - 1]);
            var nextProcess = _ReadyQueue.dequeue();
            nextProcess.loadToCPU();

            //alert(nextProcess.PID + " PC = " + this.PC);
            // alert(this.PC == nextProcess.PC);
            _currentProcess = nextProcess.PID;
        };

        /**
        * Function to check the bounds of a function
        * @param memLoc the location to be checked
        * @returns {boolean} wheither or not the program went out of bounds
        */
        Cpu.prototype.checkbounds = function (memLoc) {
            return memLoc >= this.base && memLoc <= this.limit;
        };

        /**
        * Function to convert a number to hex
        * @param dec the decimal number to be converted
        * @returns {string} the string of the hexedecimal equivalenbt
        */
        Cpu.prototype.toHexDigit = function (dec) {
            return dec.toString(16);
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
