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

// ❌ Inalis ang: let entries = []; - Wala na tayong gagamiting lokal na array, server na ang hahawak

// Function to fetch data from the server and update the UI
async function loadData() {
    try {
        const response = await fetch('/api/transactions');
        if (!response.ok) throw new Error('Failed to fetch transactions');
        
        const entries = await response.json(); 

        // I-update ang UI gamit ang data mula sa server
        updateTotals(entries); 
        updateHistory(entries); 

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

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
loadData(); // 👈 Tiyakin na ito ay tinatawag sa simula!

// Update categories when type changes
entryType.addEventListener("change", loadCategories);

// Add Entry (Binago para gumamit ng POST request sa server)
addEntryBtn.addEventListener("click", async () => {
    const type = entryType.value;
    const category = entryCategory.value;
    const amount = parseFloat(entryAmount.value);
    const date = entryDate.value;

    if (!amount || !date || !category) {
        alert("Please complete all fields.");
        return;
    }

    const newEntry = { type, category, amount, date }; // Description ay 'N/A' sa server

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry)
        });

        if (!response.ok) throw new Error('Failed to add transaction');
        
        // Pagkatapos mag-save, i-reload ang data para maipakita ang bagong entry
        await loadData(); 
        
        // I-clear ang form
        entryAmount.value = "";
        entryDate.value = "";
        
    } catch (error) {
        console.error('Error adding entry:', error);
        alert("Failed to add entry. Check console.");
    }
});

// Update Totals (Tumanggap na ng 'entries' mula sa server)
function updateTotals(entries) {
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

// Update History Table (Tumanggap na ng 'entries' mula sa server, gumagamit na ng entry.id)
function updateHistory(entries) {
    historyTable.innerHTML = "";

    entries.forEach((entry) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td class="p-2">${entry.type}</td>
            <td class="p-2">${entry.category}</td>
            <td class="p-2">₱${entry.amount.toLocaleString()}</td>
            <td class="p-2">${entry.date}</td>
            <td class="p-2">
                <button class="bg-red-500 text-white px-2 py-1 rounded"
                        onclick="deleteEntry(${entry.id})"> 
                    Delete
                </button>
            </td>
        `;

        historyTable.appendChild(row);
    });
}

// Delete Entry (Binago para gumamit ng DELETE request at entry ID)
async function deleteEntry(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete transaction');
        
        // I-reload ang data pagkatapos mag-delete
        await loadData();

    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}

// Make functions global for inline onclick
window.deleteEntry = deleteEntry;
window.loadData = loadData; // Gawin ding global para sa debug