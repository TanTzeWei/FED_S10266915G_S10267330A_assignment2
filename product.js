document.addEventListener("DOMContentLoaded",async function(){
  search();
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
        }, 1000); // Give the browser time to render the dropdown
    });


    // Close the dropdown if the user clicks outside of it
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
            console.log("✅ Dropdown closed!");
        }
    });
    let productId = localStorage.getItem("productId");
    let data;
    data = await findProduct(productId);
    otherListingData = await otherListings();
    if(data != null){
        let productData = JSON.parse(data)[0];
        console.log(productId);
        const name = document.getElementById("productName");
        const price = document.getElementById("price");
        const delivery = document.getElementById("delivery");
        const meetup = document.getElementById("meetup");
        const address = document.getElementById("location");
        const os = document.getElementById("os");
        const condition = document.getElementById("condition");
        const description = document.getElementById("description");
        const rating = document.getElementById("rating");
        const pfp =  document.querySelector(".seller-info img");
        document.querySelector("#productImg").src = String(productData.photo);
        clickProfile(pfp);
        name.textContent = productData.listingname;
        price.textContent = "SGD "+productData.price;
        if(!productData.delivery){
            delivery.style.display = "none";
        }
        if(!productData.meetup){
            meetup.style.display = "none";
        }
        if(productData.address == ""){
            address.textContent = "";
            let boldText = document.createElement("strong");
            boldText.textContent = "Meetup Location: ";
            address.appendChild(boldText);
            address.appendChild(document.createTextNode("N/A"));
        }else{
            address.textContent = "";
            let boldText = document.createElement("strong");
            boldText.textContent = "Meetup Location: ";
            address.appendChild(boldText);
            address.appendChild(document.createTextNode(productData.address));
        }
        if(productData.os){
            os.textContent = "";
            let boldText = document.createElement("strong");
            boldText.textContent = "Software: ";
            os.appendChild(boldText);
            os.appendChild(document.createTextNode(productData.os));
        }
        if(productData.condition){
            condition.textContent = "";
            let boldText = document.createElement("strong");
            boldText.textContent = "Condition: ";
            condition.appendChild(boldText);
            condition.appendChild(document.createTextNode(productData.condition));
        }
        console.log(productData.description)
        description.textContent = productData.description;

        rating.textContent = productData.ownername +" 4.6/5★ (98 reviews)";
        rating.style.fontWeight = "bold";
        pfp.setAttribute("profileId",productData.ownerid)
        createChat(productData.listingname,productData.price,productData.ownername)
    }else{
        console.log("There is no such product");
    }
    let parsedData = JSON.parse(otherListingData)
    newListingData = parsedData.filter(p => p.status == "Active" || p.status == "Sponsored");
    let productExample = document.querySelector("#example");
    
    console.log(newListingData)
    for(let i = 0;i<3;i++){
      let ranInt = Math.floor(Math.random()*newListingData.length);
      selected = newListingData[ranInt];
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

      if (selected.premiumlisting === true) {
        premium.style.display = "block";
      }
      if (selected.status === "Sponsored") {
        sponsoredVal.style.display = "block";
      }
      let likedby = Array.isArray(selected.likedby) ? [...selected.likedby] : [];
        const userId = localStorage.getItem("id");

        if (likedby.includes(userId)) { // Check if the user ID is in the array
          likeButton.querySelector("img").src = "images/likedHeart.png";
          likeButton.setAttribute("liked", "true");
        } else {
          likeButton.querySelector("img").src = "images/unlikedHeart.png"; // Or your default image
          likeButton.setAttribute("liked", "false");
        }
      clone.setAttribute("productId", selected.listingid);
      clone.setAttribute("ownerId", selected.ownerid);
      pressLiked(likeButton,selected);
      createProductLink(clone);
      document.querySelector(".grid-container").appendChild(clone);
      lottieGone();
    }
    const searchButton = document.querySelector(".search-bar button");
    searchButton.addEventListener("click", function() {
    let search = document.querySelector(".search-bar input").value;
    localStorage.setItem("search", search);
    const url = `Search.html?item=${search}`;
    window.location.href = url;
    console.log("Search initiated");
  });
});
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


async function otherListings(){
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
    return JSON.stringify(data); 
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
async function fetchNewId() {
  try {
    const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/chatroom";
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

    // If the API returns an empty array, return 1 as the new ID
    if (data.length === 0) {
      return 1;
    }

    // Find the highest value from the response data
    const highestValue = Math.max(...data.map(item => item.value));

    // Return the next ID by adding 1 to the highest value
    return highestValue + 1;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null; // Return null if there's an error
  }
}

function createChat(listingn,price,sname){
  document.querySelector(".chat-button").addEventListener("click",async function(){
    let add = {
      id: await fetchNewId(),
      buyerid: localStorage.getItem("id"),
      sellerid: localStorage.getItem("ownerId"),
      listingid:localStorage.getItem("productId"),
      listingname:listingn,
      listingprice:price,
      buyername:localStorage.getItem("username"),
      sellername:sname
    }
    console.log(add);
    const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/chatroom";
    const apiKey = "6784db79cea8d35416e3d912"
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

    const url = `chat.html`;
    window.location.href = url; 
})
}

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

    button.querySelector("img").src = "images/likedHeart.png";
    button.querySelector("path span").textContent = Number(selected.likecount)-1
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
  button.querySelector("img").src = "images/normalHeart.png";
  button.querySelector("path span").textContent = Number(selected.likecount)-1;
  })
}

function clickProfile(sellerinfo){
  sellerinfo.addEventListener("click",function(){
    let id = sellerinfo.getAttribute("profileId");
    localStorage.setItem("ownerId",id);
    const url = `profile.html?id=${id}`;
    window.location.href = url; 
  })
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

async function findProduct(id) {
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { listingid:Number(id)
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
function search(){
  const searchButton = document.querySelector(".search-bar button");
  searchButton.addEventListener("click",function(){
    let search = document.querySelector(".search-bar input").value;
    localStorage.setItem("search",search);
    const url = `Search.html?item=${search}`;
    window.location.href = url; 
    console.log("Done")
  })
}
