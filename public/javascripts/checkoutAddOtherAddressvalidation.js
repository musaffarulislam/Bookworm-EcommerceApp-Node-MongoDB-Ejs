const form1 = document.querySelector("#addOtherAddress");
const addHouseName = form1.querySelector("#addHouseName");
const addStreetName = form1.querySelector("#addStreetName");
const addTown = form1.querySelector("#addTown");
const addState = form1.querySelector("#addState");
const addZipCode = form1.querySelector("#addZipCode");
const addCountry = form1.querySelector("#addCountry");
const addErrorElement = form1.querySelector('#addOtherAddressError');


function hideErrorMessageaddOtherAddress(){
    addErrorElement.innerHTML="";
}
function showErrorMessageaddOtherAddress(message){
    addErrorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        addErrorElement.innerHTML =`<div></div>`
    },5000);
}
function submitformaddOtherAddress(){
    // e.preventDefault()

    if(addHouseName.value === ""){
        showErrorMessageaddOtherAddress("House field is empty");
        return false;
    }

    if(addHouseName.value.trim() ===""){
        showErrorMessageaddOtherAddress("House Name field is empty");
        return false;
    }

    if(addHouseName.value.length >40){
        showErrorMessageaddOtherAddress("Name must be less than 40");
        return false;
    }

    if(addStreetName.value === ""){
        showErrorMessageaddOtherAddress("Street Name field is empty");
        return false;
    }

    if(addStreetName.value.trim()==""){
        showErrorMessageaddOtherAddress("StreetName field is empty");
        return false;
    }

    if(addStreetName.value.length >30){
        showErrorMessageaddOtherAddress("Street Name must be less than 30");
        return false;
    }

    if(addTown.value === ""){
        showErrorMessageaddOtherAddress("Town field is empty");
        return false;
    }

    if(addTown.value.trim()==""){
        showErrorMessageaddOtherAddress("Town field is empty");
        return false;
    }

    if(addTown.value.length >30){
        showErrorMessageaddOtherAddress("Town must be less than 30");
        return false;
    }

    if(addState.value === ""){
        showErrorMessageaddOtherAddress("State field is empty");
        return false;
    }

    if(addState.value.trim()==""){
        showErrorMessageaddOtherAddress("State field is empty");
        return false;
    }

    if(addState.value.length >30){
        showErrorMessageaddOtherAddress("State must be less than 30");
        return false;
    }

    if(addCountry.value === ""){
        showErrorMessageaddOtherAddress("Country field is empty");
        return false;
    }

    if(addCountry.value.trim()==""){
        showErrorMessageaddOtherAddress("Country field is empty");
        return false;
    }

    if(addCountry.value.length >30){
        showErrorMessageaddOtherAddress("Country must be less than 30");
        return false;
    }

    
    if(addZipCode.value === ""){
        showErrorMessageaddOtherAddress("Phonenumber field is empty");
        return false;
    }

    if(addZipCode.value.trim()==""){
        showErrorMessageaddOtherAddress("Pin code field is empty");
        return false;
    }

    if(addZipCode.value.length <6){
        showErrorMessageaddOtherAddress("Pin Code must be 6 numbers");
        return false;
    }

    if(addZipCode.value.length >6){
        showErrorMessageaddOtherAddress("Incorrect Pin Code");
        return false;
    }

    if(addZipCode.value <= 099999){
        showErrorMessageaddOtherAddress("Incorrect Pin Code");
        return false;
    }

    hideErrorMessageaddOtherAddress()
    return true;
}
    
