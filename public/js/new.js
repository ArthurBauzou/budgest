let select = document.querySelector("select")
let newInput = document.getElementById("newposto")

newInput.style.display = "none"

select.addEventListener('change', function() {
    console.log(select.value)
    if (select.value === "12384568") {
        newInput.style.display = "flex"
    } else {
        newInput.style.display = "none"        
    }
})