function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = {
        id: userId,
        name: "Ali",
        email: "ali@123.com"
      }

      if (userId <= 0) {
        reject("Invalid userId");
      }
      else {
        resolve(user);
      }
    }, 1000)

  })
}


function fetchOrders(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = {
        userId: userId,
        orderId: 101,

        product: "computer"
      }


      if (userId <= 0) {
        reject("Invalid orderId");
      }
      else {
        resolve(order);
      }

    }, 1000)

  })
}



function fetchOrderDetails(orderId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const details = {
        orderId: orderId,
        product: "computer",
        price: 120000,
        status: "Delivered"
      }

      if (orderId <= 0) {
        reject("No details found");
      }
      else {
        resolve(details);
      }
    }, 1000)
  })
}

async function loadUserData() {
  try {
    const user = await fetchUser(1);
    console.log(user);
    const order = await fetchOrders(user.id);
    console.log(order);
    const orderDetails = await fetchOrderDetails(order.orderId);

    console.log(orderDetails);
  }
  catch (error) {
    console.log(error);
  }
}
loadUserData();

/* 
Callbacks: They are useful for handling the asynchoronous operations.There can be nesting 
            for multiple operations which makes the code difficult to read,maintain.
Promises: It reduces the callback nesting and uses .then() and .catch() to handle async work.
Async/awaits:- It uses await with Promises and makes code easier to read and maintain. It uses try/catch for handling errors.
*/
