
//1.ARRAY DESTRUCTING
console.log("1.BELOW IS OUTPUT OF ARRAY DESTRUCTING");

{const fruits= ["banana", "apple", "orange"];

const [firstFruit, secondFruit,thirdFruit] = fruits;

console.log(firstFruit);
console.log(secondFruit,thirdFruit);
}


//2.OBJECT DESTRUCTING

console.log("2.BELOW IS OUTPUT OF OBJECT DESTRUCTING");

{const Car={
    
    brand:"Toyota",
    price:500000,

};
const {brand,price}=Car;//
  
console.log(brand);  
console.log(price);  
}
//3. TEMPLATE LITERALS
console.log("3.BELOW IS OUTPUT OF TEMPLATE LITERALS");

{
const name="zahra";
const company="ML arteka";
const role="swe intern";

console.log(`My name is ${name} and I have joined ${company} as a ${role}.`);

//4.ARROW FUNCTION
console.log("4.BELOW IS OUTPUT OF ARROW FUNCTION");

const multiply =(a,b)=>a*b;

console.log(multiply(5,4));
const greet = () => "Hello";
}
// 5. Spread Operators with Arrays
console.log("5.BELOW IS OUTPUT OF SPREAD OPERATORS WITH ARRAYS");

{let marks=[20,30,40];
let updatedMarks=[...marks,80];
console.log(updatedMarks);
}
// 6. Spread Operators with Objects
console.log("6.BELOW IS OUTPUT OF SPREAD OPERATORS WITH OBJECTS");

{
const student={
    name:"zahra",
    age:22,}
const newStudent={
    ...student,
    gender:"Female"
};
console.log(newStudent);
}
7.//DEFAULT PARAMETERS
console.log("7.BELOW IS OUTPUT OF DEFAULT PARAMETERS");

{
let  greet=(name="Guest")=>`Hi! Welcome to the team ${name}`;
console.log(greet("zahra"));}

function greett(name="ali")
{return `Hi! Welcome to the team ${name}`;

}
console.log(greett());

//8. Rest Parameters
console.log("8.BELOW IS OUTPUT OF REST PARAMETERS");

function calculatePrice(...items) {
    let total=0;
    for (let val of items){
    total+=val;}
    return total;
    
}
console.log(calculatePrice(10,20,30));

//9. Optional Chaining:
console.log("9.BELOW IS OUTPUT OF OPTIONAL CHAINING");

const user = {
    name: "Zahra",
    address: {
        city: "Lahore"
    }
};

console.log(user.address?.town);

//10. Nullish Coalescing
console.log("10.BELOW IS OUTPUT OF NULLISH COALESCING");

const userName=null;
console.log(userName ?? "unknown");
