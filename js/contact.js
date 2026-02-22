document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const notice = document.getElementById('contact-notice');
    const destinationEmail = 'ftc.team.boulan@gmail.com';

    if (!contactForm) return;

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const subject = String(formData.get('subject') || '').trim();
        const message = String(formData.get('message') || '').trim();

        if (!name || !email || !subject || !message) {
            showNotice('Please fill in all required fields before sending.', 'error');
            return;
        }

        const emailBody = [
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            'Message:',
            message
        ].join('\n');

        const mailtoUrl = `mailto:${destinationEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

        window.location.href = mailtoUrl;
        showNotice('Your email app should open with a pre-filled message. If it does not, email us directly at ftc.team.boulan@gmail.com.', 'success');
        contactForm.reset();
    });

    function showNotice(message, type) {
        if (!notice) return;
        notice.textContent = message;
        notice.classList.remove('error', 'success');
        if (type) {
            notice.classList.add(type);
        }
        notice.style.display = 'block';
    }
});
