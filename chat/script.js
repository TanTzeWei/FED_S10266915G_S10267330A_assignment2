document.addEventListener("DOMContentLoaded",async function(){
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
    let chatRoomsData = JSON.parse(await fetchChatRoom());
    let messagesData = JSON.parse(await fetchMessages());
    let accountsData = JSON.parse(await fetchAccounts());
    let userId = localStorage.getItem("id");
    let exampleList = document.querySelector(".user-list");
    let msgSend = document.querySelector(".message.sent");
    let msgReceive = document.querySelector(".message.received");
    let chatRoomExample = document.querySelector(".user");

    let userInRooms = chatRoomsData.filter(item=> item.buyerid == userId || item.sellerid);
    console.log(userInRooms);
    console.log(messagesData);
      
    userInRooms.forEach(element => {
        let opposeUser = accountsData.find(item=> item.id == element.buyerid || item.id == element.sellerid)
        let cloneChatRoom = chatRoomExample.cloneNode(true);
        cloneChatRoom.style.display = "block";
        cloneChatRoom.textContent = element.listingname;
        if (opposeUser.pfp) {
            const imgElement = cloneChatRoom.querySelector("span img");
          
            if (imgElement) { // Ensure the img element exists
              imgElement.src = opposeUser.pfp; // Set the src to the user's profile picture
            } else {
              console.error("Image element not found in cloneChatRoom");
            }
          } else {
            console.log("Profile picture is not available.");
          }
          
        document.querySelector(".user-list li").appendChild(cloneChatRoom);
        cloneChatRoom.setAttribute("chatRoomId",element.id);
        cloneChatRoom.addEventListener("click",function(){  
            console.log("clicked")
            localStorage.setItem("chatId",cloneChatRoom.getAttribute("chatRoomId"))
            document.querySelector(".item-info h3").textContent = element.listingname
            document.querySelector(".price span").textContent = "$"+element.listingprice
            if(Number(localStorage.getItem("id")) == element.buyerid){
                document.querySelector(".seller-name").textContent = element.sellername;
            }else{
                document.querySelector(".seller-name").textContent = element.buyername;
            }
            let currentMessages = messagesData.filter(item=>item.chatroomid == Number(localStorage.getItem("chatId")));
            if(currentMessages.length >0){
                let sortedMessage = currentMessages.sort((a, b) => {
                    let dateA = new Date(a.timestamp);
                    let dateB = new Date(b.timestamp);
                    return dateA-dateB; 
                });
                sortedMessage.forEach(message => {
                    console.log(localStorage.getItem("id"))
                    if(message.senderid == Number(localStorage.getItem("id"))){//sent by me
                        let clonedMessage = msgSend.cloneNode(true);
                        clonedMessage.querySelector(".message-text").textContent = message.text;
                        clonedMessage.querySelector(".message-timestamp").textContent = message.timestamp;
                        clonedMessage.style.display = "block";
                        document.querySelector(".chat-messages").appendChild(clonedMessage);
                    }else{
                        let clonedMessage = msgReceive.cloneNode(true);
                        clonedMessage.querySelector(".message-text").textContent = message.text;
                        clonedMessage.querySelector(".message-timestamp").textContent =  message.timestamp;
                        clonedMessage.style.display = "block";
                        document.querySelector(".chat-messages").appendChild(clonedMessage);
                    }
                });
            }
        })
        document.querySelector(".send-btn").addEventListener("click",async function(){
            let now = new Date();
            let year = now.getFullYear();
            let month = String(now.getMonth() + 1).padStart(2, '0');  
            let day = String(now.getDate()).padStart(2, '0');
            let hours = String(now.getHours()).padStart(2, '0');
            let minutes = String(now.getMinutes()).padStart(2, '0');

            let formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            let chatId = localStorage.getItem("chatId");
            let input = document.querySelector(".message-input input");
            let clonedMessage = msgSend.cloneNode(true);
            clonedMessage.querySelector(".message-text").textContent = input.value;
            clonedMessage.querySelector(".message-timestamp").textContent = formattedDateTime;
            document.querySelector(".chat-messages").appendChild(clonedMessage);

            let add = {
                chatroomid:chatId,
                senderid:localStorage.getItem("id"),
                timestamp:formattedDateTime,
                text:input.value
              }
              const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/messages";
              const apiKey = "6784db79cea8d35416e3d912";
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
        })


    });
})

async function fetchAccounts(){
    try {
   
        const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/account";
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
async function fetchChatRoom(){
    try {
   
        const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/chatroom";
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
async function fetchMessages(){
    try {
   
        const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/messages";
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
function subCatSearch(event){
  let button = event.target;
  localStorage.setItem("search",button.textContent);
  const url = `/SearchResult/Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
  window.location.href = url; 

}