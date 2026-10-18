document.addEventListener('DOMContentLoaded', async () => {
    const robotsGrid = document.getElementById('robots-grid');
    if (!robotsGrid) return;

    try {
        const response = await fetch('js/robots.json');
        if (!response.ok) throw new Error(`Robot data request failed: ${response.status}`);

        const data = await response.json();
        data.robots.forEach(robot => {
            const card = document.createElement('article');
            card.className = 'robot-card';

            const imageContainer = document.createElement('div');
            imageContainer.className = 'robot-image-placeholder';

            const image = document.createElement('img');
            image.src = robot.image;
            image.alt = `${robot.season} ${robot.name}`;

            const placeholder = document.createElement('div');
            placeholder.className = 'robot-placeholder-icon';
            placeholder.textContent = 'Robot image unavailable';
            placeholder.hidden = true;

            image.addEventListener('error', () => {
                if (image.dataset.usingFallback !== 'true') {
                    image.dataset.usingFallback = 'true';
                    image.src = 'images/robot-2025.png';
                    image.alt = 'Default Silver Hornets robot image';
                    return;
                }

                image.hidden = true;
                placeholder.hidden = false;
            });

            imageContainer.append(image, placeholder);

            if (robot.name === 'Current Robot') {
                const shotSequence = document.createElement('div');
                shotSequence.className = 'robot-shot-sequence';
                shotSequence.setAttribute('aria-hidden', 'true');

                for (let ballNumber = 1; ballNumber <= 4; ballNumber += 1) {
                    const ball = document.createElement('span');
                    ball.className = `robot-ball robot-ball-${ballNumber}`;
                    shotSequence.appendChild(ball);
                }

                imageContainer.appendChild(shotSequence);
            }

            const info = document.createElement('div');
            info.className = 'robot-info';

            const season = document.createElement('h3');
            season.textContent = robot.season;

            const name = document.createElement('p');
            name.className = 'robot-name';
            name.textContent = robot.name;

            const description = document.createElement('p');
            description.textContent = robot.description;

            const features = document.createElement('ul');
            features.className = 'robot-features';
            robot.features.forEach(feature => {
                const item = document.createElement('li');
                item.textContent = feature;
                features.appendChild(item);
            });

            info.append(season, name, description, features);
            card.append(imageContainer, info);
            robotsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading robot data:', error);
        robotsGrid.textContent = 'Robot information is temporarily unavailable.';
    }
});