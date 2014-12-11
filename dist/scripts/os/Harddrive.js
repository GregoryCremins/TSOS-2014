/*
* To create the hard drive
*/
var TSOS;
(function (TSOS) {
    var hardDrive = (function () {
        function hardDrive() {
        }
        hardDrive.prototype.HarddriveStartup = function () {
            for (var t = 0; t < 3; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var memString = "" + t + "" + s + "" + b;
                        localStorage.setItem(memString, "0");
                    }
                }
            }
        };

        hardDrive.prototype.setValue = function (targettsb, value) {
            localStorage.setItem(targettsb, value);
        };

        hardDrive.prototype.getValue = function (targettsb) {
            return localStorage.getItem(targettsb);
        };
        return hardDrive;
    })();
    TSOS.hardDrive = hardDrive;
})(TSOS || (TSOS = {}));
