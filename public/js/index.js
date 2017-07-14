let subForm = document.getElementById("subForm")
let loginBtn = document.querySelectorAll('.logBlock')
let subBtn = document.querySelector('.subBlock')
let errCont = document.getElementById("errContainer")

subForm.style.display = "none"
errCont.style.display = "none"

subForm.addEventListener('submit', function(e) {

    e.preventDefault();

    let names = extraire('.namelist') // la fonction extraire est dans le fichier general.js

    let subName = document.getElementById("name")
    let subPass = document.getElementById("pass")
    let subPass2 = document.getElementById("pass2")

    // effacre toutes les erreurs
    $("#errContainer").empty()

    // ecrire les erreurs si nécessaire
    if (names.includes(subName.value)) {
        errCont.style.display = "block"
        let err = "ce nom d'utilisateur est déjà dans la base"
        errCreate(err, errCont)
    }
    if (/\s/.test(subName.value)) {
        errCont.style.display = "block"
        let err = "votre nom ne doit pas contenir d\'espace"
        errCreate(err, errCont)
    }
    if (subName.value === '' || subPass.value === '') {
        errCont.style.display = "block"
        let err = "veuillez remplir tous les champs"
        errCreate(err, errCont)
    } else if (subPass2.value !== subPass.value) {
        errCont.style.display = "block"
        let err = "veuillez confirmer le password"
        errCreate(err, errCont)
    }

    // si tout est bon, on peut post
    if (
        !names.includes(subName.value) &&
        subName.value !== '' &&
        !/\s/.test(subName.value) &&
        subPass.value !== '' &&
        subPass2.value === subPass.value
    ) {
        this.submit()
    }
})

// ici je garde mon fetch par ce que ça pourrait me resservir plus tard
        // let data = {name: subName.value, pass: subPass.value}
        // let headers = new Headers({'Content-Type': 'application/json'})
        // fetch('/subscribe', {
        //     method: "POST",
        //     headers: headers,
        //     body: JSON.stringify(data)
        // })

// subBtn.addEventListener('click', (e) => {
//     subForm.style.display= "flex"
// })