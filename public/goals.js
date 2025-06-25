import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEditGoal } from "./addEditGoal.js";

let goalsDiv = null;
let goalsTable = null;
let goalsTableHeader = null;

export const handleGoals = () => {
  goalsDiv = document.getElementById("goals");
  const logoff = document.getElementById("logoff-goals");
  const addGoal = document.getElementById("add-goal");
  goalsTable = document.getElementById("goals-table-body");
  goalsTableHeader = document.getElementById("goals-table-header");

  goalsDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addGoal) {
        showAddEditGoal(null);
      } else if (e.target === logoff) {
        setToken(null);
        message.textContent = "You have been logged off.";
        goalsTable.replaceChildren();
        showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
        message.textContent = "";
        showAddEditGoal(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        const goalId = e.target.dataset.id;
        if (!goalId) return;

        enableInput(false);
        try {
          const response = await fetch(`/api/v1/goals/${goalId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.status === 200) {
            message.textContent = data.msg;
            showGoals();
          } else {
            message.textContent = data.msg || "Failed to delete the goal.";
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

export const showGoals = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/goals", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [];

    if (response.status === 200) {
      if (data.count === 0) {
        goalsTable.replaceChildren();
      } else {
        for (let i = 0; i < data.goals.length; i++) {
          const goal = data.goals[i];

          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const progressBarHTML = `
             <div style="background:#ccc; width:100%; height:10px; border-radius:5px; margin-bottom:2px;">
               <div style="width:${Math.min(
                 progress,
                 100
               )}%; height:100%; background:${
            progress >= 100 ? "green" : "#007bff"
          }; border-radius:5px;"></div>
             </div>
             <small>${progress.toFixed(1)}%</small>
           `;

          const editButton = `<td><button type="button" class="editButton" data-id=${goal._id}>edit</button></td>`;
          const deleteButton = `<td><button type="button" class="deleteButton" data-id=${goal._id}>delete</button></td>`;

          const rowHTML = `
              <td>${goal.title}</td>
              <td>${goal.targetAmount.toFixed(2)}</td>
              <td>${goal.currentAmount.toFixed(2)}</td>
              <td>${goal.monthlyContribution.toFixed(2)}</td>
              <td>${new Date(goal.targetDate).toLocaleDateString()}</td>
              <td>${progressBarHTML}</td>
              ${editButton}${deleteButton}`;

          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        goalsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(goalsDiv);
};
