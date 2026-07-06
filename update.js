(function () {
  'use strict';

  function updateBalance() {
    const el = document.getElementById("balance");
    if (el) el.innerText = (Math.random() * 10000).toFixed(2);
  }

  function updateProfit() {
    const el = document.getElementById("profit");
    if (el) el.innerText = (Math.random() * 5000).toFixed(2);
  }

  function startDashboard() {
    setInterval(() => {
      updateBalance();
      updateProfit();
    }, 3000);
  }

  document.addEventListener("DOMContentLoaded", startDashboard);
})();
