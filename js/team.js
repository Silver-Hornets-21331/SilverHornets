// Load and display team members from JSON file
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('js/team.json');
        const teamData = await response.json();

        // Render leadership
        const leadershipGrid = document.getElementById('leadership-grid');
        if (leadershipGrid) {
            leadershipGrid.innerHTML = teamData.leadership.map(member => `
                <div class="team-member">
                    <img class="member-avatar" src="${member.image}" alt="${member.name} avatar">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                    <p>${member.description}</p>
                </div>
            `).join('');
        }

        // Render team members
        const membersGrid = document.getElementById('members-grid');
        if (membersGrid) {
            membersGrid.innerHTML = teamData.members.map(member => `
                <div class="team-member">
                    <img class="member-avatar" src="${member.image}" alt="${member.name} avatar">
                    <h3>${member.name}</h3>
                    <p>${member.role}</p>
                </div>
            `).join('');
        }

        // Render mentors
        const mentorsGrid = document.getElementById('mentors-grid');
        if (mentorsGrid) {
            mentorsGrid.innerHTML = teamData.mentors.map(mentor => `
                <div class="team-member">
                    <img class="member-avatar" src="${mentor.image}" alt="${mentor.name} avatar">
                    <h3>${mentor.name}</h3>
                    <p>${mentor.role}</p>
                    <p>${mentor.description}</p>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Error loading team data:', error);
    }
});
