/*
* To create the hard drive
 */

module TSOS {

    export class Harddrive
    {
        public HarddriveStartup()
        {
            for(var t = 0; t < 3; t++)
            {
                for(var s = 0; s < 8; s++)
                {
                    for(var b = 0; b < 8; b++)
                    {
                        var memString = "" + t + s + b;
                        localStorage.setItem(memString, "0");
                    }
                }
            }
        }

        public setValue(targettsb, value)
        {
            document.getElementById(targettsb).innerHTML = value;
        }

        public getValue(targettsb)
        {
            return document.getElementById(targettsb).innerHTML;
        }
    }
}