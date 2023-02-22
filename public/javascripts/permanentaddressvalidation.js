const form = document.querySelector("#permanentAddress");
const houseName = form.querySelector("#houseName");
const streetName = form.querySelector("#streetName");
const town = form.querySelector("#town");
const state = form.querySelector("#state");
const zipCode = form.querySelector("#zipCode");
const country = form.querySelector("#country");
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
function submitformpermanentAddress(e){
    // e.preventDefault()
    if(houseName.value === ""){
        showErrorMessage("Name is required");
        return false;
    }

    if(houseName.value.length >40){
        showErrorMessage("Name must be less than 40");
        return false;
    }

    if(streetName.value === ""){
        showErrorMessage("Street Name is required");
        return false;
    }

    if(streetName.value.length >30){
        showErrorMessage("Street Name must be less than 30");
        return false;
    }

    if(town.value === ""){
        showErrorMessage("Town is required");
        return false;
    }

    if(town.value.length >30){
        showErrorMessage("Town must be less than 30");
        return false;
    }

    if(state.value === ""){
        showErrorMessage("State is required");
        return false;
    }

    if(state.value.length >30){
        showErrorMessage("State must be less than 30");
        return false;
    }

    if(country.value === ""){
        showErrorMessage("country is required");
        return false;
    }

    if(country.value.length >30){
        showErrorMessage("country must be less than 30");
        return false;
    }

    
    if(zipCode.value === ""){
        showErrorMessage("Phonenumber is required");
        return false;
    }

    if(zipCode.value.length <6){
        showErrorMessage("Pin Code must be 6 numbers");
        return false;
    }

    if(zipCode.value.length >6){
        showErrorMessage("Incorrect Pin Code");
        return false;
    }

    if(zipCode.value <= 0){
        showErrorMessage("Incorrect Pin Code");
        return false;
    }



    hideErrorMessage()
    return true;
}
    
