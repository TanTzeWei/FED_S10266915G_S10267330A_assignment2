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
                  window.location.href = "../login/login.html";
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
    let data = JSON.parse(await fetchListingsData());
    const grid = document.querySelector(".listings-grid");
    const userId = localStorage.getItem("id");
    let filteredData = data.filter(item => {
        const likedby = item.likedby || []; 
        return likedby.includes(localStorage.getItem("id"));
      });

      filteredData.forEach(selected => {
        let productExample = document.querySelector("#example");
        let clone = productExample.cloneNode(true);
        let description = clone.querySelector(".description");
        let name = description.querySelector("h3");
        let price = description.querySelector("p");
        let condition = description.querySelector("span");
        let likeButton = clone.querySelector(".like-btn");
        let likeCount = likeButton.querySelector(".like-count");
        let userInfo = clone.querySelector(".user-info");
        let username = userInfo.querySelector(".username");
        let postTime = userInfo.querySelector(".post-time");
        let premium = clone.querySelector("#premium");
        let sponsoredVal = clone.querySelector("#sponsored");
        let dayPosted = new Date(selected.datecreated);
        let currentDate = new Date()
        let dateDiff = currentDate.getDate()-dayPosted.getDate();
  
        clone.removeAttribute("id");
        clone.querySelector("#productImg").src = String(selected.photo);
        price.textContent = "S$"+selected.price;
        name.textContent = selected.username;
        condition.textContent = selected.condition;
        likeCount.textContent = selected.likecount;
        username.textContent = selected.ownername;
        postTime.textContent = dateDiff+" days ago";
        name.textContent = selected.listingname;
        clone.style.display = "flex";
        if(selected.premiumlisting == true){
          premium.style.display = "block";
        }
        if(selected.status == "Sponsored"){
          sponsoredVal.style.display = "block";
        }
        clone.setAttribute("productId", selected.listingid);
        clone.setAttribute("ownerId", selected.ownerid);
        let likedby = Array.isArray(selected.likedby) ? [...selected.likedby] : [];
        const userId = localStorage.getItem("id");

        if (likedby.includes(userId)) { // Check if the user ID is in the array
          likeButton.querySelector("img").src = "../images/likedHeart.png";
          likeButton.setAttribute("liked", "true");
        } else {
          likeButton.querySelector("img").src = "../images/normalHeart.png"; // Or your default image
          likeButton.setAttribute("liked", "false");
        }

        

        createProductLink(clone);
        grid.appendChild(clone);
        pressLiked(likeButton,selected);
        clone.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
          sponsorListing(event)
        })
        clone.querySelector(".menu-options #delete").addEventListener("click",function(event){
          deleteListing(event.target,data);
        })
    })
      });
      function pressLiked(button,selected){
        button.addEventListener("click",async function(event){
          event.stopPropagation();
          console.log(selected);
          let productCard = button.parentElement
          let user = localStorage.getItem("id")
          let id = productCard.getAttribute("productid")
          console.log(button.getAttribute("liked"))
          if(button.getAttribute("liked") != "true"){//unlike
            const itemId = selected._id;  // The document ID to update
            let newLikedBy = Array.isArray(selected.likedby) ? [...selected.likedby] : [];
      
            newLikedBy.push(localStorage.getItem("id"));
            console.log(newLikedBy)
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
                "likecount": Number(selected.likecount)+1,
                "likedby": newLikedBy
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
      
          button.querySelector("img").src = "../images/likedHeart.png";
          button.querySelector("path span").textContent = Number(selected.likecount)+1
          }else{
            const itemId = selected._id;  // The document ID to update
            let newLikedBy = Array.isArray(selected.likedby) ? [...selected.likedby] : [];
            console.log(newLikedBy);
      
            // Remove the item with the matching `id`
            newLikedBy = newLikedBy.filter(item => item != localStorage.getItem("id"));
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
                "likecount": Number(selected.likecount)-1,
                "likedby": JSON.stringify(newLikedBy)
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
      
      
            
          }
        button.querySelector("img").src = "../images/normalHeart.png";
        button.querySelector("path span").textContent = Number(selected.likecount)-1;
        })
      }
      function sponsorListing(event){
        console.log("click")
        event.preventDefault();
        let productCard = event.target.parentElement.parentElement;
        let productId = productCard.getAttribute("productid")
        localStorage.setItem("productId",productId);
        const url = `/PushListing/pushlisting.html?id=${productId}`;
        window.location.href = url; 
      }
      function editListing(event){
        let productCard = event.target.parentElement.parentElement;
        let productId = productCard.getAttribute("productid")
        localStorage.setItem("productId",productId);
        const url = `../EditListing/EditListing.html?id=${productId}`;
        window.location.href = url; 
      }
      function reportListing(event){
        let productCard = event.target.parentElement
        localStorage.setItem("productId",productCard.getAttribute("productid"));
        const url = `../Report/Report.html`;
        window.location.href = url; 
      }
      function clickOption(e){
        let target = e.target;
        let productCard = target.parentElement.parentElement;
        if(window.getComputedStyle(productCard.querySelector("#menu-example")).display == "none"){
          if(productCard.getAttribute("ownerId") == localStorage.getItem("id")){
            productCard.querySelector("#menu-example").style.display = "block";
            productCard.querySelector("#menu-example #edit").style.display = "block";
            productCard.querySelector("#menu-example #sponsor").style.display = "block";
            productCard.querySelector("#menu-example #delete").style.display = "block";
          }else{
            productCard.querySelector("#menu-example").style.display = "block";
            productCard.querySelector("#menu-example #report").style.display = "block";
          }
        }else{
          productCard.querySelector("#menu-example").style.display = "none";
            productCard.querySelector("#menu-example #edit").style.display = "hidden";
            productCard.querySelector("#menu-example #sponsor").style.display = "hidden";
            productCard.querySelector("#menu-example #delete").style.display = "hidden";
        } 
    }      
      async function deleteListing(button,oldData){
      const data = JSON.parse(oldData);
      let productCard = button.parentElement.parentElement;
      let productId = productCard.getAttribute("productid");
      
        menudot.addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #report").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #edit").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #delete").addEventListener("click",function(event){
          event.stopPropagation()
        })
      }
      function createProductLink(productCard) {
        const menudot = productCard.querySelector(".menu-dots-product")
        productCard.addEventListener("click",function(){
          let productId = productCard.getAttribute("productid")
          localStorage.setItem("productId",productId)
          const url = `../product/product.html?id=${productId}`;
          window.location.href = url; 
          console.log("Done")
        })
        menudot.addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #report").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #edit").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
          event.stopPropagation()
        })
        productCard.querySelector(".menu-options #delete").addEventListener("click",function(event){
          event.stopPropagation()
        })
      }
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
  const url = `/SearchResult/Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
  window.location.href = url; 

}