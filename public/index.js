let activeDiv = null;
export const setDiv = (newDiv) => {
  if (newDiv != activeDiv) {
    if (activeDiv) {
      activeDiv.style.display = "none";
    }
    newDiv.style.display = "block";
    activeDiv = newDiv;
  }
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

export let message = null;

import { showTransactions, handleTransactions } from "./transactions.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { showGoals, handleGoals } from "./goals.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEditTx.js";
import { handleAddEditGoal } from "./addEditGoal.js";
import { handleRegister } from "./register.js";

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleRegister();
  handleTransactions();
  handleAddEdit();
  handleAddEditGoal(); 
  handleGoals(); 
  
  const nav = document.getElementById("navigation");
  const showTxBtn = document.getElementById("show-transactions");
  const showGoalsBtn = document.getElementById("show-goals");

  const setActiveNavButton = (activeBtn) => {
    [showTxBtn, showGoalsBtn].forEach((btn) => btn.classList.remove("active"));
    activeBtn.classList.add("active");
  };

  if (token) {
    nav.style.display = "block";

    showTxBtn.addEventListener("click", () => {
      showTransactions();
      setActiveNavButton(showTxBtn);
    });

    showGoalsBtn.addEventListener("click", () => {
      showGoals();
      setActiveNavButton(showGoalsBtn);
    });

    showTransactions(); // default view
    setActiveNavButton(showTxBtn);
  } else {
    showLoginRegister();
  }

});
