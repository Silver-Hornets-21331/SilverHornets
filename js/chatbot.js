document.addEventListener('DOMContentLoaded', async () => {
    const chatbot = document.querySelector('.chatbot');
    if (!chatbot) return;

    const toggleButton = chatbot.querySelector('.chatbot-toggle');
    const panel = chatbot.querySelector('.chatbot-panel');
    const closeButton = chatbot.querySelector('.chatbot-close');
    const form = chatbot.querySelector('.chatbot-form');
    const input = chatbot.querySelector('.chatbot-input');
    const messages = chatbot.querySelector('.chatbot-messages');
    const botName = chatbot.dataset.botName || 'SHBot';

    // Load team data
    let teamData = { leadership: [], members: [], mentors: [] };
    try {
        const response = await fetch('js/team.json');
        teamData = await response.json();
    } catch (error) {
        console.log('Team data not available for chatbot');
    }

    const rules = [
        {
            keywords: ['mission', 'goal', 'purpose'],
            reply: 'Our mission is to inspire and prepare students for STEM careers through competitive robotics and teamwork.'
        },
        {
            keywords: ['ftc', 'first tech challenge'],
            reply: 'FTC is a robotics competition where students design, build, and program robots to compete in alliances.'
        },
        {
            keywords: ['outreach', 'community', 'events'],
            reply: 'We host outreach events, demos, and community STEM activities. See the Outreach page for highlights.'
        },
        {
            keywords: ['sponsor', 'sponsors', 'donate', 'support'],
            reply: 'Sponsors keep our team running. Visit the Sponsors page to learn how to support us.'
        },
        {
            keywords: ['contact', 'email', 'reach'],
            reply: 'You can reach us at ftc.team.boulan@gmail.com or via the Contact page. We are happy to connect with students, mentors, and sponsors.'
        },
        {
            keywords: ['members', 'join', 'team size', 'how many'],
            reply: () => {
                const totalMembers = teamData.leadership.length + teamData.members.length;
                return `We have ${totalMembers} team members, plus ${teamData.mentors.length} amazing mentors! Interested in joining? Check the Team page for details.`;
            }
        },
        {
            keywords: ['captain', 'leader', 'leadership', 'who leads'],
            reply: () => {
                if (teamData.leadership.length === 0) return 'Visit our Team page to meet our leadership!';
                const leaders = teamData.leadership.map(l => `${l.name} (${l.role})`).join(', ');
                return `Our leadership team includes: ${leaders}. They guide our team to success!`;
            }
        },
        {
            keywords: ['programming', 'coder', 'software', 'code'],
            reply: () => {
                const programmers = [...teamData.leadership, ...teamData.members].filter(m => 
                    m.role.toLowerCase().includes('programming') || m.role.toLowerCase().includes('software')
                );
                if (programmers.length === 0) return 'We have talented programmers on our team! Check the Team page to meet them.';
                return `Our programming team includes ${programmers.map(p => p.name).join(', ')}. They handle all our robot software and autonomous code!`;
            }
        },
        {
            keywords: ['mentor', 'coach', 'adult'],
            reply: () => {
                if (teamData.mentors.length === 0) return 'Our mentors guide us to excellence! See the Team page to learn more.';
                const mentorList = teamData.mentors.map(m => `${m.name} (${m.role})`).join(' and ');
                return `Our mentors are ${mentorList}. They provide invaluable guidance and support!`;
            }
        },
        {
            keywords: ['deshna', 'maydiga'],
            reply: () => {
                const deshna = [...teamData.leadership, ...teamData.members].find(m => 
                    m.name.toLowerCase().includes('deshna')
                );
                if (deshna) {
                    return `${deshna.name} is our ${deshna.role}. ${deshna.description || 'A key member of our team!'}`;
                }
                return 'You can meet all our team members on the Team page!';
            }
        },
        {
            keywords: ['roles', 'positions', 'what do you do', 'responsibilities'],
            reply: () => {
                const roles = [...new Set([...teamData.leadership, ...teamData.members].map(m => m.role))];
                if (roles.length === 0) return 'We have diverse roles including mechanical, programming, business, and more!';
                return `Our team has many roles including: ${roles.slice(0, 5).join(', ')}${roles.length > 5 ? ', and more' : ''}. Visit the Team page to see everyone!`;
            }
        },
        {
            keywords: ['mechanical', 'build', 'design', 'cad'],
            reply: () => {
                const mechanical = [...teamData.leadership, ...teamData.members].filter(m => 
                    m.role.toLowerCase().includes('mechanical') || 
                    m.role.toLowerCase().includes('design') || 
                    m.role.toLowerCase().includes('cad') ||
                    m.role.toLowerCase().includes('build')
                );
                if (mechanical.length === 0) return 'Our mechanical team designs and builds our amazing robots! Check the Team page for details.';
                return `Our mechanical and design team includes ${mechanical.map(p => p.name).join(', ')}. They create our robot designs and bring them to life!`;
            }
        },
        {
            keywords: ['electrical', 'wiring', 'electronics'],
            reply: () => {
                const electrical = [...teamData.leadership, ...teamData.members].filter(m => 
                    m.role.toLowerCase().includes('electrical') || m.role.toLowerCase().includes('electronics')
                );
                if (electrical.length === 0) return 'Our electrical team handles all robot wiring and electronics!';
                return `Our electrical team includes ${electrical.map(p => p.name).join(', ')}. They handle all our robot\'s electrical systems!`;
            }
        },
        {
            keywords: ['business', 'outreach', 'marketing', 'branding'],
            reply: () => {
                const business = [...teamData.leadership, ...teamData.members].filter(m => 
                    m.role.toLowerCase().includes('business') || 
                    m.role.toLowerCase().includes('outreach') ||
                    m.role.toLowerCase().includes('marketing') ||
                    m.role.toLowerCase().includes('branding')
                );
                if (business.length === 0) return 'Our business team handles outreach, sponsors, and community engagement!';
                return `Our business and outreach team includes ${business.map(p => p.name).join(', ')}. They handle sponsor relations and community outreach!`;
            }
        },
        {
            keywords: ['list all', 'everyone', 'all members', 'whole team'],
            reply: () => {
                const allMembers = [...teamData.leadership, ...teamData.members];
                if (allMembers.length === 0) return 'Visit the Team page to meet everyone!';
                const names = allMembers.map(m => m.name).slice(0, 8).join(', ');
                return `Here are some of our team members: ${names}${allMembers.length > 8 ? ', and more' : ''}! Visit the Team page to see the full roster.`;
            }
        },
        {
            keywords: ['hours', 'meeting', 'schedule'],
            reply: 'Meeting hours are listed on the Hours page. Let me know if you need help finding it.'
        },
        {
            keywords: ['hello', 'hi', 'hey'],
            reply: `Hi! I am ${botName}. Ask me about our team, members, outreach, or sponsors.`
        }
    ];

    const addMessage = (text, sender) => {
        const message = document.createElement('div');
        message.className = `chatbot-message ${sender}`;
        message.textContent = text;
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    };

    const getReply = (text) => {
        const normalized = text.toLowerCase();
        for (const rule of rules) {
            if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
                // Check if reply is a function or string
                return typeof rule.reply === 'function' ? rule.reply() : rule.reply;
            }
        }
        return 'I can help with questions about our team members, leadership, mentors, mission, outreach, sponsors, or meetings. What would you like to know?';
    };

    const openChat = () => {
        chatbot.classList.add('open');
        toggleButton.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        input.focus();
    };

    const closeChat = () => {
        chatbot.classList.remove('open');
        toggleButton.setAttribute('aria-expanded', 'false');
        panel.setAttribute('aria-hidden', 'true');
    };

    toggleButton.addEventListener('click', () => {
        if (chatbot.classList.contains('open')) {
            closeChat();
        } else {
            openChat();
        }
    });

    closeButton.addEventListener('click', closeChat);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeChat();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addMessage(text, 'user');
        input.value = '';
        const reply = getReply(text);
        setTimeout(() => addMessage(reply, 'bot'), 200);
    });

    addMessage(`Hi! I am ${botName}. Ask me about our team members, leadership, mentors, or anything else about FTC Team 21331!`, 'bot');
});
