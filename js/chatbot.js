document.addEventListener('DOMContentLoaded', () => {
    const chatbot = document.querySelector('.chatbot');
    if (!chatbot) return;

    const toggleButton = chatbot.querySelector('.chatbot-toggle');
    const panel = chatbot.querySelector('.chatbot-panel');
    const closeButton = chatbot.querySelector('.chatbot-close');
    const form = chatbot.querySelector('.chatbot-form');
    const input = chatbot.querySelector('.chatbot-input');
    const messages = chatbot.querySelector('.chatbot-messages');
    const botName = chatbot.dataset.botName || 'SHBot';

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
            reply: 'You can reach us via the Contact page. We are happy to connect with students, mentors, and sponsors.'
        },
        {
            keywords: ['members', 'join', 'team'],
            reply: 'Interested in joining? Check the Members page for details and eligibility.'
        },
        {
            keywords: ['hours', 'meeting', 'schedule'],
            reply: 'Meeting hours are listed on the Hours page. Let me know if you need help finding it.'
        },
        {
            keywords: ['hello', 'hi', 'hey'],
            reply: `Hi! I am ${botName}. Ask me about our team, outreach, or sponsors.`
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
                return rule.reply;
            }
        }
        return 'I can help with questions about mission, outreach, sponsors, or meetings. Try one of those!';
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

    addMessage(`Hi! I am ${botName}. Ask me about the team or FTC.`, 'bot');
});
