function fetchUser(userId){
return new Promise((resolve, reject)=>{
  setTimeout(()=>{
  const user={
   id:userId,
   name: "Ali",
   email: "ali@123.com"}

  if (userId<=0){
  reject("Invalid userId");
  }
  else{
    resolve(user);
  }
  },1000)
  
})}

function fetchOrders(userId){
    return new Promise((resolve,reject)=>{
  setTimeout(()=>{
  const order={userId:userId,
              orderId: 101,

              product:"computer"}

    
               if (userId<=0){
  reject("Invalid orderId");
  }
  else{
    resolve(order);
  }

  },1000)
  
  })}

  function fetchOrderDetails(orderId){
    return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      const details={
        orderId:orderId,
        product: "computer",
      price: 120000,
      status: "Delivered"
      }

      if (orderId<=0){
  reject("No details found");
  }
  else{
    resolve(details);
  }
    },1000)
  })}

fetchUser(1)

  .then((user) => {
    console.log(user);

    return fetchOrders(user.id);
  })

  .then((order) => {
    console.log(order);

    return fetchOrderDetails(order.orderId);
  })

  .then((details) => {
    console.log(details);
  })

  .catch((error) => {
    console.log(error);
  });