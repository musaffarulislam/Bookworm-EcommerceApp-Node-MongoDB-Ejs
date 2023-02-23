const form = document.querySelector("#addBook");
const bookName = form.querySelector("#bookName");
const bookDetails = form.querySelector("#bookDetails");
const author = form.querySelector("#author");
const genre = form.querySelector("#genre");
const language = form.querySelector("#language");
const myFiles = form.querySelector("#myFiles");
const rating = form.querySelector("#Rating");
const pages = form.querySelector("#author");
const retailPrice = form.querySelector("#retailPrice");
const rentPrice = form.querySelector("#rentPrice");

const errorElement = form.querySelector('#error');



function hideErrorMessage(){
    errorElement.innerHTML="";
}
function showErrorMessage(message){
    errorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        errorElement.innerHTML =`<div></div>`
    },3000);
}
function addBookValidation(e){
    // e.preventDefault()
    if(bookName.value === "" || bookName.value.trim()==""){
        showErrorMessage("Book Name is required");
        return false;
    }

    if(bookName.value.length >50){
        showErrorMessage("Book name must be less than 50");
        return false;
    }


    if(bookDetails.value === "" || bookDetails.value.trim()==""){
        showErrorMessage("Book Name is required");
        return false;
    }

    if(bookDetails.value.length <30){
        showErrorMessage("Book name must be greter than 30");
        return false;
    }


    if(author.value === ""){
        showErrorMessage("Author is required");
        return false;
    }

    if(genre.value === ""){
        showErrorMessage("Genre is required");
        return false;
    }

    if(language.value === ""){
        showErrorMessage("Language is required");
        return false;
    }


    if(rating.value === "" || rating.value.trim()==""){
        showErrorMessage("Rating is required");
        return false;
    }


    if(rating.value > 5 || rating.value <= 0){
        showErrorMessage("Incorrect Rating");
        return false;
    }


    if(pages.value === "" || pages.value.trim()==""){
        showErrorMessage("Pages is required");
        return false;
    }


    if(pages.value >= 100000 || pages.value <= 0){
        showErrorMessage("Incorrect Page Number");
        return false;
    }


    if(retailPrice.value === "" || retailPrice.value.trim()==""){
        showErrorMessage("Retail Price is required");
        return false;
    }


    if(retailPrice.value >= 1000000 || retailPrice.value <= 0){
        showErrorMessage("Incorrect Retail Price");
        return false;
    }

    if(rentPrice.value === "" || rentPrice.value.trim()==""){
        showErrorMessage("Rent Price is required");
        return false;
    }


    if(rentPrice.value >= 1000000 || rentPrice.value <= 0){
        showErrorMessage("Incorrect Rent Price");
        return false;
    }



    hideErrorMessage()
    return true;
}