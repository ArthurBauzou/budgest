let avat = document.getElementById("infovatar").textContent
let val = parseInt(avat)
let select = document.getElementById('couleur')
let optionSel = document.querySelector('option[value="'+val+'"]')
optionSel.setAttribute("selected", "selected")
select.style.color = optionSel.style.color


