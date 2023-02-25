function editGenreValidation(genreId){
    const editGenreName = document.getElementById(`editGenreName${genreId}`);
    const errorEditElement = document.getElementById(`editAlert${genreId}`);
    if(editGenreName.value === "" || editGenreName.value.trim()==""){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre name field is empty</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }
    if(editGenreName.value.length >30){
        errorEditElement.innerHTML =`<div class="alert alert-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >Genre Name must Less than 30 Characters</div>`;
        setTimeout(()=>{
            errorEditElement.innerHTML = ""
        },3000)
        return false;
    }

    errorEditElement.innerHTML = "";
    return true;
}