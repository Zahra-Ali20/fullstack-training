function findHighest(numbers){
    let max=numbers[0];

if(numbers.length===0){
console.log("This is an empty array of numbers.")
}
else{
for(let val of numbers){
  if (val>max){
    max=val;
  }
    

}
 return console.log("The maximun number is:",max);
}
}
findHighest([20,30,40]);


function removeDuplicates(values)
{
   const  array=[];
     for (val of values){
        if(!array.includes(val)){
            array.push(val);
        }
     }
             return array;

}

    console.log(removeDuplicates([1,2,2,3,5,5,6]));


function   countOccurrences(values){
const obj={};
for (let val of values){
  if(obj[val]){
    obj[val]++;
  }
  else{
obj[val]=1;
  }
}
     return obj;
 }
console.log(countOccurrences(["oranges","oranges","banana","apple"]));


function calculateCartTotal(cart){
total=0;
for(let item of cart){
  total=total+item.price*item.quantity
}


    return total;

}

console.log(calculateCartTotal([
  { name: "Laptop", price: 1000, quantity: 1 },
  { name: "Mouse", price: 50, quantity: 2 }
]));

function filterAndSortProducts(products, category, maxPrice) {
    
function checkProducts(product){
      return product.category===category && product.price<=maxPrice;
}
       let filteredProducts = products.filter(checkProducts);
filteredProducts.sort((a,b)=>{
    return a.price-b.price;
})
   return filteredProducts; }
const products = [
  {
    name: "Laptop",
    price: 1200,
    category: "Electronics"
  },
  {
    name: "Mouse",
    price: 500,
    category: "Electronics"
  },
  {
    name: "Keyboard",
    price: 800,
    category: "Electronics"
  },
  {
    name: "Coffee Maker",
    price: 1500,
    category: "Kitchen"
  },
  {
    name: "Toaster",
    price: 700,
    category: "Kitchen"
  },
  {
    name: "Backpack",
    price: 50,
    category: "Accessories"
  }
];
const result=filterAndSortProducts(products, "Electronics", 1500);
console.log(result);