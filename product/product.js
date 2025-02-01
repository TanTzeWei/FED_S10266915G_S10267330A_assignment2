document.addEventListener("DOMContentLoaded",async function(){
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
      createProductLink(clone);
      document.querySelector(".grid-container").appendChild(clone);
      lottieGone();
    }
})
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

function clickProfile(sellerinfo){
  sellerinfo.addEventListener("click",function(){
    let id = sellerinfo.getAttribute("profileId");
    localStorage.setItem("ownerId",id);
    const url = `../profile/profile.html?id=${id}`;
    window.location.href = url; 
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
    event.stopPropagation();

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