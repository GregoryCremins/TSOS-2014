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

        public isEmpty(){
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
        public sortByPriority(){
            //redundant check
            if(_CPU != null)
            {
                var holdingArray = new PCB[0]();
                while(this.getSize() > 0)
                {
                    holdingArray.pubh(this.dequeue());
                }

                //repopulate the queue
                while(holdingArray.length > 0)
                {
                    var indexOfHigh = -1;
                    var valueOfHigh = null;
                    //find highest priority
                    for(var i = 0; i < holdingArray.length; i++)
                    {
                        if(indexOfHigh == -1 || holdingArray[i].priority > valueOfHigh)
                        {
                            indexOfHigh = i;
                            valueOfHigh = holdingArray[i];
                        }
                    }
                    var target = holdingArray[indexOfHigh];
                    this.enqueue(target);
                    holdingArray.splice(indexOfHigh, 1);
                }
            }
        }
    }
}
