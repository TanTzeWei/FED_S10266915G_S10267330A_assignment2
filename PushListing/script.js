document.addEventListener("DOMContentLoaded",async function(){
    if(localStorage.getItem("id") === null){
        console.log("user not logged in")
      }else{
        document.querySelector(".user-icon").style.display = "block";
        document.querySelector(".auth-buttons").style.display = "none";
      }
      let obj = await fetchListing(localStorage.getItem("productId"));
      console.log(obj[0]);
      const title = document.getElementById("title");
      const itemPrice = document.getElementById("itemPrice");
      const datePosted = document.getElementById("postTime");
      
      let dayPosted = new Date(obj[0].datecreated);
      let currentDate = new Date();
      let dateDiff = currentDate.getDate() - dayPosted.getDate();

      title.textContent = obj[0].listingname;
      itemPrice.textContent = "Price:$"+obj.price;
      datePosted.textContent = "Posted "+dateDiff+" days ago"; 
})

async function fetchListing(idNo) {
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { listingid: Number(idNo) };
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

        // Check if data is an empty array
        if (Array.isArray(data) && data.length === 0) {
            console.log("no data found");
            return false;
        } else {
            return data;  // Return raw data (object or array)
        }
    } catch (error) {
        console.error("Error validating product:", error);
        return false;
    }
}
