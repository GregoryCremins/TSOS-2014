/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {

        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty() {
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
        public sortQueue()
        {
            //first store all of the pcb's to an array
            var temp = new Array();
            while(this.getSize() > 0)
            {
               var target = this.dequeue();
                temp[temp.length] = target;
            }

            alert(temp.length);
            // then put them back in order
            while(temp.length > 0)
            {
                var maxIndex = -1;
                var maxVal = -1;
                for(var i = 0; i < temp.length; i++)
                {
                    if(temp[i].getPriority() > maxVal)
                    {
                        maxIndex = i;
                        maxVal = temp[i].getPriority();
                    }
                }
                this.enqueue(temp[maxIndex])
                temp.splice(maxIndex, 1);
            }
        }
    }
}
