const form = document.querySelector("#login");
const email = form.querySelector("#email");
const password = form.querySelector("#password");
const errorElement = form.querySelector('#alert');

function hideErrorMessage(){
    errorElement.innerHTML="";
}
function showErrorMessage(message){
    errorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
}
form.submitform = () =>{
    // e.preventDefault()
    // console.log(email.value)
    if(email.value === ""){
        showErrorMessage("Email field is empty");
        return false;
    }

    if(email.value.trim()==""){
        showErrorMessage("Email field is empty");
        return false;
    }

    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.value.match(validRegex)) {
      
      } else {
        showErrorMessage("Email is not correct");
        return false;
      }
    
    if(email.value.length >60){
        showErrorMessage("Email must be less than 60");
        return false;
    }

    if(password.value === ""){
        showErrorMessage("Password field is empty");
        return false;
    }

    if(password.value.trim()==""){
        showErrorMessage("Password field is empty");
        return false;
    }

    if(password.value.length <3){
        showErrorMessage("Password must be longer than 3 Characters");
        return false;
    }

    if(password.value.length >=15){
        showErrorMessage("Password must be less than 15 Characters");
        return false;
    }


    hideErrorMessage()
    return true;
}