const balanceEl = document.getElementById('balance');
const incomeAmountEl = document.getElementById('income');
const expenseAmountEl = document.getElementById('expense');
const transactionListEl = document.getElementById('transaction-list');
const transactionHistoryEl = document.getElementById('transaction-history');
const transactionFormEl = document.getElementById('transaction-form');
const descriptionEl = document.getElementById('description');
const amountEl= document.getElementById('amount');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
transactionFormEl.addEventListener("submit", addTransaction);

// First i made a function called addTransaction that takes an event object as a parameter. 
// This function is triggered when the transaction form is submitted. It prevents the default form submission behavior, retrieves the description and amount values from the input fields, creates a new transaction object with a unique ID, and adds it to the transactions array. 
// The updated transactions array is then saved to local storage, and the transaction list and summary are updated in the UI.


function addTransaction(e){
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value.trim());

    if(description === ''){
        alert('Please enter a description.');
        return;
    }
    if(isNaN(amount)){
        alert('Please enter a valid numeric amount.');
        return;
    }

    transactions.push({
        id:Date.now(),
        description,
        amount
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));

    updateTransactionlist();
    updatesummary();

    transactionFormEl.reset();
}
//Updates the transaction list in the UI by clearing the existing list and re-rendering it based on the current transactions array. 
// It sorts the transactions in reverse order (most recent first) and creates a new transaction element for each transaction, which is then appended to the transaction list element in the DOM.

function updateTransactionlist(){
    transactionListEl.innerHTML = '';

    const sortedTransactions = [...transactions].reverse();
    sortedTransactions.forEach(transaction => {
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}
function createTransactionElement(transaction){
    const li = document.createElement('li');
    li.classList.add("transaction");
    li.classList.add(transaction.amount < 0 ? 'expense' : 'income');

    // Use template literals to create the inner HTML of the transaction element
    // This includes the description, amount (formatted with a sign), and a delete button
    li.innerHTML = `
        <span class="description">${transaction.description}</span>
        <span class="amount">${formatCurrency(transaction.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">×</button>
    `;

    return li;
}

function updatesummary(){
    try{
        //calculate the balance based on the transaction list.
        const balance = transactions.reduce((acc, transaction) => acc + (Number(transaction.amount) || 0), 0);

        const income = transactions.filter(transaction => Number(transaction.amount) > 0)
        .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

        const expense = transactions.filter(transaction => Number(transaction.amount) < 0)
        .reduce((acc, transaction) => acc + Number(transaction.amount), 0);

        //update the UI with the calculated balance, income, and expense values. The values are formatted to currency display.
        balanceEl.textContent = formatCurrency(balance);
        incomeAmountEl.textContent = formatCurrency(income);
        expenseAmountEl.textContent = formatCurrency(Math.abs(expense));
    }catch(err){
        console.error('Error in updatesummary:', err);
        balanceEl.textContent = formatCurrency(0);
        incomeAmountEl.textContent = formatCurrency(0);
        expenseAmountEl.textContent = formatCurrency(0);
    }
}

function formatCurrency(number){
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    }).format(number);
}

function deleteTransaction(id){
    //filter the transaction we want to delete
    transactions = transactions.filter(transaction => transaction.id !== id);

    //update local storage and UI
    localStorage.setItem('transactions',JSON.stringify(transactions));

    updateTransactionlist();
    updatesummary();
}

updateTransactionlist();
updatesummary();

