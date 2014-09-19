///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new TSOS.ShellCommand(this.shellStatusUpdate, "status", "<string> - Sets the status");
            this.commandList[this.commandList.length] = sc;

            //load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Loads the program input area value");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new TSOS.ShellCommand(this.shellDateTime, "datetime", "- Tells you the date and time.");
            this.commandList[this.commandList.length] = sc;

            //location
            sc = new TSOS.ShellCommand(this.shellLocation, "whereami", "- Tells you what stage you are on.");
            this.commandList[this.commandList.length] = sc;

            //travel to new location
            sc = new TSOS.ShellCommand(this.shellTravel, "travel", "- Travels you to a new location with a new challenger!");
            this.commandList[this.commandList.length] = sc;

            //cause blue screen of death
            sc = new TSOS.ShellCommand(this.shellBSOD, "lose", "- Causes a blue screen of death image");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
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
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
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
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };

        Shell.prototype.shellMan = function (args) {
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
        };

        Shell.prototype.shellTrace = function (args) {
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
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };

        //function to print the date and time
        Shell.prototype.shellDateTime = function () {
            var d = new Date();
            d.setTime(Date.now());
            var day = d.getDay();
            var mins = d.getMinutes();
            var minString = "";
            var stringDay = "";
            switch (day) {
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
                    "GARBAGE DAY!";
                    break;
            }
            if (mins < 10) {
                minString = "0" + mins;
            } else {
                minString = "" + mins;
            }
            _StdOut.putText("The date is: " + stringDay + ", " + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear());
            _StdOut.advanceLine();
            var hours = d.getHours();
            if (hours >= 12) {
                _StdOut.putText("The time is: " + hours + ":" + minString + ":" + d.getSeconds() + " P.M.");
            } else {
                _StdOut.putText("The time is: " + hours + ":" + d.getMinutes() + ":" + d.getSeconds() + " A.M.");
            }
        };

        // function to change the users location
        Shell.prototype.shellTravel = function () {
            STAGE = Math.floor(Math.random() * 8);
            _StdOut.putText("Now traveling to new stage!");
        };

        //function to tell the user their current location
        Shell.prototype.shellLocation = function () {
            var s = STAGE;
            switch (s) {
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
                    _StdOut.putText("Current Location: Ancient temple!!!!");
                default:
                    _StdOut.putText("SHIT BE FUCKED UP BRA!");
            }
            _StdOut.advanceLine();
            _StdOut.putText(s);
        };

        //function to update the status
        Shell.prototype.shellStatusUpdate = function (args) {
            if (args.length > 0) {
                var newStatus = args[0];
                _StatusHandler.updateStatus(newStatus);
                _StdOut.putText("Status Updated");
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        };

        //function to cause a blue screen of death
        Shell.prototype.shellBSOD = function (args) {
            // Call Kernel trap
            _Kernel.krnTrapError("Forced Bsod. Rage quit.");
        };

        //function to load the data from the program input into memory
        //the loading actually doesn't work, as of right now it only validates the code
        Shell.prototype.shellLoad = function () {
            var text = _ProgramInput.value.toString();
            var isValid = true;

            for (var i = 0; i < text.length; i++) {
                var char = text.charCodeAt(i);
                if ((char >= 48 && char <= 57) || (char >= 65 && char <= 70) || (char == 32)) {
                    isValid = true;
                } else {
                    isValid = false;
                }
            }
            if (isValid) {
                _StdOut.putText("Program validated and loaded successfully");
            } else {
                _StdOut.putText("Program not validated. Accepted characters: spaces, 0-9, and A-F only.");
            }
        };
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
