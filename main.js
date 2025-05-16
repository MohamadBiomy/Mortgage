// variables
let inputs = document.querySelectorAll("input[type='number']")
let clearAllBtn = document.querySelector("header p")
let emptyResult = document.querySelector(".empty")
let completedResult = document.querySelector(".completed")
let calculateButton = document.querySelector("button")
let mortgageRadio = document.querySelectorAll("input[type='radio']")
let repaymentDiv = document.querySelector(".monthly-payment")
let isFilled = true
let mortgageType = ""
let mortgageAmount, mortgageTerm, interestRate;
let mortgageObj = {} 
let monthlyRepaymentSpan = document.querySelector(".monthly-repayment")
let totalRepaymentSpan = document.querySelector(".total-repayment")

// inputs
inputs.forEach((input, index) => {
  // disabling arrow keys
  input.addEventListener("keydown", (ev) => ev.key === "ArrowUp" || ev.key === "ArrowDown" ? ev.preventDefault() : null)
  
  // navigating by enter key
  input.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && index !== inputs.length - 1) {
      inputs[index + 1].focus()
    } else if (ev.key === "Enter" && index === inputs.length - 1) {
      calculateButton.click()
    }
  })

  // styling on focus
  input.addEventListener("focus", (ev) => {
    // removing class from all inputs
    inputs.forEach(e => e.parentElement.classList.remove("focused"))
    // adding class
    input.parentElement.classList.add("focused")
  })

  // remove styling on blur
  input.addEventListener("blur", () => input.parentElement.classList.remove("focused"))
})

// clear all button
clearAllBtn.addEventListener("click", () => inputs.forEach(e => {
  e.value = ""
  e.parentElement.classList.remove("focused")
}))

// removing complete side
completedResult.remove()

// calculate repayment
calculateButton.addEventListener("click", (e) => {
  e.preventDefault()
  // check if all inputs are filled
  inputs.forEach(input => !input.value ? isFilled = false : null)
  // get mortgage type
  mortgageRadio.forEach(rad => rad.checked ? mortgageType = rad.value : null)
  // calculate or wait
  isFilled ? showPayment() : errorClass(inputs)
})



// functions
function errorClass(inputs) {
  inputs.forEach(input => {
    if (!input.value) {
      input.parentElement.classList.add("error")
      input.onfocus = () => input.parentElement.classList.remove("error")
    }
  })
}

function showPayment() {
  // remove empty result
  emptyResult.remove()

  // add completed result
  document.querySelector(".result-side").append(completedResult)

  // if add monthly repayment or not
  if (mortgageType === "interest-only") repaymentDiv.remove()
  
  // fill these vars
  mortgageAmount = +inputs[0].value
  mortgageTerm = +inputs[1].value
  interestRate = +inputs[2].value
  mortgageObj = calculateTotalMortgage(mortgageAmount, interestRate, mortgageTerm)
  monthlyRepaymentSpan.innerHTML = addComma(mortgageObj.monthlyPayment)
  totalRepaymentSpan.innerHTML = addComma(mortgageObj.totalInterest)
}

function calculateTotalMortgage(principal, annualInterestRate, years) {
  const monthlyRate = (annualInterestRate / 100) / 12;
  const numberOfPayments = years * 12;

  const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const totalPaid = monthlyPayment * numberOfPayments;

  return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalInterest: (totalPaid).toFixed(2)
  };
}

function addComma(str) {
  int = str.toString().split(".")[0].split("")
  int = int.reverse()
  float = str.toString().split(".")[1]
  for (let i = 3; i < int.length; i += 4) {
    int.splice(i, 0, ",")
  }
  int = int.reverse()
  return [...int, ".", ...float].join("")
}
