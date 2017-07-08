let subForm = document.getElementById("subForm")
let loginBtn = document.querySelectorAll('.user')
let logForm = document.querySelector("#logForm form")

subForm.addEventListener('submit', function(e) {

    e.preventDefault();

    let names = extraire('.namelist')

    let subName = document.getElementById("name")
    let subPass = document.getElementById("pass")
    let subPass2 = document.getElementById("pass2")
    if (names.includes(subName.value)) {
        console.log("deja dans la base")
    }
    if (subName.value === '') {
        console.log ('veuillez entrer un nom')
    }
    if (subPass.value === '') {
        console.log ('veuillez entrer un password')
    }
    if (subPass2.value !== subPass.value) {
        console.log ('veuillez confirmer le password')
    }

    if (
        !names.includes(subName.value) &&
        subName.value !== '' &&
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

// ajout d'un bouton de connexion pour chaque utilisateur
for (let i=0; i<loginBtn.length; i++) {
    loginBtn[i].addEventListener('click', function(e) {
        let user = e.target.textContent.replace(/\s/g,'')
        let passForm = document.getElementById("logForm")
        q_modal("logForm")
        passForm.querySelector("h2").textContent = user
        passForm.querySelector("input").value = user
        passForm.querySelector("form").setAttribute("action", "/profil/"+user)
    })
}
