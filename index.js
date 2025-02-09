let listings=[];
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
 function loadTrending(data,page){
    let oldData = JSON.parse(data);
    let secondData = oldData.sort((a, b) => b.likecount - a.likecount);
    let newData = secondData.filter(item => item.status == "Active");
    const trending = document.querySelector("#trendingList");
    while (trending.firstChild) {
      trending.removeChild(trending.firstChild);
    }

    let dataDict = {1:[newData[0],newData[1],newData[2],newData[3],newData[4]],
      2:[newData[5],newData[6],newData[7],newData[8],newData[9]],
      3:[newData[10],newData[11],newData[12],newData[13],newData[14]],
      4:[newData[15],newData[16],newData[17],newData[18],newData[19]],
      5:[newData[20],newData[21],newData[22],newData[23],newData[24]]
    }
    dataDict[page].forEach(function(selected){
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
        
        clone.querySelector("#productImg").src = String(selected.photo);
        clone.removeAttribute("id");
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
          likeButton.querySelector("img").src = "images/likedHeart.png";
          likeButton.setAttribute("liked", "true");
        } else {
          likeButton.querySelector("img").src = "images/normalHeart.png"; // Or your default image
          likeButton.setAttribute("liked", "false");
        }

        

        createProductLink(clone);
        trending.appendChild(clone);
        pressLiked(likeButton,selected);
        clone.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
          sponsorListing(event)
        })
        clone.querySelector(".menu-options #delete").addEventListener("click",function(event){
          deleteListing(event.target,data);
        })
    })
}

function loadSponsored(dict, page) {
  let currentDict = dict[page - 1];  

  if (!Array.isArray(currentDict)) {
    console.error("Error: currentDict is not an array");
    return;
  }

  const sponsored = document.querySelector("#sponsoredList");
  if (!sponsored) {
    console.error("Element with ID 'sponsoredList' not found.");
    return;
  }

  while (sponsored.firstChild) {
    sponsored.removeChild(sponsored.firstChild);
  }

  currentDict.forEach((selected) => {
    if (selected != null) {
      let productExample = document.querySelector("#example");
      if (!productExample) {
        console.error("Element with ID 'example' not found.");
        return;
      }

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
          likeButton.querySelector("img").src = "images/normalHeart.png"; // Or your default image
          likeButton.setAttribute("liked", "false");
        }
        createProductLink(clone);
      clone.setAttribute("productId", selected.listingid);
      clone.setAttribute("ownerId", selected.ownerid);
      pressLiked(likeButton,selected);
      sponsored.appendChild(clone);
      clone.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
        sponsorListing(event)
      })
      clone.querySelector(".menu-options #delete").addEventListener("click",function(event){
        deleteListing(event.target,selected);
      })
    }
  });
}

function loadSponsoredDict(data, Dict) {
  let oldData = JSON.parse(data);
  let newData = oldData.filter(item => item.status == "Sponsored");

  function selectRandomItems(arr, count, usedItems) {
    let selectedItems = [];
    let copyArr = [...arr];
    for (let i = 0; i < count; i++) {
      if (copyArr.length === 0) break;
      let ranInt = Math.floor(Math.random() * copyArr.length);
      let selected = copyArr[ranInt];

      if (!usedItems.has(selected.listingid)) {
        selectedItems.push(selected);
        usedItems.add(selected.listingid);
        copyArr.splice(ranInt, 1);
      }
    }
    return selectedItems;
  }

  Dict.length = 0;

  let usedItems = new Set();
  let remainingData = [...newData];  // Create a copy of the data array to work with

  while (remainingData.length > 0) {
    // Select the number of items to take (either 5 or fewer if there are not enough left)
    let groupSize = Math.min(5, remainingData.length); 
    let selectedItems = selectRandomItems(remainingData, groupSize, usedItems);
    Dict.push(selectedItems);

    // Remove the selected items from remainingData
    selectedItems.forEach(item => {
      let index = remainingData.indexOf(item);
      if (index > -1) remainingData.splice(index, 1);
    });
  }

  console.log("Dict after filling arrays:", Dict);
}





function loadForYou(dict,page){
  let currentDict = dict[page - 1];  

  if (!Array.isArray(currentDict)) {
    console.error("Error: currentDict is not an array");
    return;
  }

  const sponsored = document.querySelector("#forYouList");
  if (!sponsored) {
    console.error("Element with ID 'sponsoredList' not found.");
    return;
  }

  while (sponsored.firstChild) {
    sponsored.removeChild(sponsored.firstChild);
  }

  currentDict.forEach((selected) => {
    if (selected != null) {
      let productExample = document.querySelector("#example");
      if (!productExample) {
        console.error("Element with ID 'example' not found.");
        return;
      }

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
      let imgProduct = clone.querySelector("#productImg")

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
      console.log(selected.photo)

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
      createProductLink(clone);
      clone.setAttribute("productId", selected.listingid);
      clone.setAttribute("ownerId", selected.ownerid);
      pressLiked(likeButton,selected);
      sponsored.appendChild(clone);
      clone.querySelector(".menu-options #sponsor").addEventListener("click",function(event){
        sponsorListing(event)
      })
      clone.querySelector(".menu-options #delete").addEventListener("click",function(event){
        deleteListing(event.target,selected);
      })
    }
  });
}


function loadForYouDict(data, Dict) {
  let oldData = JSON.parse(data);
  let newData = oldData.filter(item => item.status == "Active");

  function selectRandomItems(arr, count, usedItems) {
    let selectedItems = [];
    let copyArr = [...arr];
    for (let i = 0; i < count; i++) {
      if (copyArr.length === 0) break;
      let ranInt = Math.floor(Math.random() * copyArr.length);
      let selected = copyArr[ranInt];

      if (!usedItems.has(selected.listingid)) {
        selectedItems.push(selected);
        usedItems.add(selected.listingid);
        copyArr.splice(ranInt, 1);
      }
    }
    return selectedItems;
  }

  Dict.length = 0;

  let usedItems = new Set();
  let remainingData = newData.slice(); 

  while (remainingData.length > 0) {
    let selectedItems = selectRandomItems(remainingData, Math.min(5, remainingData.length), usedItems);
    Dict.push(selectedItems);
    selectedItems.forEach(item => {
      let index = remainingData.indexOf(item);
      if (index > -1) remainingData.splice(index, 1);
    });
  }

  console.log("Dict after filling arrays:", Dict);
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
  button.querySelector("img").src = "images/normalHeart.png";
  button.querySelector("path span").textContent = Number(selected.likecount)-1;
  })
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

function sponsorListing(event){
  console.log("click")
  event.preventDefault();
  let productCard = event.target.parentElement.parentElement;
  let productId = productCard.getAttribute("productid")
  localStorage.setItem("productId",productId);
  const url = `pushlisting.html?id=${productId}`;
  window.location.href = url; 
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

function editListing(event){
  let productCard = event.target.parentElement.parentElement;
  let productId = productCard.getAttribute("productid")
  localStorage.setItem("productId",productId);
  const url = `EditListing.html?id=${productId}`;
  window.location.href = url; 
}
function reportListing(event){
  let productCard = event.target.parentElement
  localStorage.setItem("productId",productCard.getAttribute("productid"));
  const url = `report.html`;
  window.location.href = url; 
}
async function deleteListing(button,oldData){
const data = JSON.parse(oldData);
let productCard = button.parentElement.parentElement;
let productId = productCard.getAttribute("productid");

const getObj = (productId) => { 
  const item = data.find(obj => obj.listingid == productId); 
  return item ? item : "Item not found"; 
};

let obj = getObj(productId);
console.log(obj);
console.log(obj.listingid);

// Create container
const container = document.createElement("div");
container.style.textAlign = "center";
container.style.background = "white";
container.style.padding = "20px";
container.style.borderRadius = "10px";
container.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
container.style.position = "fixed"; // Use 'fixed' to keep it in place while scrolling
container.style.top = "50%"; // Position from the top of the screen
container.style.left = "50%"; // Position from the left of the screen
container.style.transform = "translate(-50%, -50%)"; // Adjust for exact center
container.style.zIndex = "1000"; // Ensure it's above other elements
container.style.maxWidth = "400px"; // Optional: Set a max width for better look

// Create heading
const heading = document.createElement("h2");
heading.innerText = "Are you sure you want to delete this item?";
container.appendChild(heading);

// Create button container
const buttonContainer = document.createElement("div");
buttonContainer.style.marginTop = "10px";

// Create Yes button
const yesButton = document.createElement("button");
yesButton.innerText = "Yes";
yesButton.style.backgroundColor = "red";
yesButton.style.color = "white";
yesButton.style.border = "none";
yesButton.style.padding = "10px 20px";
yesButton.style.borderRadius = "5px";
yesButton.style.cursor = "pointer";
yesButton.style.marginRight = "10px";

yesButton.addEventListener("mouseover", function () {
  yesButton.style.backgroundColor = "darkred";
});
yesButton.addEventListener("mouseout", function () {
  yesButton.style.backgroundColor = "red";
});

yesButton.addEventListener("click", async function () {
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
      "status": "Inactive",
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
  
  container.remove(); // Remove the container after action
});

// Create No button
const noButton = document.createElement("button");
noButton.innerText = "No";
noButton.style.backgroundColor = "gray";
noButton.style.color = "white";
noButton.style.border = "none";
noButton.style.padding = "10px 20px";
noButton.style.borderRadius = "5px";
noButton.style.cursor = "pointer";

noButton.addEventListener("mouseover", function () {
  noButton.style.backgroundColor = "darkgray";
});
noButton.addEventListener("mouseout", function () {
  noButton.style.backgroundColor = "gray";
});

noButton.addEventListener("click", function () {
  container.remove(); // Remove the container when "No" is clicked
});

// Append buttons to buttonContainer
buttonContainer.appendChild(yesButton);
buttonContainer.appendChild(noButton);

// Append buttonContainer to container
container.appendChild(buttonContainer);

// Append container to the body
document.body.appendChild(container);
document.body.style.backgroundColor = "#f4f4f4"; // Optional background color for body
document.body.style.fontFamily = "Arial, sans-serif"; // Optional font styling

}

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
    search();
    let data = (await fetchListingsData());
    const trending = document.querySelector("#trendingList");
    trending.setAttribute("page",1);
    const sponsored = document.querySelector("#sponsoredList");
    sponsored.setAttribute("page",1);
    const forYou = document.querySelector("#forYouList");
    forYou.setAttribute("page",1);
    

    let sponsoredDict = []
    let forYouDict = []
    loadSponsoredDict(data,sponsoredDict);
    loadForYouDict(data,forYouDict);

    loadTrending(data,trending.getAttribute("page"));
    loadForYou(forYouDict,forYou.getAttribute("page"));
    loadSponsored(sponsoredDict,sponsored.getAttribute("page"));
    

    const prevBtnTrend = document.getElementById("prevBtnTrend");
    prevBtnTrend.addEventListener("click",function(){
      let page = trending.getAttribute("page")
      if(page==1){

      }else{
        trending.setAttribute("page",Number(page)-1);
        loadTrending(data,trending.getAttribute("page"));
      }
    })
    const nextBtnTrend = document.getElementById("nextBtnTrend");
    nextBtnTrend.addEventListener("click",function(){
      let page = trending.getAttribute("page")
      if(page==5){

      }else{
        trending.setAttribute("page",Number(page)+1);
        loadTrending(data,trending.getAttribute("page"));
      }
    })

    const prevBtnSpons = document.getElementById("prevBtnSpons");
    prevBtnSpons.addEventListener("click",function(){
      let page = sponsored.getAttribute("page")
      if(page==1){

      }else{
        sponsored.setAttribute("page",Number(page)-1);
        loadSponsored(sponsoredDict,sponsored.getAttribute("page"));
      }
    })
    const nextBtnSpons = document.getElementById("nextBtnSpons");
    nextBtnSpons.addEventListener("click",function(){
      let page = sponsored.getAttribute("page")
      if(page==5){

      }else{
        sponsored.setAttribute("page",Number(page)+1);
        loadSponsored(sponsoredDict,sponsored.getAttribute("page"));
      }
    })
    const prevBtnForYou = document.getElementById("prevBtnForYou");
    prevBtnForYou.addEventListener("click",function(){
      let page = forYou.getAttribute("page")
      if(page==1){

      }else{
        forYou.setAttribute("page",Number(page)-1);
        loadForYou(forYouDict,forYou.getAttribute("page"));
      }
    })
    const nextBtnForYou = document.getElementById("nextBtnForYou");
    nextBtnForYou.addEventListener("click",function(){
      let page = forYou.getAttribute("page")
      if(page==5){

      }else{
        forYou.setAttribute("page",Number(page)+1);
        loadForYou(forYouDict,forYou.getAttribute("page"));
      }
    })

    
    lottieGone();
    
})
function lottieGone(){
  const lottie = document.querySelector("#lottiePlayer")
  lottie.style.display = "none";
}
// Banner functionality
let currentBannerIndex = 0;
const banners = document.querySelectorAll('.banner img');
const totalBanners = banners.length;
function updateBanner() {
    const bannerWidth = document.querySelector('.banner-container').clientWidth;
    const bannerContainer = document.querySelector('.banner');
    bannerContainer.style.transform = `translateX(-${currentBannerIndex * bannerWidth}px)`;
}
function autoplayBanner() {
  currentBannerIndex++;
  if (currentBannerIndex >= totalBanners) {
      currentBannerIndex = 0;
      const bannerContainer = document.querySelector('.banner');
      bannerContainer.style.transition = 'none'; // Disable transition for seamless loop
      bannerContainer.style.transform = `translateX(0)`;
      setTimeout(() => {
          bannerContainer.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition
          currentBannerIndex++;
          updateBanner();
      }, 50); // Small delay to allow the transform to reset
  } else {
      updateBanner();
  }
}
setInterval(autoplayBanner, 3000);
// Initialize banner on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBanner();
});

function subCatSearch(event){
  let button = event.target;
  localStorage.setItem("search",button.textContent);
  const url = `Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
  window.location.href = url; 

}



