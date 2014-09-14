///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            //first check if it was backspace
            if(keyCode == 8)
            {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
                ((keyCode >= 97) && (keyCode <= 123))){  // a..z
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) ||   // digits
                        (keyCode == 32)                     ||   // space
                        (keyCode == 13)) {                       // enter
                if(isShifted && ((keyCode >= 48) && (keyCode <= 57)))
                {
                    switch(keyCode)
                    {
                      case 48:
                           // close parenthesis
                            keyCode = 41;
                            break;
                      case 49:
                            // exclamation point
                            keyCode = 33;
                            break;
                      case 50:
                            // at symbol
                            keyCode = 64;
                            break;
                      case 51:
                            //hashtag
                            keyCode = 35;
                            break;
                      case 52:
                            //dolla dolla bill yall
                            keyCode = 36;
                            break;
                      case 53:
                            //percent
                            keyCode = 37;
                            break;
                      case 54:
                            //hat
                            keyCode = 94;
                            break;
                      case 55:
                            //and symbol
                            keyCode = 38;
                            break;
                      case 56:
                            //star
                            keyCode = 42;
                            break;
                      case 57:
                            //open parenthesis
                            keyCode = 40;
                            break;
                      default:
                            keyCode = keyCode;
                            break

                    }
                }
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else
            {
                //handle all punctuation marks
                var foundPunctMark = false;
                if(keyCode == 190 && !foundPunctMark) //period
                {
                    keyCode = 46;
                    if(isShifted)
                    {
                        keyCode = 62;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 188 && !foundPunctMark) //comma
                {
                    keyCode = 44;
                    if(isShifted)
                    {
                        keyCode = 60;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 191 && !foundPunctMark) //forward slash
                {
                    keyCode = 47;
                    if(isShifted)
                    {
                        keyCode = 63;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 186 && !foundPunctMark) //semicolon
                {
                    keyCode = 59;
                    if(isShifted)
                    {
                        keyCode = 58;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 222 && !foundPunctMark) //apostrophe
                {
                    keyCode = 39;
                    if(isShifted)
                    {
                        keyCode = 34;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 219 && !foundPunctMark) //open bracket
                {
                    keyCode = 91;
                    if(isShifted)
                    {
                        keyCode = 123;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 221 && !foundPunctMark) //close bracket
                {
                    keyCode = 93;
                    if(isShifted)
                    {
                        keyCode = 125;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 220 && !foundPunctMark) //backslash
                {
                    keyCode = 92;
                    if(isShifted)
                    {
                        keyCode = 124;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 189 && !foundPunctMark) //dash
                {
                    keyCode = 45;
                    if(isShifted)
                    {
                        keyCode = 95;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 187 && !foundPunctMark) //equals sign
                {
                    keyCode = 61;
                    if(isShifted)
                    {
                        keyCode = 43;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if(keyCode == 192 && !foundPunctMark) //tilda a.k.a. tildashmerde
                {
                    keyCode = 96;
                    if(isShifted)
                    {
                        keyCode = 126;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr) ;
                }


            }
        }
    }
}
