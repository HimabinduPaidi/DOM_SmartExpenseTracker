// DOM Elements
const personInput = document.getElementById("personInput");
const addPersonBtn = document.getElementById("addPersonBtn");
const peopleList = document.getElementById("peopleList");

const amountInput = document.getElementById("amountInput");
const paidBySelect = document.getElementById("paidBySelect");
const addExpenseBtn = document.getElementById("addExpenseBtn");

const expenseList = document.getElementById("expenseList");
const clearAllBtn = document.getElementById("clearAllBtn");

const summaryList = document.getElementById("summaryList");

// Data Arrays
let people = [];
let expenses = [];

/* ---------- Storage ---------- */
function saveToStorage() {
    localStorage.setItem("people", JSON.stringify(people));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function loadFromStorage() {
    const p = localStorage.getItem("people");
    const e = localStorage.getItem("expenses");

    if (p) people = JSON.parse(p);
    if (e) expenses = JSON.parse(e);
}

/* ---------- People ---------- */
addPersonBtn.addEventListener("click", () => {
    const name = personInput.value.trim();
    if (!name) return;

    people.push({ name, balance: 0 });
    personInput.value = "";

    updatePaidBy();
    renderPeople();
    recalculate();
    saveToStorage();
});

function renderPeople() {
    peopleList.innerHTML = "";
    people.forEach(p => {
        const li = document.createElement("li");
        li.className = "list-item";
        li.textContent = p.name;  // Cannot delete person individually
        peopleList.appendChild(li);
    });
}

function updatePaidBy() {
    paidBySelect.innerHTML = "<option value=''>Paid By</option>";
    people.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.name;
        opt.textContent = p.name;
        paidBySelect.appendChild(opt);
    });
}

/* ---------- Expenses ---------- */
addExpenseBtn.addEventListener("click", () => {
    const amount = Number(amountInput.value);
    const paidBy = paidBySelect.value;

    if (!amount || !paidBy) return;

    expenses.push({ amount, paidBy });
    amountInput.value = "";

    recalculate();
    renderExpenses();
    saveToStorage();
});

function renderExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach((exp, index) => {
        const li = document.createElement("li");
        li.className = "list-item";

        li.innerHTML = `
            <span>${exp.paidBy} paid ₹${exp.amount}</span>
            <button class="btn-danger small-btn">Delete</button>
        `;

        li.querySelector("button").onclick = () => {
            expenses.splice(index, 1);
            recalculate();
            renderExpenses();
            saveToStorage();
        };

        expenseList.appendChild(li);
    });
}

/* ---------- CLEAR ALL (RESET APP) ---------- */
clearAllBtn.addEventListener("click", () => {
    if (!confirm("Are you sure? This will delete all people and expenses.")) return;

    people = [];
    expenses = [];
    localStorage.clear();

    updatePaidBy();
    renderPeople();
    renderExpenses();
    renderSummary(); // clear summary
});

/* ---------- Calculation ---------- */
function recalculate() {
    people.forEach(p => p.balance = 0);

    if (people.length === 0 || expenses.length === 0) return;

    expenses.forEach(exp => {
        const share = exp.amount / people.length;

        people.forEach(p => p.balance -= share);

        const payer = people.find(p => p.name === exp.paidBy);
        if (payer) payer.balance += exp.amount;
    });

    renderSummary();
}

/* ---------- Summary ---------- */
function renderSummary() {
    summaryList.innerHTML = "";

    if (expenses.length === 0) return; // Only show after at least 1 expense

    people.forEach(p => {
        const li = document.createElement("li");
        li.className = "list-item";

        if (p.balance > 0) {
            li.innerHTML = `<span class="green">${p.name} receives ₹${p.balance.toFixed(2)}</span>`;
        } else if (p.balance < 0) {
            li.innerHTML = `<span class="red">${p.name} owes ₹${Math.abs(p.balance).toFixed(2)}</span>`;
        } else {
            li.innerHTML = `<span class="muted">${p.name} is settled</span>`;
        }

        summaryList.appendChild(li);
    });
}

/* ---------- Init ---------- */
function renderAll() {
    renderPeople();
    renderExpenses();
    renderSummary();
}

loadFromStorage();
updatePaidBy();
renderAll();
recalculate();
