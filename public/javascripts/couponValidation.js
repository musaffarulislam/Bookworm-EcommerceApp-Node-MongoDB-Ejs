const form = document.querySelector("#addCoupon");
const couponName = form.querySelector("#couponName");
const discountPercentage = form.querySelector("#discountPercentage");
const maxDiscountPrice = form.querySelector("#maxDiscountPrice");
const minTotalAmount = form.querySelector("#minTotalAmount");
const inputDate = new Date(form.querySelector('#expDate').value);
const errorElement = form.querySelector('#couponErrorMessage');



function hideErrorMessage(){
    errorElement.innerHTML="";
}
function showErrorMessage(message){
    errorElement.innerHTML =`<div class="alert alert-warning border border-warning w-80 d-flex justify-content-center fw-bold py-2" role="alert" >${message}</div>`;
    setTimeout(()=>{
        errorElement.innerHTML =`<div></div>`
    },3000);
}
function couponValidation(e){
    // e.preventDefault()
    if(couponName.value === "" || couponName.value.trim()==""){
        showErrorMessage("Coupon Name is required");
        return false;
    }

    if(couponName.value.length >30){
        showErrorMessage("Coupon name must be less than 15");
        return false;
    }



    if(discountPercentage.value === "" || discountPercentage.value.trim()==""){
        showErrorMessage("Discount Percentage is required");
        return false;
    }


    if(discountPercentage.value > 100 || discountPercentage.value <= 0){
        showErrorMessage("Incorrect Discount Percentage");
        return false;
    }


    if(maxDiscountPrice.value === "" || maxDiscountPrice.value.trim()==""){
        showErrorMessage("Discount Percentage is required");
        return false;
    }


    if(maxDiscountPrice.value >= 1000 || maxDiscountPrice.value <= 0){
        showErrorMessage("Incorrect max DiscountPrice");
        return false;
    }


    if(minTotalAmount.value === "" || minTotalAmount.value.trim()==""){
        showErrorMessage("Discount Percentage is required");
        return false;
    }


    if(minTotalAmount.value >= 100000 || minTotalAmount.value <= 0){
        showErrorMessage("Incorrect Minimum Total Amount");
        return false;
    }


    const today = new Date();

    if (inputDate < today) {
        showErrorMessage("Please Enter Valid Date");
        return false;
    }

    hideErrorMessage()
    return true;
}