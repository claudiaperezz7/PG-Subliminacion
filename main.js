// =============================================
//  CONFIGURACIÓN
//  Reemplazá con tu número real (código país sin +)
//  Ejemplo Argentina: 549 + tu número sin el 0 inicial
// =============================================
const WA_NUMBER = '56950182756';

// =============================================
//  ESTADO
// =============================================
let selected = [];
let qty = 1;

// =============================================
//  SELECCIÓN DE PRODUCTOS
// =============================================
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    const prod  = card.dataset.product;
    const emoji = card.dataset.emoji;

    if (selected.find(s => s.name === prod)) {
      // Ya estaba seleccionado → lo quitamos
      selected = selected.filter(s => s.name !== prod);
      card.classList.remove('selected');
    } else {
      // No estaba → lo agregamos
      selected.push({ name: prod, emoji });
      card.classList.add('selected');
    }

    renderTags();
  });
});

// =============================================
//  RENDERIZAR TAGS DE PRODUCTOS SELECCIONADOS
// =============================================
function renderTags() {
  const display = document.getElementById('selected-display');
  display.innerHTML = '';

  if (selected.length === 0) {
    const msg = document.createElement('span');
    msg.className = 'no-selection-msg';
    msg.id = 'no-sel-msg';
    msg.textContent = 'Ningún producto seleccionado aún...';
    display.appendChild(msg);
    return;
  }

  selected.forEach(s => {
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `${s.emoji} ${s.name} <button onclick="removeTag('${s.name}')">✕</button>`;
    display.appendChild(tag);
  });
}

// =============================================
//  QUITAR UN PRODUCTO DEL PEDIDO
// =============================================
function removeTag(name) {
  selected = selected.filter(s => s.name !== name);

  document.querySelectorAll('.product-card').forEach(card => {
    if (card.dataset.product === name) {
      card.classList.remove('selected');
    }
  });

  renderTags();
}

// =============================================
//  SELECTOR DE CANTIDAD
// =============================================
document.getElementById('qty-plus').addEventListener('click', () => {
  qty = Math.min(qty + 1, 99);
  document.getElementById('qty-val').textContent = qty;
});

document.getElementById('qty-minus').addEventListener('click', () => {
  qty = Math.max(qty - 1, 1);
  document.getElementById('qty-val').textContent = qty;
});

// =============================================
//  ENVIAR PEDIDO POR WHATSAPP
// =============================================
document.getElementById('wsp-btn').addEventListener('click', enviarWSP);

function enviarWSP() {
  const nombre  = document.getElementById('nombre').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const envio   = document.getElementById('envio').value;

  // Validaciones
  if (selected.length === 0) {
    alert('Por favor seleccioná al menos un producto antes de continuar.');
    return;
  }

  if (!nombre) {
    alert('Por favor ingresá tu nombre.');
    document.getElementById('nombre').focus();
    return;
  }

  // Armar el mensaje de WhatsApp
  const prods = selected.map(s => `${s.emoji} ${s.name}`).join(', ');

  let txt = `¡Hola! Me llamo *${nombre}* y quiero hacer un pedido \n\n`;
  txt += `*Productos:* ${prods}\n`;
  txt += `*Cantidad:* ${qty} unidad${qty > 1 ? 'es' : ''}\n`;
  if (mensaje) txt += `*Personalización:* ${mensaje}\n`;
  if (envio)   txt += `*Envío:* ${envio}\n`;
  txt += `\n¡Quedo esperando información, gracias! `;

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`;
  window.open(url, '_blank');
}

// Menú hamburguesa mobile
document.getElementById('nav-hamburger').addEventListener('click', () => {
  document.getElementById('nav-mobile-menu').classList.toggle('open');
});

function cerrarMenu() {
  document.getElementById('nav-mobile-menu').classList.remove('open');
}