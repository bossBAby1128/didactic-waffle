document.getElementById("add-money-btn").addEventListener("click",function(){
    // bank account access
    const bankAccount=getValueFromInput("add-money-bank");
    if(bankAccount=="Select a Bank"){
        alert("please select a bank");
        return;
    }
    //2 get bank account number
    const accno=getValueFromInput("add-money-number");
    if(accno.length!=11){
        alert("Invalid account number");
        return;
    }
    // get amount
    const amount=getValueFromInput("add-money-amount");
    const currentBalance=getBalance();
    const newBalance=currentBalance+Number(amount);
    
    const pin=getValueFromInput("add-money-pin");
    if(pin=="1234"){
        alert(`Add Money Success from
             ${bankAccount} at ${new Date()}`);
        setBalance(newBalance);
        // history-container call
        const history=document.getElementById("history-container");
        // new div create
        const newHistory=document.createElement("div");
        // new div inner html
        newHistory.innerHTML=`
        <div class="transaction-card p-5 bg-base-100">
        Add Money Success from
             ${bankAccount},acc-no ${accno} at ${new Date()}
        </div>`;
        // history container new div append
        history.append(newHistory);
    } else {
        alert("Invalid Pin");
    return;
    }

});