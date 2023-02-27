// const formEdit = document.querySelector("#editBook");
const editbookName = document.getElementById("bookName");
const editbookDetails = document.getElementById("bookDetails");
const editauthor = document.getElementById("author");
const editgenre = document.getElementById("genre");
const editlanguage = document.getElementById("language");
const editmyFiles = document.getElementById("myFiles");
const editrating = document.getElementById("Rating");
const editpages = document.getElementById("author");
const editretailPrice = document.getElementById("retailPrice");
const editrentPrice = document.getElementById("rentPrice");

const editerrorElement = document.getElementById("editError");

function hideErrorEditMessage() {
  editerrorElement.innerHTML = "";
}
function showErrorEditMessage(message) {
  console.log(message)
  editerrorElement.innerHTML = `<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
  setTimeout(() => {
    editerrorElement.innerHTML = `<div></div>`;
  }, 3000);
}
function editBookValidation(e) {
  if (editbookName.value === "" || editbookName.value.trim() == "") {
    showErrorEditMessage("Book Name field is empty");
    return false;
  }

  if (editbookName.value.length > 50) {
    showErrorEditMessage("Book name must be less than 50");
    return false;
  }

  if (editbookDetails.value === "" || editbookDetails.value.trim() == "") {
    showErrorEditMessage("Book Details field is empty");
    return false;
  }

  if (editbookDetails.value.length < 30) {
    showErrorEditMessage("Book Details must be greter than 30");
    return false;
  }

  if (editauthor.value === "") {
    showErrorEditMessage("Author field is empty");
    return false;
  }

  if (editgenre.value === "") {
    showErrorEditMessage("Genre field is empty");
    return false;
  }

  if (editlanguage.value === "") {
    showErrorEditMessage("Language field is empty");
    return false;
  }

  if (editrating.value === "" || editrating.value.trim() == "") {
    showErrorEditMessage("editRating field is empty");
    return false;
  }

  if (editrating.value > 5 || editrating.value <= 0) {
    showErrorEditMessage("Incorrect Rating");
    return false;
  }

  if (editpages.value === "" || editpages.value.trim() == "") {
    showErrorEditMessage("Pages field is empty");
    return false;
  }

  if (editpages.value >= 100000 || editpages.value <= 0) {
    showErrorEditMessage("Incorrect Page Number");
    return false;
  }

  if (editretailPrice.value === "" || editretailPrice.value.trim() == "") {
    showErrorEditMessage("Retail Price field is empty");
    return false;
  }

  if (editretailPrice.value >= 1000000 || editretailPrice.value <= 0) {
    showErrorEditMessage("Incorrect Retail Price");
    return false;
  }

  if (editrentPrice.value === "" || editrentPrice.value.trim() == "") {
    showErrorEditMessage("Rent Price field is empty");
    return false;
  }

  if (editrentPrice.value >= 1000000 || editrentPrice.value <= 0) {
    showErrorEditMessage("Incorrect Rent Price");
    return false;
  }

  hideErrorEditMessage();
  return true;
}
