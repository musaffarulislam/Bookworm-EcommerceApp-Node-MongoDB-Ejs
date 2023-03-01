const form3 = document.querySelector("#addPermanantAddress");
const addPermanantHouseName = form3.querySelector("#addPermanantHouseName");
const addPermanantStreetName = form3.querySelector("#addPermanantStreetName");
const addPermanantTown = form3.querySelector("#addPermanantTown");
const addPermanantState = form3.querySelector("#addPermanantState");
const addPermanantZipCode = form3.querySelector("#addPermanantZipCode");
const addPermanantCountry = form3.querySelector("#addPermanantCountry");
const addPermanantErrorElement = form3.querySelector('#addPermanantAddressError');


function hideErrorMessageAddPermanantAddress(){
    addPermanantErrorElement.innerHTML="";
}
function showErrorMessageAddPermanantAddress(message){
    addPermanantErrorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        addPermanantErrorElement.innerHTML =`<div></div>`
    },5000);
}
function submitformaddPermanentAddress(){
    // e.preventDefault()

    if(addPermanantHouseName.value === ""){
        showErrorMessageAddPermanantAddress("House Name field is empty");
        return false;
    }

    if(addPermanantHouseName.value.trim() ===""){
        showErrorMessageAddPermanantAddress("House Name field is empty");
        return false;
    }

    if(addPermanantHouseName.value.length >40){
        showErrorMessageAddPermanantAddress("Name must be less than 40");
        return false;
    }

    if(addPermanantStreetName.value === ""){
        showErrorMessageAddPermanantAddress("Street Name field is empty");
        return false;
    }

    
    if(addPermanantStreetName.value.trim()==""){
        showErrorMessageAddPermanantAddress("StreetName field is empty");
        return false;
    }

    if(addPermanantStreetName.value.length >30){
        showErrorMessageAddPermanantAddress("Street Name must be less than 30");
        return false;
    }

    if(addPermanantTown.value === ""){
        showErrorMessageAddPermanantAddress("Town field is empty");
        return false;
    }

    if(addPermanantTown.value.trim()==""){
        showErrorMessageAddPermanantAddress("Town field is empty");
        return false;
    }

    if(addPermanantTown.value.length >30){
        showErrorMessageAddPermanantAddress("Town must be less than 30");
        return false;
    }

    if(addPermanantState.value === ""){
        showErrorMessageAddPermanantAddress("State field is empty");
        return false;
    }

    if(addPermanantState.value.trim()==""){
        showErrorMessageAddPermanantAddress("State field is empty");
        return false;
    }

    if(addPermanantState.value.length >30){
        showErrorMessageAddPermanantAddress("State must be less than 30");
        return false;
    }

    if(addPermanantCountry.value === ""){
        showErrorMessageAddPermanantAddress("Country field is empty");
        return false;
    }

    if(addPermanantCountry.value.trim()==""){
        showErrorMessageAddPermanantAddress("Country field is empty");
        return false;
    }

    if(addPermanantCountry.value.length >30){
        showErrorMessageAddPermanantAddress("Country must be less than 30");
        return false;
    }

    
    if(addPermanantZipCode.value === ""){
        showErrorMessageAddPermanantAddress("Phonenumber field is empty");
        return false;
    }

    if(addPermanantZipCode.value.trim()==""){
        showErrorMessageAddPermanantAddress("Pin code field is empty");
        return false;
    }

    if(addPermanantZipCode.value.length <6){
        showErrorMessageAddPermanantAddress("Pin Code must be 6 numbers");
        return false;
    }

    if(addPermanantZipCode.value.length >6){
        showErrorMessageAddPermanantAddress("Incorrect Pin Code");
        return false;
    }

    if(addPermanantZipCode.value <= 099999){
        showErrorMessageAddPermanantAddress("Incorrect Pin Code");
        return false;
    }



    hideErrorMessageAddPermanantAddress()
    return true;
}
    
