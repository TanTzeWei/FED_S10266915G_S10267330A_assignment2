const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/account"; 
const apiKey = "677fd9b27b07b237dac82c50";
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
function validateUsername(target) {
    console.log("h");
   let settings = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "x-apikey": apiKey,
        "Cache-Control": "no-cache"
      },
   }
   fetch(apiUrl, settings)
      .then(response => response.json())
      .then(response => {
        let content = "";

        for (var i = 0; i < response.length && i < limit; i++) {
          console.log(response);
        }
  })
  validateUsername("username");
const signupForm = document.querySelector(".registration-form");
const username = document.querySelector("#registration-username");
const email = document.querySelector("#registration-email");
const password = document.querySelector("#registration-password");

signupForm.addEventListener("submit", function(event) {
    let bool = true;
    event.preventDefault();
})}

