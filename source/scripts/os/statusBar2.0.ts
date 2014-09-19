/*
Script to control the status bar
 */

//Get a global reference for the status bar and set it
var onDocumentLoad = function()
{
    _StatusCanvas = <HTMLCanvasElement>document.getElementById("statusCanvas");
    _StatusContext = _StatusCanvas.getContext("2d");
    _StatusHandler = new TSOS.statusBarHander();
 };

module TSOS
{
    //status bar class
    export class statusBarHander {
        //the current date and time
        public currentDate = new Date();
        //the line which will be printed
        public line = "";
        //the current time as a string
        public curTime = "";
        constructor()
        {
            CanvasTextFunctions.enable(_StatusContext);
        }

        //function to return the day and time as a string
        public showDate()
        {
            var dotw = this.currentDate.getDay();
            var day = "";
            var month = this.currentDate.getMonth() + 1;
            var date = this.currentDate.getDate();
            var year = this.currentDate.getFullYear();
            var hours = this.currentDate.getHours();
            var minutes = this.currentDate.getMinutes().toString();
            var seconds = this.currentDate.getSeconds();
            var tod = "AM";
            switch (dotw){
                case 0:
                    day = "Sunday";
                    break;
                case 1:
                    day = "Monday";
                    break;
                case 2:
                    day = "Tuesday";
                    break;
                case 3:
                    day = "Wednesday";
                    break;
                case 4:
                    day = "Thursday";
                    break;
                case 5:
                    day = "Friday";
                    break;
                case 6:
                    day = "Saturday";
                    break;
                default:
                    day = "End of the world?";
                    break;
            }
            if(this.currentDate.getMinutes() < 10)
            {
                minutes = "0" + minutes;
            }
            if(hours >= 12)
            {
                tod = "PM";

            }
            return "" + day + " " + month + "/" + date + "/" + year + ", " + hours + ":" + minutes + ":" + seconds + " " + tod;
        }
        //function to render the new status and date on the canvas
        public renderStatus()
        {
            this.line = this.showDate() + ". Status: " + STATUS;
            _StatusContext.drawText( _DefaultFontFamily, _DefaultFontSize, 0, _FontHeightMargin + _DefaultFontSize , this.line);

        }

        //function to update the status and render it
        public updateStatus(newStatus)
        {

            var curDate = new Date();
            var testTime = this.showDate();
            //set the time
            this.curTime = testTime;
            this.currentDate = curDate;

            //if the status has changed, update it
            if(STATUS != newStatus)
            {
                STATUS = newStatus;

            }
            //clear and render status
            this.clearStatusBar();
            this.renderStatus();

        }
        //function to clear the status bar
        public clearStatusBar(){
            _StatusContext.clearRect(0,0,1000, 500);

        }

    }
}
