# MokeSell Website

MokeSell is a consumer-to-consumer (C2C) marketplace designed exclusively for mobile phone sales. Whether you're looking to sell your pre-loved smartphone or find a great deal on a second-hand device, MokeSell provides a seamless and trustworthy platform for all mobile phone transactions.

Unlike other marketplaces, MokeSell eliminates the middleman, ensuring that sellers keep 100% of their profits. No hidden fees, no unnecessary commissions—just direct sales between buyers and sellers for a hassle-free experience.
---

## 📌 Design Process  

### **Target Audience**
MokeSell is designed for individuals who want to **buy or sell second-hand mobile phones** easily and securely.  

### **User Goals**
- Sellers want to **list their used phones quickly** and reach potential buyers.  
- Buyers want to **find and filter listings easily** to get the best deals.  
- Both parties need a **secure chat system** to communicate without sharing personal contact details.  

### **User Stories**
- **As a seller**, I want to create a listing, so that I can sell my used phone.  
- **As a seller**, I want to edit my listing, so that I can update my product details.  
- **As a buyer**, I want to search and filter listings, so that I can find the phone I need.  
- **As a buyer**, I want to chat with sellers, so that I can negotiate and ask questions.  
- **As a user**, I want to report inappropriate listings, so that I can ensure a safe marketplace.  

### **Wireframes & Mockups**
- [Adobe XD Wireframes](#) *(Include link or attach a folder in the repository)*  
- Figma Wireframe (Link: https://www.figma.com/design/tCgwGHp7NemqbUCzVIR04h/FED-ASSG2?node-id=0-1&t=OcVMvmJzIJXjp7v6-1)
---

## 🎯 Features  

### **✅ Existing Features**
1. **Homepage Product Loading** – Displays phones in three categories: *For You, Sponsored, and Trending*.  
2. **Login & Register** – Allows users to sync or create new accounts.  
3. **Edit Listings** – Enables sellers to modify their product details.  
4. **Report Listings** – Users can report inappropriate product listings.  
5. **Sponsor Listings** – Sellers can pay to boost product visibility.  
6. **Delete Listings** – Allows sellers to deactivate their listings.  
7. **Profile Settings** – Users can update their personal information.  
8. **Logout** – Enables users to securely log out.  
9. **Search & Filter** – Users can search and filter through the database.  
10. **Premium Membership** – Users can buy premium status for added visibility.  
11. **Chat System** – Buyers and sellers can communicate within the platform.  
12. **Product Page** – Displays detailed product information dynamically.  
13. **Like & Save Listings** – Users can save products they are interested in.  
14. **User Profiles** – Displays profile bios and listings.  

### **🚀 Features Left to Implement**
- **Review Offer Function** – To allow sellers to review buyer offers.  
- **Admin Panel** – To let staff review and manage reported listings.  

---

## 🛠 Technologies Used  

- **RestDB** – Database for storing user and product information.  
- **Imgbb** – Image hosting for product pictures.  

---

## ✅ Testing  

### **Manual Testing Scenarios**  

#### **Homepage (`index`)**
- Ensure all products load correctly after the Lottie animation.  
- Click on the like button and check if it updates the saved list.  
- Scroll through products to confirm proper display.  

#### **Search Results (`search`)**
- Test search functionality by entering various keywords.  
- Use filters to refine search results.  

#### **Product Page (`product`)**
- Click a product and verify it loads the correct details.  
- Test navigation to the seller's profile.  
- Test the chat function with the seller.  

#### **Profile Page**
- Ensure username, bio, and listings display correctly.  
- Verify all profile links and actions work.  

#### **Product Card**
- Test listing sponsorship.  
- Test editing, deleting, and reporting listings.  

#### **Premium Purchase**
- Complete a purchase and verify the console logs the premium status update.  

#### **Register**
- Attempt to register with **empty fields** and check for validation errors.  

#### **Login**
- Enter incorrect details and ensure an error message appears.  

#### **Chat**
- Send messages and confirm they are received in real-time.  
- Refresh the page to check for message persistence.  

---

## 📜 Credits  

- **ChatGPT** – Assisted in API functions for **Imgbb** and **RestDB**. And also github formatting
- **Inspired by** – Carousell
- Icon taken from **Font Awesome**
- All Images are taken from **Pinterest**

---


