// Categories
const incomeCategories = ["Salary", "Allowance", "Others"];
const expenseCategories = ["Food", "Transportation", "Education", "Phone", "Bills", "Shopping", "Others"];

// DOM Elements
const entryType = document.getElementById("entryType");
const entryCategory = document.getElementById("entryCategory");
const entryAmount = document.getElementById("entryAmount");
const entryDate = document.getElementById("entryDate");
const addEntryBtn = document.getElementById("addEntryBtn");
const historyTable = document.getElementById("historyTable");

const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const totalBalanceEl = document.getElementById("totalBalance");

// Data storage
let entries = [];

// Load initial categories
function loadCategories() {
    entryCategory.innerHTML = "";

    let list = entryType.value === "income" ? incomeCategories : expenseCategories;

    list.forEach(cat => {
        let option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        entryCategory.appendChild(option);
    });
}

// Initial load
loadCategories();

// Update categories when type changes
entryType.addEventListener("change", loadCategories);

// Add Entry
addEntryBtn.addEventListener("click", () => {
    const type = entryType.value;
    const category = entryCategory.value;
    const amount = parseFloat(entryAmount.value);
    const date = entryDate.value;

    if (!amount || !date || !category) {
        alert("Please complete all fields.");
        return;
    }

    const newEntry = { type, category, amount, date };
    entries.push(newEntry);

    updateHistory();
    updateTotals();

    entryAmount.value = "";
    entryDate.value = "";
});

// Update Totals
function updateTotals() {
    let income = 0;
    let expense = 0;

    entries.forEach(e => {
        if (e.type === "income") income += e.amount;
        else expense += e.amount;
    });

    totalIncomeEl.textContent = "₱" + income.toLocaleString();
    totalExpenseEl.textContent = "₱" + expense.toLocaleString();
    totalBalanceEl.textContent = "₱" + (income - expense).toLocaleString();
}

// Update History Table
function updateHistory() {
    historyTable.innerHTML = "";

    entries.forEach((entry, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-2">${entry.type}</td>
            <td class="p-2">${entry.category}</td>
            <td class="p-2">₱${entry.amount.toLocaleString()}</td>
            <td class="p-2">${entry.date}</td>
            <td class="p-2">
                <button class="bg-red-500 text-white px-2 py-1 rounded"
                        onclick="deleteEntry(${index})">
                    Delete
                </button>
            </td>
        `;

        historyTable.appendChild(row);
    });
}

// Delete Entry
function deleteEntry(index) {
    entries.splice(index, 1);
    updateHistory();
    updateTotals();
}

// Make functions global for inline onclick
window.deleteEntry = deleteEntry;
