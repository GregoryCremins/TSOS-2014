///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public history = [],
                    public historyIndex = history.length) {

        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    this.history[this.history.length] = this.buffer;
                    this.historyIndex = this.history.length;
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else {
                    if (chr === String.fromCharCode(8)) { //backspace
                        var removeChar = this.buffer.charAt(this.buffer.length - 1)
                        this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                        this.backSpace(removeChar);
                        //this.buffer += "J";
                    }
                    else {
                        //tab command to autocomplete a line
                        if(chr == String.fromCharCode(9)){ //
                            var currentBuffer = this.buffer.toString();
                            var foundMatch = false;
                            var currentCommands = ["ver","help","shutdown","cls","man","trace","load","rot13","prompt","status","datetime","whereami","travel","lose"];
                            //there is no contains function ARRRGH!
                            //check list of current commands
                            for(var k = 0; k < currentCommands.length; k++) {
                                if ((this.inOrderContains(currentBuffer, currentCommands[k])) && foundMatch == false) {
                                    currentBuffer = currentCommands[k];
                                    foundMatch = true;
                                }
                            }

                            if(foundMatch)
                            {
                                this.replaceBuffer(currentBuffer);
                            }
                        }
                        else {
                            if(chr == "upArrow"){//upArrow
                                if(this.historyIndex >  0)
                                {
                                    var historyCommand = this.history[this.historyIndex - 1]
                                    this.replaceBuffer(historyCommand);
                                    this.historyIndex = this.historyIndex - 1;
                                }
                            }
                            else {
                                    if(chr =="downArrow")
                                    {
                                        if(this.historyIndex < this.history.length - 1)
                                        {
                                            var historyCommand = this.history[this.historyIndex + 1]
                                            this.replaceBuffer(historyCommand);
                                            this.historyIndex = this.historyIndex + 1;
                                        }
                                    }
                                else {


                                        // This is a "normal" character, so ...
                                        // ... draw it on the screen...
                                        //the first wrapping text attempt
                                        // if ((this.buffer.length % 47) == 0 && this.buffer.length != 0) {
                                        //   this.advanceLine();
                                        //}
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
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to w;rite one function and use the term "text" to connote string or char.
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //THIS IS THE AMAZING LINE WRAPPING
            if(text.length > 1)
            {
                for(var i = 0; i < text.length; i++)
                {
                    this.putText(text.charAt(i));
                }
            }
            else {
                if (text !== "") {
                    // Draw the text at the current X and Y coordinates.
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    if((this.currentXPosition + offset) > 500)
                    {
                        this.advanceLine();
                    }
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                   this.currentXPosition = this.currentXPosition + offset;
                }
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            //the scrolling of destiny
            if((this.currentYPosition + _DefaultFontSize + _FontHeightMargin) < _DrawingContext.canvas.height) {
                this.currentYPosition += _DefaultFontSize + _FontHeightMargin;
            }
            else
            {
                this.scrollUp();
            }
            // TODO: Handle scrolling. (Project 1)
            //size of buffer is 29
        }
        public backSpace(text): void{
            var charLength = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
            var yHeight = _DefaultFontSize + _FontHeightMargin;
            _DrawingContext.clearRect(this.currentXPosition - charLength, ((this.currentYPosition - yHeight) + 5), charLength, yHeight);
            if(this.currentXPosition > 0)
            {
                this.currentXPosition = this.currentXPosition - charLength;
            }

        }
        //function to check if a smaller sting is contained within the larger string
        //stating at char 0
        public inOrderContains(smallText, largeText): boolean{
            var isStillMatching = true;
            if(smallText.length >= largeText.length)
            {
                return false;
            }
            else {
                for (var i = 0; i < smallText.length; i++) {
                    if (smallText.charAt(i) != largeText.charAt(i)) {
                        isStillMatching = false;
                    }
                }
            }
            return isStillMatching;
        }
       //function to replace the buffer on the screen and behind the scenes
        public replaceBuffer(text)
        {
            //first clear all characters
            for(var i = this.buffer.length; i >0; i--)
            {
                var removeChar = this.buffer.charAt(this.buffer.length - 1);
                this.buffer = this.buffer.substring(0, this.buffer.length - 1);
                this.backSpace(removeChar);
            }
            //then add the new characters
            this.buffer = text;
            for(var j = 0; j < this.buffer.length; j++)
            {
                this.putText(this.buffer.charAt(j));
            }
        }
        //method to just scroll the screen
        public scrollUp()
        {
            var yOffset = _DefaultFontSize + _FontHeightMargin;
            var image = _DrawingContext.getImageData(0, yOffset, _DrawingContext.canvas.width, _DrawingContext.canvas.height);
            _DrawingContext.putImageData(image,0, 0);
            _DrawingContext.clearRect(0, _DrawingContext.canvas.height - yOffset,_DrawingContext.canvas.width, _DrawingContext.canvas.height);
        }
    }
 }
