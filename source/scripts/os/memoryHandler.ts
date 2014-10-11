/**
 * Created by Greg on 10/5/2014.
 * class to handle the memory array
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
        public load(mem, index)
        {
            if(typeof(mem) == typeof(123))
            {
                //it is a hex digit, we need to do conversion
                var first = 0;
                if(mem > 16) {
                    first = Math.floor(mem / 16);
                }
                else
                {
                    first = 0;
                }
                var second = mem % 16;
                var firstChar = this.ConvertToString(first);
                var secondChar = this.ConvertToString(second);

                _Memory[index] = firstChar + secondChar;
                this.updateMem();
            }
            else
            {
                //otherwise, its already disassembly
                _Memory[index] = mem;
                this.updateMem();
            }

        }

        /**
         * Function to convert the given hex digit to a string
         * @param digit the hex digit to be converted
         * @returns {string} the string which is generated
         * @constructor
         */
        public ConvertToString(digit)
        {
            switch(digit)
            {
                case 15:
                {
                    return "F";
                    break;
                }
                case 14:
                {
                    return "E";
                    break;
                }
                case 13:
                {
                    return "D";
                    break;
                }
                case 12:
                {
                    return "C";
                    break;
                }
                case 11:
                {
                    return "B";
                    break;
                }
                case 10:
                {
                    return "A";
                    break;
                }
                default:
                {
                    return "" + digit;
                    break;
                }
            }
        }

        /**
         * Function to read a value from memory at the given index
         * @param index the index which we which to read from memory
         * @returns {Object} the value at that given index
         */
        public read(index)
        {
            return _Memory[index];
        }

        /**
         * Function to update memory on the UI
         */
        public updateMem()
        {
            _MemoryElement.value = "";
            for(var i = 0; i < _Memory.length; i++)
            {
                _MemoryElement.value = _MemoryElement.value + _Memory[i] + " ";
            }
            _CPU.updateUI();
        }



    }

}