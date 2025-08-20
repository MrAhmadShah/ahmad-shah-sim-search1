// Simple script for testing
console.log("Simple script loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM Content Loaded - Simple script");
    
    const phoneInput = document.getElementById("phoneInput");
    const searchBtn = document.getElementById("searchBtn");
    const loadingSection = document.getElementById("loadingSection");
    const resultsSection = document.getElementById("resultsSection");
    const errorSection = document.getElementById("errorSection");
    const resultsContent = document.getElementById("resultsContent");
    const errorMessage = document.getElementById("errorMessage");
    
    console.log("Elements found:", {
        phoneInput: !!phoneInput,
        searchBtn: !!searchBtn,
        loadingSection: !!loadingSection
    });
    
    if (searchBtn) {
        searchBtn.addEventListener("click", async function() {
            console.log("Search button clicked!");
            const phoneNumber = phoneInput.value.trim();
            console.log("Phone number:", phoneNumber);
            
            if (!phoneNumber) {
                showError("Please enter a phone number to search.");
                return;
            }
            
            showLoading();
            
            try {
                console.log("Making API request...");
                const response = await fetch(`/api/search?number=${encodeURIComponent(phoneNumber)}`);
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
        });
    }
    
    function showLoading() {
        console.log("Showing loading");
        hideAllSections();
        if (loadingSection) {
            loadingSection.classList.remove("hidden");
        }
        if (searchBtn) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        }
    }
    
    function showResults(data) {
        console.log("Showing results", data);
        hideAllSections();
        
        if (resultsContent && data.data) {
            resultsContent.innerHTML = `
                <div class="result-card">
                    <h4><i class="fas fa-phone"></i> SIM Information Result</h4>
                    <div class="result-info">
                        <div class="info-item">
                            <span class="info-label">Phone Number</span>
                            <span class="info-value">${data.data.phone_number || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Name</span>
                            <span class="info-value">${data.data.name || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">CNIC</span>
                            <span class="info-value">${data.data.cnic || 'N/A'}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Address</span>
                            <span class="info-value">${data.data.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        if (resultsSection) {
            resultsSection.classList.remove("hidden");
        }
        resetSearchButton();
    }
    
    function showError(message) {
        console.log("Showing error:", message);
        hideAllSections();
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        if (errorSection) {
            errorSection.classList.remove("hidden");
        }
        resetSearchButton();
    }
    
    function hideAllSections() {
        if (loadingSection) loadingSection.classList.add("hidden");
        if (resultsSection) resultsSection.classList.add("hidden");
        if (errorSection) errorSection.classList.add("hidden");
    }
    
    function resetSearchButton() {
        if (searchBtn) {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
        }
    }
});

