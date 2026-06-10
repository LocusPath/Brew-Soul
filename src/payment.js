// ─── Payment Processing Mock ───
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const paymentForm = document.getElementById('payment-form');
  const payBtn = document.getElementById('pay-btn');
  const payBtnText = document.getElementById('pay-btn-text');
  const overlay = document.getElementById('status-overlay');

  const cardNameInput = document.getElementById('card-name');
  const cardNumberInput = document.getElementById('card-number');
  const cardExpiryInput = document.getElementById('card-expiry');
  const cardCvcInput = document.getElementById('card-cvc');

  // Load and render cart
  let cart = JSON.parse(localStorage.getItem('brew_soul_cart')) || [];

  if (cart.length === 0) {
    const container = document.querySelector('.payment-container');
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary); animation: fadeInUp 0.8s var(--ease-out-expo) forwards;">
          <div style="font-size: 3.5rem; color: var(--gold); margin-bottom: 20px;">☕</div>
          <h2 class="payment-title" style="margin-bottom: 12px;">Your Cart is Empty</h2>
          <p style="margin-bottom: 24px; color: var(--text-secondary);">Add some artisan brews to your cart before proceeding to checkout.</p>
          <a href="/" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; width: auto; padding: 12px 30px;">Return to Store</a>
        </div>
      `;
    }
    return;
  }

  // Populate dynamic order summary
  const itemsList = document.getElementById('checkout-items-list');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const taxesEl = document.getElementById('checkout-taxes');
  const totalEl = document.getElementById('checkout-total');

  if (itemsList) {
    itemsList.innerHTML = cart.map(item => `
      <div class="summary-item" style="animation: fadeInItem 0.4s ease forwards;">
        <span>${item.name} x ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8%
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (taxesEl) taxesEl.textContent = `$${taxes.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  if (payBtnText) payBtnText.textContent = `Pay $${total.toFixed(2)}`;

  // ─── Input Formatting ───

  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', () => {
      let value = cardNumberInput.value.replace(/\D/g, '');
      value = value.substring(0, 16);
      const parts = value.match(/.{1,4}/g);
      cardNumberInput.value = parts ? parts.join(' ') : value;
      validateField(cardNumberInput);
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', () => {
      let value = cardExpiryInput.value.replace(/\D/g, '');
      value = value.substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      cardExpiryInput.value = value;
      validateField(cardExpiryInput);
    });
  }

  if (cardCvcInput) {
    cardCvcInput.addEventListener('input', () => {
      let value = cardCvcInput.value.replace(/\D/g, '');
      cardCvcInput.value = value.substring(0, 4); // Max 4 digits
      validateField(cardCvcInput);
    });
  }

  if (cardNameInput) {
    cardNameInput.addEventListener('input', () => {
      validateField(cardNameInput);
    });
  }

  // ─── Validation Helpers ───

  function setError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.add('error');
    group.classList.remove('success');
    let errorEl = group.querySelector('.error-message');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    if (!group) return;
    group.classList.remove('error');
    group.classList.add('success');
    const errorEl = group.querySelector('.error-message');
    if (errorEl) {
      errorEl.remove();
    }
  }

  function validateField(input) {
    if (input === cardNameInput) {
      const name = cardNameInput.value.trim();
      if (name.length < 3) {
        setError(cardNameInput, 'Name must be at least 3 characters.');
        return false;
      } else if (/\d/.test(name)) {
        setError(cardNameInput, 'Name cannot contain numbers.');
        return false;
      } else {
        clearError(cardNameInput);
        return true;
      }
    }

    if (input === cardNumberInput) {
      const cleanCard = cardNumberInput.value.replace(/\D/g, '');
      if (cleanCard.length !== 16) {
        setError(cardNumberInput, 'Card number must be 16 digits.');
        return false;
      } else {
        clearError(cardNumberInput);
        return true;
      }
    }

    if (input === cardExpiryInput) {
      const val = cardExpiryInput.value;
      const cleanExpiry = val.replace(/\D/g, '');
      if (cleanExpiry.length !== 4) {
        setError(cardExpiryInput, 'Expiry must be MM/YY.');
        return false;
      }

      const parts = val.split('/');
      if (parts.length !== 2) {
        setError(cardExpiryInput, 'Expiry must be MM/YY.');
        return false;
      }

      const mm = parseInt(parts[0], 10);
      const yy = parseInt(parts[1], 10);
      if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) {
        setError(cardExpiryInput, 'Invalid expiration month.');
        return false;
      }

      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear() % 100;

      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        setError(cardExpiryInput, 'Card has expired.');
        return false;
      } else if (yy > currentYear + 15) {
        setError(cardExpiryInput, 'Invalid expiration year.');
        return false;
      } else {
        clearError(cardExpiryInput);
        return true;
      }
    }

    if (input === cardCvcInput) {
      const cleanCvc = cardCvcInput.value.replace(/\D/g, '');
      if (cleanCvc.length !== 3 && cleanCvc.length !== 4) {
        setError(cardCvcInput, 'CVC must be 3 or 4 digits.');
        return false;
      } else {
        clearError(cardCvcInput);
        return true;
      }
    }

    return true;
  }

  // ─── Form Submission ───

  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const nameValid = validateField(cardNameInput);
      const numberValid = validateField(cardNumberInput);
      const expiryValid = validateField(cardExpiryInput);
      const cvcValid = validateField(cardCvcInput);

      if (!nameValid || !numberValid || !expiryValid || !cvcValid) {
        return;
      }

      // Show loading status on button
      payBtn.classList.add('loading');
      payBtn.disabled = true;

      // Clear the local storage cart immediately on successful payment
      localStorage.removeItem('brew_soul_cart');

      // Simulate network request delay
      setTimeout(() => {
        // Remove loading state
        payBtn.classList.remove('loading');
        
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
