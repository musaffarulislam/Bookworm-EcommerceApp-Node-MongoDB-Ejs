const form = document.querySelector("#changeParmenantAddressForm");
const houseName = form.querySelector("#houseName");
const streetName = form.querySelector("#streetName");
const town = form.querySelector("#town");
const state = form.querySelector("#state");
const zipCode = form.querySelector("#zipCode");
const country = form.querySelector("#country");
const errorElement = form.querySelector('#permanentAddressError');


function hideErrorMessagepermanent(){
    errorElement.innerHTML="";
}
function showErrorMessagepermanent(message){
    errorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        errorElement.innerHTML =`<div></div>`
    },3000);
}
function submitformEditParmanent(e){
    // e.preventDefault()
    
    if(houseName.value === ""){
        showErrorMessagepermanent("Name field is empty");
        return false;
    }

    if(houseName.value.trim()==""){
        showErrorMessagepermanent("House Name field is empty");
        return false;
    }

    if(houseName.value.length >40){
        showErrorMessagepermanent("Name must be less than 40");
        return false;
    }

    if(streetName.value === ""){
        showErrorMessagepermanent("Street Name field is empty");
        return false;
    }

    if(streetName.value.trim()==""){
        showErrorMessagepermanent("streetName field is empty");
        return false;
    }

    if(streetName.value.length >30){
        showErrorMessagepermanent("Street Name must be less than 30");
        return false;
    }

    if(town.value === ""){
        showErrorMessagepermanent("Town field is empty");
        return false;
    }

    if(town.value.trim()==""){
        showErrorMessagepermanent("Town field is empty");
        return false;
    }

    if(town.value.length >30){
        showErrorMessagepermanent("Town must be less than 30");
        return false;
    }

    if(state.value === ""){
        showErrorMessagepermanent("State field is empty");
        return false;
    }

    if(state.value.trim()==""){
        showErrorMessagepermanent("State field is empty");
        return false;
    }

    if(state.value.length >30){
        showErrorMessagepermanent("State must be less than 30");
        return false;
    }

    if(country.value === ""){
        showErrorMessagepermanent("country field is empty");
        return false;
    }

    if(country.value.trim()==""){
        showErrorMessagepermanent("Country field is empty");
        return false;
    }

    if(country.value.length >30){
        showErrorMessagepermanent("country must be less than 30");
        return false;
    }

    
    if(zipCode.value === ""){
        showErrorMessagepermanent("Pincode field is empty");
        return false;
    }

    if(zipCode.value.trim()==""){
        showErrorMessagepermanent("Pin code field is empty");
        return false;
    }

    if(zipCode.value.length <6){
        showErrorMessagepermanent("Pin Code must be 6 numbers");
        return false;
    }

    if(zipCode.value.length >6){
        showErrorMessagepermanent("Incorrect Pin Code");
        return false;
    }

    if(zipCode.value <= 099999){
        showErrorMessagepermanent("Incorrect Pin Code");
        return false;
    }



    hideErrorMessagepermanent()
    return true;
}
    
