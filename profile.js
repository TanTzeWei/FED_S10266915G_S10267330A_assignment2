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
    let profileId = localStorage.getItem("ownerId");

    if(profileId != localStorage.getItem("id")){
      document.querySelector("#editProf").style.display = "none";
    }
    let profileData = JSON.parse(await findProfile(profileId))[0];
    console.log(profileData);
    const user = document.querySelector(".username h2");
    const desc = document.querySelector(".username p");
    const prem = document.querySelector(".username h2 span");
    const listingBy = document.querySelector(".listings h2");
    const productExample = document.querySelector("#example");
    user.textContent = "@"+ profileData.username;
    desc.textContent = profileData.bio;
    listingBy.textContent = "Listings by " + profileData.username;

    if(!profileData.premium){
        prem.style.display = "none";
    }

    let listingData = JSON.parse(await fetchListings(profileId));
    listingData.forEach(function(selected){
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
      let currentDate = new Date();
      let dateDiff = currentDate.getDate() - dayPosted.getDate();
      
      clone.querySelector("#productImg").src = String(selected.photo);
      clone.removeAttribute("id");
      price.textContent = "S$" + selected.price;
      name.textContent = selected.listingname;
      condition.textContent = selected.condition;
      likeCount.textContent = selected.likecount;
      username.textContent = selected.ownername;
      postTime.textContent = dateDiff + " days ago";
      clone.style.display = "flex";
      pressLiked(likeButton,selected);


      if (selected.premiumlisting === true) {
        premium.style.display = "block";
      }
      if (selected.status === "Sponsored") {
        sponsoredVal.style.display = "block";
      }
      if (likedby.includes(userId)) { // Check if the user ID is in the array
        likeButton.querySelector("img").src = "images/likedHeart.png";
        likeButton.setAttribute("liked", "true");
      } else {
        likeButton.querySelector("img").src = "images/normalHeart.png"; // Or your default image
        likeButton.setAttribute("liked", "false");
      }
      clone.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
        sponsorListing(event)
      })

      clone.setAttribute("productId", selected.listingid);
      clone.setAttribute("ownerId", selected.ownerid);
      createProductLink(clone);
      document.querySelector(".listings-grid").appendChild(clone);
      if(selected.status == "Inactive"){
        clone.querySelector("#inactive").style.display = "block";
        clone.removeEventListener("click")
      }
    })
    lottieGone();
})
function sponsorListing(event){
  console.log("click")
  event.preventDefault();
  let productCard = event.target.parentElement.parentElement;
  let productId = productCard.getAttribute("productid")
  localStorage.setItem("productId",productId);
  const url = `pushlisting.html?id=${productId}`;
  window.location.href = url; 
}
async function findProfile(idNo){
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { id:Number(idNo)
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
      if (JSON.stringify(data) == "[]") {
        console.log("no data found")
        return false; 
      } else {
        return JSON.stringify(data);
      }
    } catch (error) {
      console.error("Error validating product:", error);
      return false; 
    }
}

async function fetchListings(idNo){
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { ownerid:Number(idNo)
    };
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
      if (JSON.stringify(data) == "[]") {
        console.log("no data found")
        return false; 
      } else {
        return JSON.stringify(data);
      }
    } catch (error) {
      console.error("Error validating product:", error);
      return false; 
    }
}
function clickOption(e){
    let target = e.target;
    let productCard = target.parentElement.parentElement;
    if(window.getComputedStyle(productCard.querySelector("#menu-example")).display == "none"){
      if(productCard.getAttribute("ownerId") == localStorage.getItem("id")){
        productCard.querySelector("#menu-example").style.display = "block";
        productCard.querySelector("#menu-example #edit").style.display = "block";
        productCard.querySelector("#menu-example #delete").style.display = "block";
      }else{
        productCard.querySelector("#menu-example").style.display = "block";
        productCard.querySelector("#menu-example #report").style.display = "block";
      }
    }else{
      productCard.querySelector("#menu-example").style.display = "none";
        productCard.querySelector("#menu-example #edit").style.display = "hidden";
        productCard.querySelector("#menu-example #delete").style.display = "hidden";
    }
    
  }
  
  function createProductLink(productCard) {
    const menudot = productCard.querySelector(".menu-dots-product")
    productCard.addEventListener("click",function(){
      let productId = productCard.getAttribute("productid")
      localStorage.setItem("productId",productId)
      const url = `product.html?id=${productId}`;
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
  function lottieGone(){
    const lottie = document.querySelector("#lottiePlayer")
    lottie.style.display = "none";
  }
  function subCatSearch(event){
    let button = event.target;
    localStorage.setItem("search",button.textContent);
    const url = `Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
    window.location.href = url; 
  
  }