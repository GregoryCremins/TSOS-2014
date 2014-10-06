///<reference path="../globals.ts" />
/* ------------
Console.ts
Requires globals.ts
The OS Console - stdIn and stdOut by default.
Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
------------ */
var TSOS;
(function (TSOS) {
    var Console = (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, buffer, history, historyIndex) {
            if (typeof currentFont === "undefined") { currentFont = _DefaultFontFamily; }
            if (typeof currentFontSize === "undefined") { currentFontSize = _DefaultFontSize; }
            if (typeof currentXPosition === "undefined") { currentXPosition = 0; }
            if (typeof currentYPosition === "undefined") { currentYPosition = _DefaultFontSize; }
            if (typeof buffer === "undefined") { buffer = ""; }
            if (typeof history === "undefined") { history = []; }
            if (typeof historyIndex === "undefined") { historyIndex = history.length; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
            this.history = history;
            this.historyIndex = historyIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };

        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };

        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };

        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();

                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) {
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.history[this.history.length] = this.buffer;
                    this.historyIndex = this.history.length;
                    _OsShell.handleInput(this.buffer);

                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    if (chr === String.fromCharCode(8)) {
                        var removeChar = this.buffer.charAt(this.buffer.length - 1);
                        this.backSpace(removeChar);
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        //this.buffer += "J";
                    } else {
                        //tab command to autocomplete a line
                        if (chr == String.fromCharCode(9)) {
                            var currentBuffer = this.buffer.toString();
                            var returnBuffer = "";
                            var foundMatch = false;
                            var currentCommands = ["ver", "help", "shutdown", "cls", "man", "trace", "load", "rot13", "prompt", "status", "datetime", "whereami", "travel", "lose"];

                            for (var k = 0; k < currentCommands.length; k++) {
                                if ((this.inOrderContains(currentBuffer, currentCommands[k]))) {
                                    returnBuffer += currentCommands[k];
                                    returnBuffer += " ";
                                    foundMatch = true;
                                }
                            }

                            if (foundMatch) {
                                this.replaceBuffer(returnBuffer);
                            }
                        } else {
                            if (chr == "upArrow") {
                                if (this.historyIndex > 0) {
                                    var historyCommand = this.history[this.historyIndex - 1];
                                    this.replaceBuffer(historyCommand);
                                    this.historyIndex = this.historyIndex - 1;
                                }
                            } else {
                                if (chr == "downArrow") {
                                    if (this.historyIndex < this.history.length - 1) {
                                        var historyCommand = this.history[this.historyIndex + 1];
                                        this.replaceBuffer(historyCommand);
                                        this.historyIndex = this.historyIndex + 1;
                                    }
                                } else {
                                    // This is a "normal" character, so ...
                                    // ... draw it on the screen...
                                    this.putText(chr);

                                    // ... and add it to our buffer.
                                    this.buffer += chr;
                                }
                            }
                        }
                    }
                }
                // TODO: Write a case for Ctrl-C.
            }
        };

        Console.prototype.putText = function (text) {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to w;rite one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //THIS IS THE AMAZING LINE WRAPPING
            if (text.length > 1) {
                for (var i = 0; i < text.length; i++) {
                    this.putText(text.charAt(i));
                }
            } else {
                if (text !== "") {
                    // Draw the text at the current X and Y coordinates.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    if ((this.currentXPosition + offset) > _DrawingContext.canvas.width) {
                        this.advanceLine();
                    }
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);

                    // Move the current X position.
                    this.currentXPosition = this.currentXPosition + offset;
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;

            //the scrolling of destiny
            if ((this.currentYPosition + _DefaultFontSize + _FontHeightMargin) < _DrawingContext.canvas.height) {
                this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            } else {
                this.scrollUp();
            }
            // TODO: Handle scrolling. (Project 1)
            //size of buffer is 29
        };
        Console.prototype.backSpace = function (text) {
            var charLength = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var yHeight = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - charLength, ((this.currentYPosition - yHeight) + 3), charLength, yHeight + 3);
            if (this.currentXPosition > 0) {
                this.currentXPosition = this.currentXPosition - charLength;
            } else {
                this.currentXPosition = 0;

                //check if there is more input
                if (this.buffer.length > 0) {
                    this.currentYPosition = this.currentYPosition - (_DefaultFontSize + _FontHeightMargin);
                    var testCharLength = _DrawingContext.measureText(this.buffer);
                    alert(testCharLength);
                    this.currentXPosition = testCharLength % 500;
                    this.backSpace(text);
                }
            }
        };

        //function to check if a smaller sting is contained within the larger string
        //stating at char 0
        Console.prototype.inOrderContains = function (smallText, largeText) {
            var isStillMatching = true;
            if (smallText.length >= largeText.length) {
                return false;
            } else {
                for (var i = 0; i < smallText.length; i++) {
                    if (smallText.charAt(i) != largeText.charAt(i)) {
                        isStillMatching = false;
                    }
                }
            }
            return isStillMatching;
        };

        //function to replace the buffer on the screen and behind the scenes
        Console.prototype.replaceBuffer = function (text) {
            for (var i = this.buffer.length; i > 0; i--) {
                var removeChar = this.buffer.charAt(this.buffer.length - 1);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                this.backSpace(removeChar);
            }

            //then add the new characters
            this.buffer = text;
            for (var j = 0; j < this.buffer.length; j++) {
                this.putText(this.buffer.charAt(j));
            }
        };

        //method to just scroll the screen
        Console.prototype.scrollUp = function () {
            var yOffset = _DefaultFontSize + _FontHeightMargin;
            var image = _DrawingContext.getImageData(0, yOffset, _DrawingContext.canvas.width, _DrawingContext.canvas.height);
            _DrawingContext.putImageData(image, 0, 0);
            _DrawingContext.clearRect(0, _DrawingContext.canvas.height - yOffset, _DrawingContext.canvas.width, _DrawingContext.canvas.height);
        };
        return Console;
    })();
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
