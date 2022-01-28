// mapeando a Ul que vai receber as transações, as receitas, as despesas, do saldo atual e do form
const transactionUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')

// 1º vou fazer um array de objetos para simular algumas transações
/*let transactions = [
    {id: 1, name: 'Bolo de brigadeiro', amount: -20},
    {id: 2, name: 'Salário', amount: 300},
    {id: 3, name: 'Torta de frango', amount: -10},
    {id: 4, name: 'Violão', amount: 150}
]
*/

// para que as adições e remoções das transações persistam no browser mesmo após ele ser recarregado
// é necessário usar o localStorage do browser:
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

// criando a func remove transaction:
const removeTransaction = ID => {
    transactions = transactions.filter(transaction =>
        transaction.id !== ID)
    updateLocalStorage()
    init()
}

// criar uma func p/ add as transações no DOM
const addTransctionsIntoDOM = ({amount, name, id}) => {
    const operator = amount < 0 ? '-' : '+'
    const CSSclass = amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(amount)
    const li = document.createElement('li')

    li.classList.add(CSSclass)
    li.innerHTML = `${name}
    <span> ${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick ="removeTransaction(${id})">x</button>
    `
    transactionUl.append(li)
}
// refatorando updateBalanceValues:
const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(amount => amount < 0)
    .reduce((acc, amount) => acc + amount, 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(amount => amount > 0)
    .reduce((acc, amount) => acc + amount, 0)
    .toFixed(2)

const getTotal= transactionsAmounts => transactionsAmounts
    .reduce((acc, amount) => acc + amount, 0).toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount)
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)
    
    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}
// quando carregar a pág iserir as informações no DOM
const init = () => {
    transactionUl.innerHTML = ''
    transactions.forEach(addTransctionsIntoDOM)
    updateBalanceValues()
}

init()

/*
o setItem salva uma informação no localStorage e a informção a ser salva
te o formato chave: valor como se fosse um obj, o valor é uma array de 
objs em formato de string, p/ converter o arr de objs em string usa-se JSON.stringify
*/
const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

/*
criando uma função p/ gerar id aletaórios OBS.: a func 'Math.round' 
retorna uma expressão numérica fornecida arredondada para o inteiro mais próximo:
*/
const generateID = () => Math.round(Math.random() * 1000)


//refatorando form.addEventListner...:
const addToTransactionsArray = (transactionName, transactionAmount) =>{
    transactions.push({
        id: generateID(),
        name: transactionName,
        amount: Number(transactionAmount)
    })
}

const cleanIputs = () => {
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
}
const handleFormSubmit = event => {
    event.preventDefault()

    //mapenando o 'name' e 'amount da transação que será enviada'
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty){
        alert('Por favor, preencha tanto o nome quanto o valor da transação')
        return
    }

   addToTransactionsArray(transactionName, transactionAmount)
   init()
   updateLocalStorage()
   cleanIputs()
}

// adcionando um ouvidor de eventos no form:
form.addEventListener('submit', handleFormSubmit)




