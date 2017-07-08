let extraire = function(selecteur) {
    let data = []
    let elts = document.querySelectorAll(selecteur)
    for (let i=0; i<elts.length; i++) {
        let t = elts[i].textContent
        data[i] = t.replace(/\s/g,'')
    }
    return data
}

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
    // creation du fond terminée

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