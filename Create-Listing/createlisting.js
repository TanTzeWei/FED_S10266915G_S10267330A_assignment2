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
async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=dcf161ae0f10bda1cf4c0244444d3bdd`, {
      method: 'POST',
      body: formData
  });

  const data = await response.json();
  if (data.success) {
      return data.data.url; // The image URL from ImgBB
  } else {
      console.error('Image upload failed', data);
      return null;
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
  const coverPhotoUrl = await uploadImageToImgBB(cover.files[0]);  // Use the selected file from the input
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
  const authButtons = document.querySelector(".auth-buttons");
  if(localStorage.getItem("id") === null){
      console.log("user not logged in")
      authButtons.classList.remove('logged-in');
    }
    else{
      authButtons.classList.add('logged-in');
      document.querySelector(".user-container").style.display = "block";
      document.querySelector(".register-btn").style.display = "none";
      document.querySelector(".login-btn").style.display = "none";
    }
    const profileIcon = document.getElementById("user-container");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutButton = document.getElementById("logoutbutton");

  if (!profileIcon || !dropdownMenu) {
      console.error("❌ user-container OR dropdown-menu NOT found in the DOM!");
      return;
  }

  console.log("✅ user-container FOUND!");

  // Corrected click event listener
  profileIcon.addEventListener("click", function (event) {
      console.log("✅ Profile Icon Clicked!");
      event.stopPropagation(); // Prevents the click event from bubbling up
      dropdownMenu.classList.toggle("active"); // Toggle active class correctly
      setTimeout(() => {
          if (logoutButton) {
              console.log("✅ Logout button FOUND!");
              logoutButton.addEventListener("click", function (event) {
                  event.stopPropagation();
                  console.log("✅ Logout button clicked!");
                  localStorage.removeItem("id");
                  window.location.href = "../login/login.html";
              });
          } else {
              console.error("❌ Logout button NOT found!");
          }
      }, 300); // Give the browser time to render the dropdown
  });


  // Close the dropdown if the user clicks outside of it
  document.addEventListener("click", function (event) {
      if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove("active");
          console.log("✅ Dropdown closed!");
      }
  });
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
