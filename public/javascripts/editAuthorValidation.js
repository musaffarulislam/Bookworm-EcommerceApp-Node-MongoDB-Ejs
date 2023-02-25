function editAuthorValidation(authorId){
    const editAuthorName = document.getElementById(`editAuthorName${authorId}`);
    const editAuthorDetails = document.getElementById(`editAuthorDetails${authorId}`);
    const errorEditElement = document.getElementById(`editAlert${authorId}`);
    if(editAuthorName.value === "" || editAuthorName.value.trim()==""){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author name field is empty</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }
    if(editAuthorDetails.value.length >30){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author Name must Less than 30 Characters</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }

    if(editAuthorDetails.value === "" || editAuthorDetails.value.trim()==""){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details field is empty</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }
    if(editAuthorDetails.value.length >500){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must Less than 500 Characters</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }
    if(editAuthorDetails.value.length <30){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Author details must greater than 30 Characters</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }

    errorEditElement.innerHTML = "";
    return true;
}