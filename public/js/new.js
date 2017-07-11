let select = document.querySelector("select")
let newInput = document.getElementById("newposto")
let dateIn = document.getElementById('date')

newInput.style.display = "none"

// apparition du champ de nouvelle origine / poste
select.addEventListener('change', function() {
    console.log(select.value)
    if (select.value === "12384568") {
        newInput.style.display = "flex"
    } else {
        newInput.style.display = "none"        
    }
})

// correction du format de la date
let datemanuel =document.getElementById("datemanuel")
datemanuel.addEventListener('input', function() {
    let a = datemanuel.value
    let b = a.replace(/\D/g, "")
    let mask = {4:"-",6:"-"}
    let c = ""
    for (let i=0; i<b.length && i<8; i++) {
        if (mask[i]) { c = c + mask[i] }
        c = c+b[i]
    }
    datemanuel.value = c
})

// correction du format du montant
let montant = document.getElementById("montant")
montant.addEventListener('input', function() {
    let a = montant.value
    let b = a.replace(/[^\d.]/g, "")
    let c = b.match(/\b\d+\.?\d{0,2}/)
    montant.value = c
})