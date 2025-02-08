document.addEventListener("DOMContentLoaded",async function(){
  if(localStorage.getItem("id") === null){
    console.log("user not logged in")
  }else{
    document.querySelector(".user-container").style.display = "block";
    document.querySelector(".user-actions").style.display = "none";
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

  document.querySelector(".listng-form").addEventListener("submit",async function(event){
    event.preventDefault();
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
              ownerid: localStorage.getItem("id"),
              premiumlisting: localStorage.getItem("premium"),
              listingname: name.value,
              description: description.value,
              os: os.value,
              condition: condition.value,
              meetup: Boolean(meetup.value),
              address: address.value,
              delivery: Boolean(delivery.value),
              price: price.value,
              ownername: localStorage.getItem("username")
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
            })

            let productId = productCard.getAttribute("productid")
            localStorage.setItem("productId",productId)
            const url = `../product/product.html?id=${productId}`;
            window.location.href = url; 
            console.log("Done")
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      listings=data;
      return JSON.stringify(data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
}
const profileIcon = document.getElementById('user-container');
    const dropdownMenu = document.getElementById('dropdown-menu');

    profileIcon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevents the click event from bubbling up
        dropdownMenu.classList.toggle('active'); // Toggle active class correctly
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('active');
        }
    });