document.addEventListener("DOMContentLoaded",async function(){
  if(localStorage.getItem("id") === null){
    console.log("user not logged in")
  }else{
    document.querySelector(".user-icon").style.display = "block";
    document.querySelector(".auth-buttons").style.display = "none";
  }
  let productData = await fetchListingsData();
  let obj = JSON.parse(productData).find(item=> item.listingid = localStorage.getItem("productId"));
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const image = document.querySelector("#photo");
  const os = document.querySelector("#os");
  const condition = document.querySelector("#condition");
  const meetup = document.querySelector("#meetup");
  const address = document.querySelector("#address");
  const delivery = document.querySelector("#delivery");
  const price = document.querySelector("#price");

  name.value = obj.listingname
  description.value = obj.description;
  os.value = obj.os;
  condition.value = obj.condition;
  meetup.value = obj.meetup;
  address.value = obj.address;
  delivery.value = obj.delivery;
  price.value = obj.price;
})

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
        throw new Error(HTTP error! status: ${response.status});
      }
  
      const data = await response.json();
      listings=data;
      return JSON.stringify(data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}