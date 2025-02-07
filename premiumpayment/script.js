document.addEventListener('DOMContentLoaded', function () {
    if(localStorage.getItem("id") === null){
        console.log("user not logged in")
      }else{
        document.querySelector(".user-icon").style.display = "block";
        document.querySelector(".auth-buttons").style.display = "none";
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

document.addEventListener('DOMContentLoaded', function () {
    // Check if the screen size is small
    const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    if (isSmallScreen) {
        const categories = document.querySelectorAll('.category > a');
        
        categories.forEach(category => {
            category.addEventListener('click', function (e) {
                // Prevent the default link behavior
                e.preventDefault();

                // Toggle visibility of subcategories
                const subcategories = this.nextElementSibling; // The <ul> element
                subcategories.classList.toggle('show');
            });
        });
    }

    // Hamburger menu functionality
    document.getElementById('hamburger-menu').addEventListener('click', function () {
        var categories = document.querySelector('.categories');
        var authButtons = document.querySelector('.auth-buttons');
        var userIcon = document.querySelector('.user-icon');

        categories.classList.toggle('show');
        authButtons.classList.toggle('show');
        userIcon.classList.toggle('show');
    });
});

  