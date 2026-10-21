document.getElementById("cashout-btn").addEventListener("click",function(){
    // get the agent number & validate
    const cashoutNumber=getValueFromInput("cashout-number");
    if(cashoutNumber.length !=11){
        alert("Invalid number");
        return;
    }
    // get the amount
    const cashoutAmount=getValueFromInput("cashout-amount");
    //get the current balance
    const currentBalance=getBalance();
    //calculate the balance
    const newBalance=currentBalance-Number(cashoutAmount);
    console.log(newBalance);
    if(newBalance<0){
        alert("Invalid Amount");
        return;
    }
    const pin=getValueFromInput("cashout-pin");
    if(pin==="1234"){
        alert("Cashout Successful");
        setBalance(newBalance);
        // history-container call
        const history=document.getElementById("history-container");
        // new div create
        const newHistory=document.createElement("div");
        // new div inner html
        newHistory.innerHTML=`
        <div class="transaction-card p-5 bg-base-100">
        Cashout ${cashoutAmount} Taka Success to
             ${cashoutNumber}, at ${new Date()}
        </div>`;
        // history container new div append
        history.append(newHistory);

    } else {
        alert("Invalid Pin");
        return;
    }
});


// document.getElementById("cashout-btn").addEventListener("click",function(){
//     //1.get the agent number & validate
//     const cashoutNumberInput=document.getElementById("cashout-number");
//     const cashoutNumber=cashoutNumberInput.value;
//     console.log(cashoutNumber);
//     if(cashoutNumber.length !=11){
//         alert("Invalid Agent Number");
//         return;
//     }
//     //2.get the amount,validate & convert to number
//     const cashoutAmountInput=document.getElementById("cashout-amount");
//     const cashoutAmount=cashoutAmountInput.value;
//     console.log(cashoutAmount);
//     // 3.get the current balance,validate,convert to number
//     const balanceElement= document.getElementById("balance");
//     const balance=balanceElement.innerText;
//     console.log(balance);
//     // 4.calculate the new balance
//     const newBalance=Number(balance)-Number(cashoutAmount);
    
//     if(newBalance < 0){
//         alert("Invalid Amount");
//         return;
//     }
   
//     // 5.get the pin & verify
//     const cashoutPinInput = document.getElementById("cashout-pin");
//     const pin=cashoutAmountInput.value;
//     if(pin==='1234'){
//         alert("cashout successful");
//         console.log("new Balance",newBalance);
//         balanceElement.u=innerText=newBalance;
//     } else {
//         alert("Invalid Pin");
//     }
//     // 6.if true-show an alert if false show error & return
// })