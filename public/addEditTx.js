import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTransactions } from "./transactions.js";

let addEditDiv = null;
let title = null;
let amount = null;
let type = null;
let incomeCategory = null;
let expenseCategory = null;
let incomeCategoryGroup = null;
let expenseCategoryGroup = null;
let date = null;
let addingTransaction = null;
let savingsGoalGroup = null;
let savingsGoal = null;

const updateSavingsGoalVisibility = () => {
  if (type.value === "expense" && expenseCategory.value === "savings") {
    savingsGoalGroup.style.display = "block";
  } else {
    savingsGoalGroup.style.display = "none";
  }
};

export const handleAddEdit = () => {
  addEditDiv = document.getElementById("edit-transaction");
  title = document.getElementById("title");
  amount = document.getElementById("amount");
  type = document.getElementById("type");
  incomeCategory = document.getElementById("incomeCategory");
  expenseCategory = document.getElementById("expenseCategory");
  incomeCategoryGroup = document.getElementById("income-category-group");
  expenseCategoryGroup = document.getElementById("expense-category-group");
  date = document.getElementById("date");
  savingsGoalGroup = document.getElementById("savings-goal-group");
  savingsGoal = document.getElementById("savingsGoal");

  const savingsGoalSelect = document.getElementById("savingsGoal");

  const loadGoalsIntoSelect = async () => {
    try {
      const response = await fetch("/api/v1/goals", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200 && data.goals.length > 0) {
        savingsGoalSelect.innerHTML = "";
        data.goals.forEach((goal) => {
          const option = document.createElement("option");
          option.value = goal._id;
          option.textContent = goal.title;
          savingsGoalSelect.appendChild(option);
        });
      } else {
        savingsGoalSelect.innerHTML = "<option disabled>No goals</option>";
      }
    } catch (err) {
      console.log(err);
      savingsGoalSelect.innerHTML =
        "<option disabled>Error loading goals</option>";
    }
  };

  loadGoalsIntoSelect();

  type.addEventListener("change", () => {
    if (type.value === "income") {
      incomeCategoryGroup.style.display = "block";
      expenseCategoryGroup.style.display = "none";
      savingsGoalGroup.style.display = "none";
    } else if (type.value === "expense") {
      incomeCategoryGroup.style.display = "none";
      expenseCategoryGroup.style.display = "block";
      updateSavingsGoalVisibility();
    }
  });

  expenseCategory.addEventListener("change", () => {
    updateSavingsGoalVisibility();
  });

  addingTransaction = document.getElementById("adding-transaction");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingTransaction) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/transactions";

        if (addingTransaction.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/transactions/${addEditDiv.dataset.id}`;
        }

        const bodyData = {
          title: title.value,
          amount: parseFloat(amount.value),
          type: type.value,
          date: new Date(date.value + "T00:00:00"),
        };

        if (type.value === "income") {
          bodyData.incomeCategory = incomeCategory.value;
        } else if (type.value === "expense") {
          bodyData.expenseCategory = expenseCategory.value;
          if (expenseCategory.value === "savings" && savingsGoal.value) {
            bodyData.goalId = savingsGoal.value;
          }
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(bodyData),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The transaction entry was updated.";
            } else {
              // a 201 is expected for a successful create
              message.textContent = "The transaction entry was created.";
            }

            title.value = "";
            amount.value = "";
            type.value = "income";
            incomeCategory.value = "salary";
            expenseCategory.value = "rent";
            incomeCategoryGroup.style.display = "block";
            expenseCategoryGroup.style.display = "none";

            showTransactions();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }
        enableInput(true);
      } else if (e.target === editCancel) {
        message.textContent = "";
        showTransactions();
      }
    }
  });
};

export const showAddEdit = async (transactionId) => {
  if (!transactionId) {
    title.value = "";
    amount.value = "";
    type.value = "income";
    incomeCategory.value = "salary";
    expenseCategory.value = "rent";
    updateSavingsGoalVisibility();
    date.value = new Date().toISOString().split("T")[0];
    incomeCategoryGroup.style.display = "block";
    expenseCategoryGroup.style.display = "none";
    addingTransaction.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/transactions/${transactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.transaction.title;
        amount.value = data.transaction.amount;
        type.value = data.transaction.type;
        addingTransaction.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = transactionId;

        if (data.transaction.type === "income") {
          incomeCategoryGroup.style.display = "block";
          expenseCategoryGroup.style.display = "none";
          incomeCategory.value = data.transaction.incomeCategory;
        } else {
          incomeCategoryGroup.style.display = "none";
          expenseCategoryGroup.style.display = "block";
          expenseCategory.value = data.transaction.expenseCategory;
          updateSavingsGoalVisibility();
        }

        date.value = data.transaction.date.split("T")[0];
        
        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The transactions entry was not found";
        showTransactions();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showTransactions();
    }

    enableInput(true);
  }
};


