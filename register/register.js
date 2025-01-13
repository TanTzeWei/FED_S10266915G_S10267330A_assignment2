const apiKey = "6784db79cea8d35416e3d912"
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
async function validateUsername(target,target2) {
  const query = { username: target
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


async function createAccount(u,p,e){
  let hashedPass = cyrb53(p);

  let add = {
    username: u,
    email: e,
    password: hashedPass
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


document.addEventListener("DOMContentLoaded", function(e) {
  validateUsername("w");
  const signupForm = document.querySelector(".registration-form");
  const username = document.querySelector("#registration-username");
  const email = document.querySelector("#registration-email");
  const password = document.querySelector("#registration-password");
  const singupButton = document.querySelector(".registration-signup-btn")


signupForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  singupButton.textContent = "Loading";
  singupButton.style.background = "#808080";
  singupButton.disabled = "true";
  let isValid = await validateUsername(username.value,email.value);
  
  if(isValid){
    console.log("true") 
    singupButton.textContent = "Signup";
    singupButton.style.background = "#ff4d4d";
    singupButton.disabled = "true";
  }else{
    console.log("false");
    singupButton.textContent = "Signup";
    singupButton.style.background = "#ff4d4d";
    singupButton.disabled = "true";
  }   
})
});
