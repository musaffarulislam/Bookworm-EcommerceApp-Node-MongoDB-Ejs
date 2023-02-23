const form3 = document.querySelector("#addPermanantAddress");
const addPermanantHouseName = form3.querySelector("#addPermanantHouseName");
const addPermanantStreetName = form3.querySelector("#addPermanantStreetName");
const addPermanantTown = form3.querySelector("#addPermanantTown");
const addPermanantState = form3.querySelector("#addPermanantState");
const addPermanantZipCode = form3.querySelector("#addPermanantZipCode");
const addPermanantCountry = form3.querySelector("#addPermanantCountry");
const addPermanantErrorElement = form3.querySelector('#addPermanantAddressError');


function hideErrorMessageaddaddPermanantAddress(){
    addPermanantErrorElement.innerHTML="";
}
function showErrorMessageaddaddPermanantAddress(message){
    addPermanantErrorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2 mx-5" role="alert" >${message}</div>`;
    setTimeout(()=>{
        addPermanantErrorElement.innerHTML =`<div></div>`
    },3000);
}
function submitformaddaddPermanantAddress(){
    // e.preventDefault()

    if(addPermanantHouseName.value === ""){
        showErrorMessageaddaddPermanantAddress("Name is required");
        return false;
    }

    if(addPermanantHouseName.value.trim() ===""){
        showErrorMessageaddaddPermanantAddress("House Name is required");
        return false;
    }

    if(addPermanantHouseName.value.length >40){
        showErrorMessageaddaddPermanantAddress("Name must be less than 40");
        return false;
    }

    if(addPermanantStreetName.value === ""){
        showErrorMessageaddaddPermanantAddress("Street Name is required");
        return false;
    }

    
    if(addPermanantStreetName.value.trim()==""){
        showErrorMessage("StreetName is required");
        return false;
    }

    if(addPermanantStreetName.value.length >30){
        showErrorMessageaddaddPermanantAddress("Street Name must be less than 30");
        return false;
    }

    if(addPermanantTown.value === ""){
        showErrorMessageaddaddPermanantAddress("Town is required");
        return false;
    }

    if(addPermanantTown.value.trim()==""){
        showErrorMessageaddaddPermanantAddress("Town is required");
        return false;
    }

    if(addPermanantTown.value.length >30){
        showErrorMessageaddaddPermanantAddress("Town must be less than 30");
        return false;
    }

    if(addPermanantState.value === ""){
        showErrorMessageaddaddPermanantAddress("State is required");
        return false;
    }

    if(addPermanantState.value.trim()==""){
        showErrorMessageaddaddPermanantAddress("State is required");
        return false;
    }

    if(addPermanantState.value.length >30){
        showErrorMessageaddaddPermanantAddress("State must be less than 30");
        return false;
    }

    if(addPermanantCountry.value === ""){
        showErrorMessageaddaddPermanantAddress("Country is required");
        return false;
    }

    if(addPermanantCountry.value.trim()==""){
        showErrorMessageaddaddPermanantAddress("Country is required");
        return false;
    }

    if(addPermanantCountry.value.length >30){
        showErrorMessageaddaddPermanantAddress("Country must be less than 30");
        return false;
    }

    
    if(addPermanantZipCode.value === ""){
        showErrorMessageaddaddPermanantAddress("Phonenumber is required");
        return false;
    }

    if(addPermanantZipCode.value.trim()==""){
        showErrorMessageaddaddPermanantAddress("Pin code is required");
        return false;
    }

    if(addPermanantZipCode.value.length <6){
        showErrorMessageaddaddPermanantAddress("Pin Code must be 6 numbers");
        return false;
    }

    if(addPermanantZipCode.value.length >6){
        showErrorMessageaddaddPermanantAddress("Incorrect Pin Code");
        return false;
    }

    if(addPermanantZipCode.value <= 099999){
        showErrorMessageaddaddPermanantAddress("Incorrect Pin Code");
        return false;
    }



    hideErrorMessageaddaddPermanantAddress()
    return true;
}
    
