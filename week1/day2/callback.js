function fetchUser(userId, callback) {

  setTimeout(() => {
    const user = {
      id: userId,
      name: "Ali",
      email: "ali@123.com"
    }

    if (userId <= 0) {
      callback("Invalid userId", null);
    }
    else {
      callback(null, user);
    }
  }, 1000)

}

function fetchOrders(userId, callback) {
  setTimeout(() => {
    const order = {
      userId: userId,
      orderId: 101,
      product: "computer"
    }


    if (userId <= 0) {
      callback("Invalid orderId", null);
    }
    else {
      callback(null, order);
    }

  }, 1000)

}

function fetchOrderDetails(orderId, callback) {
  setTimeout(() => {
    const details = {
      orderId: orderId,
      product: "computer",
      price: 120000,
      status: "Delivered"
    }

    if (orderId <= 0) {
      callback("No details found", null);
    }
    else {
      callback(null, details);
    }
  }, 1000)
}


fetchUser(1, (error, user) => {

  if (error) {
    console.log(error);
  }

  else {
    console.log(user);

    fetchOrders(user.id, (error, order) => {

      if (error) {
        console.log(error);
      }

      else {
        console.log(order);

        fetchOrderDetails(order.orderId, (error, details) => {

          if (error) {
            console.log(error);
          }

          else {
            console.log(details);
          }

        });
      }

    });
  }

});