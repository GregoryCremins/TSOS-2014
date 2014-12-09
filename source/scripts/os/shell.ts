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

            //set the quantum
            sc = new ShellCommand(this.shellQuantum, "quantum", "<int> -Sets the quantum for round robin scheduling");
            this.commandList[this.commandList.length] = sc;

            //run all processes
            sc = new ShellCommand(this.shellRunAll, "runall", "-Runs all processes in memory");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            sc = new ShellCommand(this.shellPS, "ps", "-Lists all running processes");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKillProcess, "kill", "<int> -Kills the specified process ")
            this.commandList[this.commandList.length] = sc;

            //create <filename>- creates a file in the page table
            sc = new ShellCommand(this.shellCreateFile, "create", "<string> -Creates a file in the page table.");
            this.commandList[this.commandList.length] = sc;

            // ls - lists the files in the page table
            sc = new ShellCommand(this.shellListDirectory, "ls", "Lists all files in memory");
            this.commandList[this.commandList.length] = sc;

            //write <filename> - read from the file if it exists
            sc = new ShellCommand(this.shellWriteFile, "write", "<string> \"<string>\" - writes the data enclosed in quotes to the file with the given filename");
            this.commandList[this.commandList.length] = sc;

            //delete <filename> -deletes a file
            sc = new ShellCommand(this.shellDeleteFile, "delete", "<string> - deletes the specified file from the hard drive");
            this.commandList[this.commandList.length] = sc;

            //read <filename> - read a file
            sc = new ShellCommand(this.shellReadFile, "read", "<string> -reads the contents of a file in memory");
            this.commandList [this.commandList.length] = sc;

            //format
            sc = new ShellCommand(this.shellFormat, "format", "- Formats the hard drive");
            this.commandList [this.commandList.length] = sc;

            //setschedule <schedule> - set the scheduling algorithm
            sc = new ShellCommand(this.shellSetSchedule, "setschedule", "<string> - sets the scheduling algorithm")
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
        public shellLoad(priority)
        {
            if(priority == null || priority == undefined || priority == "")
            {
                priority = 0;
            }
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
                    var thing = _pidsave;
                    if(_pidsave > 3)
                    {
                        thing = (_pidsave % 3)
                    }
                    test.setPCval(256 * (thing - 1));
                    test.setBase(256 * (thing - 1));
                    test.setLimit(test.base + 255);
                    test.setPriority(priority);
                    //alert("Test.PID = " + test.PID);
                    if (_pidsave == 4) {
                        _pidsave = 1;
                    }
                    else {
                        _pidsave = _pidsave + 1;
                    }
                    //Handle multiple Processes
                    if (_Processes.length < 3) {

                        _Processes = _Processes.concat(test);
                        var offset = 256 * (_Processes.length - 1);
                        for (var h = 0; h < program.length; h++) {
                            _MemoryHandler.load(program[h], h + offset);
                            _CPUElement.focus();
                            _Canvas.focus();

                        }
                        _MemoryHandler.updateMem();
                    }
                    else
                    {
                        _Processes = _Processes.concat(test);
                        var filename = "Process" + test.PID;
                        var buffer = "";
                        for(var h = 0; h < program.length; h++)
                        {
                            buffer = buffer + program[h];
                        }
                        var t = _HardDriveDriver.createFile(filename);
                        _HardDriveDriver.writeToFile(filename, buffer);
                        test.setHardDriveLoc(t);
                    }

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
                    if(_CPU.scheduling == "priority")
                    {
                        _ReadyQueue.sortQueue();
                        }
                    //alert("ON THE READY QUEUE");
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

        //set the quantum
        public shellQuantum(q)
        {
            if(q > 0)
            {
                if(!_CPU.isExecuting)
                {
                    _quantum = q;
                    _StdOut.putText("Quantum now set to: " + _quantum);
                }
                else
                {
                    _StdOut.putText("Please wait until the CPU has completed execution before changing the quantum.");

                }
            }
            else
            {
                _StdOut.putText("Invalid value for Quantum. Please use a number greater than 0");
            }
        }

        //kill a process
        public shellKillProcess(pid)
        {
            var foundPID = false;
            if(_currentProcess == pid)
            {
                //alert("TRYING TO KILL");
                //alert(_currentProcess);
                //alert(_CPU.PC);
                _CPU.storeToPCB(_currentProcess);
                _currentProcess = 0;
                foundPID = true;
            }
            else
            {
                // alert("TRYING TO REMOVE FROM QUEUE");
                //check readyQueue
                var flag = false;
                var resultQueue = new TSOS.Queue();
                while (flag == false)  {
                    var testProcess = _ReadyQueue.dequeue();
                    if (testProcess.PID != pid) {
                        //alert(testProcess.PID);
                        resultQueue.enqueue(testProcess);
                        //alert(resultQueue.getSize());
                    }
                    else
                    {
                        //alert(testProcess.PID);
                        foundPID = true;
                        testProcess.storeToPCB(testProcess.getPID());
                    }
                    flag = _ReadyQueue.getSize() <= 0;
                }
                _ReadyQueue = resultQueue;
            }
            if(foundPID)
            {
                _StdOut.putText("Successfully killed process " + pid);
            }
            else
            {
                _StdOut.putText("Process not found. No processes killed.")
            }
                _StdOut.advanceLine();
                _MemoryHandler.updateMem();
                _Canvas.focus();

        }

        //run all programs
        public shellRunAll()
        {
            for(var i = 0; i < _Processes.length; i++)
            {
                _ReadyQueue.enqueue(_Processes[i]);
            }
            if(_CPU.scheduling == "priority")
            {
            _ReadyQueue.sortQueue();
                }
            _CPU.isExecuting = true;
            _currentProcess = 0;
            //alert(_currentProcess);
            _StdOut.putText("Running all processes");
        }

        //show running proesses
        public shellPS()
        {
            if(_CPU.isExecuting)
            {
                _StdOut.putText("Process " + _currentProcess + " in the CPU");
                _StdOut.advanceLine();
                var resultQueue = new Queue();
                while(_ReadyQueue.getSize() > 0)
                {
                    var pros = _ReadyQueue.dequeue();
                    _StdOut.putText("Process " + pros.PID + " is running but waiting on the ready queue");
                    _StdOut.advanceLine();
                    resultQueue.enqueue(pros);
                }
                _ReadyQueue = resultQueue;
            }
            else
            {
                _StdOut.putText("There are no running processes.");
            }
        }
        //create a file in memory
        public shellCreateFile(fileName)
        {
           var t = _HardDriveDriver.createFile(fileName);
            _StdOut.putText("Successfully created file at location: " + t);
        }
        public shellListDirectory()
        {
            _HardDriveDriver.listHardDrive();
        }
        public shellDeleteFile(fileName)
        {
            var success = _HardDriveDriver.deleteFile(fileName);
            if(success)
            {
                _StdOut.putText("Successfully removed file");
            }
            else
            {
                _StdOut.putText("Error: file not found.")
            }
        }
        public shellReadFile(fileName)
        {
           var out = _HardDriveDriver.readFromFile(fileName);
            _StdOut.putText(out);
            _StdOut.advanceLine();
        }
        public shellWriteFile(args)
        {
            if(args.length == 2)
            {
                var fileName = args[0];
                var data = args[1];
                if(data.substring(0, 1) == '"' && '"'  == data.substring(data.length - 1))
                {
                   _HardDriveDriver.writeToFile(fileName, data.substring(1, data.length - 1));

                }
                else
                {
                    _StdOut.putText("Please surround the data with quotes");
                }
            }
            else
            {
                _StdOut.putText("Please provide 2 arguements, the file name and the data to be written");
            }
        }
        public shellFormat()
        {
            _HardDriveDriver.formatHardDrive();
        }

        public shellSetSchedule(scheduling)
        {
            if(!_CPU.isExecuting) {
                if (scheduling == "priority" || scheduling == "fcfs" || scheduling == "rr") {
                    _CPU.scheduling = scheduling;
                    _StdOut.putText("Scheduling set");
                    _CPU.updateUI();
                }
                else {
                    _StdOut.putText("Error: Invalid scheduling chosen. Please choose either rr, priority, or fcfs");
                }

            }
            else
            {
                _StdOut.putText("Please wait for CPU to finish executing before changing the scheduling")
            }
        }
    }
}
