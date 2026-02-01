// Letter content
const letterContent = `Sophia, my love, I can only be so lucky to walk through Paris at night with someone as beautiful, both inside and out, as you are. There's something about the way you amplify every aspect of the beauty around you, bringing it to life even in the quiet moments.

I can't wait to go to a café in the morning and have you across the table from me. I imagine that same effect—the world slowing down just for us—will be even more evident when I'm with you.

I've made so many friends and relationships in my life, but my favorite one is ours. I can't believe how far we've come from that bonfire, and I couldn't be happier with where things have gone.

I always hated the clichés of love in stories, and yet here we are, bound for Paris with a girl who showed me I could love this much. But honestly, regardless of the place, wherever you are feels more like home to me. You're my favorite place, Sophia—my favorite view, my favorite moment, my favorite everything.

And after never having someone like you in my life, it's become such an easy decision who I want to spend this, and every other holiday, with. And (even though I already asked), in this I’m asking you to make this Valentine's Day ours. I want to experience the "city of love" with the love of my life.

You're my everything, baby. I love you so much.`;

// Elements
const letterTextEl = document.getElementById('letter-text');
const skipBtn = document.getElementById('skip-btn');
const questionSection = document.getElementById('question-section');
const yesHeartBtn = document.getElementById('yes-heart');
const yesCroissantBtn = document.getElementById('yes-croissant');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const toast = document.getElementById('toast');
const countdownTextEl = document.getElementById('countdown-text');
const heartCanvas = document.getElementById('heart-canvas');

// Typewriter state
let typewriterIndex = 0;
let typewriterInterval = null;
let isTypewriterComplete = false;

// Initialize
function init() {
    setupCountdown();
    startTypewriter();
    setupEventListeners();
    setupCanvas();
}

// Countdown to next Valentine's Day
function setupCountdown() {
    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let valentinesDay = new Date(currentYear, 1, 14); // Feb 14

        // If Valentine's Day has passed this year, target next year
        if (now > valentinesDay) {
            valentinesDay = new Date(currentYear + 1, 1, 14);
        }

        const diff = valentinesDay - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        countdownTextEl.textContent = `${days}d ${hours}h ${minutes}m`;
    }

    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
}

// Typewriter effect
function startTypewriter() {
    const speed = 30; // milliseconds per character

    typewriterInterval = setInterval(() => {
        if (typewriterIndex < letterContent.length) {
            letterTextEl.textContent = letterContent.slice(0, typewriterIndex + 1);
            typewriterIndex++;
        } else {
            completeTypewriter();
        }
    }, speed);
}

function completeTypewriter() {
    clearInterval(typewriterInterval);
    letterTextEl.textContent = letterContent;
    isTypewriterComplete = true;
    skipBtn.classList.add('hidden');
    questionSection.classList.add('visible');
}

// Event listeners
function setupEventListeners() {
    // Skip button
    skipBtn.addEventListener('click', () => {
        if (!isTypewriterComplete) {
            clearInterval(typewriterInterval);
            completeTypewriter();
        }
    });

    // Yes buttons
    yesHeartBtn.addEventListener('click', () => handleYesClick('YES 💖'));
    yesCroissantBtn.addEventListener('click', () => handleYesClick('YES 🥐'));

    // Modal close
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

// Handle YES button click
function handleYesClick(choice) {
    // Save to localStorage
    const data = {
        valentineAccepted: true,
        chosenYes: choice,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('parisValentine', JSON.stringify(data));

    // Show modal
    modalOverlay.classList.add('active');

    // Trigger heart burst
    triggerHeartBurst();

    // Show toast
    showToast();

    // Focus modal close button for accessibility
    setTimeout(() => {
        modalClose.focus();
    }, 100);
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('active');
}

// Show toast notification
function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Canvas setup
function setupCanvas() {
    heartCanvas.width = window.innerWidth;
    heartCanvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        heartCanvas.width = window.innerWidth;
        heartCanvas.height = window.innerHeight;
    });
}

// Heart burst animation
function triggerHeartBurst() {
    const ctx = heartCanvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Skip animation if user prefers reduced motion
        return;
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 1,
            size: Math.random() * 20 + 10,
            emoji: Math.random() > 0.5 ? '💖' : '💘'
        });
    }

    // Animate particles
    function animate() {
        ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);

        let activeParticles = 0;

        particles.forEach(p => {
            if (p.life > 0) {
                activeParticles++;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravity
                p.life -= 0.015;

                // Draw emoji
                ctx.globalAlpha = p.life;
                ctx.font = `${p.size}px serif`;
                ctx.fillText(p.emoji, p.x, p.y);
            }
        });

        ctx.globalAlpha = 1;

        if (activeParticles > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
        }
    }

    animate();
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
