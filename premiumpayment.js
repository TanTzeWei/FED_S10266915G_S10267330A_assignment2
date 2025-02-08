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
                    window.location.href = "login.html";
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
      const selectedPlan = JSON.parse(localStorage.getItem('selectedPlan'));
    if (selectedPlan) {
        const orderSummary = document.getElementById('order-summary');
        const orderTotal = document.getElementById('order-total');
        const tax = document.getElementById('tax');

        const taxAmount = (selectedPlan.price * 0.07).toFixed(2); // Assuming 7% tax rate
        const totalAmount = (parseFloat(selectedPlan.price) + parseFloat(taxAmount)).toFixed(2);

        orderSummary.innerHTML = `
            <li>${selectedPlan.plan} Plan <span>$${selectedPlan.price}</span></li>
        `;
        tax.textContent = `$${taxAmount}`;
        orderTotal.textContent = `$${totalAmount}`;
        document.getElementById('confirm-btn').textContent = `Confirm Payment $${totalAmount}`;
    }
    const confirmBtn = document.getElementById('confirm-btn');

    confirmBtn.addEventListener('click', async function () {
        try {
            await processPayment();
            await updatePremiumStatus();
        } catch (error) {
            console.error('Payment failed:', error);
        }
    });

    function processPayment() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(); // Simulate successful payment
            }, 2000);
        });
    }

    async function updatePremiumStatus() {
        const userid = Number(localStorage.getItem('id'));
        console.log('User ID from localStorage:', userid); // Retrieve user ID from localStorage or another source
        if (!userid) {
            console.error('User ID not found.');
            alert('Error: User ID is missing.');
            return;
        }

        const apiKey = '6784db79cea8d35416e3d912'; // Replace with your RestDB API key
        const url = `https://assg2fed-fbbe.restdb.io/rest/account`; // Collection URL (no need for `/id` yet)

        try {
            // Fetch the records and find the recordId for the matching userId
            const records = await getRecords(url, apiKey);
            console.log('Fetched records:', records);
            // Find the record with the matching userId
            const userRecord = records.find(record => record.id === userid);
            console.log('Matching user record:', userRecord);
            if (!userRecord) {
                throw new Error('User record not found.');
            }

            const recordId = userRecord._id; // Get the recordId for the user

            // Now update the premium status for the found user
            const updateResponse = await fetch(`${url}/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                },
                body: JSON.stringify({ premium: true })
            });

            if (!updateResponse.ok) throw new Error(`HTTP error! Status: ${updateResponse.status}`);

            const data = await updateResponse.json();
            console.log('Premium status updated:', data);
            alert('Payment successful! Your premium status has been updated.');

        } catch (error) {
            console.error('Error updating premium status:', error);
            alert('An error occurred while updating your premium status. Please try again.');
        }
    }

    // Function to fetch records from RestDB
    const getRecords = async (url, apiKey) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'x-apikey': apiKey
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch records');
            }

            const data = await response.json();
            return data; // Return the records

        } catch (error) {
            console.error('Error fetching records:', error);
            throw error;
        }
    };
});

function subCatSearch(event){
    let button = event.target;
    localStorage.setItem("search",button.textContent);
    const url = `Search.html?item=${button.textContent}`;//yo tzewei if you are copy pasting this from here to others change the path to ../SearchResult/Search.html?item=${button.textContent} or it wont work
    window.location.href = url; 
  
  }

  