document.addEventListener('DOMContentLoaded', function () {
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
        const userId = localStorage.getItem('userId'); // Retrieve user ID from localStorage or another source
        if (!userId) {
            console.error('User ID not found.');
            alert('Error: User ID is missing.');
            return;
        }

        const apiKey = '6784db79cea8d35416e3d912'; // Replace with your RestDB API key
        const url = `https://assg2fed-fbbe.restdb.io/rest/account/${userId}`;

        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-apikey': apiKey
                },
                body: JSON.stringify({ premium: true })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            console.log('Premium status updated:', data);
            alert('Payment successful! Your premium status has been updated.');
        } catch (error) {
            console.error('Error updating premium status:', error);
            alert('An error occurred while updating your premium status. Please try again.');
        }
    }
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