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
async function validateUsername(target) {
  const query = { username: target,
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
      return true;
    }
  } catch (error) {
    console.error("Error validating username:", error);
    return false; 
  }
}

async function validateEmail(target) {
  const query = { email: target,
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
      return true;
    }
  } catch (error) {
    console.error("Error validating email:", error);
    return false; 
  }
}


async function createAccount(u,p,e){
  let hashedPass = cyrb53(p);

  let add = {
    username: u,
    email: e,
    password: hashedPass,
    staff: false,
    premium: false
  }
  const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/account";

  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": apiKey,
      "Cache-Control": "no-cache",
    },
    body: JSON.stringify(add), 
  };

  try {
    const response = await fetch(apiUrl, settings);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data created successfully:", data);
    return data; // Return the created data
  } catch (error) {
    console.error("Error creating new data:", error);
  }
}
function showNotification(message) {
  const notificationMessage = document.getElementById("notification-message");
  notificationMessage.textContent = message; // Set the message
  notification.classList.remove("hidden");
  notification.classList.add("visible");

  // Automatically hide after 5 seconds
  setTimeout(hideNotification, 5000);
}

// Function to hide the notification
function hideNotification() {
  notification.classList.remove("visible");
  notification.classList.add("hidden");
}


document.addEventListener("DOMContentLoaded", function(e) {
  const signupForm = document.querySelector(".registration-form");
  const username = document.querySelector("#registration-username");
  const email = document.querySelector("#registration-email");
  const password = document.querySelector("#registration-password");
  const singupButton = document.querySelector(".registration-signup-btn")
  username.addEventListener("click",function(){
    username.style.borderColor = "#ccc";
  })
  email.addEventListener("click",function(){
    email.style.borderColor = "#ccc";
  })

signupForm.addEventListener("submit", async function(event) {
  
  event.preventDefault();
  singupButton.textContent = "Loading";
  singupButton.style.background = "#808080";
  singupButton.disabled = true;
  let isValidUser = await validateUsername(username.value);
  let isValidEmail = await validateEmail(email.value)
  
  if(isValidUser){
    showNotification("Username exists. Please use another username!");
    username.style.borderColor = "Red"; 
    singupButton.textContent = "Signup";
    singupButton.style.background = "#ff4d4d";
    singupButton.disabled = false;
  }else{
    if(isValidEmail){
      showNotification("An account was already signed up with this email. Please use another email or login");
      email.style.borderColor = "Red"; 
      singupButton.textContent = "Signup";  
      singupButton.style.background = "#ff4d4d";
      singupButton.disabled = false;
    }else{
      createAccount(username.value,password.value,email.value)
      singupButton.textContent = "Signup";
      singupButton.style.background = "#ff4d4d";
      singupButton.disabled = false;
      window.location.href = "login/login.html"
    }
    
  }   
})
});
