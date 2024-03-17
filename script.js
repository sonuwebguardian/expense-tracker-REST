document.addEventListener("DOMContentLoaded", async (e) => {

    checkToken();

    document.getElementById("logoutButton").addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "login.html"
    })

    try {
        const response = await axios.get("https://database-d5bdc-default-rtdb.firebaseio.com/expenseDetails.json");

        console.log(response);
        if(response.data){
            Object.entries(response.data).forEach(([key,value])=>{
                printHistory(key,value);
            })
        }
    } catch (error) {
        console.log(error);
    }
})

async function onbuttonclick(e) {
  e.preventDefault();

  const amount = document.getElementById("amount").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;

  let expenseDetails = {
    amount: amount,
    description: description,
    category: category,
  };

  // console.log(expenseDetails);

  try {
    const response = await axios.post(
      "https://database-d5bdc-default-rtdb.firebaseio.com/expenseDetails.json",
      expenseDetails
    );

    console.log(response);
    if (response.data) {
      printHistory(response.data.name, expenseDetails);
    }
  } catch (error) {
    console.log(error);
  }
}

function printHistory(key, obj) {
    const ul = document.getElementById("expense-list");
    const li = document.createElement("li");

    li.appendChild(
        document.createTextNode(`${obj.amount} - ${obj.category} - ${obj.description}`)
    );
    li.id = key;
    li.className = "list-group-item";

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger btn-sm float-right delete";
    delBtn.appendChild(document.createTextNode("Delete"));
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-info btn-sm float-right edit";
    editBtn.appendChild(document.createTextNode("Edit"));
    li.appendChild(delBtn);
    li.appendChild(editBtn);

    editBtn.addEventListener("click", async (e) => {
        document.getElementById("amount").value = obj.amount;
        document.getElementById("description").value = obj.description;
        document.getElementById("category").value = obj.category;

        li.remove();

        try {
            const response = await axios.delete(`https://database-d5bdc-default-rtdb.firebaseio.com/expenseDetails/${key}.json`);
            console.log("Item edited", response.data);
        } catch (error) {
            console.log(error);
        }
    })

    delBtn.addEventListener("click", async (e) => {
        li.remove();

        try {
            const response = await axios.delete(`https://database-d5bdc-default-rtdb.firebaseio.com/expenseDetails/${key}.json`);

            console.log("Item Deleted", response.data);
        } catch (error) {
            
        }
    });

    ul.appendChild(li)
}

function checkToken() {
    const token = localStorage.getItem("token");

    if(!token){
        window.location.href = "login.html"
        return false;
    }
    return true;
}