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
            alert(_Memory);
        }
    }

}