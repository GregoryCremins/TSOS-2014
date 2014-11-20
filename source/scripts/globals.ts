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
var APP_NAME: string    = "BEUOS";   // Beat'em up OS
var APP_VERSION: string = "Hyper Turbo EX Dynamic 4.0";   // The Forever exalted supreme 4th edition extra editions will be be indicated.
//The current location for whereami
var STAGE: number = 0;
//the status
var STATUS: string = "Type command: status <string> to change your status";

//Status bar variables
var _StatusCanvas: HTMLCanvasElement = null; //Initialized in statusBar2.0;
var _StatusContext = null; //Initialized in statusBar2.0;
var _StatusHandler = null; //Initialized in statusBar2.0;
var _MemoryHandler = null; //Creates a memory handlerS
var _MemoryElement2 = null; // The memory element 2
var _PCBElement = null;
var _Memory = Array.apply(null, new Array(768)).map(String.prototype.valueOf,"00");                       // Memory for Assembly commands
var _CPUElement = null;                // Memory HTML element
var _currentProcess = 0;                  //the current running process
var _Processes = new Array<TSOS.PCB>();                      // Array of processes
var _pidsave = 1;
var CPU_CLOCK_INTERVAL: number = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.
var _SteppingMode = false;             //For single step debugging of program input
var TIMER_IRQ: number = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                            // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ: number = 1;

//program input
var _ProgramInput = null; // Initialized in hostinit

//
// Global Variables
//
var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas: HTMLCanvasElement = null;  // Initialized in hostInit().
var _DrawingContext = null;             // Initialized in hostInit().
var _DefaultFontFamily = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;              // Additional space added to font size when advancing a line.



var _Trace: boolean = true;  // Default the OS trace to be on.

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue = null;
var _KernelBuffers: any[] = null;
var _KernelInputQueue = null;

//OS Processes queue
var _ReadyQueue = null;
var _quantum = 6;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver = null;

var _hardwareClockID: number = null;

// For testing...
var _GLaDOS: any = null;
var Glados: any = null;

var onDocumentLoad = function() {
	TSOS.Control.hostInit();

};
