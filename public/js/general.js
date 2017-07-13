// cette fonction récupère une liste d'elements et fabrique un tableau avec leur valeur texte. Elle sert à retrouver la liste des utilisateurs depuis le html.
let extraire = function(selecteur) {
    let data = []
    let elts = document.querySelectorAll(selecteur)
    for (let i=0; i<elts.length; i++) {
        let t = elts[i].textContent
        data[i] = t.replace(/\s/g,'')
    }
    return data
}

// cette fonction servait à afficher un element en plein écran (en 'modal') tel un pop-up mais finalement je ne vais pas m'en servir.
let q_modal = function(ID) {
    let fondmodal = document.createElement('div')
    fondmodal.setAttribute("id", "fondmodal")
    fondmodal.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
    fondmodal.style.height = "100%"
    fondmodal.style.width = "100%"
    fondmodal.style.position = "fixed"
    fondmodal.style.top = "0"
    fondmodal.style.left = "0"
    let body = document.getElementsByTagName("Body")[0]
    body.appendChild(fondmodal)

    let elt = document.getElementById(ID)
    fondmodal.appendChild(elt)
    elt.style.display = "block"

    elt.addEventListener('click', function(e) {
        e.stopPropagation()
    })

    fondmodal.addEventListener('click', function(event) {
        fondmodal.style.display = "none"
    })
}

// cette fonction sert à faire la somme des chiffres affichés dans certaines cellules d'un tableau html.
let countSum = function(cell_list) {
    let a = 0
    for (let i=0; i<cell_list.length; i++) {
        let b = parseFloat(cell_list[i].textContent)
        a = a + b
    }
    return a
}

// ajouter une erreur
let errCreate = function(msg, container) {
    let err = document.createElement('p')
    err.appendChild(document.createTextNode(msg))
    container.appendChild(err)
}

// fonction piquée sur stackoverflow pour pouvoir faire un POST sans formulaire (en fait si, elle crée un formulaire invisible)
function post_x(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}