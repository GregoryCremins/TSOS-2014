/**
 * Created by Greg on 10/7/2014.
 * Class to hadle the values of a current process
 */
module TSOS{
    export class PCB {
        public PC:number = 0;
        public Acc:number = 0;
        public Xreg:number = 0;
        public Yreg:number = 0;
        public Zflag:number = 0;
        public PID:number = 0;
        public base:number = 0;
        public limit:number = 0;
        public priority: number = 0;

        public PCB(PC:number = 0, Acc:number = 0, Xreg:number = 0, Yreg:number = 0, Zflag:number =0) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }

        public getPID()
        {
            return this.PID;
        }

        public setPID(val) {
            this.PID = val;
        }

        public setPCval(val) {
            this.PC = val;
        }

        public setLimit(val) {
            this.limit = val;
        }

        public setBase(val) {
            this.base = val;
        }
        public setPriority(val){
            this.priority = val;
        }

        /**
         * Function to load the values of this PCB to the CPU
         */
        public loadToCPU() {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.base, this.limit);

        }

        /**
         * Method to store the parameters to this PCB
         * @param PC
         * @param Acc
         * @param Xreg
         * @param Yreg
         * @param Zflag
         */
        public storeVals(PC, Acc, Xreg, Yreg, Zflag) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }

        /**
         * Function to print the PCB's contents to the screen
         */
        public printToScreen() {
            //new PCB writer
            var newRow = <HTMLTableRowElement>_PCBElement.insertRow();
            for (var j = 0; j < 9; j++) {
                var targetCell = newRow.insertCell(j);
                switch (j) {
                    case 0:
                    {
                        targetCell.innerHTML = "" + this.PID;
                        break;
                    }
                    case 1:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.PC);
                        break;
                    }
                    case 2:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Acc);
                        break;
                    }
                    case 3:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Xreg);
                        break;
                    }
                    case 4:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Yreg);
                        break;
                    }
                    case 5:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.Zflag);
                        break;
                    }
                    case 6:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.base);
                        break;
                    }
                    case 7:
                    {
                        targetCell.innerHTML = "0x" + this.toHexDigit(this.limit);
                        break;
                    }
                    case 8:
                    {
                        targetCell.innerHTML = "" + this.priority;
                        break;
                    }
                    default:
                    {
                        break;
                    }
                }
            }

        }

        /**
         * Function to convert a number to hex
         * @param dec the decimal number to be converted
         * @returns {string} the string of the hexedecimal equivalenbt
         */
        public toHexDigit(dec) {
            return dec.toString(16);
        }
    }
}