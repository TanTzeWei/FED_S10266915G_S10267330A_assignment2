document.addEventListener("DOMContentLoaded",async function(){
    if(localStorage.getItem("id") === null){
      console.log("user not logged in")
    }else{
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
        }, 1000); // Give the browser time to render the dropdown
    });


    // Close the dropdown if the user clicks outside of it
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
            console.log("✅ Dropdown closed!");
        }
    });
  });
    let name = document.querySelector("#name");
    let email = document.querySelector("#email");
    let itemid = document.querySelector("#id");
    let issue = document.querySelector("#issue");
    let message = document.querySelector("#message");
    let image = document.querySelector("#screenshot");
    document.getElementById('feedbackForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const apiKey = "6784db79cea8d35416e3d912";
        id = await fetchNewId()

  // Upload the image to Imgur and get the URL
  const coverPhotoUrl = await uploadImageToImgBB(image.files[0]);  // Use the selected file from the input
  if (!coverPhotoUrl) {
    showNotification("Image upload to Imgur failed!");
    return;  // Exit if image upload fails
  }

  let add = {
    username:name.value,
    photo: coverPhotoUrl,
    email:email.value,
    itemid:itemid.value,
    issue:issue.value,
    message:message.value,
    status:"unsolved"
    
  };

  const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/report";
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
    });
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
  function subCatSearch(event){
    let button = event.target;
    localStorage.setItem("search",button.textContent);
    const url = `/SearchResult/Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
    window.location.href = url; 
  
  }
