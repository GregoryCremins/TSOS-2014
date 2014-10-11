/**
 * Created by Greg on 10/7/2014.
 * Class to hadle the values of a current process
 */
module TSOS{
    export class PCB{
        public PC: number = 0;
        public Acc: number = 0;
        public Xreg: number = 0;
        public Yreg: number = 0;
        public Zflag: number = 0;

        public PCB( PC: number = 0,
                    Acc: number = 0,
                    Xreg: number = 0,
                    Yreg: number = 0,
                    Zflag: number = 0)
        {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }

        /**
         * Function to load the values of this PCB to the CPU
         */
        public loadToCPU()
        {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);

        }

        /**
         * Method to store the parameters to this PCB
         * @param PC
         * @param Acc
         * @param Xreg
         * @param Yreg
         * @param Zflag
         */
        public storeVals(PC, Acc, Xreg, Yreg, Zflag)
        {
            this.PC= PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
    }


}