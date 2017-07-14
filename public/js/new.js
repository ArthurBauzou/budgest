let errCont = document.getElementById('errContainer')
let form = document.getElementById('newForm')
let newPosto = document.getElementById('newposto')

let descr = document.getElementById('descr')
let montant = document.getElementById('montant')
let dateIn = document.getElementById('datepicker')
let select = document.querySelector('select')
let n_posto = document.getElementById('n_posto')


newPosto.style.display = 'none'
errCont.style.display = 'none'

// apparition du champ de nouvelle origine / poste
select.addEventListener('change', function() {
    if (select.value === "n_posto") {
        newPosto.style.display = "flex"
        select.parentNode.className = ""
    } else {
        newPosto.style.display = "none"
        select.parentNode.className = "formFinal"
    }
})

// correction temps réel du format du montant
montant.addEventListener('input', function() {
    let a = montant.value
    let c = a.match(/\b\d{1,8}\.?\d{0,2}/)
    montant.value = c
})

// datepicker
$(()=>{
    $("#datepicker").datepicker()
    $("#datepicker").datepicker("option", "dateFormat", "yy-mm-dd")
})

// vérification avant le post :
form.addEventListener('submit', function(e) {

    e.preventDefault();

    // effacre toutes les erreurs
    $("#errContainer").empty()

    // ecrire les erreurs si nécessaire
    if (descr.value === '' || montant.value === '' || dateIn.value === '') {
        errCont.style.display = "block"
        let err = "veuillez remplir tous les champs"
        errCreate(err, errCont)
    }
    if (descr.value.length > 49) {
        errCont.style.display = "block"
        let err = "Le nom de la transaction est trop long (50 caractères maximum, actuellement "+descr.value.length+")"
        errCreate(err, errCont)
    }
    if (select.value === 'n_posto' && n_posto.value === '') {
        errCont.style.display = "block"
        let err = "veuillez nommer le nouveau poste / la nouvelle origine"
        errCreate(err, errCont)
    }

    // si tout va bien on peut poster
    if (
        descr.value !== '' &&
        montant.value !== '' &&
        dateIn.value !== '' &&
        descr.value.length <= 49
    ) {
        if (select.value !== 'n_posto') {
            this.submit()
        } else if (n_posto.value !== '') {
            this.submit()
        }
    }
})

// correction du format de la date, mais finalement un datepicker est plus efficace
    // let datemanuel =document.getElementById("datemanuel")
    // datemanuel.addEventListener('input', function() {
    //     let a = datemanuel.value
    //     let b = a.replace(/\D/g, "")
    //     let mask = {4:"-",6:"-"}
    //     let c = ""
    //     for (let i=0; i<b.length && i<8; i++) {
    //         if (mask[i]) { c = c + mask[i] }
    //         c = c+b[i]
    //     }
    //     datemanuel.value = c
    // })