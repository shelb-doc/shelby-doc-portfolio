/**
 * Rubber Duck Easter Egg Module
 * Interactive rubber duck debugging companion with sound effects
 */

const duck = document.getElementById('rubberDuck');
let quackCount = 0;

// Quack sounds (using Web Audio API to generate duck-like sounds)
function playQuack() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Duck-like quack frequency
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Show quack text
function showQuackText() {
    const quackText = document.createElement('div');
    quackText.textContent = 'QUACK!';
    quackText.style.cssText = `
        position: fixed;
        bottom: 7rem;
        right: 3rem;
        color: #9b7ab8;
        font-size: 1.5rem;
        font-weight: 700;
        font-family: 'Urbanist', sans-serif;
        animation: quackFloat 0.8s ease-out;
        pointer-events: none;
        z-index: 10000;
        text-shadow: 0 0 10px rgba(155, 122, 184, 0.5);
    `;

    document.body.appendChild(quackText);

    setTimeout(() => {
        quackText.remove();
    }, 800);
}

// Add floating animation
const style = document.createElement('style');
style.textContent = `
    @keyframes quackFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translateY(-30px) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translateY(-60px) scale(1);
        }
    }

    @keyframes duckBounce {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-15px) rotate(-5deg);
        }
        75% {
            transform: translateY(-5px) rotate(5deg);
        }
    }

    @keyframes duckSpin {
        0% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(90deg) scale(1.2); }
        50% { transform: rotate(180deg) scale(1); }
        75% { transform: rotate(270deg) scale(1.2); }
        100% { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(style);

// Click handler
duck.addEventListener('click', function(e) {
    e.preventDefault();
    quackCount++;

    // Play quack sound
    playQuack();

    // Show quack text
    showQuackText();

    // Bounce animation
    duck.style.animation = 'duckBounce 0.5s ease-out';

    // Special animation every 5 quacks
    if (quackCount % 5 === 0) {
        duck.style.animation = 'duckSpin 1s ease-in-out';
    }

    setTimeout(() => {
        duck.style.animation = '';
    }, 1000);
});

// Hover effect
duck.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.filter = 'drop-shadow(0 6px 12px rgba(155, 122, 184, 0.6))';
});

duck.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.filter = 'drop-shadow(0 4px 8px rgba(155, 122, 184, 0.4))';
});
