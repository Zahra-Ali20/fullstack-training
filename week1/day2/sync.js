// This is Synchronous JS

console.log("Start");
console.log("Processing");
console.log("End");



// This is Asynchronous JS

console.log("Start");

setTimeout(() => {
    console.log("Processing")
}, 1000)
console.log("End");
