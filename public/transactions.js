import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEditTx.js";

let transactionsDiv = null;
let transactionsTable = null;
let transactionsTableHeader = null;

export const handleTransactions = () => {
  transactionsDiv = document.getElementById("transactions");
  const logoff = document.getElementById("logoff");
  const addTransaction = document.getElementById("add-transaction");
  transactionsTable = document.querySelector("#transactions-table tbody");
  transactionsTableHeader = document.getElementById(
    "transactions-table-header"
  );

  ["filter-type", "filter-category", "filter-title"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", showTransactions);
  });


  transactionsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addTransaction) {
        showAddEdit(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        transactionsTable.replaceChildren([transactionsTableHeader]);
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        const transactionId = e.target.dataset.id;
        if (!transactionId) return;

        enableInput(false);
        try {
          const response = await fetch(
            `/api/v1/transactions/${transactionId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = data.msg;
            showTransactions();
          } else {
            message.textContent =
              data.msg || "Failed to delete the transaction.";
          }
        } catch (err) {
          console.log(err);
          message.textContent =
            "A communication error occurred during deletion.";
        }
        enableInput(true);
      }
    }
  });
};

export const showTransactions = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/transactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [transactionsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        transactionsTable.replaceChildren(...children); // clear this for safety
        document.getElementById("balance").textContent = "Balance: $0.00";
      } else {
        let incomeSum = 0;
        let expenseSum = 0;
        
        const typeFilterEl = document.getElementById("filter-type");
        const categoryFilterEl = document.getElementById("filter-category");
        const titleFilterEl = document.getElementById("filter-title");

        const typeFilter = typeFilterEl?.value.toLowerCase() || "";
        const categoryFilter = categoryFilterEl?.value.toLowerCase() || "";
        const titleFilter = titleFilterEl?.value.toLowerCase() || "";

        const typeOptions = new Set();
        const categoryOptions = new Set();

        for (let i = 0; i < data.transactions.length; i++) {
          const tx = data.transactions[i];
          const category =
            tx.type === "income" ? tx.incomeCategory : tx.expenseCategory;
          
          typeOptions.add(tx.type.toLowerCase());
          categoryOptions.add(category.toLowerCase());

          if (
            (typeFilter && tx.type.toLowerCase() !== typeFilter) ||
            (categoryFilter && category.toLowerCase() !== categoryFilter) ||
            (titleFilter && !tx.title.toLowerCase().includes(titleFilter))
          ) {
            continue; 
          }

          const editButton = `<td><button type="button" class="editButton" data-id=${data.transactions[i]._id}>edit</button></td>`;
          const deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.transactions[i]._id}>delete</button></td>`;
          const rowHTML = `
            <td>${tx.title}</td>
            <td>${tx.amount.toFixed(2)}</td>
            <td>${tx.type}</td>
            <td>${category}</td>
            <td>${new Date(tx.date).toLocaleDateString()}</td>
            ${editButton}${deleteButton}`;

          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);

          // Sum income/expense
          if (tx.type === "income") incomeSum += tx.amount;
          else if (tx.type === "expense") expenseSum += tx.amount;
        }

        transactionsTable.replaceChildren(...children);
        const balance = incomeSum - expenseSum;
        const balanceEl = document.getElementById("balance");
        balanceEl.textContent = `Balance: $${balance.toFixed(2)}`;
        balanceEl.style.color =
        balance > 0 ? "green" : balance < 0 ? "red" : "black";
        
        updateSelect("filter-type", typeOptions);
        updateSelect("filter-category", categoryOptions);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(transactionsDiv);
};

function updateSelect(selectId, valueSet) {
  const select = document.getElementById(selectId);
  const selected = select.value; 

  select.innerHTML =
    `<option value="">All</option>` +
    [...valueSet]
      .sort()
      .map((v) => `<option value="${v}">${capitalize(v)}</option>`)
      .join("");

  select.value = selected;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
