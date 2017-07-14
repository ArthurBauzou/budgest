let username = document.getElementsByTagName('h2')[0].firstChild.textContent.replace(/\s/g,'')
let role = document.getElementById('budgestRole').textContent

if (role === "enfant") {
    let spentCells = document.querySelectorAll("span.spent")
    let earnedCells = document.querySelectorAll("span.earned")
    let totContain = document.querySelector("h2 .totalChild p")

    let total = Math.round((countSum(earnedCells) + countSum(spentCells))*100)/100
    totContain.textContent = "total : " +total
}

// supression des lignes
let suprBtnList = document.querySelectorAll(".suprBtn")

for (let i=0; i<suprBtnList.length; i++) {
    suprBtnList[i].addEventListener('click', function(e) {
        if (confirm('Attention : En cliquant sur "OK", vous supprimerez définitivement cette transaction. Continuer ?')) {
            let ligne = e.target.parentNode.parentNode
            let msg = {}
            if (ligne.hasAttribute("dep_id")) {
                msg = {"table": "depenses", "type": "id_dep","id": ligne.getAttribute("dep_id")}
            }
            if (ligne.hasAttribute("rent_id")) {
                msg = {"table": "rentrees", "type": "id_rent","id": ligne.getAttribute("rent_id")}
            }
            if (ligne.hasAttribute("vir_id")) {
                msg = {"table": "virements", "type": "id_vir", "id": ligne.getAttribute("vir_id")}
            }
            post_x('/profil/'+username+'/del', msg)
        }
    })
}

