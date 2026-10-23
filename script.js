// ============================================================
//  script.js  -  works on BOTH index.html (login) and home.html
//  Each section only runs if its elements exist on the page.
// ============================================================

// ---------- Settings (change these in one place) ----------
const CORRECT_NUMBER = "01234567890";
const CORRECT_PIN = "1234";
const HOME_PAGE = "home.html";   // no leading slash!
const LOGIN_PAGE = "index.html";

// ---------- Helper functions ----------

// id -> input value (trimmed). Returns "" if the element is missing.
function getValueFromInput(id) {
    const input = document.getElementById(id);
    if (!input) {
        console.warn(`Element with id "${id}" not found`);
        return "";
    }
    return input.value.trim();
}

// Clear an input (or reset a <select> to its first option)
function clearInput(id) {
    const input = document.getElementById(id);
    if (!input) return;
    if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
    } else {
        input.value = "";
    }
}

// Read the current balance as a number
function getBalance() {
    const balanceElement = document.getElementById("balance");
    if (!balanceElement) return 0;
    const balance = Number(balanceElement.innerText.replace(/,/g, ""));
    return Number.isNaN(balance) ? 0 : balance;
}

// Show a new balance
function setBalance(value) {
    const balanceElement = document.getElementById("balance");
    if (balanceElement) balanceElement.innerText = value;
}

// Hide all sections, then show only the one with this id.
// You can still call it from HTML: onclick="showOnly('cashout')"
function showOnly(id) {
    const sectionIds = ["add-money", "cashout", "history"];

    sectionIds.forEach(function (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) section.classList.add("hidden");
    });

    const selected = document.getElementById(id);
    if (selected) selected.classList.remove("hidden");
}

// A valid amount is a number greater than 0
function isValidAmount(value) {
    const num = Number(value);
    return value !== "" && Number.isFinite(num) && num > 0;
}

// Add one line to the history list (textContent = safe from HTML injection)
function addToHistory(message) {
    const history = document.getElementById("history-container");
    if (!history) return;

    const card = document.createElement("div");
    card.className = "transaction-card p-5 bg-base-100";
    card.textContent = message;
    history.append(card);
}

// ---------- Run after the page has loaded ----------
document.addEventListener("DOMContentLoaded", function () {

    // ========================================================
    //  LOGIN SECTION  (only runs on index.html)
    // ========================================================
    const loginBtn = document.getElementById("login-btn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            const contactNumber = getValueFromInput("input-number");
            const pin = getValueFromInput("input-pin");

            if (contactNumber === CORRECT_NUMBER && pin === CORRECT_PIN) {
                // remember that the user logged in (cleared when the tab closes)
                try {
                    sessionStorage.setItem("loggedIn", "true");
                } catch (e) {
                    console.warn("Could not save login state", e);
                }
                alert("Login Success");
                window.location.assign(HOME_PAGE);
            } else {
                alert("Login failed");
            }
        });
    }

    // ========================================================
    //  HOME PAGE PROTECTION  (only runs on home.html)
    //  If someone opens home.html without logging in, send them back.
    // ========================================================
    const isHomePage = document.getElementById("balance") !== null;

    if (isHomePage) {
        let loggedIn = null;
        try {
            loggedIn = sessionStorage.getItem("loggedIn");
        } catch (e) {
            loggedIn = "true"; // storage blocked -> don't lock the user out
        }
        if (loggedIn !== "true") {
            window.location.replace(LOGIN_PAGE);
            return;
        }
    }

    // ========================================================
    //  LOGOUT  (optional: give any button id="logout-btn")
    // ========================================================
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            try {
                sessionStorage.removeItem("loggedIn");
            } catch (e) { /* ignore */ }
            window.location.replace(LOGIN_PAGE);
        });
    }

    // ========================================================
    //  ADD MONEY SECTION  (only runs on home.html)
    // ========================================================
    const addMoneyBtn = document.getElementById("add-money-btn");

    if (addMoneyBtn) {
        addMoneyBtn.addEventListener("click", function () {
            // 1. bank
            const bankAccount = getValueFromInput("add-money-bank");
            if (bankAccount === "" || bankAccount === "Select a Bank") {
                alert("Please select a bank");
                return;
            }

            // 2. account number (exactly 11 digits)
            const accNo = getValueFromInput("add-money-number");
            if (!/^\d{11}$/.test(accNo)) {
                alert("Invalid account number (must be 11 digits)");
                return;
            }

            // 3. amount
            const amount = getValueFromInput("add-money-amount");
            if (!isValidAmount(amount)) {
                alert("Please enter a valid amount");
                return;
            }

            // 4. pin
            const pin = getValueFromInput("add-money-pin");
            if (pin !== CORRECT_PIN) {
                alert("Invalid Pin");
                return;
            }

            // 5. success
            const newBalance = getBalance() + Number(amount);
            setBalance(newBalance);

            const time = new Date().toLocaleString();
            alert(`Add Money Success from ${bankAccount} at ${time}`);
            addToHistory(
                `Add Money Success: ${amount} Taka from ${bankAccount}, acc-no ${accNo} at ${time}`
            );

            // clear the form
            ["add-money-bank", "add-money-number", "add-money-amount", "add-money-pin"]
                .forEach(clearInput);
        });
    }

    // ========================================================
    //  CASHOUT SECTION  (only runs on home.html)
    // ========================================================
    const cashoutBtn = document.getElementById("cashout-btn");

    if (cashoutBtn) {
        cashoutBtn.addEventListener("click", function () {
            // 1. agent number (exactly 11 digits)
            const cashoutNumber = getValueFromInput("cashout-number");
            if (!/^\d{11}$/.test(cashoutNumber)) {
                alert("Invalid number (must be 11 digits)");
                return;
            }

            // 2. amount
            const cashoutAmount = getValueFromInput("cashout-amount");
            if (!isValidAmount(cashoutAmount)) {
                alert("Please enter a valid amount");
                return;
            }

            // 3. enough balance?
            const newBalance = getBalance() - Number(cashoutAmount);
            if (newBalance < 0) {
                alert("Insufficient balance");
                return;
            }

            // 4. pin
            const pin = getValueFromInput("cashout-pin");
            if (pin !== CORRECT_PIN) {
                alert("Invalid Pin");
                return;
            }

            // 5. success
            setBalance(newBalance);

            const time = new Date().toLocaleString();
            alert("Cashout Successful");
            addToHistory(
                `Cashout ${cashoutAmount} Taka Success to ${cashoutNumber} at ${time}`
            );

            // clear the form
            ["cashout-number", "cashout-amount", "cashout-pin"].forEach(clearInput);
        });
    }
});




// console.log("Hello World");
// console.log("MAchine ADded");

// machine id -> input value
// function getValueFromInput(id){
//     const input=document.getElementById(id);
//     const value=input.value;
//     console.log(id,value);
//     return value;
// }

// function getBalance(){
//     const balanceElement=document.getElementById("balance");
//     const balance=balanceElement.innerText;
//     console.log("current balance",Number(balance));
//     return Number(balance);
// }

// // machine value -> set balance
// function setBalance(value){
//     const balanceElement=document.getElementById("balance");
//     balanceElement.innerText=value;
// }
// // machine id > hide all > show id
// function showOnly(id){
//     const addmoney=document.getElementById("add-money");
//     const cashout=document.getElementById("cashout");
//     const history=document.getElementById("history");
//     // console.log(`add Money-${addmoney},Cashout-${cashout}`);
//     // hide all portion
//     addmoney.classList.add("hidden");
//     cashout.classList.add("hidden");
//     history.classList.add("hidden");
//     // show id selected element
//     const selected=document.getElementById(id);
//     selected.classList.remove("hidden");

// }
// // login javascript section
// // console.log("login-functionality")
// document.getElementById("login-btn").addEventListener("click",function(){
//     // get the mobile number input
//     const numberInput=document.getElementById("input-number");
//     const contactNumber=numberInput.value;
//     console.log(contactNumber);

//     // get the pin
//     const inputPin=document.getElementById("input-pin");
//     const pin=inputPin.value;
//     console.log(pin);
//     // match the mobile number & pin
//     if(contactNumber=="01234567890" && pin=="1234"){
//         alert("login Success");

//         // window.location.replace("/home.html")
//         window.location.assign("home.html")
//         } else{
//             alert("login failed")
//         }
//         return;
//     // if true >> homepage if false >> return

// });
// // addMoney javascript section
// document.getElementById("add-money-btn").addEventListener("click",function(){
//     // bank account access
//     const bankAccount=getValueFromInput("add-money-bank");
//     if(bankAccount=="Select a Bank"){
//         alert("please select a bank");
//         return;
//     }
//     //2 get bank account number
//     const accno=getValueFromInput("add-money-number");
//     if(accno.length!=11){
//         alert("Invalid account number");
//         return;
//     }
//     // get amount
//     const amount=getValueFromInput("add-money-amount");
//     const currentBalance=getBalance();
//     const newBalance=currentBalance+Number(amount);
    
//     const pin=getValueFromInput("add-money-pin");
//     if(pin=="1234"){
//         alert(`Add Money Success from
//              ${bankAccount} at ${new Date()}`);
//         setBalance(newBalance);
//         // history-container call
//         const history=document.getElementById("history-container");
//         // new div create
//         const newHistory=document.createElement("div");
//         // new div inner html
//         newHistory.innerHTML=`
//         <div class="transaction-card p-5 bg-base-100">
//         Add Money Success from
//              ${bankAccount},acc-no ${accno} at ${new Date()}
//         </div>`;
//         // history container new div append
//         history.append(newHistory);
//     } else {
//         alert("Invalid Pin");
//     return;
//     }

// });
// // cashout javascript section
// document.getElementById("cashout-btn").addEventListener("click",function(){
//     // get the agent number & validate
//     const cashoutNumber=getValueFromInput("cashout-number");
//     if(cashoutNumber.length !=11){
//         alert("Invalid number");
//         return;
//     }
//     // get the amount
//     const cashoutAmount=getValueFromInput("cashout-amount");
//     //get the current balance
//     const currentBalance=getBalance();
//     //calculate the balance
//     const newBalance=currentBalance-Number(cashoutAmount);
//     console.log(newBalance);
//     if(newBalance<0){
//         alert("Invalid Amount");
//         return;
//     }
//     const pin=getValueFromInput("cashout-pin");
//     if(pin==="1234"){
//         alert("Cashout Successful");
//         setBalance(newBalance);
//         // history-container call
//         const history=document.getElementById("history-container");
//         // new div create
//         const newHistory=document.createElement("div");
//         // new div inner html
//         newHistory.innerHTML=`
//         <div class="transaction-card p-5 bg-base-100">
//         Cashout ${cashoutAmount} Taka Success to
//              ${cashoutNumber}, at ${new Date()}
//         </div>`;
//         // history container new div append
//         history.append(newHistory);

//     } else {
//         alert("Invalid Pin");
//         return;
//     }
// });



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