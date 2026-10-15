function first() {
  second();
}

function second() {
  third();
}

function third() {
  console.log("Third");
}

first();


// Prediction:
// A
// C
// B

console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");

/*setTimeout(..., 0) does not mean “run immediately” because the callback is scheduled to execute after the current
synchronous code finishes. A delay of 0 milliseconds does not guarantee immediate execution.
The callback must wait until the timer is eligible and the Event Loop can process it.*/


// It will print A,D,C,B Because promise callbacks are handled in microtask queue and timer callbacks are handled in
// timer queues and microtask queues are given priority so thats why promises are executed first and then the timer callbacks.
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});
console.log("D");


process.nextTick(() => {
  console.log("nextTick");
});


Promise.resolve().then(() => {
  console.log("promise");
});


setTimeout(() => {
  console.log("timeout");
}, 0);*/
/*nextTick is printed first then promise and then timeout.
process.nextTick() is specific to Node.js and schedules callbacks to run after the current synchronous operation,
before normal Event Loop callback processing continues. We should not use it just because it executes earlier.
 Excessive scheduling can starve the Event Loop by continuously keeping the Next Tick Queue busy, delaying timers, I/O callbacks, and other work.
*/

console.log("1. Program started");

setTimeout(() => {
  console.log("2. Timer callback executed");
}, 0);

console.log("3. Heavy calculation started");

let sum = 0;

for (let i = 0; i < 50_000_000; i++) {
  sum += i;
}

console.log("4. Heavy calculation finished");
console.log("Sum:", sum);