///<reference path="deviceDriver.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/* ----------------------------------
DeviceDriverKeyboard.ts
Requires deviceDriver.ts
The Kernel Keyboard Device Driver.
---------------------------------- */
var TSOS;
(function (TSOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };

        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that they are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            //first check if it was backspace
            if (keyCode == 8) {
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            if (((keyCode >= 65) && (keyCode <= 90)) || ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);

                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }

                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } else if (((keyCode >= 48) && (keyCode <= 57)) || (keyCode == 32) || (keyCode == 13)) {
                if (isShifted && ((keyCode >= 48) && (keyCode <= 57))) {
                    switch (keyCode) {
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
                            break;
                    }
                }
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            } else {
                //handle all punctuation marks
                var foundPunctMark = false;
                if (keyCode == 190 && !foundPunctMark) {
                    keyCode = 46;
                    if (isShifted) {
                        keyCode = 62;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 188 && !foundPunctMark) {
                    keyCode = 44;
                    if (isShifted) {
                        keyCode = 60;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 191 && !foundPunctMark) {
                    keyCode = 47;
                    if (isShifted) {
                        keyCode = 63;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 186 && !foundPunctMark) {
                    keyCode = 59;
                    if (isShifted) {
                        keyCode = 58;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 222 && !foundPunctMark) {
                    keyCode = 39;
                    if (isShifted) {
                        keyCode = 34;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 219 && !foundPunctMark) {
                    keyCode = 91;
                    if (isShifted) {
                        keyCode = 123;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 221 && !foundPunctMark) {
                    keyCode = 93;
                    if (isShifted) {
                        keyCode = 125;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 220 && !foundPunctMark) {
                    keyCode = 92;
                    if (isShifted) {
                        keyCode = 124;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 189 && !foundPunctMark) {
                    keyCode = 45;
                    if (isShifted) {
                        keyCode = 95;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 187 && !foundPunctMark) {
                    keyCode = 61;
                    if (isShifted) {
                        keyCode = 43;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
                if (keyCode == 192 && !foundPunctMark) {
                    keyCode = 96;
                    if (isShifted) {
                        keyCode = 126;
                    }
                    foundPunctMark = true;
                    chr = String.fromCharCode(keyCode);
                    _KernelInputQueue.enqueue(chr);
                }
            }
        };
        return DeviceDriverKeyboard;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(TSOS || (TSOS = {}));
