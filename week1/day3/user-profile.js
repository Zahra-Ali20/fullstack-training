const user = {
  id: 1,
  firstName: "Ali",
  lastName: "Khan",
  email: "ali@example.com"
};

const fullName =(user)=>{return `The Full name is ${user.firstName} ${user.lastName}`;}

console.log(fullName(user));
