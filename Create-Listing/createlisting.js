async function createListing(name,desc,condition,set,warranty,meetup,address,delivery,os,price,coverPhoto,likeCount = 0,status = "Active",){
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    
    let add = {
        ownerid: localStorage.getItem("id"),
        productname:name,
        productdesc:desc,
        premiumlisting:getItem("premium"),
        condition:condition,
        set:set,
        warranty:warranty,
        meetup:meetup,
        address:address,
        delivery:delivery,
        os:os,
        price:price,
        date:currentDate,
        likeCount:likeCount,
        status:status,
        cover:coverPhoto,
      }
      const apiUrl = "https://assg2fed-fbbe.restdb.io/rest/listings";
    
      const settings = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-apikey": apiKey,
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify(add), 
}

document.addEventListener("DOMContentLoaded",function(){
    const form = document.querySelector(".listing-form");
    const photo = document.querySelector("#photo");
    //const os = document.querySelector("");
    //const condition = document.querySelector("");
    //const name = document.querySelector("#name");
    //const set = document.querySelector("");
    //const warranty = document.querySelector("");
    //const description = document.querySelector("description");
    //const meetup = document.querySelector("");
    //const address = document.querySelector("#address")
    //const delivery = document.querySelector("");
    //const price = document.querySelector("");
    
    form.addEventListener("submit", async function(event){  
        event.preventDefault();
    })
})}