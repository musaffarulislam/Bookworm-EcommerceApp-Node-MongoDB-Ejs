const form1 = document.querySelector("#editCoupon");
const editcouponName = form1.querySelector("#editcouponName");
const editdiscountPercentage = form1.querySelector("#editdiscountPercentage");
const editmaxDiscountPrice = form1.querySelector("#editmaxDiscountPrice");
const editminTotalAmount = form1.querySelector("#editminTotalAmount");
const editinputDate = new Date(form1.querySelector('#editexpDate').value);
const editerrorElement = form1.querySelector('#editcouponErrorMessage');


function hideEditErrorMessage(){
    editerrorElement.innerHTML="";
}
function showEditErrorMessage(message){
    editerrorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        editerrorElement.innerHTML =`<div></div>`
    },3000);
}

function couponEditValidation(e){
    // e.preventDefault()
    
    if(editcouponName.value === "" || editcouponName.value.trim()==""){
        showEditErrorMessage("Coupon Name is required");
        return false;
    }

    if(editcouponName.value.length >30){
        showEditErrorMessage("Coupon name must be less than 15");
        return false;
    }



    if(editdiscountPercentage.value === "" || editdiscountPercentage.value.trim()==""){
        showEditErrorMessage("Discount Percentage is required");
        return false;
    }


    if(editdiscountPercentage.value > 100 || editdiscountPercentage.value <= 0){
        showEditErrorMessage("Incorrect Discount Percentage");
        return false;
    }


    if(editmaxDiscountPrice.value === "" || editmaxDiscountPrice.value.trim()==""){
        showEditErrorMessage("Discount Percentage is required");
        return false;
    }


    if(editmaxDiscountPrice.value >= 100000 || editmaxDiscountPrice.value <= 0){
        showEditErrorMessage("Incorrect max DiscountPrice");
        return false;
    }


    if(editminTotalAmount.value === "" || editminTotalAmount.value.trim()==""){
        showEditErrorMessage("Discount Percentage is required");
        return false;
    }


    if(editminTotalAmount.value <= 100000 || editminTotalAmount.value <= 0){
        showEditErrorMessage("Incorrect Minimum Total Amount");
        return false;
    }


    const edittoday = new Date();

    if (editinputDate < edittoday) {
        showEditErrorMessage("Please Enter Valid Date");
        return false;
    }

    hideEditErrorMessage()
    return true;
}
    
 
