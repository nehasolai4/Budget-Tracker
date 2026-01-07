let form = document.getElementById('transactionForm')
let lst = document.getElementById('transactionList')

let transactions=[]

let income = document.getElementById('income')
let expense = document.getElementById('expense')
let balance = document.getElementById('balance')

let month = document.getElementById('monthPicker')
let monthTotal = document.getElementById('monthTotal')


form.addEventListener('submit',function(event){
    event.preventDefault()
    console.log("form submitted!!")

    let type = document.getElementById('type').value
    let category = document.getElementById('category').value
    let amt = document.getElementById('amount').value
    let date = document.getElementById('date').value

    amt = Number(amt)

    if(!category || amt<=0 || !date){
        alert("Please fill all fields correctly")
        return
    }

    const transaction={
        id: Date.now(),
        type: type,
        category: category,
        amount: amt,
        date: date
    }

    transactions.push(transaction)

    form.reset()

    saveTransactions();
    renderTransactions();
    updateSummary();

    
});

lst.addEventListener("click",function(event){
    if(event.target.tagName==="BUTTON"){
        let reqId=Number(event.target.dataset.id)
        transactions=transactions.filter(t=>t.id!=reqId)

        saveTransactions()
        renderTransactions()
        updateSummary()
    }
});

month.addEventListener("change",function(event){
    selectedMonth = event.target.value
    let monthlyTotal=0
    for(let i=0; i<transactions.length;i++){
        if(transactions[i].type==="expense" && transactions[i].date.startsWith(selectedMonth)){
            monthlyTotal+=transactions[i].amount
        }
    }

    monthTotal.textContent = `Total spent:₹${monthlyTotal}`
})

function renderTransactions(){
    lst.innerHTML = "";
    for(let i=0; i<transactions.length; i++){
        let li = document.createElement("li")
        let span = document.createElement("span")
        span.textContent=`${transactions[i].category}-${transactions[i].amount}`
        span.className=transactions[i].type

        li.appendChild(span)
        

        let delBtn = document.createElement("button")
        delBtn.textContent="Delete" 
        delBtn.dataset.id=transactions[i].id

        li.appendChild(delBtn)
        lst.appendChild(li)

    }
}


function updateSummary(){
    let totalIncome=0
    let totalExpense=0

    for(let i=0;i<transactions.length;i++){
        if(transactions[i].type==='income'){
            totalIncome+=transactions[i].amount;
        }

        else{
            totalExpense+=transactions[i].amount;
        }
    }

    totalBalance=totalIncome-totalExpense

    income.textContent=totalIncome
    expense.textContent=totalExpense
    balance.textContent=totalBalance
}


function saveTransactions(){
    localStorage.setItem("transactions",JSON.stringify(transactions))
}

function loadTransactions(){
    let data = localStorage.getItem("transactions")
    if(data){
        transactions=JSON.parse(data)
        renderTransactions()
        updateSummary()
    }
}

loadTransactions()

