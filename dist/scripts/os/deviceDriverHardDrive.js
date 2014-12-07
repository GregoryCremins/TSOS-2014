/**
* Created by Whar on 12/6/2014.
*/
//poop By Dan Treccagyolo
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TSOS;
(function (TSOS) {
    var deviceDriverHardDrive = (function (_super) {
        __extends(deviceDriverHardDrive, _super);
        function deviceDriverHardDrive() {
            _super.call(this, this.hdDriverEntry(), this.startHardDrive());
        }
        deviceDriverHardDrive.prototype.hdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        deviceDriverHardDrive.prototype.startHardDrive = function () {
            _HardDrive.HarddriveStartup();
        };
        deviceDriverHardDrive.prototype.formatHardDrive = function () {
            if (_CPU == null || !_CPU.isExecuting) {
                for (var t = 0; t < 3; t++) {
                    for (var s = 0; s < 8; s++) {
                        for (var b = 0; b < 8; b++) {
                            _HardDrive.setValue(t + s + b + "", "0");
                        }
                    }
                }
                _StdOut.putText("Successfully formatted disk");
            } else {
                _StdOut.putText("Error: Please wait for execution to complete before formatting the hard drive.");
            }
        };

        //method to write file into page table
        deviceDriverHardDrive.prototype.createFile = function (fileName) {
            var targetLoc = "000";
            var target = false;
            while (targetLoc != "077" && target == false) {
                if (_HardDrive.getValue(targetLoc).charAt(0) == '0') {
                    _HardDrive.setValue(targetLoc, "1" + fileName);
                    target = true;
                } else {
                    var location = parseInt("0" + targetLoc, 8);
                    location = location + 1;
                    targetLoc = location.toString(8);
                    while (targetLoc.length < 3) {
                        targetLoc = "0" + targetLoc;
                    }
                }
            }
            if (target == false) {
                _StdOut.putText("Unable to create file. Page table is full.");
            } else {
                _StdOut.putText("File created in memory.");
            }
        };

        //write to file
        deviceDriverHardDrive.prototype.writeToFile = function (fileName, data) {
            //first find the index of the file in the page table
            var pageLoc = "000";
            var foundFile = false;
            while (pageLoc != "077" && foundFile == false) {
                //if we found it, stop looping
                var f = _HardDrive.getValue(pageLoc).indexOf(fileName);
                if (_HardDrive.getValue(pageLoc).charAt(0) == '1' && f) {
                    foundFile = true;
                } else {
                    var location = parseInt("0" + pageLoc, 8);
                    location = location + 1;
                    pageLoc = location.toString(8);
                    while (pageLoc.length < 3) {
                        pageLoc = "0" + targetLoc;
                    }
                }
            }

            //if we found the file, then we must attempt to write to it
            if (foundFile == true) {
                //now we write the data
                var targetLoc = "100";
                var target = false;
                var numBlocks = Math.ceil(data.length / 60);

                var runningCountOfBlocks = 0;
                var flag = false;

                while (targetLoc != "277" && flag == false) {
                    if (_HardDrive.getValue(targetLoc).charAt(0) == "0") {
                        runningCountOfBlocks += 1;
                        var location = parseInt("0" + targetLoc, 8);
                        location = location + 1;
                        targetLoc = location.toString(8);
                        while (targetLoc.length < 3) {
                            targetLoc = "0" + targetLoc;
                        }
                    } else {
                        runningCountOfBlocks == 0;
                        var location = parseInt("0" + targetLoc, 8);
                        location = location + 1;
                        targetLoc = location.toString(8);
                        while (targetLoc.length < 3) {
                            targetLoc = "0" + targetLoc;
                        }
                    }
                    if (runningCountOfBlocks == numBlocks) {
                        flag = true;
                    }
                }

                //then begin the write if we found a suitable space
                if (flag == true) {
                    //first get starting location
                    var startLoc = parseInt("0" + targetLoc, 8) - numBlocks;

                    //save the location of the first page of data to the page table
                    _HardDrive.setValue(pageLoc, _HardDrive.getValue(pageLoc) + startLoc.toString(8));
                    var currentLoc = startLoc.toString(8);
                    while (currentLoc.length < 3) {
                        currentLoc = "0" + currentLoc;
                    }

                    //then we begin the write.
                    var counter = 0;
                    _HardDrive.setValue(currentLoc, 1);
                    while (data.length > 0) {
                        var temp = data.charAt(0);
                        _HardDrive.setValue(currentLoc, _HardDrive.getValue(currentLoc) + temp);
                        data = data.substring(1);
                        counter++;

                        //then if we need to swap blocks. we do so
                        if (counter % 60 == 0) {
                            //first, fill in the last 3 bytes with the index of the next block and the first byte set to 1 for used
                            var nextLoc = parseInt("0" + currentLoc, 8) + 1;
                            var nextLocString = nextLoc.toString(8);
                            while (nextLocString.length < 3) {
                                nextLocString = "0" + nextLocString;
                            }
                            _HardDrive.setValue(currentLoc, "1" + _HardDrive.getValue(currentLoc).substr(1) + nextLocString);

                            //then go to the next block
                            currentLoc = nextLocString;
                        }
                    }
                    _StdOut.putText("Data successfully written to memory");
                } else {
                    _StdOut.putText("Error: No large enough space exists for data. Try clearing some files and try again.");
                }
            } else {
                _StdOut.putText("Error: File not found. Please make sure the name is correct.");
            }
        };

        //read and display file contents from memory
        deviceDriverHardDrive.prototype.readFromFile = function (filename) {
            //first find the file in memory
            var pageLoc = "000";
            var foundFile = false;
            while (pageLoc != "077" && foundFile == false) {
                //if we found it, stop looping
                if (_HardDrive.getValue(pageLoc).charAt(0) == '1' && _HardDrive.getValue(pageLoc).indexOf(filename) > -1) {
                    foundFile = true;
                } else {
                    var location = parseInt("0" + pageLoc, 8);
                    location = location + 1;
                    pageLoc = location.toString(8);
                }
            }

            //if we found it, we need to print it
            if (foundFile) {
                //check if the file has a destination location
                var page = _HardDrive.getValue(pageLoc);
                var dataLocString = page.substring(page.length - 3);
                if (+dataLocString != NaN && +dataLocString < parseInt("0277", 8)) {
                    var dataLoc = parseInt("0" + dataLocString, 8);
                    var currentData = _HardDrive.getValue(dataLoc.toString(8));
                    var outString = "";
                    while (currentData.length == 64 && dataLoc < 255) {
                        outString = outString + currentData.substr(1, 61);
                        currentData = _HardDrive.getValue(dataLoc.toString(8));
                        dataLoc += 1;
                    }
                    _StdOut.putText(outString);
                    _StdOut.advanceLine();
                } else {
                    _StdOut.putText("File exists, but there is no data");
                }
            } else {
                _StdOut.putText("Error: file not found");
            }
        };

        //delete file from memory
        deviceDriverHardDrive.prototype.deleteFile = function (filename) {
            //first find the file in memory
            var pageLoc = "000";
            var foundFile = false;
            while (pageLoc != "077" && foundFile == false) {
                //if we found it, stop looping
                if (_HardDrive.getValue(pageLoc).charAt(0) == '1' && _HardDrive.getValue(pageLoc).indexOf(filename) > -1) {
                    foundFile = true;
                } else {
                    var location = parseInt("0" + pageLoc, 8);
                    location = location + 1;
                    pageLoc = location.toString(8);
                }
            }

            //if we found it, we need to remove it
            if (foundFile) {
                var page = _HardDrive.getValue(pageLoc);
                var dataLocString = page.substring(page.length - 3);
                if (+dataLocString != NaN && +dataLocString < parseInt("0277", 8)) {
                    var dataLoc = parseInt("0" + dataLocString, 8);

                    //reset the page table block
                    _HardDrive.setValue(pageLoc, "0");
                    var currentData = _HardDrive.getValue(dataLoc.toString(8));
                    while (currentData.length == 64 && dataLoc < 255) {
                        currentData = _HardDrive.getValue(dataLoc.toString(8));
                        _HardDrive.setValue(dataLoc.toString(8), "0");
                        dataLoc += 1;
                    }
                    _StdOut.putText("Successfully deleted file");
                }
            } else {
                _StdOut.putText("Error: file not found");
            }
        };

        deviceDriverHardDrive.prototype.listHardDrive = function () {
            var pageLoc = "000";
            var endFile = false;
            _StdOut.putText("Name of file[location of track sector and block of file data]");
            _StdOut.advanceLine();
            _StdOut.putText("Hard drive:");
            while (pageLoc != "077" && endFile == false) {
                if (_HardDrive.getValue(pageLoc).charAt(0) == '1') {
                    _StdOut.advanceLine();
                    _StdOut.putText(_HardDrive.getValue(pageLoc).substring(1));
                    var location = parseInt("0" + pageLoc, 8);
                    location = location + 1;
                    pageLoc = location.toString(8);
                    while (pageLoc.length < 3) {
                        pageLoc = "0" + pageLoc;
                    }
                } else {
                    _StdOut.advanceLine();
                    endFile = true;
                }
            }
        };
        return deviceDriverHardDrive;
    })(TSOS.DeviceDriver);
    TSOS.deviceDriverHardDrive = deviceDriverHardDrive;
})(TSOS || (TSOS = {}));
