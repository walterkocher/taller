/**
 * WeGo! - Demo Interactivo App.js
 */

/* ==========================================================================
   NAVEGACIÓN Y UTILIDADES
   ========================================================================== */

// Alternar menú móvil
function toggleMenu() {
  const mobileMenu = document.getElementById('nav-mobile');
  mobileMenu.classList.toggle('open');
}

// Control de Modales
function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Mostrar notificaciones Toast
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}

// Alternar pestañas de "Cómo funciona"
function switchHow(role, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  document.getElementById('steps-driver').classList.add('hidden');
  document.getElementById('steps-passenger').classList.add('hidden');
  document.getElementById(`steps-${role}`).classList.remove('hidden');
}

// Cambiar entre rol Pasajero / Conductor en el demo interactivo
function switchApp(role) {
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`btn-${role}`).classList.add('active');
  
  document.getElementById('app-passenger').classList.add('hidden');
  document.getElementById('app-driver').classList.add('hidden');
  document.getElementById(`app-${role}`).classList.remove('hidden');
  
  // Hacer scroll suave hacia el demo si se activa desde el Hero
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Navegación interna entre las pantallas del teléfono
function showScreen(role, screenId) {
  const prefix = role === 'passenger' ? 'p' : 'd';
  document.querySelectorAll(`.${prefix}-screen`).forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}


/* ==========================================================================
   FLUJO DE PASAJERO
   ========================================================================== */

let isWomensMode = false;
let passengerDest = '';
let selectedRide = null;
let etaInterval;

// Datos simulados de conductores
const mockRides = [
  { id: 1, driver: 'Walter K.', avatar: 'walter', rating: '4.9', verified: true, price: 800, time: 5, womensOnly: false, car: 'Toyota Yaris 2021', reviews: 142 },
  { id: 2, driver: 'Valentina R.', avatar: 'valentina', rating: '5.0', verified: true, price: 900, time: 2, womensOnly: true, car: 'Hyundai Grand i10 2020', reviews: 89 },
  { id: 3, driver: 'Carlos M.', avatar: 'carlos', rating: '4.7', verified: false, price: 700, time: 8, womensOnly: false, car: 'Kia Rio 2018', reviews: 45 },
  { id: 4, driver: 'Camila S.', avatar: 'camila', rating: '4.8', verified: true, price: 750, time: 12, womensOnly: true, car: 'Chevrolet Spark 2019', reviews: 210 }
];

function toggleWomensMode() {
  isWomensMode = document.getElementById('womens-mode').checked;
}

function setDestination(dest) {
  document.getElementById('dest-input').value = dest;
  passengerDest = dest;
}

function searchRides() {
  passengerDest = document.getElementById('dest-input').value;
  if (!passengerDest) {
    showToast('Por favor, ingresa a dónde vas.');
    return;
  }
  showScreen('passenger', 'p-results');
  document.getElementById('results-heading').textContent = 'Viajes hacia ' + passengerDest.split(' ')[0] + '...';
  
  // Resetea filtros visuales
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  document.querySelector('.filter-chip').classList.add('active'); // "Todos"
  
  renderRides('all');
}

function filterRides(type, btn) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderRides(type);
}

function renderRides(filterType) {
  const list = document.getElementById('rides-list');
  list.innerHTML = '';
  
  let filtered = [...mockRides];

  // Aplicar modo mujer
  if (isWomensMode) {
    filtered = filtered.filter(r => r.womensOnly);
  }

  // Aplicar filtros de ordenamiento
  if (filterType === 'cheap') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filterType === 'fast') {
    filtered.sort((a, b) => a.time - b.time);
  } else if (filterType === 'top') {
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  }

  document.getElementById('results-count').textContent = `${filtered.length} encontrados`;

  filtered.forEach(ride => {
    const card = document.createElement('div');
    card.className = `ride-card ${ride.womensOnly ? 'womens-only' : ''}`;
    card.onclick = () => selectRide(ride.id);
    card.innerHTML = `
      <div class="ride-top">
        <div class="ride-driver">
          <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=${ride.avatar}&backgroundColor=FF6B35" alt="${ride.driver}" class="ride-avatar"/>
          <div>
            <div class="ride-name">${ride.driver}</div>
            <div class="ride-meta">
              ★ ${ride.rating}
              ${ride.verified ? '<span class="verified-badge">✓ Verificado</span>' : ''}
              ${ride.womensOnly ? '<span class="womens-badge">Solo mujeres</span>' : ''}
            </div>
          </div>
        </div>
        <div class="ride-price">$${ride.price}</div>
      </div>
      <div class="ride-info">
        <span>⏱ a ${ride.time} min</span>
        <span>📍 A 3 cuadras</span>
      </div>
    `;
    list.appendChild(card);
  });
}

function selectRide(id) {
  selectedRide = mockRides.find(r => r.id === id);
  showScreen('passenger', 'p-profile');

  const profileHtml = `
    <div class="profile-header">
      <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=${selectedRide.avatar}&backgroundColor=FF6B35" class="profile-avatar"/>
      <div>
        <div class="profile-name">${selectedRide.driver}</div>
        <div class="profile-badges">
          <span class="badge badge-orange">★ ${selectedRide.rating}</span>
          ${selectedRide.womensOnly ? '<span class="badge badge-pink">👩 Modo Mujer</span>' : ''}
        </div>
      </div>
    </div>
    <div class="profile-stats">
      <div class="prof-stat"><strong>${selectedRide.reviews}</strong><span>Viajes</span></div>
      <div class="prof-stat"><strong>2 años</strong><span>En WeGo!</span></div>
      <div class="prof-stat"><strong>100%</strong><span>Completados</span></div>
    </div>
    <div class="profile-car">🚗 ${selectedRide.car}</div>
    <div class="profile-reviews">
      <div class="review-item"><strong>Ana P.</strong> "Muy amable y puntual. Conduce con cuidado, excelente viaje en Temuco."</div>
    </div>
  `;
  document.getElementById('driver-profile-card').innerHTML = profileHtml;
}

function confirmRide() {
  showScreen('passenger', 'p-confirmed');
  
  // Iniciar simulador de tiempo (ETA)
  let timeInSeconds = selectedRide.time * 60; 
  const counter = document.getElementById('eta-counter');
  
  clearInterval(etaInterval);
  
  // Para propósitos del demo, aceleraremos el tiempo
  etaInterval = setInterval(() => {
    timeInSeconds -= 15; 
    if (timeInSeconds <= 0) {
      clearInterval(etaInterval);
      counter.textContent = "¡Llegó!";
      counter.style.color = "#22c55e";
    } else {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      counter.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function shareTrip() {
  openModal('share-modal');
}

function finishRide() {
  clearInterval(etaInterval);
  showScreen('passenger', 'p-rating');
  setRating(0); // Reiniciar estrellas
}

function setRating(stars) {
  const starEls = document.querySelectorAll('#star-rating .star');
  starEls.forEach((el, idx) => {
    if (idx < stars) el.classList.add('active');
    else el.classList.remove('active');
  });
}

function submitRating() {
  showScreen('passenger', 'p-done');
}

function resetPassenger() {
  document.getElementById('dest-input').value = '';
  document.getElementById('womens-mode').checked = false;
  isWomensMode = false;
  showScreen('passenger', 'p-search');
}


/* ==========================================================================
   FLUJO DE CONDUCTOR
   ========================================================================== */

let seats = 2;
let driverDest = '';

function changeSeat(delta) {
  seats += delta;
  if (seats < 1) seats = 1;
  if (seats > 4) seats = 4;
  
  document.getElementById('seat-count').textContent = seats;
  // Simular cálculo de precio sugerido según asientos disponibles/ocupación
  const basePrice = 800;
  document.getElementById('suggested-price').textContent = '$' + basePrice;
}

function publishRoute() {
  driverDest = document.getElementById('driver-dest').value;
  if (!driverDest) {
    showToast('Por favor, indica tu destino.');
    return;
  }
  
  document.getElementById('pub-dest-label').textContent = driverDest;
  document.getElementById('incoming-requests').innerHTML = '';
  
  showScreen('driver', 'd-waiting');
}

function simulateRequest() {
  const reqContainer = document.getElementById('incoming-requests');
  
  // Prevenir duplicados si se hace spam al botón
  if (reqContainer.innerHTML !== '') return;
  
  const reqHtml = `
    <div class="request-incoming" onclick="viewRequest()">
      <div class="req-info">
        <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=matias&backgroundColor=FF6B35" class="req-avatar"/>
        <div>
          <div class="req-text">Matías F. solicita viaje</div>
          <div class="req-dest">Va hacia: ${driverDest}</div>
        </div>
      </div>
      <div class="req-btn">Revisar</div>
    </div>
  `;
  
  reqContainer.innerHTML = reqHtml;
  showToast('¡Nueva solicitud de pasajero!');
}

function viewRequest() {
  showScreen('driver', 'd-request');
  
  const reqDetailsHtml = `
    <div class="profile-header">
      <img src="https://api.dicebear.com/7.x/thumbs/svg?seed=matias&backgroundColor=FF6B35" class="profile-avatar"/>
      <div>
        <div class="profile-name">Matías F.</div>
        <div class="profile-badges">
          <span class="badge badge-orange">★ 4.9</span>
          <span class="badge" style="background:#E5E7EB; color:#374151">Pasajero frecuente</span>
        </div>
      </div>
    </div>
    <div class="profile-car" style="margin: 1rem 0;">📍 Esperando a 2 cuadras de tu ruta</div>
    <div class="trip-earnings" style="margin-top:0">
      <span>Aporte ofrecido:</span>
      <strong>$800</strong>
    </div>
  `;
  
  document.getElementById('request-card').innerHTML = reqDetailsHtml;
}

function acceptRequest() {
  showScreen('driver', 'd-accepted');
}

function rejectRequest() {
  showScreen('driver', 'd-waiting');
  document.getElementById('incoming-requests').innerHTML = ''; // Limpiar la solicitud rechazada
  showToast('Solicitud rechazada');
}

function finishDriverRide() {
  showScreen('driver', 'd-rating');
  setDriverRating(0);
}

function setDriverRating(stars) {
  const starEls = document.querySelectorAll('#driver-star-rating .star');
  starEls.forEach((el, idx) => {
    if (idx < stars) el.classList.add('active');
    else el.classList.remove('active');
  });
}

function submitDriverRating() {
  showScreen('driver', 'd-done');
}

function resetDriver() {
  document.getElementById('driver-dest').value = '';
  seats = 2;
  document.getElementById('seat-count').textContent = seats;
  showScreen('driver', 'd-publish');
}


/* ==========================================================================
   FUNCIONALIDADES EXTRAS (CHAT, COMPARTIR, CTA)
   ========================================================================== */

function openChat() {
  openModal('chat-modal');
  // Asegurarse de que el scroll del chat esté abajo
  const container = document.getElementById('chat-messages');
  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  
  if (text) {
    const container = document.getElementById('chat-messages');
    
    // Crear mensaje del usuario
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-me';
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simular auto-respuesta después de 1.5s
    setTimeout(() => {
      const replyDiv = document.createElement('div');
      replyDiv.className = 'msg msg-other';
      replyDiv.textContent = '¡Entendido! Voy atento.';
      container.appendChild(replyDiv);
      container.scrollTop = container.scrollHeight;
    }, 1500);
  }
}

function copyLink() {
  // Simular copiar al portapapeles
  navigator.clipboard.writeText("wego.cl/seguimiento/abc123").then(() => {
    showToast("¡Enlace copiado al portapapeles!");
    closeModal('share-modal');
  }).catch(() => {
    showToast("Error al copiar enlace.");
  });
}

function joinWaitlist() {
  const emailInput = document.getElementById('waitlist-email');
  const email = emailInput.value.trim();
  const msg = document.getElementById('waitlist-msg');
  
  // Validación básica de correo
  if (email && email.includes('@') && email.includes('.')) {
    msg.textContent = '¡Genial! Te avisaremos cuando WeGo! esté 100% operativo en Temuco.';
    msg.style.color = '#22c55e'; // Verde
    emailInput.value = '';
  } else {
    msg.textContent = 'Por favor ingresa un correo electrónico válido.';
    msg.style.color = '#FF6B35'; // Naranja
  }
}
