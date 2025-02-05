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

// Function to upload the image to Imgur
async function uploadImageToImgur(file) {
  const formData = new FormData();
  formData.append("image", file);  // Append the image file to FormData

  const clientId = "666ace3b3cee718";  // Replace with your Imgur Client ID
  const apiUrl = "https://api.imgur.com/3/image";  // Imgur upload endpoint

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Client-ID ${clientId}`,  // Authorization header with your Client ID
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Imgur upload failed: ${data.data.error}`);
    }

    return data.data.link;  // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    return null;  // Return null if upload fails
  }
}
async function fetchNewId(){
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
  const highestValue = Math.max(...data.map(item => item.value));
  return Number(highestValue+1)
}


// Modified createListing function to use Imgur upload
async function createListing(name, desc, cover, o, cond, meet, addr, del, pri) {
  const apiKey = "6784db79cea8d35416e3d912";
  id = await fetchNewId()

  // Upload the image to Imgur and get the URL
  const coverPhotoUrl = await uploadImageToImgur(cover.files[0]);  // Use the selected file from the input
  if (!coverPhotoUrl) {
    showNotification("Image upload to Imgur failed!");
    return;  // Exit if image upload fails
  }

  let add = {
    listingid: id,
    ownerid: localStorage.getItem("id"),
    premiumlisting: localStorage.getItem("premium"),
    listingname: name.value,
    description: desc.value,
    photo: coverPhotoUrl,  // Use the Imgur URL as the cover photo
    os: o.value,
    condition: cond.value,
    meetup: Boolean(meet.value),
    address: addr.value,
    delivery: Boolean(del.value),
    price: pri.value,
    datecreated: new Date(),
    ownername: localStorage.getItem("username"),
    likecount: 0,
    status: "Active",
    likedby:{}
  };

  const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/listing";
  console.log("Sending data:", add);

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
    return data;  // Return the created data
  } catch (error) {
    console.error("Error creating new data:", error);
  }
}

// Event listener for form submission
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".listing-form");
  const photo = document.querySelector("#photo");  // File input
  const photoPreview = document.querySelector("#photo-preview");
  const os = document.querySelector("#os");
  const condition = document.querySelector("#condition");
  const name = document.querySelector("#name");
  const description = document.querySelector("#description");
  const address = document.querySelector("#address");
  const price = document.querySelector("#price");
  const meetup = document.querySelector("#meetup");
  const delivery = document.querySelector("#delivery");

  photo.addEventListener("change", function() {
    const file = photo.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            photoPreview.src = e.target.result;
            photoPreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
});

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (name.value === "") {
      name.style.borderColor = "red";
      showNotification("Invalid name!");
    } else if (description.value === "") {
      showNotification("Please add a description!");
      description.style.borderColor = "red";
    } else if (photo.files.length === 0) {
      showNotification("Please add a Cover photo!");
      photo.style.borderColor = "red";
    } else if (meetup.checked && address.value === "") {
      showNotification("Add an address to meetup!");
      address.style.borderColor = "red";
    } else if (!meetup.checked && !delivery.checked) {
      showNotification("Please choose at least 1 deal method!");
      meetup.style.borderColor = "red";
      delivery.style.borderColor = "red";
    } else if (price.value < 0 || price.value === "") {
      showNotification("Please add a valid price!");
      price.style.borderColor = "red";
    } else {
      // Pass the file input to the createListing function
      createListing(name, description, photo, os, condition, meetup, address, delivery, price);
    }
  });
});
