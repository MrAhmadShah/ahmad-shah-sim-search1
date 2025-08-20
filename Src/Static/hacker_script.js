// AhMaD Shah - Hacker Sim Search JavaScript with 3D Effects and Lightning

class HackerSimSearch {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.startMatrixRain();
        this.startLightningEffects();
        this.initializeGlitchEffects();
    }

    initializeElements() {
        this.phoneInput = document.getElementById('phoneInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchSection = document.getElementById('searchSection');
        this.loadingSection = document.getElementById('loadingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');
        this.resultInfo = document.getElementById('resultInfo');
        this.errorMessage = document.getElementById('errorMessage');
        this.newSearchBtn = document.getElementById('newSearchBtn');
        this.retryBtn = document.getElementById('retryBtn');
        this.matrixBg = document.getElementById('matrixBg');
        this.lightningBg = document.getElementById('lightningBg');
    }

    setupEventListeners() {
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.phoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        this.newSearchBtn.addEventListener('click', () => this.resetSearch());
        this.retryBtn.addEventListener('click', () => this.resetSearch());

        // Add typing sound effect simulation
        this.phoneInput.addEventListener('input', () => this.playTypingEffect());
    }

    playTypingEffect() {
        // Visual feedback for typing
        this.phoneInput.style.boxShadow = '0 0 25px #00ffff, inset 0 0 25px rgba(0, 255, 255, 0.3)';
        setTimeout(() => {
            this.phoneInput.style.boxShadow = '0 0 20px #00ffff, inset 0 0 20px rgba(0, 255, 255, 0.2)';
        }, 100);
    }

    async performSearch() {
        const phoneNumber = this.phoneInput.value.trim();
        
        if (!phoneNumber) {
            this.showError('Please enter a phone number or CNIC to hack');
            return;
        }

        this.showLoading();
        this.triggerLightningStorm();

        try {
            const response = await fetch(`/api/search?number=${encodeURIComponent(phoneNumber)}`);
            const data = await response.json();

            if (data.success && data.data) {
                this.showResults(data.data);
            } else {
                this.showError(data.message || 'Target not found in database');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Connection to hacker database failed. Retry hack.');
        }
    }

    showLoading() {
        this.hideAllSections();
        this.loadingSection.classList.remove('hidden');
        this.searchBtn.disabled = true;
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> HACKING...';
    }

    showResults(data) {
        this.hideAllSections();
        this.resultsSection.classList.remove('hidden');
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> HACK SEARCH';

        // Populate result information
        this.resultInfo.innerHTML = `
            <div class="info-item">
                <div class="info-label"><i class="fas fa-phone"></i> Phone Number</div>
                <div class="info-value">${data.phone_number || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fas fa-user"></i> Target Name</div>
                <div class="info-value">${data.name || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fas fa-id-card"></i> CNIC</div>
                <div class="info-value">${data.cnic || 'N/A'}</div>
            </div>
            <div class="info-item">
                <div class="info-label"><i class="fas fa-map-marker-alt"></i> Address Intel</div>
                <div class="info-value">${data.address || 'N/A'}</div>
            </div>
            ${data.associated_numbers && data.associated_numbers.length > 0 ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                    <div class="info-label"><i class="fas fa-network-wired"></i> Associated Numbers</div>
                    <div class="associated-numbers-list">
                        ${data.associated_numbers.map(number => 
                            `<div class="associated-number" onclick="hackerApp.searchAssociatedNumber('${number}')">
                                <i class="fas fa-link"></i> ${number}
                            </div>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
        `;

        // Add result animation
        this.animateResults();
    }

    searchAssociatedNumber(number) {
        this.phoneInput.value = number;
        this.performSearch();
    }

    showError(message) {
        this.hideAllSections();
        this.errorSection.classList.remove('hidden');
        this.errorMessage.textContent = message;
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> HACK SEARCH';
    }

    hideAllSections() {
        this.loadingSection.classList.add('hidden');
        this.resultsSection.classList.add('hidden');
        this.errorSection.classList.add('hidden');
    }

    resetSearch() {
        this.hideAllSections();
        this.phoneInput.value = '';
        this.phoneInput.focus();
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> HACK SEARCH';
    }

    animateResults() {
        const resultCard = document.querySelector('.result-card');
        resultCard.style.opacity = '0';
        resultCard.style.transform = 'perspective(800px) rotateX(15deg) translateY(50px)';
        
        setTimeout(() => {
            resultCard.style.transition = 'all 0.6s ease-out';
            resultCard.style.opacity = '1';
            resultCard.style.transform = 'perspective(800px) rotateX(3deg) translateY(0)';
        }, 100);
    }

    // Matrix Rain Effect
    startMatrixRain() {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        setInterval(() => {
            for (let i = 0; i < 3; i++) {
                this.createMatrixColumn();
            }
        }, 200);
    }

    createMatrixColumn() {
        const column = document.createElement('div');
        column.className = 'matrix-rain';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.fontSize = (Math.random() * 10 + 10) + 'px';
        column.style.opacity = Math.random() * 0.7 + 0.3;
        
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let text = '';
        for (let i = 0; i < Math.random() * 20 + 10; i++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        this.matrixBg.appendChild(column);
        
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, 5000);
    }

    // Lightning Effects
    startLightningEffects() {
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.createLightningBolt();
            }
        }, 1000);
    }

    createLightningBolt() {
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.style.left = Math.random() * 100 + '%';
        bolt.style.height = Math.random() * 300 + 100 + 'px';
        bolt.style.top = Math.random() * 50 + '%';
        bolt.style.animationDelay = Math.random() * 0.5 + 's';
        
        this.lightningBg.appendChild(bolt);
        
        setTimeout(() => {
            if (bolt.parentNode) {
                bolt.parentNode.removeChild(bolt);
            }
        }, 1000);
    }

    triggerLightningStorm() {
        // Create multiple lightning bolts during search
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createLightningBolt();
            }, i * 100);
        }
    }

    // Glitch Effects
    initializeGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.1) { // 10% chance
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = 'glitch 2s infinite';
                    }, 50);
                }
            }, 2000);
        });
    }

    // Add screen shake effect during intense operations
    shakeScreen() {
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
}

// Add shake animation to CSS dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
`;
document.head.appendChild(shakeStyle);

// Initialize the application
let hackerApp;
document.addEventListener('DOMContentLoaded', () => {
    hackerApp = new HackerSimSearch();
    console.log('🔥 AhMaD Shah Hacker Sim Search - System Online 🔥');
    console.log('⚡ Lightning effects activated ⚡');
    console.log('🌊 Matrix rain initialized 🌊');
});

// Add some console styling for the hacker theme
console.log('%c🔥 AHMAD SHAH HACKER SIM SEARCH 🔥', 'color: #00ff00; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00ff00;');
console.log('%c⚡ SYSTEM INITIALIZED ⚡', 'color: #00ffff; font-size: 16px; font-weight: bold;');
console.log('%c🌊 MATRIX PROTOCOLS ACTIVE 🌊', 'color: #ff00ff; font-size: 14px; font-weight: bold;');

