document.addEventListener("DOMContentLoaded", () => {
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#38bdf8" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.3, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#818cf8",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } }, "push": { "particles_nb": 3 } }
            },
            "retina_detect": true
        });
    }

    const form = document.getElementById('feedback-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('span');
    const loader = document.getElementById('loader');
    const formMessage = document.getElementById('form-message');
    const apiUrl = `${window.PORTFOLIO_API_URL}/feedback`;

    async function parseResponse(response) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return response.json();
        }

        const text = await response.text();
        return { error: text || 'Unexpected server response.' };
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const comment = document.getElementById('comment').value;

        // UI Loading state
        submitBtn.disabled = true;
        btnText.style.opacity = '0';
        loader.style.display = 'block';
        formMessage.className = 'form-message';
        formMessage.textContent = '';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, comment })
            });

            const data = await parseResponse(response);

            if (response.ok) {
                formMessage.textContent = 'Thank you! Your feedback has been sent.';
                formMessage.classList.add('success');
                form.reset();
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            formMessage.textContent = error.message || 'Unable to send your message right now.';
            formMessage.classList.add('error');
        } finally {
            // Restore UI state
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            loader.style.display = 'none';
        }
    });
});
