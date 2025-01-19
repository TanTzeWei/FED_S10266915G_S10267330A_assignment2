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
        return JSON.stringify(data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}
function loadTrending(data,page){
    let oldData = JSON.parse(data);
    let newData = oldData.sort((a, b) => b.likecount - a.likecount);
    const trending = document.querySelector("#trendingList");


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
        trending.appendChild(clone);
    })
}
function loadSponsored(dict,page){
  let currentDict = dict[page]
  for(let i = 0; i<5;i++){//first 5//
    const sponsored = document.querySelector("#sponsoredList");
    let productExample = document.querySelector("#example");
    let selected = currentDict[i];
    if(selected != null){
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
      
      clone.setAttribute("productId",selected.listingid);
      clone.setAttribute("ownerId",selected.ownerid)
      sponsored.appendChild(clone);
    } 
}
}


function loadForYou(data){
    for(let i = 0; i<5;i++){//first 5//
        let newData = JSON.parse(data);
        const forYou = document.querySelector("#forYouList");
        let productExample = document.querySelector("#example");
        let randomInt = Math.floor(Math.random()*newData.length);
        let selected = newData[randomInt];
        if(selected.status == "Sponsored" || selected.status == "Active"){
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
          forYou.appendChild(clone);
        } 
    }
}
function loadSponsoredDict(data,Dict){
  let oldData = JSON.parse(data);
  let newData = oldData.filter(item => item.status =="Sponsored");
  let first = [];
  let second = [];
  let third = [];
  let fourth = [];
  let fifth = [];

  for(let i = 0;i <5;i++){
    let randomInt = Math.floor(Math.random()*newData.length)
    let selected  = newData[randomInt];
    first.push(selected);
    delete newData[randomInt];
  }
  for(let i = 0;i <5;i++){
    let randomInt = Math.floor(Math.random()*newData.length)
    let selected  = newData[randomInt];
    second.push(selected);
    delete newData[randomInt];
  }
  for(let i = 0;i <5;i++){
    let randomInt = Math.floor(Math.random()*newData.length)
    let selected  = newData[randomInt];
    third.push(selected);
    delete newData[randomInt];
  }
  for(let i = 0;i <5;i++){
    let randomInt = Math.floor(Math.random()*newData.length)
    let selected  = newData[randomInt];
    fourth.push(selected);
    delete newData[randomInt];
  }
  for(let i = 0;i <5;i++){
    let randomInt = Math.floor(Math.random()*newData.length)
    let selected  = newData[randomInt];
    fifth.push(selected);
    delete newData[randomInt];
  }
  Dict[1] = first;
  Dict[2] = second;
  Dict[3] = third;
  Dict[4] = fourth;
  Dict[5] = fifth;
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


document.addEventListener("DOMContentLoaded",async function(){
    let data = (await fetchListingsData());
    const trending = document.querySelector("#trendingList");
    trending.setAttribute("page",1);
    const sponsored = document.querySelector("#sponsoredList");
    sponsored.setAttribute("page",1)
    const forYou = document.querySelector("#forYouList");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    let sponsoredDict = {
      1:"",
      2:"",
      3:"",
      4:"",
      5:""
    }
    loadSponsoredDict(data,sponsoredDict);

    loadForYou(data);
    loadSponsored(sponsoredDict,sponsored.getAttribute("page"));
    loadTrending(data,trending.getAttribute("page"));
})