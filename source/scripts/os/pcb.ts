/**
 * Created by Greg on 10/7/2014.
 * Function to save the current state of the CPU
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
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
        }
        public loadToCPU()
        {
            _CPU.load(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
            _CPU.isExecuting = true;
        }
    }


}