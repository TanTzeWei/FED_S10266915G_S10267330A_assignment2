document.addEventListener("DOMContentLoaded",async function(){
    if(localStorage.getItem("id") === null){
        console.log("user not logged in")
      }else{
        document.querySelector(".user-icon").style.display = "block";
        document.querySelector(".auth-buttons").style.display = "none";
      }
      let obj = JSON.parse(await fetchListings(localStorage.getItem("productid")));
      const title = document.getElementById("title");
      const itemPrice = document.getElementById("itemPrice");
      const datePosted = document.getElementById("postTime");
      
      let dayPosted = new Date(obj.datecreated);
      let currentDate = new Date();
      let dateDiff = currentDate.getDate() - dayPosted.getDate();

      title.textContent = obj.listingname;
      itemPrice.textContent = "Price:$"+obj.price;
      datePosted.textContent = "Posted "+dateDiff+" days ago"; 
})

async function fetchListings(idNo){
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { id:Number(idNo)
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