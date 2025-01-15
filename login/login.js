const apiKey = "6784db79cea8d35416e3d912";
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}; //Credits to Yves M. from stack overflow
async function validatelogin(target,target2) {
    const query = { username: target,
        password: cyrb53(target2)
    };
    const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/account?q=" + encodeURIComponent(JSON.stringify(query));
  
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
        "Cache-Control": "no-cache",
      },
    };
  
    try {
      const response = await fetch(apiUrl, settings);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      if (JSON.stringify(data) == "[]") {
        return false; 
      } else {
        console.log(data[0].username);
        addToLocalStore(data[0].id,data[0].premium,data[0].staff);
        return true;
      }
    } catch (error) {
      console.error("Error validating login:", error);
      return false; 
    }
  }
  function addToLocalStore(id,premium,staff){
    localStorage.setItem("id",id);
    localStorage.setItem("premium",premium);
    localStorage.setItem("staff",staff);
  }

document.addEventListener("DOMContentLoaded",function(){
    let username = document.querySelector("#username");
    let password = document.querySelector("#password"); 
    let loginForm = document.querySelector(".login-form");
    let loginButton = document.querySelector(".login-button")

    loginForm.addEventListener("submit",async function(event){
        event.preventDefault();
        loginButton.style.backgroundColor = "gray";
        loginButton.disabled = true;
        let isLogin = await validatelogin(username.value,password.value);
        if(isLogin){
            console.log("Can login");
            loginButton.style.backgroundColor = "#28a745";
            loginButton.disabled = false;
            window.location.href = "../index.html"
        }else{
            console.log("cannot login");
            loginButton.style.backgroundColor = "#28a745";
            loginButton.disabled = false;
        }

    })
})