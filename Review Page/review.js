// Character counter logic
const reviewText = document.querySelector(".review-text");
const charCount = document.getElementById("char-count");
const message = document.getElementById("limit-message");

reviewText.addEventListener("input", () => {
    const maxLength = 200;
    const remainingChars = maxLength - reviewText.value.length;

    if (remainingChars <= 0) {
        reviewText.value = reviewText.value.substring(0, maxLength);
        message.textContent = "0 characters remaining.";
    } else {
        message.textContent = `${remainingChars} characters remaining.`;
    }

    charCount.textContent = maxLength - remainingChars; // Update the current count
});


