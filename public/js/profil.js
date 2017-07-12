let spentCells = document.querySelectorAll("span.spent")
let earnedCells = document.querySelectorAll("span.earned")

console.log(spentCells)
console.log(earnedCells)

let countSum = function(table) {
    let a = 0
    for (let i=0; i<table.length; i++) {
        let b = parseFloat(table[i].textContent)
        console.log("b: ",b)
        a = a + b
        console.log("a: ",a)
    }
    return a
}

let total = Math.round((countSum(earnedCells) + countSum(spentCells))*100)/100

let totContain = document.querySelector("h2 .totalChild p")
totContain.textContent = "total : " +total