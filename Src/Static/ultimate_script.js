// AhMaD Shah - Ultimate Hacker Sim Search JavaScript with Multi-Color Effects

class UltimateHackerSimSearch {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.startMatrixRain();
        this.startLightningEffects();
        this.initializeGlitchEffects();
        this.startColorCycling();
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

        // Enhanced typing effects
        this.phoneInput.addEventListener('input', () => this.playTypingEffect());
        this.phoneInput.addEventListener('focus', () => this.onInputFocus());
        this.phoneInput.addEventListener('blur', () => this.onInputBlur());
    }

    playTypingEffect() {
        // Enhanced visual feedback for typing with rainbow effects
        this.phoneInput.style.transform = 'scale(1.02)';
        this.phoneInput.style.boxShadow = '0 0 30px #fff, inset 0 0 30px rgba(255, 255, 255, 0.3)';
        setTimeout(() => {
            this.phoneInput.style.transform = 'scale(1)';
            this.phoneInput.style.boxShadow = '';
        }, 150);
    }

    onInputFocus() {
        this.triggerLightningStorm();
        this.phoneInput.style.animation = 'input-focus-rainbow 2s ease-in-out infinite';
    }

    onInputBlur() {
        this.phoneInput.style.animation = 'input-rainbow-border 5s ease-in-out infinite';
    }

    async performSearch() {
        const phoneNumber = this.phoneInput.value.trim();
        
        if (!phoneNumber) {
            this.showError('Please enter a phone number or CNIC to hack');
            return;
        }

        // Validate input
        if (!this.validateInput(phoneNumber)) {
            this.showError('Invalid format. Please enter a valid Pakistani mobile number or 13-digit CNIC');
            return;
        }

        this.showLoading();
        this.triggerLightningStorm();
        this.shakeScreen();

        try {
            const response = await fetch(`/api/search?number=${encodeURIComponent(phoneNumber)}`);
            const data = await response.json();

            if (data.success && data.data) {
                this.showResults(data.data);
                this.celebrateSuccess();
            } else {
                this.showError(data.message || 'Target not found in database');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Connection to hacker database failed. Retry hack.');
        }
    }

    validateInput(input) {
        // Remove all non-digit characters except +
        const cleaned = input.replace(/[^\d+]/g, '');
        
        // Check if it's a CNIC (13 digits)
        if (cleaned.length === 13 && cleaned.match(/^\d{13}$/)) {
            return true;
        }
        
        // Check if it's a Pakistani mobile number
        if (cleaned.match(/^(\+92|92|0)?3\d{9}$/)) {
            return true;
        }
        
        // Check if it's an international format
        if (cleaned.match(/^\+92\d{10}$/)) {
            return true;
        }
        
        return false;
    }

    showLoading() {
        this.hideAllSections();
        this.loadingSection.classList.remove('hidden');
        this.searchBtn.disabled = true;
        this.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> HACKING...';
        
        // Add dramatic loading effects
        this.startIntenseMatrixRain();
    }

    showResults(data) {
        this.hideAllSections();
        this.resultsSection.classList.remove('hidden');
        this.searchBtn.disabled = false;
        this.searchBtn.innerHTML = '<i class="fas fa-search"></i> HACK SEARCH';

        // Determine if input was CNIC or phone number
        const inputType = data.phone_number && data.phone_number.length === 13 ? 'CNIC' : 'Phone Number';

        // Populate result information with enhanced display
        this.resultInfo.innerHTML = `
            <div class="info-item">
                <div class="info-label"><i class="fas fa-${inputType === 'CNIC' ? 'id-card' : 'phone'}"></i> Search Type</div>
                <div class="info-value">${inputType} Search</div>
            </div>
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
            <div class="info-item" style="grid-column: 1 / -1;">
                <div class="info-label"><i class="fas fa-map-marker-alt"></i> Address Intel</div>
                <div class="info-value">${data.address || 'N/A'}</div>
            </div>
            ${data.associated_numbers && data.associated_numbers.length > 0 ? `
                <div class="info-item" style="grid-column: 1 / -1;">
                    <div class="info-label"><i class="fas fa-network-wired"></i> Associated Numbers (${data.associated_numbers.length})</div>
                    <div class="associated-numbers-list">
                        ${data.associated_numbers.map((number, index) => 
                            `<div class="associated-number" onclick="ultimateHackerApp.searchAssociatedNumber('${number}')" style="animation-delay: ${index * 0.1}s">
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
        
        // Add error effects
        this.triggerErrorEffects();
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
        this.stopIntenseMatrixRain();
    }

    animateResults() {
        const resultCard = document.querySelector('.result-card');
        resultCard.style.opacity = '0';
        resultCard.style.transform = 'perspective(800px) rotateX(15deg) translateY(50px)';
        
        setTimeout(() => {
            resultCard.style.transition = 'all 0.8s ease-out';
            resultCard.style.opacity = '1';
            resultCard.style.transform = 'perspective(800px) rotateX(3deg) translateY(0)';
        }, 100);

        // Animate associated numbers
        const associatedNumbers = document.querySelectorAll('.associated-number');
        associatedNumbers.forEach((number, index) => {
            setTimeout(() => {
                number.style.transform = 'translateX(0) scale(1)';
                number.style.opacity = '1';
            }, 200 + (index * 100));
        });
    }

    celebrateSuccess() {
        // Create celebration effects
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createLightningBolt();
            }, i * 50);
        }
        this.shakeScreen();
    }

    triggerErrorEffects() {
        // Create red lightning for errors
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createErrorLightning();
            }, i * 100);
        }
    }

    // Enhanced Matrix Rain Effect
    startMatrixRain() {
        this.matrixInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) {
                this.createMatrixColumn();
            }
        }, 200);
    }

    startIntenseMatrixRain() {
        this.stopMatrixRain();
        this.intensiveMatrixInterval = setInterval(() => {
            for (let i = 0; i < 8; i++) {
                this.createMatrixColumn();
            }
        }, 100);
    }

    stopIntenseMatrixRain() {
        if (this.intensiveMatrixInterval) {
            clearInterval(this.intensiveMatrixInterval);
        }
        this.startMatrixRain();
    }

    stopMatrixRain() {
        if (this.matrixInterval) {
            clearInterval(this.matrixInterval);
        }
    }

    createMatrixColumn() {
        const column = document.createElement('div');
        column.className = 'matrix-rain';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.fontSize = (Math.random() * 10 + 10) + 'px';
        column.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Enhanced character set with more variety
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let text = '';
        for (let i = 0; i < Math.random() * 25 + 15; i++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        this.matrixBg.appendChild(column);
        
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, 6000);
    }

    // Enhanced Lightning Effects
    startLightningEffects() {
        setInterval(() => {
            if (Math.random() < 0.15) { // 15% chance every interval
                this.createLightningBolt();
            }
        }, 800);
    }

    createLightningBolt() {
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.style.left = Math.random() * 100 + '%';
        bolt.style.height = Math.random() * 400 + 150 + 'px';
        bolt.style.top = Math.random() * 60 + '%';
        bolt.style.animationDelay = Math.random() * 0.5 + 's';
        
        // Random color lightning
        const colors = ['#fff', '#00ffff', '#ff00ff', '#ffff00', '#ff0040'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        bolt.style.background = `linear-gradient(to bottom, ${color}, transparent)`;
        bolt.style.boxShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
        
        this.lightningBg.appendChild(bolt);
        
        setTimeout(() => {
            if (bolt.parentNode) {
                bolt.parentNode.removeChild(bolt);
            }
        }, 1000);
    }

    createErrorLightning() {
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.style.left = Math.random() * 100 + '%';
        bolt.style.height = Math.random() * 300 + 100 + 'px';
        bolt.style.top = Math.random() * 50 + '%';
        bolt.style.background = 'linear-gradient(to bottom, #ff0040, transparent)';
        bolt.style.boxShadow = '0 0 10px #ff0040, 0 0 20px #ff0040, 0 0 30px #ff0040';
        
        this.lightningBg.appendChild(bolt);
        
        setTimeout(() => {
            if (bolt.parentNode) {
                bolt.parentNode.removeChild(bolt);
            }
        }, 800);
    }

    triggerLightningStorm() {
        // Create multiple lightning bolts during search
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createLightningBolt();
            }, i * 80);
        }
    }

    // Enhanced Glitch Effects
    initializeGlitchEffects() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            setInterval(() => {
                if (Math.random() < 0.15) { // 15% chance
                    element.style.animation = 'none';
                    setTimeout(() => {
                        element.style.animation = 'glitch 2s infinite';
                    }, 50);
                }
            }, 1500);
        });
    }

    // Color Cycling Effects
    startColorCycling() {
        // Add dynamic color cycling to various elements
        setInterval(() => {
            this.cycleColors();
        }, 100);
    }

    cycleColors() {
        // This function can be used to add additional dynamic color effects
        // Currently handled by CSS animations, but can be extended here
    }

    // Enhanced screen shake effect
    shakeScreen() {
        document.body.style.animation = 'shake 0.8s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 800);
    }

    // Add particle effects
    createParticleEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#00ffff';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50 + Math.random() * 50;
            
            document.body.appendChild(particle);
            
            let posX = x;
            let posY = y;
            let opacity = 1;
            
            const animate = () => {
                posX += Math.cos(angle) * velocity * 0.02;
                posY += Math.sin(angle) * velocity * 0.02;
                opacity -= 0.02;
                
                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            animate();
        }
    }
}

// Add enhanced shake animation to CSS dynamically
const enhancedShakeStyle = document.createElement('style');
enhancedShakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0) translateY(0); }
        10% { transform: translateX(-3px) translateY(-2px); }
        20% { transform: translateX(3px) translateY(2px); }
        30% { transform: translateX(-3px) translateY(-2px); }
        40% { transform: translateX(3px) translateY(2px); }
        50% { transform: translateX(-2px) translateY(-1px); }
        60% { transform: translateX(2px) translateY(1px); }
        70% { transform: translateX(-2px) translateY(-1px); }
        80% { transform: translateX(2px) translateY(1px); }
        90% { transform: translateX(-1px) translateY(0px); }
    }
`;
document.head.appendChild(enhancedShakeStyle);

// Initialize the application
let ultimateHackerApp;
document.addEventListener('DOMContentLoaded', () => {
    ultimateHackerApp = new UltimateHackerSimSearch();
    console.log('%c🔥🔥🔥 AHMAD SHAH ULTIMATE HACKER SIM SEARCH 🔥🔥🔥', 'color: #ff0040; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff0040;');
    console.log('%c⚡ ULTIMATE SYSTEM INITIALIZED ⚡', 'color: #00ffff; font-size: 18px; font-weight: bold;');
    console.log('%c🌊 ENHANCED MATRIX PROTOCOLS ACTIVE 🌊', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
    console.log('%c🎨 MULTI-COLOR EFFECTS ENABLED 🎨', 'color: #ffff00; font-size: 14px; font-weight: bold;');
    console.log('%c💫 LIGHT TRAVELING ANIMATIONS ACTIVE 💫', 'color: #00ff00; font-size: 14px; font-weight: bold;');
});

// Add click particle effects
document.addEventListener('click', (e) => {
    if (ultimateHackerApp) {
        ultimateHackerApp.createParticleEffect(e.clientX, e.clientY);
    }
});

