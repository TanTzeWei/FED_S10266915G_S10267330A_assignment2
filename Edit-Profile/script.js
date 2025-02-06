document.addEventListener("DOMContentLoaded",async function(){
  if(localStorage.getItem("id") === null){
    console.log("user not logged in")
  }else{
    document.querySelector(".user-icon").style.display = "block";
    document.querySelector(".auth-buttons").style.display = "none";
  }
    const applyButton = document.querySelector(".apply-btn")
    let newPfp = document.querySelector("#profilePic");
    let newUser = document.querySelector("#username");
    let newBio = document.querySelector("#bio");
    let data = (await fetchAccount())[0];

    newUser.value = data.username;
    newBio.value = data.bio;

    localStorage.setItem("pass",data.password);
    localStorage.setItem("obj",data._id)
    applyButton.addEventListener("click",async function(event){
        event.preventDefault();
        document.querySelector(".container").style.display = "block";
    })

})
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

async function fetchAccount() {
    let apiKey = "6784db79cea8d35416e3d912"
    console.log(localStorage.getItem("id"))
    const query = { id:Number(localStorage.getItem("id"))
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
        return data;
      }
    } catch (error) {
      console.error("Error validating login:", error);
      return false; 
    }
  }

  function checkPassword() {
    const correctPassword = localStorage.getItem("pass"); 
    const enteredPassword = document.getElementById("password-input").value;
    if (cyrb53(enteredPassword) == correctPassword) {
        const itemId = localStorage.getItem("obj");
        localStorage.removeItem("obj");  // The document ID to update
        console.log("Updating Item ID:", itemId);

    const apiKey = "6784db79cea8d35416e3d912";  // Replace with your API key
    const databaseUrl = `https://assg2fed-fbbe.restdb.io/rest/account/${itemId}`; 
    console.log(document.querySelector("#username").value);
    console.log(document.querySelector("#bio").value);
    fetch(databaseUrl, {
        method: "PATCH",  // Use PATCH to update specific fields
        headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey
        },
        body: JSON.stringify({
          "username":document.querySelector("#username").value,
          "bio":document.querySelector("#bio").value    
       }
       )
    })
    .then(async (response) => {
        const text = await response.text();  // Read raw response
        console.log("Full Response:", text);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${text}`);
        }

        return JSON.parse(text);  // Parse manually
    })
    .then(data => console.log("Updated item:", data))
    .catch(error => console.error("Error updating item:", error));

        alert("Changes applied successfully!");
        localStorage.removeItem("pass");
        document.querySelector(".container").style.display = "none";
    } else {
        console.log(cyrb53(enteredPassword))
        document.getElementById("message-text").textContent = "Incorrect password. Please try again.";
    }
    
}

function cancelChanges() {
    document.querySelector(".container").style.display = "none";
}
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