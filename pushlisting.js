document.addEventListener("DOMContentLoaded",async function(){
    const authButtons = document.querySelector(".auth-buttons");
    if(localStorage.getItem("id") === null){
        console.log("user not logged in")
        authButtons.classList.remove('logged-in');
      }
      else{
        authButtons.classList.add('logged-in');
        document.querySelector(".user-container").style.display = "block";
        document.querySelector(".register-btn").style.display = "none";
        document.querySelector(".login-btn").style.display = "none";
      }
      const profileIcon = document.getElementById("user-container");
      const dropdownMenu = document.getElementById("dropdown-menu");
      const logoutButton = document.getElementById("logoutbutton");

    if (!profileIcon || !dropdownMenu) {
        console.error("❌ user-container OR dropdown-menu NOT found in the DOM!");
        return;
    }

    console.log("✅ user-container FOUND!");

    // Corrected click event listener
    profileIcon.addEventListener("click", function (event) {
        console.log("✅ Profile Icon Clicked!");
        event.stopPropagation(); // Prevents the click event from bubbling up
        dropdownMenu.classList.toggle("active"); // Toggle active class correctly
        setTimeout(() => {
            if (logoutButton) {
                console.log("✅ Logout button FOUND!");
                logoutButton.addEventListener("click", function (event) {
                    event.stopPropagation();
                    console.log("✅ Logout button clicked!");
                    localStorage.removeItem("id");
                    window.location.href = "login.html";
                });
            } else {
                console.error("❌ Logout button NOT found!");
            }
        }, 300); // Give the browser time to render the dropdown
    });


    // Close the dropdown if the user clicks outside of it
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
            console.log("✅ Dropdown closed!");
        }
    });
      let obj = await fetchListing(localStorage.getItem("productId"));
      console.log(obj[0]);
      const title = document.getElementById("title");
      const itemPrice = document.getElementById("itemPrice");
      const datePosted = document.getElementById("postTime");
      
      let dayPosted = new Date(obj[0].datecreated);
      let currentDate = new Date();
      let dateDiff = currentDate.getDate() - dayPosted.getDate();

      document.querySelector(".listing-image img").src = String(obj.photo);
      title.textContent = obj[0].listingname;
      itemPrice.textContent = "Price:$"+obj.price;
      datePosted.textContent = "Posted "+dateDiff+" days ago"; 


      document.querySelector(".pay-button").addEventListener(async function(){
        const itemId = obj._id;  // The document ID to update
        console.log("Updating Item ID:", itemId);

        const apiKey = "6784db79cea8d35416e3d912";  // Replace with your API key
        const databaseUrl = `https://assg2fed-fbbe.restdb.io/rest/listing/${itemId}`; 

        fetch(databaseUrl, {
            method: "PATCH",  // Use PATCH to update specific fields
            headers: {
            "Content-Type": "application/json",
            "x-apikey": apiKey
            },
            body: JSON.stringify({
            "status": "Sponsored",
            })
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
            })

        const url = `index.html`;
        window.location.href = url; 
        })

async function fetchListing(idNo) {
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { listingid: Number(idNo) };
    const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/listing?q=" + encodeURIComponent(JSON.stringify(query));

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

        // Check if data is an empty array
        if (Array.isArray(data) && data.length === 0) {
            console.log("no data found");
            return false;
        } else {
            return data;  // Return raw data (object or array)
        }
    } catch (error) {
        console.error("Error validating product:", error);
        return false;
    }
}
function subCatSearch(event){
    let button = event.target;
    localStorage.setItem("search",button.textContent);
    const url = `Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
    window.location.href = url; 
  
  }
