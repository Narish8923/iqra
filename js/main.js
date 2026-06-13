/* ============================================
   IQRA'S BIRTHDAY WEBSITE — Global JS (main.js)
   Shared interactions, cursor trails, page trans,
   and persistent audio synchronization
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initNavbarScroll();
  initPageTransitions();
  initScrollReveal();
  initAudioManager();
  initEasterEgg();
});

/* ====== 1. Custom Cursor with Trails ====== */
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  const ring = document.createElement('div');
  ring.id = 'cursor-ring';
  
  document.body.appendChild(cursor);
  document.body.appendChild(ring);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let cursorX = 0, cursorY = 0;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Spawn heart trail periodically
    if (Math.random() < 0.08) {
      spawnHeartTrail(mouseX, mouseY);
    }
  });

  // Render loop for smooth cursor tracking
  function tick() {
    // Smooth lerp for outer ring
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    // Instant mapping for inner dot
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(tick);
  }
  tick();

  // Hover states
  const hoverables = document.querySelectorAll('a, button, .clickable, .glass');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

function spawnHeartTrail(x, y) {
  const heart = document.createElement('div');
  heart.className = 'cursor-heart';
  heart.innerHTML = '❤️';
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  
  // Random small offset and size
  const size = Math.random() * 10 + 8;
  const rotation = Math.random() * 40 - 20;
  heart.style.fontSize = `${size}px`;
  heart.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
  
  // Varied pink hues
  const colors = ['#FF0080', '#FF6B9D', '#b06eff', '#FFD700'];
  heart.style.color = colors[Math.floor(Math.random() * colors.length)];
  
  document.body.appendChild(heart);
  
  // Clean up
  setTimeout(() => heart.remove(), 800);
}

/* ====== 2. Navbar Scrolling ====== */
function initNavbarScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    // Update top progress bar
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    const progress = document.getElementById('scroll-progress');
    if (progress) progress.style.width = `${scrolled}%`;
  });
}

/* ====== 3. Page Transitions ====== */
function initPageTransitions() {
  const overlay = document.createElement('div');
  overlay.id = 'page-overlay';
  overlay.innerHTML = '<div class="circle"></div>';
  document.body.appendChild(overlay);

  const transitionCircle = overlay.querySelector('.circle');

  // Intercept nav links
  document.querySelectorAll('.nav-links a, .btn-transition').forEach(link => {
    link.addEventListener('click', (e) => {
      const destination = link.getAttribute('href');
      if (destination && destination !== '#' && !destination.startsWith('http')) {
        e.preventDefault();
        
        // Expand circle
        overlay.classList.add('active');
        
        // Push state or redirect after transition
        setTimeout(() => {
          window.location.href = destination;
        }, 700);
      }
    });
  });

  // Shrink circle on page load
  window.addEventListener('pageshow', () => {
    overlay.classList.remove('active');
  });
}

/* ====== 4. Scroll Reveal ====== */
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Keep it revealed or unobserve
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ====== 5. Persistent Audio Manager ====== */
let audioCtx = null;
window.bgMusic = null;

function initAudioManager() {
  // Audio is now managed by the parent index.html wrapper to ensure gapless playback.
}

/* ====== 6. Toast System ====== */
window.showToast = function(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
};

/* ====== 7. Easter Egg (Konami Code) ====== */
function initEasterEgg() {
  const pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let current = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === pattern[current]) {
      current++;
      if (current === pattern.length) {
        current = 0;
        triggerCosmicLoveMode();
      }
    } else {
      current = 0;
    }
  });
}

function triggerCosmicLoveMode() {
  window.showToast('🚀 COSMIC LOVE MODE ACTIVATED! 💖');
  
  // Synthesize a retro-synthesized "Happy Birthday" arpeggio immediately!
  playSynthesizedBirthday();
  
  // Burst hearts from cursor
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const rx = Math.random() * window.innerWidth;
      const ry = Math.random() * window.innerHeight;
      spawnHeartTrail(rx, ry);
    }, i * 60);
  }
}

function playSynthesizedBirthday() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
    const duration = [0.4, 0.4, 0.8, 0.8, 0.8, 1.2, 0.4, 0.4, 0.8, 0.8, 0.8, 1.2];
    let time = audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration[idx] - 0.05);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(time);
      osc.stop(time + duration[idx]);
      
      time += duration[idx];
    });
  } catch(e) {
    console.log("AudioContext failed or blocked.");
  }
}
