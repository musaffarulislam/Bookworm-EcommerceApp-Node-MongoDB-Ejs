
// product add to cart
function addCart(bookId, userId) {
  const url = window.location.origin;
  console.log(url);
  fetch(`${url}/addToCart?productId=${bookId}&userId=${userId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}




// model authomalically pop up
$(document).ready(function(){
  $('#myModal').modal('show');
  $('#closeBtn').click(function(){
    $('#myModal').modal('hide');
   });
});


// filtering product
const filterButtons = document.querySelectorAll(".filter-button");
filterButtons.forEach(button => {
  button.addEventListener("click", function() {
    const filter = this.getAttribute("data-filter");
    const items = document.querySelectorAll(".item");
    // Remove active class from all buttons
    filterButtons.forEach(button => button.classList.remove("active"));
    // Add active class to the clicked button
    this.classList.add("active");
    if (filter === "all") {
      items.forEach(item => (item.style.display = "block"));
    } else {
      items.forEach(item => {
        if (!item.classList.contains(filter)) {
          item.style.display = "none";
        } else {
          item.style.display = "block";
        }
      });
    }
  });
});



// Cart Icons Swall
document.getElementById("cartIdIcon").addEventListener("click", function() {
  Swal.fire({
    title: 'Not Login',
    text: "Please Login First",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Log In'
  }).then((result) => {
    if (result.value) {
      $('#exampleModalCenter').modal('show');
    }
  })
})
document.getElementById("close-modal").addEventListener("click", function() {
  $('#exampleModalCenter').modal('hide');
});



// Cart Text Swall
document.getElementById("cartIdText").addEventListener("click", function() {
  Swal.fire({
    title: 'Not Login',
    text: "Please Login First",
    icon: 'error',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Log In'
  }).then((result) => {
    if (result.value) {
      $('#exampleModalCenter').modal('show');
    }
  })
})
document.getElementById("close-modal").addEventListener("click", function() {
  $('#exampleModalCenter').modal('hide');
});



// const warning = <%= warning %>
// console.log(warning)
// if(warning){
//     window.addEventListener("load",()=>{
//         swal({
//             title: "Warning",
//             text: warning,
//             icon: "warning",
//             buttons: true,
//             dangerMode: true,
//             button: "cancel"
//         })
//     })
// }