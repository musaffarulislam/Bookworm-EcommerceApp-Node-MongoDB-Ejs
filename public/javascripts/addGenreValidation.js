function addGenreValidation(){
    const addGenreName = document.getElementById(`addGenreName`);
    const errorAddElement = document.getElementById(`addAlert`);
    if(addGenreName.value === "" || addGenreName.value.trim()==""){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre name field is empty</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }
    if(addGenreName.value.length >30){
        errorAddElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre Name must Less than 30 Characters</div>`;
        setTimeout(()=>{
            errorAddElement.innerHTML = ""
        },3000)
        return false;
    }

    errorAddElement.innerHTML = "";
    return true;
}