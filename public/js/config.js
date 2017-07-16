let avat = document.getElementById("infovatar").textContent
let val = parseInt(avat)
let select = document.getElementById('couleur')
let optionSel = document.querySelector('option[value="'+val+'"]')
optionSel.setAttribute("selected", "selected")
select.style.color = optionSel.style.color

let err = document.getElementById("infoerr").textContent
console.log(err)
if (err === 'supr') {
    let errCont = document.getElementById('suprerror')
    document.getElementById('suprAccForm').style.display = "flex"
    errCreate('Mot de passe erroné', errCont)
    errCont.style.display = "block"
} else if (err === 'pass') {
    let errCont = document.getElementById('passerror')
    document.getElementById('passform').style.display = "flex"
    errCreate('Mot de passe erroné', errCont)
    errCont.style.display = "block"
}

let passform = document.getElementById('passform')
passform.addEventListener('submit', function(e) {

    e.preventDefault()

    let oldpass = document.getElementById('oldpass')
    let newpass = document.getElementById("newpass")
    let newpassConfirm = document.getElementById("newpassconf")
    let errCont = document.getElementById('passerror')

    $("#passerror").empty()

    if (oldpass.value === '' || newpass.value === '') {
        errCont.style.display = "block"
        let err = "veuillez remplir tous les champs"
        errCreate(err, errCont)
    } else if (newpassConfirm.value !== newpass.value) {
        errCont.style.display = "block"
        let err = "veuillez confirmer le password"
        errCreate(err, errCont)
    }

    if (
        oldpass.value !== '' &&
        newpass.value !== '' &&
        newpass.value === newpassConfirm.value
    ) {
        this.submit()
    }
})