const pageLocation = location.pathname

const pageLinks = document.querySelectorAll("header .pages a")

for(link of pageLinks){
    if(pageLocation.includes(link.getAttribute("href"))){
        link.classList.add("open")
    }
}
