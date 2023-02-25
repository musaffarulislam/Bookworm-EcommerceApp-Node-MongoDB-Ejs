function addAuthorValidation(){
    const addAuthorName = document.getElementById(`addAuthorName`);
    const addAuthorDetails = document.getElementById(`addAuthorDetails`);
    const errorAddElement = document.getElementById(`addAlert`);
    if(addAuthorName.value === "" || addAuthorName.value.trim()==""){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author name field is empty</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorDetails.value.length >30){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author Name must Less than 30 Characters</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }

    if(addAuthorDetails.value === "" || addAuthorDetails.value.trim()==""){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details field is empty</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorDetails.value.length >500){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must Less than 500 Characters</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorDetails.value.length <30){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must greater than 30 Characters</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }

    errorAddElement.innerHTML = "";
    return true;
}