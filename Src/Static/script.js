// DOM Elements
const phoneInput = document.getElementById("phoneInput");
const searchBtn = document.getElementById("searchBtn");
const loadingSection = document.getElementById("loadingSection");
const resultsSection = document.getElementById("resultsSection");
const errorSection = document.getElementById("errorSection");
const resultsContent = document.getElementById("resultsContent");
const errorMessage = document.getElementById("errorMessage");
const newSearchBtn = document.getElementById("newSearchBtn");
const retrySearchBtn = document.getElementById("retrySearchBtn");

// API Base URL
const API_BASE_URL = "/api";

// State Management
let currentSearchTerm = "";

// Initialize the application
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded");
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    console.log("Setting up event listeners");
    searchBtn.addEventListener("click", performSearch);
    
    phoneInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            console.log("Enter key pressed");
            performSearch();
        }
    });
    
    newSearchBtn.addEventListener("click", resetSearch);
    
    retrySearchBtn.addEventListener("click", performSearch);
}

// Main search function
async function performSearch() {
    const phoneNumber = phoneInput.value.trim();
    
    console.log("Input phone number:", phoneNumber); // Debugging line

    if (!phoneNumber) {
        showError("Please enter a phone number to search.");
        return;
    }
    
    if (phoneNumber.length < 10) {
        showError("Please enter a valid phone number (at least 10 digits).");
        return;
    }
    
    currentSearchTerm = phoneNumber;
    showLoading();
    
    try {
        console.log(`Sending search request for: ${phoneNumber}`);
        const response = await fetch(`${API_BASE_URL}/search?number=${encodeURIComponent(phoneNumber)}`);
        const data = await response.json();
        
        console.log("API Response:", data);

        if (response.ok && data.success) {
            showResults(data);
        } else {
            showError(data.message || "No information found for this number.");
        }
    } catch (error) {
        console.error("Search error:", error);
        showError("An error occurred while searching. Please try again.");
    }
}

// Show loading state
function showLoading() {
    console.log("Showing loading state");
    hideAllSections();
    loadingSection.classList.remove("hidden");
    searchBtn.disabled = true;
    searchBtn.innerHTML = \'<i class="fas fa-spinner fa-spin"></i> Searching...\';
}

// Show search results
function showResults(data) {
    console.log("Showing results");
    hideAllSections();
    
    if (data.data) {
        displaySingleResult(data.data);
    }
    
    resultsSection.classList.remove("hidden");
    resetSearchButton();
}

// Display single search result
function displaySingleResult(result) {
    console.log("Displaying single result:", result);
    const resultCard = createResultCard(result, "SIM Information Result");
    resultsContent.innerHTML = "";
    resultsContent.appendChild(resultCard);
}

// Create result card HTML
function createResultCard(result, title) {
    const card = document.createElement("div");
    card.className = "result-card";
    
    let associatedNumbersHtml = \'\';
    if (result.associated_numbers && result.associated_numbers.length > 0) {
        associatedNumbersHtml = \'<div class="info-item"><span class="info-label">Associated Numbers</span><div class="associated-numbers-list">\';
        result.associated_numbers.forEach(num => {
            associatedNumbersHtml += `<span class="associated-number">➤ ${num}</span>`;
        });
        associatedNumbersHtml += \'</div></div>\';
    }

    card.innerHTML = `
        <h4><i class="fas fa-phone"></i> ${title}</h4>
        <div class="result-info">
            <div class="info-item">
                <span class="info-label">Phone Number</span>
                <span class="info-value">${result.phone_number || \'N/A\'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Name</span>
                <span class="info-value">${result.name || \'N/A\'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">CNIC</span>
                <span class="info-value">${result.cnic || \'N/A\'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Address</span>
                <span class="info-value">${result.address || \'N/A\'}</span>
            </div>
            ${associatedNumbersHtml}
        </div>
    `;
    
    return card;
}

// Show error message
function showError(message) {
    console.log("Showing error:", message);
    hideAllSections();
    errorMessage.textContent = message;
    errorSection.classList.remove("hidden");
    resetSearchButton();
}

// Hide all sections
function hideAllSections() {
    console.log("Hiding all sections");
    loadingSection.classList.add("hidden");
    resultsSection.classList.add("hidden");
    errorSection.classList.add("hidden");
}

// Reset search button state
function resetSearchButton() {
    console.log("Resetting search button");
    searchBtn.disabled = false;
    searchBtn.innerHTML = \'<i class="fas fa-search"></i> Search\';
}

// Reset search form
function resetSearch() {
    console.log("Resetting search form");
    // phoneInput.value = ""; // Removed this line to keep the input value
    phoneInput.focus();
    hideAllSections();
    resetSearchButton();
}

// Utility function to show notifications (can be enhanced later)
function showNotification(message, type = "info") {
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Phone number validation
function isValidPhoneNumber(phoneNumber) {
    const cleanNumber = phoneNumber.replace(/[^\\d+]/g, "");
    const pakistaniMobileRegex = /^(?:\\+92|92|0)?3[0-9]{9}$/;
    const pakistaniLandlineRegex = /^(?:\\+92|92|0)?[2-9][0-9]{7,10}$/;
    
    return pakistaniMobileRegex.test(cleanNumber) || pakistaniLandlineRegex.test(cleanNumber);
}

// Enhanced search with validation
function validateAndSearch() {
    const phoneNumber = phoneInput.value.trim();
    
    if (!phoneNumber) {
        showError("Please enter a phone number to search.");
        return false;
    }
    
    if (!isValidPhoneNumber(phoneNumber)) {
        showError("Please enter a valid Pakistani phone number.");
        return false;
    }
    
    return true;
}

// Add some visual feedback for better UX
phoneInput.addEventListener("focus", function() {
    this.parentElement.style.transform = "scale(1.02)";
});

phoneInput.addEventListener("blur", function() {
    this.parentElement.style.transform = "scale(1)";
});

// Add loading animation enhancement
function enhanceLoadingAnimation() {
    const spinner = document.querySelector(".loading-spinner i");
    if (spinner) {
        spinner.style.animation = "spin 1s linear infinite";
    }
}

// Add CSS animation for spinner
const style = document.createElement("style");
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);




