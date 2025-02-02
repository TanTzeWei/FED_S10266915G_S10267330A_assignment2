let productsData = [];
document.addEventListener("DOMContentLoaded",async function(){
    search();
    let data = await fetchListingsData()
    console.log(JSON.parse(data));
    let productsData = filterJSON(JSON.parse(data),localStorage.getItem("search"));
    console.log(productsData);
    renderProducts(productsData);
    document.querySelectorAll(".filter-button").forEach(button => {
      button.addEventListener("click", function () {
          applyFilters(productsData);
        });
      });
    });
    let grid = document.querySelector(".product-grid")
    if(productsData.length !=0){
        productsData.forEach(function(selected){
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
            createProductLink(clone);
            grid.appendChild(clone);
        })
        lottieGone();
    }else{
        console.warn("There is no such items!");
        lottieGone();
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
function filterJSON(data, searchTerm) {
    return data.filter(item => {
        return item.listingname && 
               String(item.listingname).toLowerCase().includes(searchTerm.toLowerCase());
    });
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

function search(){
    const searchButton = document.querySelector(".search-bar button");
    searchButton.addEventListener("click",function(){
      let search = document.querySelector(".search-bar input").value;
      localStorage.setItem("search",search);
      const url = `/SearchResult/Search.html?item=${search}`;
      window.location.href = url; 
      console.log("Done")
    })
  }
  
  function createProductLink(productCard) {
    const menudot = productCard.querySelector(".menu-dots-product")
    productCard.addEventListener("click",function(){
      let productId = productCard.getAttribute("productid")
      localStorage.setItem("productId",productId)
      const url = `/product/product.html?id=${productId}`;
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
    productCard.querySelector(".menu-options #delete").addEventListener("click",function(event){
      event.stopPropagation()
    })
  }
  
  function editListing(productCard){
    console.log(productCard.target)
    localStorage.setItem("productId",productCard.getAttribute("productid"))
    const url = `/EditListing/EditListing.html?id=${productId}`;
    window.location.href = url; 
  }
  function lottieGone(){
    const lottie = document.querySelector("#lottiePlayer")
    lottie.style.display = "none";
  }
  function renderProducts(productsData) {
    let grid = document.querySelector(".product-grid");
    grid.innerHTML = ""; // Clear existing items

    if (productsData.length !== 0) {
        productsData.forEach(function (selected) {
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
            let currentDate = new Date();
            let dateDiff = currentDate.getDate() - dayPosted.getDate();

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
            clone.setAttribute("productId", selected.listingid);
            clone.setAttribute("ownerId", selected.ownerid);
            createProductLink(clone);
            grid.appendChild(clone);
        });
        lottieGone();
    } else {
        console.warn("There are no matching items!");
        lottieGone();
    }
}
function applyFilters(products) {
  let selectedFilters = {
      price: null, 
      os: null,
      condition: null,
      meetup: null
  };

  // Get selected price filter
  if (document.querySelector('[data-filter="price-low"].active')) {
      selectedFilters.price = "low";
  } else if (document.querySelector('[data-filter="price-high"].active')) {
      selectedFilters.price = "high";
  }

  // Get selected OS filter
  if (document.querySelector('[data-filter="type-ios"].active')) {
      selectedFilters.os = "iOS";
  } else if (document.querySelector('[data-filter="type-android"].active')) {
      selectedFilters.os = "Android";
  } else if (document.querySelector('[data-filter="type-other"].active')) {
      selectedFilters.os = "Other";
  }

  // Get selected condition filter
  if (document.querySelector('[data-filter="condition-new"].active')) {
      selectedFilters.condition = "brand-new";
  } else if (document.querySelector('[data-filter="condition-used"].active')) {
      selectedFilters.condition = "Used";
  }

  // Get selected meetup filter
  if (document.querySelector('[data-filter="meetup"].active')) {
      selectedFilters.meetup = true;
  }

  console.log("Selected Filters:", selectedFilters);

  // Apply filtering
  let filteredProducts = products.filter(product => {
      return (
          (selectedFilters.os ? product.os === selectedFilters.os : true) &&
          (selectedFilters.condition ? product.condition === selectedFilters.condition : true) &&
          (selectedFilters.meetup !== null ? product.meetup === selectedFilters.meetup : true)
      );
  });

  // Apply price sorting
  if (selectedFilters.price === "low") {
      filteredProducts.sort((a, b) => a.price - b.price);
  } else if (selectedFilters.price === "high") {
      filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}
// Add active class to filter buttons when clicked
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", function () {
      this.classList.toggle("active");
  });
});
