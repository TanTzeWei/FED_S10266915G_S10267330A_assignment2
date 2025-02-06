document.addEventListener("DOMContentLoaded",async function(){
    let chatRoomsData = JSON.parse(await fetchChatRoom());
    let messagesData = JSON.parse(await fetchMessages());
    let userId = localStorage.getItem("id");

    let userInRooms = chatRoomsData.filter(item=> item.buyerid == userId || item.sellerid);
    let relevantMessages = messagesData.filter(item=> item.chatroomid in userInRooms.id);
})
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