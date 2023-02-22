const form = document.querySelector("#userInfo");
const userName = form.querySelector("#userName");
const email = form.querySelector("#email");
const phone = form.querySelector("#phoneNumber");
const age = form.querySelector("#age");
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
function submitformUserInfo(e){
    // e.preventDefault()
    if(userName.value === ""){
        showErrorMessage("Name is required");
        return false;
    }

    if(userName.value.length >30){
        showErrorMessage("Name must be less than 30");
        return false;
    }


    if(email.value === ""){
        showErrorMessage("Email is required");
        return false;
    }


    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.value.match(validRegex)) {
      
      } else {
        showErrorMessage("Email is not correct");
        return false;
      }
    
    if(phoneNumber.value === ""){
        showErrorMessage("Phonenumber is required");
        return false;
    }

    if(phoneNumber.value.length <10){
        showErrorMessage("Phone Number must be 10 numbers");
        return false;
    }

    if(phoneNumber.value.length >13){
        showErrorMessage("Incorrect Phone Number");
        return false;
    }

    if(phoneNumber.value <= 5999999999){
        showErrorMessage("Incorrect Phone Number");
        return false;
    }

    if(age.value === ""){
        showErrorMessage("Age is required");
        return false;
    }

    if(age.value.length >3){
        showErrorMessage("Enter the correct Age");
        return false;
    }

    if(age.value<= 0){
        showErrorMessage("Enter the correct Age");
        return false;
    }

    if(age.value>= 200){
        showErrorMessage("Enter the correct Age");
        return false;
    }


    hideErrorMessage()
    return true;
}
    
