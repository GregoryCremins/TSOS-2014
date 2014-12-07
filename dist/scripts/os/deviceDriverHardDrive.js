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
        function deviceDriverHardDrive(hd) {
            this.hardDrive = hd;
            _super.call(this, this.formatHardDrive());
        }
        deviceDriverHardDrive.prototype.formatHardDrive = function () {
            for (var t = 0; t < 3; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        this.hardDrive.setValue(t + s + b + "", "0");
                    }
                }
            }
        };

        //method to write file into page table
        deviceDriverHardDrive.prototype.writeFile = function (fileName) {
            var targetLoc = "000";
            var target = false;
            while (targetLoc != "077" && target == false) {
                if (this.hardDrive.getValue(targetLoc) == "0") {
                    this.hardDrive.setValue(targetLoc, "1" + fileName);
                    target = true;
                }
                var location = parseInt("0x" + targetLoc);
                location = location + 1;
                targetLoc = location.toString(16);
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
                var blockName = this.hardDrive;

                //if we found it, stop looping
                if (this.hardDrive.getValue(pageLoc) == "1" && this.hardDrive.getValue(pageLoc).contains(fileName)) {
                    foundFile = true;
                } else {
                    var location = parseInt("0x" + pageLoc);
                    location = location + 1;
                    pageLoc = location.toString(8);
                }
            }

            //if we found the file, then we must attempt to write to it
            if (foundFile == true) {
                //now we write the data
                var targetLoc = "100";
                var target = false;
                var numBlocks = data.length / 60;
                var runningCountOfBlocks = 0;
                var flag = false;

                while (targetLoc != "277" && flag == false) {
                    if (this.hardDrive.getValue(targetLoc).charAt(3) == "0") {
                        runningCountOfBlocks += 1;
                    } else {
                        runningCountOfBlocks == 0;
                    }
                    if (runningCountOfBlocks == numBlocks) {
                        flag = true;
                    }
                }

                //then begin the write if we found a suitable space
                if (flag == true) {
                    //first get starting location
                    var startLoc = parseInt("0x" + targetLoc) - numBlocks + 1;

                    //save the location of the first page of data to the page table
                    this.hardDrive.setValue(pageLoc, this.hardDrive.getValue(pageLoc) + startLoc.toString(8));
                    var currentLoc = startLoc;

                    //then we begin the write.
                    var counter = 0;
                    while (data.length > 0) {
                        var temp = data.charAt[0];
                        this.hardDrive.setValue(currentLoc, this.hardDrive.getValue(currentLoc) + temp);
                        data = data.substring(1);
                        counter++;

                        //then if we need to swap blocks. we do so
                        if (counter % 60 == 0) {
                            //first, fill in the last 3 bytes with the index of the next block and the first byte set to 1 for used
                            var nextLoc = currentLoc.toString(8);
                            this.hardDrive.setValue(currentLoc, "1" + this.hardDrive.getValue(currentLoc).substr(1) + nextLoc);

                            //then go to the next block
                            currentLoc = currentLoc + 1;
                        }
                    }
                } else {
                    _StdOut.putText("Error: No large enough space exists for data. Try clearing some files and try again.");
                }
            } else {
                _StdOut.putText("Error: File not found. Please make sure the name is correct.");
            }
        };
        return deviceDriverHardDrive;
    })(TSOS.DeviceDriver);
    TSOS.deviceDriverHardDrive = deviceDriverHardDrive;
})(TSOS || (TSOS = {}));
