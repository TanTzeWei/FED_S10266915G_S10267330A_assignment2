document.addEventListener("DOMContentLoaded",async function(){
    let productId = localStorage.getItem("productId");
    let data;
    data = await findProduct(productId);
    if(data != null){
        let productData = JSON.parse(data)[0];
        console.log(productData);
        const name = document.getElementById("productName");
        const price = document.getElementById("price");
        const delivery = document.getElementById("delivery");
        const meetup = document.getElementById("meetup");
        const address = document.getElementById("location");
        const os = document.getElementById("os");
        const condition = document.getElementById("condition");
        const description = document.getElementsByClassName("description");
        console.log(os);
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
        description.textContent = productData.description;

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