document.addEventListener("DOMContentLoaded",async function(){
    let chatRoomsData = JSON.parse(await fetchChatRoom());
    let messagesData = JSON.parse(await fetchMessages());
    let accountsData = JSON.parse(await fetchAccounts());
    let userId = localStorage.getItem("id");
    let exampleList = document.querySelector(".user-list");
    let msgSend = document.querySelector(".message.sent");
    let msgReceive = document.querySelector(".message.received");
    let chatRoomExample = document.querySelector(".user");

    let userInRooms = chatRoomsData.filter(item=> item.buyerid == userId || item.sellerid);
    let relevantMessages = messagesData.filter(item=> item.chatroomid in userInRooms.id);  

    userInRooms.array.forEach(element => {
        let opposeUser = accountsData.find(item=> item.id == element.buyerid || item.id == element.sellerid)
        let cloneChatRoom = chatRoomExample.cloneNode(true);
        if(localStorage.getItem(id) == element.buyerid){
            cloneChatRoom.textContent = element.sellername
        }else{
            cloneChatRoom.textContent = element.buyername;
        }
        if(opposeUser.pfp != null){
            cloneChatRoom.querySelector("span img").src = opposeUser.pfp;
        }
        cloneChatRoom.appendChild(document.querySelector(".user-list li"));
        cloneChatRoom.setAttribute("chatRoomId",element.id);
        cloneChatRoom.addEventListener("click",function(){  
            localStorage.setItem("chatId",cloneChatRoom.getAttribute("chatRoomId"))
            let currentMessages = relevantMessages.filter(item=> item.chatroomid == cloneChatRoom.getAttribute("chatRoomId"));
            if(currentMessages.length >0){
                let sortedMessage = currentMessages.sort((a, b) => {
                    let dateA = new Date(a.timestamp);
                    let dateB = new Date(b.timestamp);
                    return dateB - dateA; 
                });

                sortedMessage.array.array.forEach(message => {
                    if(element.senderid == localStorage.getItem("id")){//sent by me
                        let clonedMessage = msgSend.cloneNode(true);
                        clonedMessage.querySelector(".message-text").textContent = element.text;
                        clonedMessage.querySelector(".message-timestamp").textContent = element.timestamp;
                        clonedMessage.appendChild(document.querySelector(".chat-messages"));
                    }else{
                        let clonedMessage = msgReceive.cloneNode(true);
                        clonedMessage.querySelector(".message-text").textContent = element.text;
                        clonedMessage.querySelector(".message-timestamp").textContent = element.timestamp;
                        clonedMessage.appendChild(document.querySelector(".chat-messages"));
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
            clonedMessage.appendChild(document.querySelector(".chat-messages"));

            let add = {
                chatroomid:chatId,
                senderid:localStorage.getItem("id"),
                timestamp:formattedDateTime,
                text:input.value
              }
              const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/messages";
            
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