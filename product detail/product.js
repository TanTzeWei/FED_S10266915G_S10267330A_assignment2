document.addEventListener("DOMContentLoaded",async function(){
    let productId = 91//localStorage.getItem("productId");
    let data;
    data = await findProduct(productId);
    if(data != null){
        let productData = JSON.parse(data);

    }else{
        console.log("There is no such product");
    }

})

async function findProduct(id) {
    const apiKey = "6784db79cea8d35416e3d912";
    const query = { listingid:id
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
        return false; 
      } else {
        return JSON.stringify(data);
      }
    } catch (error) {
      console.error("Error validating login:", error);
      return false; 
    }
  }