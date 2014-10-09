/**
 * Created by Greg on 10/5/2014.
 */
module TSOS {
    export class memory
    {
        public memory(
            )
        {
            var accumulator = 0;

        }

        //loads an item into memory
        public load(mem)
        {
            _Memory[_MemIndex]= mem;
            _MemIndex++;
            this.updateMem();
            //shift the focus back and forth

        }

        public updateMem()
        {
            _MemoryElement.value = "";
            for(var i = 0; i < _Memory.length; i++)
            {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
            _CPU.updateConsole();
        }

    }

}