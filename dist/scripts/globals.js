/* ------------
Globals.ts
Global CONSTANTS and _Variables.
(Global over both the OS and Hardware Simulation / Host.)
This code references page numbers in the text book:
Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
------------ */
//
// Global "CONSTANTS" (There is currently no const or final or readonly type annotation in TypeScript.)
// TODO: Make a global object and use that instead of the "_" naming convention in the global namespace.
//
var APP_NAME = "BEUOS";
var APP_VERSION = "Hyper Turbo EX Dynamic Ultra 5.0";

//The current location for whereami
var STAGE = 0;

//the status
var STATUS = "Type command: status <string> to change your status";

//Status bar variables
var _StatusCanvas = null;
var _StatusContext = null;
var _StatusHandler = null;
var _MemoryHandler = null;
var _MemoryElement2 = null;
var _PCBElement = null;
var _Memory = Array.apply(null, new Array(768)).map(String.prototype.valueOf, "00");
var _CPUElement = null;
var _currentProcess = 0;
var _Processes = new Array();
var _pidsave = 1;
var CPU_CLOCK_INTERVAL = 100;
var _SteppingMode = false;
var TIMER_IRQ = 0;

// NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;

//program input
var _ProgramInput = null;

//hard drive
var _HardDrive = new TSOS.hardDrive();
var _HardDriveDriver = null;

//
// Global Variables
//
var _CPU;

var _OSclock = 0;

var _Mode = 0;

var _Canvas = null;
var _DrawingContext = null;
var _DefaultFontFamily = "sans";
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;

var _Trace = true;

// The OS Kernel and its queues.
var _Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

//OS Processes queue
var _ReadyQueue = null;
var _quantum = 6;

// Standard input and output
var _StdIn = null;
var _StdOut = null;

// UI
var _Console;
var _OsShell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID = null;

// For testing...
var _GLaDOS = null;
var Glados = null;

var onDocumentLoad = function () {
    TSOS.Control.hostInit();
};
