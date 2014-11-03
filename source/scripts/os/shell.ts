///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />

/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";


        constructor() {

        }

        public init() {
            var sc = null;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatusUpdate,
                                    "status",
                                    "<string> - Sets the status");
            this.commandList[this.commandList.length] = sc;
            //load
            sc = new ShellCommand(this.shellLoad, "load", "Loads the program input area value");
            this.commandList[this.commandList.length] = sc;
            //run
            sc = new ShellCommand(this.shellRun, "run","<int> - Runs the process with the given pid");
            this.commandList[this.commandList.length] = sc;
            //step
            sc = new ShellCommand(this.shellStep, "step","<int> -Runs the process with the given pid in single step mode")
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new ShellCommand(this.shellDateTime,"datetime",
                "- Tells you the date and time.");
            this.commandList[this.commandList.length] = sc;

            //location
            sc = new ShellCommand(this.shellLocation, "whereami", "- Tells you what stage you are on.");
            this.commandList[this.commandList.length] = sc;

            //travel to new location
            sc = new ShellCommand(this.shellTravel, "travel", "- Travels you to a new location with a new challenger!");
            this.commandList[this.commandList.length] = sc;

            //cause blue screen of death
            sc = new ShellCommand(this.shellBSOD, "lose", "- Causes a blue screen of death image");
            this.commandList[this.commandList.length] = sc;

            //clear the memory
            sc = new ShellCommand(this.shellClearMem, "clearmem", "-Clears all of the contents in memory");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKillProcess, "kill", "<int> -Kills the specified process ")
            this.commandList[this.commandList.length] = sc;

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = new UserCommand();
            userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses. {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {    // Check for apologies. {
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer) {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.substring(0, buffer.indexOf(" ")).toLowerCase() + buffer.substring(buffer.indexOf(" "));

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("Okay. I forgive you. This time.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
        //function to print the date and time
        public shellDateTime()
        {
                var d = new Date();
                d.setTime(Date.now());
                var day = d.getDay();
                var mins = d.getMinutes();
                var minString = ""
                var stringDay = "";
                switch(day){
                    case 0:
                        stringDay = "Sun";
                        break;
                    case 1:
                        stringDay = "Mon";
                        break;
                    case 2:
                        stringDay = "Tues";
                        break;
                    case 3:
                        stringDay = "Wed";
                        break;
                    case 4:
                        stringDay = "Thurs";
                        break;
                    case 5:
                        stringDay = "Fri";
                        break;
                    case 6:
                        stringDay = "Sat";
                        break;
                    default:
                        "GARBAGE DAY!"
                        break;
                }
                if(mins < 10)
                {
                    minString = "0" + mins;
                }
                else
                {
                    minString = "" + mins;
                }
               _StdOut.putText("The date is: " + stringDay + ", " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
               _StdOut.advanceLine();
                var hours = d.getHours();
            if(hours >= 12) {
                hours = hours - 12;
                _StdOut.putText("The time is: " + hours + ":" + minString + ":" + d.getSeconds() + " P.M.");
            }
            else
            {
                _StdOut.putText("The time is: " + hours + ":" + d.getMinutes() + ":" + d.getSeconds() + " A.M.");
            }
        }
        // function to change the users location
        public shellTravel()
        {
            STAGE =  Math.floor(Math.random() * 8);
            _StdOut.putText("Now traveling to new stage!");
        }
        //function to tell the user their current location
        public shellLocation()
        {
            var s = STAGE;
            switch(s){
                case 0:
                    _StdOut.putText("Current Location: USA.");
                    break;
                case 1:
                    _StdOut.putText("Current Location: Canada.");
                    break;
                case 2:
                    _StdOut.putText("Current Location: Brazil.");
                    break;
                case 3:
                    _StdOut.putText("Current Location: Japan.");
                    break;
                case 4:
                    _StdOut.putText("Current Location: Soviet Union.");
                    break;
                case 5:
                    _StdOut.putText("Current Location: China.");
                    break;
                case 6:
                    _StdOut.putText("Current Location: India.");
                    break;
                case 7:
                    _StdOut.putText("Current Location: Unknown Laboratory!");
                    break;
                case 8:
                    _StdOut.putText("Current Location: Ancient temple!!!!")
                default:
                    _StdOut.putText("SHIT BE FUCKED UP BRA!");
            }
            _StdOut.advanceLine();
            _StdOut.putText(s);
        }
        //function to update the status
        public shellStatusUpdate(args)
         {
            if (args.length > 0) {
                var newStatus = args[0];
                _StatusHandler.updateStatus(newStatus);
                _StdOut.putText("Status Updated");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        //function to cause a blue screen of death
        public shellBSOD() {
            // Call Kernel trap
            _Kernel.krnTrapError("Forced Bsod. Rage quit.");

        }

        //function to load the data from the program input into memory
        //the loading actually doesn't work, as of right now it only validates the code
        public shellLoad()
        {
            var errorFlag = 0;
            var program = _ProgramInput.value.toString().split(" ");
            var isValid = true;

    for(var j = 0; j < program.length; j++) {
        var text = program[j];
        for (var i = 0; i < text.length; i++) {
            var charcode = text.charCodeAt(i);
            var char = text[i];
            if ((charcode >= 48 && char <= 57) //numbers
                || ((charcode >= 65 && charcode <= 70) && char == char.toUpperCase()))
            {
                isValid = isValid && true;
            }
            else {
                isValid = false;
            }
        }
        if(text.length > 2 || text.length == 0)
        {
            isValid = false;
        }
    }
            if(isValid) {
                //check the ready queue
                var readyFlag = false;
                if(!_ReadyQueue.isEmpty()) {
                    for (var k = 0; k < _ReadyQueue.getSize(); j++) {
                        var targetProcess = _ReadyQueue.dequeue();
                        var targetPID = targetProcess.getPID();
                        if (_pidsave == targetPID) {
                            readyFlag = true;
                        }
                        _ReadyQueue.enqueue(targetProcess);
                    }
                }
                //check if it is running in the CPU
                if (_pidsave == _currentProcess || readyFlag == true) {
                    errorFlag = 2;
                }
                else {
                    var test = new PCB();
                    test.setPID(_pidsave);
                    test.setPCval(256 * (_pidsave - 1))
                    //alert("Test.PID = " + test.PID);
                    if (_pidsave == 3) {
                        _pidsave = 1;
                    }
                    else {
                        _pidsave = _pidsave + 1;
                    }
                    //Handle multiple Processes
                    if (_Processes.length < 3) {

                        _Processes = _Processes.concat(test);
                        _currentProcess = test.PID;
                        //alert("Added :" + test.PID)
                    }
                    else {
                        _Processes[test.PID] = test;
                        _currentProcess = test.PID;
                    }
                    //alert(_Processes);
                    var offset = 256 * (_Processes.length - 1);
                    for (var h = 0; h < program.length; h++) {
                        _MemoryHandler.load(program[h], h + offset);
                        _MemoryElement.focus();
                        _Canvas.focus();

                    }
                    //alert("added to memory");


                    _MemoryHandler.updateMem();
                }
            }
            else
            {
                errorFlag = 1;

            }
            //make sure we didnt have error
            switch(errorFlag)
            {
                case 0:
                {
                    _StdOut.putText("Program validated and loaded successfully. PID = " + test.PID);

                    break;
                }
                case 1:
                {
                    _StdOut.putText("Program not validated. Accepted characters: spaces, 0-9, and A-F only.");
                    break;
                }
                case 2:
                    _StdOut.putText("Loading target is either on ready queue or currently in CPU, to prevent errors in execution, program not loaded");
                    break;
            }

        }
        public shellRun(pid)
        {
            if(_Processes.length >= pid)
            {
                if(_CPU.isExecuting)
                {
                    _ReadyQueue.enqueue(_Processes[pid - 1]);
                    alert("ON THE READY QUEUE");
                }
                else
                {
                    _Processes[pid - 1].loadToCPU();
                    _currentProcess = pid;
                    _CPU.isExecuting = true;
                }
            }
           else
            {
                _StdOut.putText("Error: no programs loaded into memory.");
            }
        }

        public shellStep(pid)
        {
            if(_Processes.length >= pid)
            {
                _Processes[pid - 1].loadToCPU;
                _CPU.isExecuting = true;
                _SteppingMode = true;
                document.getElementById("btnStep").disabled = false;
                _currentProcess = pid;
            }
            else
            {
                _StdOut.putText("Error: no programs loaded into memory.");
            }
        }

        public shellClearMem()
        {
            for(var i = 0; i < _Memory.length; i++)
            {
                _MemoryHandler.load("00",i);
            }
            _currentProcess = 0;
            _Processes = new Array<TSOS.PCB>();
            _MemoryHandler.updateMem();
            _StdOut.putText("Memory Cleared");
        }

        //kill a process
        public shellKillProcess(pid)
        {
            if(_currentProcess = pid)
            {
                _CPU.storeToPCB(_currentProcess);
                _currentProcess = 0;
            }
            //check readyQueue
            for(var i = 0; i < _ReadyQueue.getSize(); i++)
            {
                if(_ReadyQueue[i].PID = pid)
                {
                    var flag = false;
                    var resultQueue = new TSOS.Queue();
                   while(flag = false)
                    {
                        var testProcess = _ReadyQueue.dequeue();
                        if(testProcess.PID != pid)
                        {
                            resultQueue.enqueue(testProcess);
                        }
                        flag = _ReadyQueue.getSize() <=0;
                    }
                    _ReadyQueue = resultQueue;
                }
            }
            _MemoryHandler.updateMem();
        }

    }
}
