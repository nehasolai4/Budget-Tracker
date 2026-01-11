let form = document.getElementById('transactionForm')
let lst = document.getElementById('transactionList')

let transactions=[]

let income = document.getElementById('income')
let expense = document.getElementById('expense')
let balance = document.getElementById('balance')

let month = document.getElementById('monthPicker')
let monthTotal = document.getElementById('monthTotal')

let currentFilter = "all";
const filterControls = document.querySelector(".filter-controls");


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
        let li=event.target.parentElement
        let reqId=Number(event.target.dataset.id)

        li.classList.add("fade-out")

        setTimeout(()=>{
            transactions=transactions.filter(t=>t.id!=reqId)
            saveTransactions()
            renderTransactions()
            updateSummary()
        },250)
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



filterControls.addEventListener("click",function(event){
    if(event.target.tagName!="BUTTON") return

    currentFilter = event.target.dataset.filter
    updateActiveFilter(event.target)
    renderTransactions()
})

function renderTransactions(){
    lst.innerHTML = "";
    let filteredTransactions = transactions.filter(t=>{
        if(currentFilter==="all") return true
        return t.type===currentFilter
    })

    for(let i=0; i<filteredTransactions.length; i++){
        let t = filteredTransactions[i]
        let li = document.createElement("li")
        let span = document.createElement("span")
        span.textContent=`${t.category}-${t.amount}`
        span.className=t.type

        li.appendChild(span)
        

        let delBtn = document.createElement("button")
        delBtn.textContent="Delete" 
        delBtn.dataset.id=t.id

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

function updateActiveFilter(activeBtn) {
    let buttons = document.querySelectorAll(".filter-controls button")

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active")
    }

    activeBtn.classList.add("active")
}


loadTransactions()

