// sponsors.js - Dynamic sponsor display
let sponsorData = {
    platinum: [],
    gold: [],
    silver: [],
    bronze: []
};

// Load sponsor data from JSON
async function loadSponsors() {
    try {
        const response = await fetch('js/sponsors.json');
        sponsorData = await response.json();
        displaySponsors();
    } catch (error) {
        console.error('Error loading sponsors:', error);
        displaySponsors(); // Display with empty data
    }
}

// Create sponsor card element
function createSponsorCard(sponsor) {
    const card = document.createElement('div');
    card.className = 'sponsor-logo-card';
    
    const link = document.createElement('a');
    link.href = sponsor.website;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.title = `${sponsor.name} - ${sponsor.description}`;
    
    const img = document.createElement('img');
    img.src = sponsor.logo;
    img.alt = `${sponsor.name} logo`;
    img.className = 'sponsor-logo';
    img.onerror = function() {
        // If image fails to load, display company name instead
        this.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.className = 'sponsor-fallback';
        fallback.textContent = sponsor.name;
        link.appendChild(fallback);
    };
    
    link.appendChild(img);
    card.appendChild(link);
    
    const name = document.createElement('p');
    name.className = 'sponsor-name';
    name.textContent = sponsor.name;
    card.appendChild(name);
    
    return card;
}

// Display sponsors organized by tier
function displaySponsors() {
    const tiers = ['platinum', 'gold', 'silver', 'bronze'];
    
    tiers.forEach(tier => {
        const container = document.getElementById(`${tier}-sponsors`);
        if (!container) return;
        
        container.innerHTML = '';
        
        const sponsors = sponsorData[tier] || [];
        
        if (sponsors.length === 0) {
            const placeholder = document.createElement('p');
            placeholder.className = 'sponsor-placeholder';
            placeholder.textContent = `Become our first ${tier.charAt(0).toUpperCase() + tier.slice(1)} sponsor!`;
            container.appendChild(placeholder);
        } else {
            sponsors.forEach(sponsor => {
                const card = createSponsorCard(sponsor);
                container.appendChild(card);
            });
        }
    });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', loadSponsors);
