// ─── Payment Processing Mock ───
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('payment-form');
  const payBtn = document.getElementById('pay-btn');
  const overlay = document.getElementById('status-overlay');

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show loading status on button
      payBtn.classList.add('loading');
      payBtn.disabled = true;

      // Simulate network request delay
      setTimeout(() => {
        // Show the success overlay
        overlay.classList.add('active');

        // Confetti effect (visual only)
        createConfetti();
      }, 2000);
    });
  }
});

function createConfetti() {
  const container = document.body;
  const colors = ['#c4a265', '#d4b87a', '#a8884d', '#27ae60', '#ffffff'];

  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = Math.random() * 8 + 4 + 'px';
    confetti.style.height = Math.random() * 8 + 4 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '2px';
    confetti.style.zIndex = '10002';
    confetti.style.opacity = Math.random();
    
    container.appendChild(confetti);

    const animation = confetti.animate([
      { transform: 'translate3d(0, 0, 0) rotate(0deg)', opacity: 1 },
      { transform: `translate3d(${(Math.random() - 0.5) * 500}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0, .9, .57, 1)'
    });

    animation.onfinish = () => confetti.remove();
  }
}
