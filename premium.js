document.addEventListener('DOMContentLoaded', function () {
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
        }, 1000); // Give the browser time to render the dropdown
    });


    // Close the dropdown if the user clicks outside of it
    document.addEventListener("click", function (event) {
        if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
            console.log("✅ Dropdown closed!");
        }
    });
    const pricingButtons = document.querySelectorAll('.pricing-button');
    pricingButtons.forEach(button => {
        button.addEventListener('click', function () {
            const plan = this.getAttribute('data-plan');
            const price = this.getAttribute('data-price');
            localStorage.setItem('selectedPlan', JSON.stringify({ plan, price }));
            window.location.href = '../premiumpayment/premiumpayment.html';
        });
    });
});
function subCatSearch(event){
    let button = event.target;
    localStorage.setItem("search",button.textContent);
    const url = `/SearchResult/Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
    window.location.href = url; 
  
  }