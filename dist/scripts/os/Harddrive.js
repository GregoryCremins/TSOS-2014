/*
* To create the hard drive
*/
var TSOS;
(function (TSOS) {
    var Harddrive = (function () {
        function Harddrive() {
        }
        Harddrive.prototype.HarddriveStartup = function () {
            for (var t = 0; t < 3; t++) {
                for (var s = 0; s < 8; s++) {
                    for (var b = 0; b < 8; b++) {
                        var memString = "" + t + s + b;
                        localStorage.setItem(memString, "0");
                    }
                }
            }
        };

        Harddrive.prototype.setValue = function (targettsb, value) {
            document.getElementById(targettsb).innerHTML = value;
        };

        Harddrive.prototype.getValue = function (targettsb) {
            return document.getElementById(targettsb).innerHTML;
        };
        return Harddrive;
    })();
    TSOS.Harddrive = Harddrive;
})(TSOS || (TSOS = {}));
