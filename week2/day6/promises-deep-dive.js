function getUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) {
        resolve({
          id: 1,
          name: "Ali",
        });
      } else {
        reject(new Error("User not found"));
      }
    }, 1000);
  });
}



function getOrders(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        if(user.id===1){
        resolve(order={
            orderId:101,
            userId:user.id,
            item:"Laptop"
        })}
    }, 500);
  });
}


function getOrderDetails(order) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId: order.orderId,
        item: order.item,
        price: 100,
      });
    }, 500);
  });
}
/*
getUser(1)
  .then((user) => {
    console.log("User:", user);
    return getOrders(user);
  })
  .then((orders) => {
    console.log("Orders:", orders[0]);
    return getOrderDetails(orders[0]);
  })
  .then((details) => {
    console.log("Order details:", details);
  })
  .catch((error) => {
    console.log("Error:", error.message);
  });
*/
  /*async function loadUserOrder() {
  try{
    const user=await getUser(1);
    console.log("User:", user);

    const orders=await getOrders(user);
        console.log("Orders:", orders);
const details=await getOrderDetails(order);
    console.log("Order details:", details);

 }

  catch(error)  {
    console.log("Error:", error.message);
  }    }

loadUserOrder();


*/
function getUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "Ali" });
    }, 1000);
  });
}

/*function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Laptop", "Mouse"]);
    }, 1000);
  });
}*/

function getProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Failed to fetch products"));
    }, 1000);
  });
}


function getTasks() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["Learn JavaScript", "Practice async"]);
    }, 1000);
  });
}/*
//sequential promise:
async function loadDataSequentially() {
  const startTime = Date.now();

  const user = await getUser();
  console.log("User:", user);

  const products = await getProducts();
  console.log("Products:", products);

  const tasks = await getTasks();
  console.log("Tasks:", tasks);

  const endTime = Date.now();
  console.log("Total time:", (endTime - startTime) / 1000, "seconds");
}


loadDataSequentially();
*/
//parallel promise:

async function loadDataParallel() {
  try {
    const [user, products, tasks] = await Promise.all([
      getUser(),
      getProducts(),
      getTasks(),
    ]);

    console.log("User:", user);
    console.log("Products:", products);
    console.log("Tasks:", tasks);
  } catch (error) {
    console.log("Promise.all Error:", error.message);
  }
}



loadDataParallel();

/*Sequential Execution

I used `await` for each operation one after another:

- `getUser()`
- `getProducts()`
- `getTasks()`

Each operation takes approximately one second. The total execution time was approximately 3.021 seconds**.

Parallel Execution

I used `Promise.all()` to run the three independent operations together. The total execution time was approximately **[write 1.019 seconds**.

### Comparison and Learning

Sequential execution waits for each operation to finish before starting the next one. Parallel execution starts all independent operations together and waits for all of them to complete.

`Promise.all()` is more time-efficient when asynchronous operations do not depend on one another. If any Promise rejects, `Promise.all()` rejects as well.*/;
