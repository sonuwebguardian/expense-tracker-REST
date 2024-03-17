document.addEventListener("DOMContentLoaded", async (e) => {
  // how to check is user is logged in
  checkTokenAndRedirect();

  // logout button
  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      // Remove the token from local storage
      localStorage.removeItem("token");
      // Redirect the user to the login page
      window.location.href = "login.html";
    });

  //making http request to api endpoint
  try {
    const response = await axios.get(
      "https://login-js-9cfab-default-rtdb.firebaseio.com//expenseDetails.json"
    );
    console.log(response);
    // for crudcrud bcoz array of objects
    // for (let i of response.data) {
    //   printHistory(i);
    // }
    // for firebase bcoz object of objects
    // If data exists, iterate over each expense entry
    if (response.data) {
      // If data exists, iterate over each expense entry
      Object.entries(response.data).forEach(([key, value]) => {
        printHistory(key, value); // Pass key and value to printHistory function
      });
    }
  } catch (err) {
    console.log(err);
  }
});

async function onbuttonclick(e) {
  //preventing the default behaviour of form submit
  e.preventDefault();
  //getting all the values of form on submit
  const amount = document.getElementById("amount").value;
  const desc = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  //console.log(amount,desc,category);

  //creating a object of expense details
  let expenseDetails = {
    amount: amount,
    desc: desc,
    category: category,
  };
  // console.log(expenseDetails);

  try {
    //using axios for storing expense details to crudcrud endpoint
    const response = await axios.post(
      "https://login-js-9cfab-default-rtdb.firebaseio.com//expenseDetails.json",
      expenseDetails
    );

    console.log(response);
    if (response.data) {
      printHistory(response.data.name, expenseDetails);
    }
  } catch (err) {
    console.log(err);
  }
}

function printHistory(key, obj) {
  //getting expense history list and creating a new list item child in it
  const ul = document.getElementById("expense-list");
  const li = document.createElement("li");
  //modifying newly created list item
  li.appendChild(
    document.createTextNode(`${obj.amount} - ${obj.category} - ${obj.desc}`)
  );
  li.id = key;
  li.className = "list-group-item";
  //creating edit and delete button and adding them to list item
  const delBtn = document.createElement("button");
  delBtn.className = "btn btn-danger btn-sm float-right delete";
  delBtn.appendChild(document.createTextNode("Delete"));
  const editBtn = document.createElement("button");
  editBtn.className = "btn btn-info btn-sm float-right edit";
  editBtn.appendChild(document.createTextNode("Edit"));
  li.appendChild(delBtn);
  li.appendChild(editBtn);

  //when edit button is clicked
  editBtn.addEventListener("click", async (e) => {
    document.getElementById("amount").value = obj.amount;
    document.getElementById("description").value = obj.desc;
    document.getElementById("category").value = obj.category;
    li.remove();
    try {
      const response = await axios.delete(
        `https://login-js-9cfab-default-rtdb.firebaseio.com//expenseDetails/${key}.json`
      );
      // console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  });

  //when delete button is clicked
  delBtn.addEventListener("click", async (e) => {
    try {
      console.log("key is", key);
      const response = await axios.delete(
        `https://login-js-9cfab-default-rtdb.firebaseio.com//expenseDetails/${key}.json`
      );
      console.log("Deleted");
      li.remove();
    } catch (err) {
      console.log(err);
    }
  });

  ul.appendChild(li);
}

function checkTokenAndRedirect() {
  const token = localStorage.getItem("token");

  if (!token) {
    // Token does not exist in local storage
    // Redirect the user to the login page
    window.location.href = "login.html";
    return false;
  }

  // Token exists in local storage, continue with the application logic
  // console.log("Token exists:", token);
  return true;
}
