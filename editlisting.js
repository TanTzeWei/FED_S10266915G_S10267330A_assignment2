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
  let productData = await fetchListingsData();
  let obj = JSON.parse(productData).find(item=> item.listingid = localStorage.getItem("productId"));
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const image = document.querySelector("#photo");
  const os = document.querySelector("#os");
  const condition = document.querySelector("#condition");
  const meetup = document.querySelector("#meetup");
  const address = document.querySelector("#address");
  const delivery = document.querySelector("#delivery");
  const price = document.querySelector("#price");

  name.value = obj.listingname
  description.value = obj.description;
  os.value = obj.os;
  condition.value = obj.condition;
  meetup.value = obj.meetup;
  address.value = obj.address;
  delivery.value = obj.delivery;
  price.value = obj.price;

  document.querySelector(".listng-form").addEventListener("submit",async function(event){
    event.preventDefault();
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
              ownerid: localStorage.getItem("id"),
              premiumlisting: localStorage.getItem("premium"),
              listingname: name.value,
              description: description.value,
              os: os.value,
              condition: condition.value,
              meetup: Boolean(meetup.value),
              address: address.value,
              delivery: Boolean(delivery.value),
              price: price.value,
              ownername: localStorage.getItem("username")
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

            let productId = productCard.getAttribute("productid")
            localStorage.setItem("productId",productId)
            const url = `product.html?id=${productId}`;
            window.location.href = url; 
            console.log("Done")
            const subcategories = document.querySelectorAll(".subcategory");
            subcategories.forEach(subcategory => {
            subcategory.addEventListener("click", subCatSearch);
    });
});

async function fetchListingsData(){
  try {
 
      const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/listing";
      const apiKey = "6784db79cea8d35416e3d912";
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": apiKey
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      listings=data;
      return JSON.stringify(data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}
function subCatSearch(event){
  let button = event.target;
  localStorage.setItem("search",button.textContent);
  const url = `Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
  window.location.href = url; 
}
