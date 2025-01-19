function showNotification(message) {
  const notificationMessage = document.getElementById("notification-message");
  notificationMessage.textContent = message; // Set the message
  notification.classList.remove("hidden");
  notification.classList.add("visible");

  // Automatically hide after 5 seconds
  setTimeout(hideNotification, 5000);
}

// Function to hide the notification
function hideNotification() {
  notification.classList.remove("visible");
  notification.classList.add("hidden");
}

async function createListing(name,desc,cover,o,cond,meet,addr,del,pri){
  const apiKey = "6784db79cea8d35416e3d912";
    
    let add = {
        ownerid:localStorage.getItem("id"),
        premiumlisting:localStorage.getItem("premium"),
        listingname:name.value,
        description:desc.value,
        coverphoto:cover.value,
        os:o.value,
        condition:cond.value,
        meetup:Boolean(meet.value),
        address:addr.value,
        delivery:Boolean(del.value),
        price:pri.value,
        datecreated:new Date(),
        ownername:localStorage.getItem("username"),
        likecount:0,
        status:"Active"
      }
      const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/listing";
      console.log(add)
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": apiKey,
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(add), 
};
try {
  const response = await fetch(apiUrl, settings);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  console.log("Data created successfully:", data);
  return data; // Return the created data
} catch (error) {
  console.error("Error creating new data:", error);
}
}
document.addEventListener("DOMContentLoaded",function(){
    const form = document.querySelector(".listing-form");
    const photo = document.querySelector("#photo");
    const os = document.querySelector("#os");
    const condition = document.querySelector("#condition");
    const name = document.querySelector("#name");
    const description = document.querySelector("#description");
    const address = document.querySelector("#address")
    const price = document.querySelector("#price");
    const meetup = document.querySelector("#meetup");
    const delivery = document.querySelector("#delivery");

    form.addEventListener("submit", async function(event){  
        event.preventDefault();
        if(name.value == ""){
          name.style.borderColor = "red";
          showNotification("Invalid name!");
        }else if(description.value == ""){
          showNotification("Please add a description!");
          description.style.borderColor = "red";
        }else if(photo.value == ""){
          showNotification("Please add a Cover photo!")
          photo.style.borderColor = "red";
        }else if(meetup.checked == true && address.value == ""){
          showNotification("Add an address to meetup!")
          address.style.borderColor = "red";
        }else if(meetup.checked == false && delivery.checked == false){
          showNotification("Please choose at least 1 deal method!")
          meetup.style.borderColor = "red";
          delivery.style.borderColor = "red";
        }else if(price.value<0 || price.value == ""){
          showNotification("Please add a valid price!")
          price.style.borderColor = "red";
        }else{
          createListing(name,description,photo,os,condition,meetup,address,delivery,price);
        }
    })
})