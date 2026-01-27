// DOM Elements
const personInput = document.getElementById("personInput");
const addPersonBtn = document.getElementById("addPersonBtn");
const peopleList = document.getElementById("peopleList");

const amountInput = document.getElementById("amountInput");
const paidBySelect = document.getElementById("paidBySelect");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const finishContributionsBtn = document.getElementById("finishContributionsBtn");
const expenseList = document.getElementById("expenseList");

const summaryModal = document.getElementById("summaryModal");
const summaryList = document.getElementById("summaryList");
const totalAmountEl = document.getElementById("totalAmount");
const finishBtn = document.getElementById("finishBtn");
const editBtn = document.getElementById("editBtn");

const historyList = document.getElementById("historyList");
const clearAllBtn = document.getElementById("clearAllBtn");

// Data
let people = JSON.parse(localStorage.getItem("people")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let currentExpense = []; // [{name, amount}]

// Helpers
function updatePaidBySelect() {
  paidBySelect.innerHTML = `<option value="">Paid by</option>`;
  people.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p; opt.textContent = p;
    paidBySelect.appendChild(opt);
  });
}

function renderPeople() {
  peopleList.innerHTML = "";
  people.forEach(p=>{
    const li = document.createElement("li"); li.textContent=p;
    peopleList.appendChild(li);
  });
  updatePaidBySelect();
}

function renderExpenses() {
  expenseList.innerHTML = "";
  currentExpense.forEach((exp,index)=>{
    const li = document.createElement("li");
    li.classList.add("expense-row");
    li.innerHTML=`
      ${exp.name}: ₹${exp.amount} 
      <span class="row-actions">
        <button class="row-edit" data-index="${index}">✎</button>
        <button class="row-delete" data-index="${index}">✕</button>
      </span>
    `;
    expenseList.appendChild(li);
  });
}

function showSummaryModal(){
  summaryList.innerHTML = "";
  const balances = {};
  let total = 0;
  people.forEach(p => balances[p] = 0);
  currentExpense.forEach(e => { balances[e.name] += e.amount; total += e.amount; });
  const split = total / people.length;
  people.forEach(p => balances[p] -= split);

  people.forEach(p => {
    const li = document.createElement("li");
    if (balances[p] > 0) li.innerHTML = `<span class="credit">${p} receives ₹${balances[p].toFixed(2)}</span>`;
    else if (balances[p] < 0) li.innerHTML = `<span class="debit">${p} owes ₹${Math.abs(balances[p]).toFixed(2)}</span>`;
    else li.innerHTML = `<span>${p} is settled</span>`;
    summaryList.appendChild(li);
  });

  totalAmountEl.textContent = `₹${total.toFixed(2)}`;
  summaryModal.style.display = "flex";
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach(sess=>{
    const div = document.createElement("div");
    div.classList.add("history-item");
    let html = `<strong>Session ${sess.id}</strong> <small>${new Date(sess.timestamp).toLocaleString()}</small><ul>`;
    for(let p in sess.balances){
      html += `<li>${p}: <span class="${sess.balances[p]>=0?'credit':'debit'}">₹${sess.balances[p].toFixed(2)}</span></li>`;
    }
    html += "</ul>";
    div.innerHTML = html;
    historyList.appendChild(div);
  });
}

function saveData(){
  localStorage.setItem("people",JSON.stringify(people));
  localStorage.setItem("history",JSON.stringify(history));
}

// Event Listeners
addPersonBtn.addEventListener("click", ()=>{
  const name = personInput.value.trim();
  if(name && !people.includes(name)){ people.push(name); personInput.value=""; renderPeople(); saveData(); }
});

addExpenseBtn.addEventListener("click", ()=>{
  const amount = parseFloat(amountInput.value);
  const paidBy = paidBySelect.value;
  if(!amount || !paidBy) return;

  const existing = currentExpense.find(e => e.name === paidBy);
  if(existing){ existing.amount = amount; } 
  else { currentExpense.push({name: paidBy, amount}); }

  amountInput.value = ""; paidBySelect.value = "";
  renderExpenses();
});

// Finish Contributions → modal
finishContributionsBtn.addEventListener("click", ()=>{
  if(currentExpense.length===0) return;
  showSummaryModal();
});

// Row delete/edit
expenseList.addEventListener("click", e=>{
  const idx = e.target.getAttribute("data-index");
  if(e.target.classList.contains("row-delete")){
    currentExpense.splice(idx,1); renderExpenses();
  }
  if(e.target.classList.contains("row-edit")){
    const exp = currentExpense[idx];
    amountInput.value = exp.amount;
    paidBySelect.value = exp.name;
    currentExpense.splice(idx,1); renderExpenses();
  }
});

// Finish Expense → save to history
finishBtn.addEventListener("click", ()=>{
  if(currentExpense.length===0) return;

  const balances = {};
  let total = 0;
  people.forEach(p => balances[p] = 0);
  currentExpense.forEach(e => { balances[e.name] += e.amount; total += e.amount; });
  const split = total / people.length;
  people.forEach(p => balances[p] -= split);

  history.push({id:Date.now(), timestamp:Date.now(), balances});
  currentExpense = []; people = [];
  summaryModal.style.display="none";
  renderPeople(); renderExpenses(); renderHistory(); saveData();
});

// Edit → back to main page
editBtn.addEventListener("click", ()=>{
  summaryModal.style.display="none";
  renderPeople(); renderExpenses();
});

// Clear All
clearAllBtn.addEventListener("click", ()=>{
  people = []; currentExpense = []; history = [];
  summaryModal.style.display="none";
  renderPeople(); renderExpenses(); renderHistory(); saveData();
});

// Initial Render
renderPeople(); renderExpenses(); renderHistory();
