const form = document.querySelector("#signup");
const username = form.querySelector("#username");
const email = form.querySelector("#email");
const phone = form.querySelector("#phonenumber");
const age = form.querySelector("#age");
const fpassword = form.querySelector("#fpassword");
const spassword = form.querySelector("#spassword");
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
function submitform(e){
    // e.preventDefault()
    if(username.value === ""){
        showErrorMessage("Name field is empty");
        return false;
    }

    if(username.value.trim()==""){
        showErrorMessage("Name field is empty");
        return false;
    }

    if(username.value.length >30){
        showErrorMessage("Name must be less than 30");
        return false;
    }


    if(email.value === ""){
        showErrorMessage("Email field is empty");
        return false;
    }

    if(email.value.trim()==""){
        showErrorMessage("Email field is empty");
        return false;
    }

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.value.match(validRegex)) {
      
      } else {
        showErrorMessage("Email is not correct");
        return false;
      }
    
    if(phonenumber.value === ""){
        showErrorMessage("Phonenumber field is empty");
        return false;
    }

    if(phonenumber.value.trim()==""){
        showErrorMessage("Phone number field is empty");
        return false;
    }

    if(phonenumber.value.length <10){
        showErrorMessage("Phone Number must be 10 numbers");
        return false;
    }

    if(phonenumber.value.length >12){
        showErrorMessage("Phone Number must be 10 numbers");
        return false;
    }

    if(phonenumber.value <= 5999999999){
        showErrorMessage("Incorrect Phone Number");
        return false;
    }

    if(age.value === ""){
        showErrorMessage("Age field is empty");
        return false;
    }

    if(age.value.trim()==""){
        showErrorMessage("Age field is empty");
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

    if(fpassword.value === ""){
        showErrorMessage("Password field is empty");
        return false;
    }

    if(fpassword.value.trim()==""){
        showErrorMessage("Password field is empty");
        return false;
    }

    if(fpassword.value.length >=15){
        showErrorMessage("Password must be less than 15 Characters");
        return false;
    }

    if(fpassword.value == "password"){
        showErrorMessage("Password can not be password");
        return false;
    }


    if(spassword.value === ""){
        showErrorMessage("Confirm Password field is empty");
        return false;
    }

    if(fpassword.value !== spassword.value){
        showErrorMessage("Passwords are not same");
        return false;
    }

    hideErrorMessage()
    return true;
}
    
