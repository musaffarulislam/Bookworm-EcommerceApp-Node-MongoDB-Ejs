function addGenreValidation(){
    const editGenreName = document.getElementById(`addGenreName`);
    const errorEditElement = document.getElementById(`addAlert`);
    if(editGenreName.value === "" || editGenreName.value.trim()==""){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre name field is empty</div>`;
        return false;
    }
    if(editGenreName.value.length >30){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre Name must Less than 30 Characters</div>`;
        return false;
    }

    errorEditElement.innerHTML = "";
    return true;
}