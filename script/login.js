console.log("login-functionality")
document.getElementById("login-btn").addEventListener("click",function(){
    // get the mobile number input
    const numberInput=document.getElementById("input-number");
    const contactNumber=numberInput.value;
    console.log(contactNumber);

    // get the pin
    const inputPin=document.getElementById("input-pin");
    const pin=inputPin.value;
    console.log(pin);
    // match the mobile number & pin
    if(contactNumber=="01234567890" && pin=="1234"){
        alert("login Success");

        // window.location.replace("/home.html")
        window.location.assign("/home.html")
        } else{
            alert("login failed")
        }
        return;
    // if true >> homepage if false >> return

});