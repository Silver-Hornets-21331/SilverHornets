// Load and display upcoming events from events.json
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('js/events.json');
        const data = await response.json();
        displayEvents(data.events);
    } catch (error) {
        console.error('Error loading events:', error);
    }
});

function displayEvents(events) {
    const eventList = document.querySelector('.event-list');
    if (!eventList) return;
    
    // Sort events by start date in ascending order (earliest first)
    const sortedEvents = [...events].sort((a, b) => {
        const firstDate = parseEventDate(a.date);
        const secondDate = parseEventDate(b.date);
        return firstDate - secondDate;
    });
    
    // Filter to show only upcoming events (from today onwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEvents = sortedEvents.filter(event => parseEventDate(event.date) >= today);
    
    // Clear existing events
    eventList.innerHTML = '';
    
    // If no upcoming events, show a message
    if (upcomingEvents.length === 0) {
        eventList.innerHTML = '<p style="text-align: center; color: #666;">No upcoming events scheduled. Check back soon!</p>';
        return;
    }
    
    // Display events
    upcomingEvents.forEach(event => {
        const eventItem = createEventItem(event);
        eventList.appendChild(eventItem);
    });
}

function parseEventDate(dateString) {
    if (!dateString) return new Date(8640000000000000);
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return new Date(8640000000000000);
    return new Date(year, month - 1, day);
}

function createEventItem(event) {
    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';
    
    // Format date for display (e.g., "Feb 22" or "Feb 22-23")
    const dateStr = formatEventDate(event.date, event.endDate);
    
    // Add type badge if available
    const typeBadge = event.type ? `<span class="event-type-badge ${event.type}">${event.type}</span>` : '';
    
    eventItem.innerHTML = `
        <span class="pill">${dateStr}</span>
        <div>
            <h3>${event.title} ${typeBadge}</h3>
            <p>${event.description}</p>
            ${event.location ? `<p class="event-location">📍 ${event.location}</p>` : ''}
            ${event.link ? `<a href="${event.link}" class="event-link" target="_blank">Learn More →</a>` : ''}
        </div>
    `;
    
    return eventItem;
}

function formatEventDate(startDate, endDate) {
    const start = new Date(startDate);
    const options = { month: 'short', day: 'numeric' };
    let dateStr = start.toLocaleDateString('en-US', options);
    
    // If there's an end date and it's different from start date, show range
    if (endDate) {
        const end = new Date(endDate);
        if (start.toDateString() !== end.toDateString()) {
            // Same month: "Feb 22-23"
            if (start.getMonth() === end.getMonth()) {
                dateStr = `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()}-${end.getDate()}`;
            } else {
                // Different month: "Feb 28 - Mar 1"
                dateStr = `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
            }
        }
    }
    
    return dateStr;
}
