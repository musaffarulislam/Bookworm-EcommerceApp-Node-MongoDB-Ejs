function addAuthorValidation(){
    const addAuthorName = document.getElementById(`addAuthorName`);
    const addAuthorDetails = document.getElementById(`addAuthorDetails`);
    const errorAddAuthorElement = document.getElementById(`addAuthorAlert`);
    console.log(addAuthorName)
    console.log(addAuthorDetails)
    if(addAuthorName.value === "" || addAuthorName.value.trim()==""){
        console.log("1111111111111111111");
        errorAddAuthorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author name field is empty</div>`;
        setTimeout(()=>{
            errorAddAuthorElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorName.value.length >30){
        console.log("2222222222222222222");
        errorAddAuthorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author Name must Less than 30 Characters</div>`;
        setTimeout(()=>{
            errorAddAuthorElement.innerHTML = ""
        },3000)
        return false;
    }

    if(addAuthorDetails.value === "" || addAuthorDetails.value.trim()==""){
        errorAddAuthorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details field is empty</div>`;
        setTimeout(()=>{
            errorAddAuthorElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorDetails.value.length >1000){
        errorAddAuthorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must Less than 500 Characters</div>`;
        setTimeout(()=>{
            errorAddAuthorElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addAuthorDetails.value.length <30){
        errorAddAuthorElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must greater than 30 Characters</div>`;
        setTimeout(()=>{
            errorAddAuthorElement.innerHTML = ""
        },3000)
        return false;
    }

    errorAddAuthorElement.innerHTML = "";
    return true;
}