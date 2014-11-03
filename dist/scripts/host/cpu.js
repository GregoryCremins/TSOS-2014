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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, runningCycleCount, isExecuting) {
            if (typeof PC === "undefined") { PC = 0; }
            if (typeof Acc === "undefined") { Acc = 0; }
            if (typeof Xreg === "undefined") { Xreg = 0; }
            if (typeof Yreg === "undefined") { Yreg = 0; }
            if (typeof Zflag === "undefined") { Zflag = 0; }
            if (typeof runningCycleCount === "undefined") { runningCycleCount = 0; }
            if (typeof isExecuting === "undefined") { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.runningCycleCount = runningCycleCount;
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

            //context swap
            if ((this.runningCycleCount % _quantum) == 0 && _ReadyQueue.getSize() > 0 && this.runningCycleCount > 0) {
                if (_currentProcess == 0) {
                    var process = _ReadyQueue.dequeue();
                    process.loadToCPU();
                    _currentProcess = process.PID;
                    this.runningCycleCount = 0;
                } else {
                    alert(_currentProcess);

                    //alert("CONTEXT SWAPPIN ACTION");
                    this.contextSwitch();
                    this.runningCycleCount = 0;
                }
            }
            if (_currentProcess == 0 && _ReadyQueue.getSize() == 0) {
                this.isExecuting = false;
            } else {
                // TODO: Accumulate CPU usage and profiling statistics here.
                // Do the real work here. Be sure to set this.isExecuting appropriately.
                this.handleCommand(_MemoryHandler.read(this.PC));
                this.runningCycleCount = this.runningCycleCount + 1;
            }
        };

        /**
        * Function to update the UI
        */
        Cpu.prototype.updateUI = function () {
            _MemoryElement.value += "\n \n CPU \n";
            _MemoryElement.value += "PC: " + this.PC + "\n";
            _MemoryElement.value += "Acc: " + this.Acc + "\n";
            _MemoryElement.value += "Xreg: " + this.Xreg + "\n";
            _MemoryElement.value += "Yreg: " + this.Yreg + "\n";
            _MemoryElement.value += "Zflag: " + this.Zflag + "\n";
        };

        /**
        * Function to load the CPU with the specified values
        * @param PC
        * @param Acc
        * @param Xreg
        * @param Yreg
        * @param Zflag
        */
        Cpu.prototype.load = function (PC, Acc, Xreg, Yreg, Zflag) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
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
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    this.Acc = parseInt("0x" + _MemoryHandler.read(this.PC));
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "8D": {
                    //store to memory
                    var memLoc = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    if (this.Acc < 16) {
                        _MemoryHandler.load(("0" + this.Acc), memLoc);
                    } else {
                        _MemoryHandler.load(this.Acc, memLoc);
                    }
                    this.PC += 3;
                    _MemoryHandler.updateMem();
                    break;
                }
                case "6D": {
                    //add with carry
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    this.Acc += parseInt("0x" + _MemoryHandler.read(this.PC));
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
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
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    this.Xreg = parseInt("0x" + _Memory[this.PC]);
                    this.PC = oldPC + 3;
                    _MemoryHandler.updateMem();
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
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    this.Yreg = parseInt("0x" + _MemoryHandler.read(this.PC));
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
                    //this.isExecuting = false;
                    _CPU.storeToPCB(_currentProcess);
                    _MemoryHandler.updateMem();
                    document.getElementById("btnStep").disabled = true;
                    _currentProcess = 0;
                    break;
                }
                case "EC": {
                    //  alert("TRYING TO COMPARE");
                    //Equals compare of memory to the Xreg
                    //first get memory variable
                    var oldPC = this.PC;
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
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
                            alert("PC = " + this.PC + " This process is: " + _currentProcess);
                        } else {
                            this.PC = this.PC + 1;
                            alert("PC = " + this.PC + " This process is: " + _currentProcess);
                            //   alert(_MemoryHandler.read(this.PC + 2));
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
                    this.PC = parseInt("0x" + _MemoryHandler.read(this.PC + 2) + _MemoryHandler.read(this.PC + 1));
                    var temp = parseInt("0x" + _MemoryHandler.read(this.PC));
                    temp = temp + 1;
                    _MemoryHandler.load(temp, this.PC);
                    _MemoryHandler.updateMem();
                    this.PC = oldPC + 3;
                    break;
                }
                case "FF": {
                    //System Call, check the Xreg
                    if (this.Xreg == 2) {
                        //_StdOut.advanceLine();
                        //print the yreg to the screen
                        var i = 0;
                        while (_MemoryHandler.read(this.Yreg + i) != "00" && i < 256) {
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
        * @param PID
        */
        Cpu.prototype.storeToPCB = function (PID) {
            _Processes[PID - 1].storeVals(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };

        Cpu.prototype.contextSwitch = function () {
            //alert("Swapping contexts");
            this.storeToPCB(_currentProcess);
            _ReadyQueue.enqueue(_Processes[_currentProcess - 1]);
            var nextProcess = _ReadyQueue.dequeue();
            nextProcess.loadToCPU();
            alert(this.PC == nextProcess.PC);
            _currentProcess = nextProcess.PID;
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
