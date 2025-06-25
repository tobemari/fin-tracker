import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showGoals } from "./goals.js";

let addEditGoalDiv = null;
let title = null;
let targetAmount = null;
let monthlyContribution = null;
let targetDate = null;
let addingGoal = null;

export const handleAddEditGoal = () => {
  addEditGoalDiv = document.getElementById("edit-goal");
  title = document.getElementById("goal-title");
  targetAmount = document.getElementById("goal-targetAmount");
  monthlyContribution = document.getElementById("goal-monthlyContribution");
  targetDate = document.getElementById("goal-targetDate");
  addingGoal = document.getElementById("adding-goal");
  const editCancel = document.getElementById("edit-cancel-goal");

  addEditGoalDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingGoal) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/goals";

        if (addingGoal.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/goals/${addEditGoalDiv.dataset.id}`;
        }

        const bodyData = {
          title: title.value,
          targetAmount: parseFloat(targetAmount.value),
          monthlyContribution: parseFloat(monthlyContribution.value),
          targetDate: new Date(targetDate.value + "T00:00:00"),
        };

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
            message.textContent =
              response.status === 200
                ? "The goal was updated."
                : "The goal was created.";

            title.value = "";
            targetAmount.value = "";
            monthlyContribution.value = "";
            targetDate.value = new Date().toISOString().split("T")[0];

            showGoals();
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
        showGoals();
      }
    }
  });
};

export const showAddEditGoal = async (goalId) => {
  if (!goalId) {
    title.value = "";
    targetAmount.value = "";
    monthlyContribution.value = "";
    targetDate.value = new Date().toISOString().split("T")[0];
    addingGoal.textContent = "add";
    message.textContent = "";

    setDiv(addEditGoalDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/goals/${goalId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.goal.title;
        targetAmount.value = data.goal.targetAmount;
        monthlyContribution.value = data.goal.monthlyContribution;
        targetDate.value = data.goal.targetDate.split("T")[0];
        addingGoal.textContent = "update";
        message.textContent = "";
        addEditGoalDiv.dataset.id = goalId;

        setDiv(addEditGoalDiv);
      } else {
        message.textContent = "The goal entry was not found.";
        showGoals();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showGoals();
    }

    enableInput(true);
  }
};
