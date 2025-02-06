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
        cloneChatRoom.textContent = opposeUser.username;
        if(opposeUser.pfp != null){
            cloneChatRoom.querySelector("span img").src = opposeUser.pfp;
        }
        cloneChatRoom.appendChild(document.querySelector(".user-list li"));
        cloneChatRoom.setAttribute("username",);
        cloneChatRoom.setAttribute("chatRoomId",element.);
        cloneChatRoom.addEventListener("click",function(){  
            let currentMessages = relevantMessages.filter(item=> item.chatroomid == )
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