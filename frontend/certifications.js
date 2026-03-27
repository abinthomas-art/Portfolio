document.addEventListener("DOMContentLoaded", () => {
    if (typeof particlesJS !== "undefined") {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#38bdf8", "#818cf8", "#c084fc"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 4, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1, "direction": "top", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" } },
                "modes": { "bubble": { "distance": 200, "size": 6, "duration": 0.3, "opacity": 1 }, "repulse": { "distance": 200, "duration": 0.4 } }
            },
            "retina_detect": true
        });
    }

    const cards = document.querySelectorAll('.cert-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.1}s`;
    });
});
