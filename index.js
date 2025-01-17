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
        console.log(JSON.stringify(data));
        return JSON.stringify(data); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
}
function loadTrending(data){

}
function loadForYou(data){
    for(let i = 0; i<5;i++){
        let newData = JSON.parse(data);
        console.log(newData)
        const forYou = document.querySelector("#forYouList");
        let productExample = document.querySelector("#example");
        let randomInt = Math.floor(Math.random()*newData.length);
        let selected = newData[randomInt];
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
        let dayPosted = new Date(selected.datecreated);
        let currentDate = new Date()
        let dateDiff = currentDate.getDate()-dayPosted.getDate();

        name.textContent = selected.listingname
        price.textContent = "S$"+selected.price;
        name.textContent = selected.username;
        condition.textContent = selected.condition;
        likeCount.textContent = selected.likecount;
        username.textContent = selected.ownername;
        postTime.textContent = dateDiff+" days ago";
        clone.style.visibility = "visible";
        forYou.appendChild(clone);
    }
}

document.addEventListener("DOMContentLoaded",async function(){
    let data = (await fetchListingsData());
    const trending = document.querySelector("#trendingList");
    const latest = document.querySelector("#latestList");
    
    
    loadForYou(data)
})