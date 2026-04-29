// ==========================================
// VARIABLES GLOBALES
// ==========================================
let total = 0;
let orden = [];
let isReadAloud = false;
let isHighContrast = false;
let isBlindMode = false;
let speechSynth = window.speechSynthesis;

// Sistema de doble-tap para modo ciego
let pendingAction = null;
let pendingTimeout = null;

// Datos de platillos (sin cambios)
const platillosData = {
    'Tacos al Pastor': { 
        desc: 'Nuestros tacos al pastor...',
        ingredients: ['Carne de cerdo', 'Chile guajillo', 'Chile ancho', 'Piña natural', 'Achiote', 'Cilantro', 'Cebolla', 'Tortillas de maíz'],
        price: 12.99
    },
    'Hamburguesa Clásica': {
        desc: 'Hamburguesa artesanal de 200g...',
        ingredients: ['Carne de res molida premium', 'Queso cheddar', 'Lechuga romana', 'Tomate', 'Cebolla', 'Pepinillos', 'Pan brioche', 'Salsas especiales'],
        price: 14.99
    },
    'Pizza Margarita': {
        desc: 'Pizza tradicional italiana...',
        ingredients: ['Masa de pizza artesanal', 'Tomates San Marzano', 'Mozzarella di bufala', 'Albahaca fresca', 'Aceite de oliva extra virgen', 'Sal marina', 'Orégano'],
        price: 16.99
    },
    'Sushi Roll California': {
        desc: 'Rollo de sushi estilo California...',
        ingredients: ['Arroz para sushi', 'Nori (alga marina)', 'Imitación de cangrejo', 'Aguacate', 'Pepino', 'Mayonesa japonesa', 'Semillas de ajonjolí', 'Salsa de soya'],
        price: 18.99
    },
    'Ensalada César': {
        desc: 'Ensalada clásica César...',
        ingredients: ['Lechuga romana', 'Queso parmesano', 'Huevo', 'Pan para crutones', 'Aceite de oliva', 'Mostaza Dijon', 'Limón', 'Ajo'],
        price: 11.99
    },
    'Pasta Carbonara': {
        desc: 'Auténtica pasta carbonara romana...',
        ingredients: ['Espagueti', 'Panceta', 'Queso pecorino romano', 'Huevo', 'Pimienta negra', 'Sal'],
        price: 15.99
    },
    'Pollo Teriyaki': {
        desc: 'Pechuga de pollo jugosa...',
        ingredients: ['Pechuga de pollo', 'Salsa de soya', 'Sake', 'Azúcar', 'Jengibre', 'Ajo', 'Vegetales variados'],
        price: 17.99
    },
    'Filete de Salmón': {
        desc: 'Filete de salmón noruego fresco...',
        ingredients: ['Filete de salmón noruego', 'Limón', 'Mantequilla', 'Perejil', 'Eneldo', 'Papas', 'Espárragos', 'Sal y pimienta'],
        price: 24.99
    }
};

// ==========================================
// SISTEMA DE VOZ
// ==========================================
function hablar(texto, onEnd) {
    if (speechSynth.speaking) speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    if (onEnd) utterance.onend = onEnd;
    speechSynth.speak(utterance);
    // Activar animación de burbuja (hablando)
    const bubble = document.getElementById('bubble-circle');
    if (bubble) {
        bubble.classList.add('speaking');
        if (onEnd) {
            const originalOnEnd = onEnd;
            utterance.onend = () => {
                bubble.classList.remove('speaking');
                originalOnEnd();
            };
        } else {
            utterance.onend = () => bubble.classList.remove('speaking');
        }
    }
}

// ==========================================
// SISTEMA DE DOBLE-TAP PARA MODO CIEGO
// ==========================================
function blindTap(label, fn, event) {
    if (!isBlindMode) {
        fn();
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (pendingAction && pendingAction.label === label) {
        clearPendingAction();
        hablar('Confirmado. ' + label);
        fn();
    } else {
        clearPendingAction();
        pendingAction = { fn, label };
        hablar(label + '. Toque de nuevo para confirmar.');
        pendingTimeout = setTimeout(() => clearPendingAction(), 6000);
    }
}
function clearPendingAction() {
    if (pendingTimeout) { clearTimeout(pendingTimeout); pendingTimeout = null; }
    pendingAction = null;
}

// ==========================================
// CARRITO DE COMPRAS (soporta cantidades)
// ==========================================
function agregarAlCarrito(nombre, precio, cantidad = 1) {
    if (cantidad <= 0) return;
    const existente = orden.find(item => item.nombre === nombre && !item.custom?.removed.length && !item.custom?.added.length);
    if (existente) {
        existente.cantidad += cantidad;
        total += precio * cantidad;
    } else {
        orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: [], added: [] } });
        total += precio * cantidad;
    }
    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
    renderizarOrden();
    if (isReadAloud) hablar(`${nombre} agregado a su orden (x${cantidad}).`);
}
function eliminarDelCarrito(id) {
    const idx = orden.findIndex(i => i.id === id);
    if (idx !== -1) {
        const item = orden[idx];
        total -= item.precio * item.cantidad;
        orden.splice(idx, 1);
        document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
        renderizarOrden();
    }
}
function renderizarOrden() {
    const lista = document.getElementById('lista-orden');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    lista.innerHTML = '';
    if (orden.length === 0) {
        mensajeVacio.style.display = 'block';
        return;
    }
    mensajeVacio.style.display = 'none';
    orden.forEach((item) => {
        let extra = '';
        if (item.custom.removed.length) extra += ` (sin ${item.custom.removed.join(', ')})`;
        if (item.custom.added.length) extra += ` (+${item.custom.added.join(', ')})`;
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<span>${item.nombre} x${item.cantidad}${extra}</span>
            <div class="order-item-right">
                <span class="order-item-price">$${(item.precio*item.cantidad).toFixed(2)}</span>
                <button class="btn-remove" onclick="eliminarDelCarrito(${item.id})"><i class="fas fa-times"></i></button>
            </div>`;
        lista.appendChild(div);
    });
}
function descargarOrden() {
    if (orden.length === 0) { alert('Su orden está vacía.'); return; }
    let texto = 'MI ORDEN\n' + '='.repeat(30) + '\n\n';
    orden.forEach((item, i) => {
        texto += `${i+1}. ${item.nombre} x${item.cantidad}`;
        if (item.custom.removed.length) texto += ` (sin ${item.custom.removed.join(', ')})`;
        if (item.custom.added.length) texto += ` (+${item.custom.added.join(', ')})`;
        texto += ` - $${(item.precio*item.cantidad).toFixed(2)}\n`;
    });
    texto += '\n' + '-'.repeat(30) + '\nTotal: $' + total.toFixed(2) + '\n\nMuestre esta pantalla al personal.';
    const blob = new Blob([texto], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mi-orden.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    if (isReadAloud) hablar('Orden descargada. Muestre esta pantalla al personal.');
}

// ==========================================
// VIDEO MODAL
// ==========================================
function abrirVideo(nombre, url) {
    const modal = document.getElementById('video-modal');
    document.getElementById('video-title').textContent = nombre;
    document.getElementById('video-frame').src = url + '?autoplay=1';
    document.getElementById('video-description').textContent = platillosData[nombre]?.desc || '';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (isReadAloud) hablar(`Video informativo de ${nombre}.`);
}
function cerrarVideo() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('video-frame').src = '';
    document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.getElementById('video-modal').classList.contains('active')) cerrarVideo();
});

// ==========================================
// ACCESIBILIDAD — lector de pantalla
// ==========================================
function toggleReadAloud() {
    isReadAloud = !isReadAloud;
    document.getElementById('btn-read').classList.toggle('active', isReadAloud);
    if (isReadAloud) {
        hablar('Lector de pantalla activado.');
        document.addEventListener('click', leerElemento);
    } else {
        speechSynth.cancel();
        document.removeEventListener('click', leerElemento);
    }
}
function leerElemento(e) {
    let texto = '';
    const target = e.target;
    if (target.closest('.card')) {
        const card = target.closest('.card');
        texto = `Platillo: ${card.dataset.name}. Precio: ${card.dataset.price} dólares.`;
    } else if (target.closest('.btn-primary')) texto = 'Botón Agregar al carrito';
    else if (target.closest('.btn-secondary')) texto = 'Botón Ver Video informativo';
    if (texto) hablar(texto);
}

// ==========================================
// PANTALLA DE BIENVENIDA Y SELECCIÓN DE MODO
// ==========================================
function speakWelcome() {
    hablar("Bienvenido al menú digital accesible. Opción uno: Sin barrera. Opción dos: Sordera. Opción tres: Baja visión o ceguera. Opción cuatro: Barrera para hablar. Puede decirlo por voz o tocar el botón.");
}
function hideOverlay(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); setTimeout(() => el.remove(), 500); }
}
function selectMode(mode) {
    speechSynth.cancel();
    if (mode === 'blind') {
        closeWelcome();
        document.getElementById('blind-choice-overlay').style.display = 'flex';
        return;
    }
    aplicarModo(mode);
    closeWelcome();
}
function setBlindMode(choice) {
    hideOverlay('blind-choice-overlay');
    aplicarModo('blind', choice);
}
function aplicarModo(mode, blindChoice = null) {
    switch (mode) {
        case 'deaf':
            document.querySelectorAll('.btn-secondary').forEach(b => { b.style.borderColor = '#2563EB'; b.style.background = '#DBEAFE'; });
            break;
        case 'blind':
            if (!isHighContrast) toggleHighContrast();
            document.documentElement.style.setProperty('--font-size-base', '20px');
            if (blindChoice === 'voice') {
                isReadAloud = true;
                document.getElementById('btn-read').classList.add('active');
                document.addEventListener('click', leerElemento);
                activarModoCiego();
                document.body.classList.add('blind-voice-simplified');
                document.getElementById('blind-bubble').classList.remove('hidden');
                // Bienvenida personalizada
                const mensajes = document.getElementById('chatbot-messages');
                mensajes.innerHTML = '';
                addMessage("Bienvenido al menú. Puedes pedir platillos como '2 tacos', preguntar ingredientes o decir 'enviar orden'. ¿Qué deseas hacer?", 'bot');
                if (isReadAloud) hablar("Bienvenido al menú. ¿Qué deseas ordenar?");
                setTimeout(() => activarVoz(), 800);
            } else {
                isReadAloud = false;
                document.getElementById('btn-read').classList.remove('active');
                document.removeEventListener('click', leerElemento);
                hablar('Alto contraste y texto grande aplicados.');
            }
            break;
        case 'quiet':
            closeWelcome();
            setTimeout(() => { toggleChatbot(); setTimeout(() => document.getElementById('chatbot-input').focus(), 150); }, 300);
            break;
        default: break;
    }
}
function activarModoCiego() {
    isBlindMode = true;
    document.body.classList.add('blind-mode');
}
function closeWelcome() { hideOverlay('welcome-overlay'); }

// ==========================================
// FUNCIÓN PARA DESACTIVAR TTS (botón en bienvenida)
// ==========================================
function desactivarTTS() {
    speechSynth.cancel();
    isReadAloud = false;
    document.getElementById('btn-read').classList.remove('active');
    document.removeEventListener('click', leerElemento);
    // Opcional: desactivar micrófono también
    if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch(e) {}
        recognitionInstance = null;
        document.getElementById('mic-btn').classList.remove('listening');
    }
}

// ==========================================
// CHATBOT (bot local mejorado)
// ==========================================
function toggleChatbot() {
    const win = document.getElementById('chatbot-window');
    const btn = document.querySelector('.chatbot-toggle');
    win.classList.toggle('active');
    btn.setAttribute('aria-expanded', win.classList.contains('active'));
    if (win.classList.contains('active')) setTimeout(() => document.getElementById('chatbot-input').focus(), 100);
}
function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, 'user');
    input.value = '';
    const respuesta = processBotMessageLocal(msg);
    setTimeout(() => {
        addMessage(respuesta, 'bot');
        if (isReadAloud) hablar(respuesta);
    }, 600);
}
const numerosTexto = { 'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10 };
function extraerCantidad(texto) {
    const matchNum = texto.match(/\b(\d+)\b/);
    if (matchNum) return parseInt(matchNum[0]);
    for (let p in numerosTexto) if (texto.includes(p)) return numerosTexto[p];
    return 1;
}
function processBotMessageLocal(message) {
    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Comando para desactivar asistente de voz
    if (msg.includes('desactivar asistente de voz') || msg.includes('silencio')) {
        desactivarTTS();
        // Detener micrófono activo
        if (recognitionInstance) {
            try { recognitionInstance.stop(); } catch(e) {}
            recognitionInstance = null;
            document.getElementById('mic-btn').classList.remove('listening');
        }
        return "Asistente de voz desactivado.";
    }
    // Saludos
    if (msg.match(/hola|buenas|hey|que tal|buenos dias|tardes|noches/)) {
        return "¡Hola! Puedes pedir tu comida diciendo, por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes.";
    }
    // Menú
    if (msg.match(/menu|platillos|comida|que tiene|opciones/)) {
        let menu = "Platillos disponibles:\n";
        for (let nombre in platillosData) menu += `- ${nombre}: $${platillosData[nombre].price}\n`;
        return menu + "Puedes pedir uno o varios con cantidad, ej. '3 tacos'.";
    }
    // Ingredientes
    if (msg.match(/ingredientes|que contiene|que lleva/i)) {
        for (let nombre in platillosData) {
            if (msg.includes(nombre.toLowerCase())) {
                return `Los ingredientes de ${nombre} son: ${platillosData[nombre].ingredients.join(', ')}. ¿Deseas quitar o agregar algo?`;
            }
        }
        return "Dime de qué platillo quieres saber los ingredientes.";
    }
    // Modificar ingrediente
    const mod = msg.match(/(quitar|sin|eliminar?)\s+([\w\s]+?)(?:\s+(de|del)\s+(.+))?$/);
    if (mod) return modificarIngrediente(mod[2].trim(), 'quitar', mod[4]?.trim());
    const add = msg.match(/(agregar|añadir|poner|con)\s+([\w\s]+?)(?:\s+(a|en|al)\s+(.+))?$/);
    if (add) return modificarIngrediente(add[2].trim(), 'agregar', add[4]?.trim());
    // Pedido con cantidad
    const cantidad = extraerCantidad(msg);
    for (let nombre in platillosData) {
        if (msg.includes(nombre.toLowerCase())) {
            agregarAlCarrito(nombre, platillosData[nombre].price, cantidad);
            return `He añadido ${cantidad} ${nombre} a tu orden. ¿Algo más?`;
        }
    }
    // Resumen / cuenta
    if (msg.match(/total|cuenta|resumen|orden/)) {
        if (orden.length === 0) return "Tu orden está vacía.";
        let resumen = "Tu orden:\n";
        orden.forEach(i => resumen += `- ${i.nombre} x${i.cantidad} $${(i.precio*i.cantidad).toFixed(2)}\n`);
        return resumen + `Total: $${total.toFixed(2)}`;
    }
    // Enviar / descargar
    if (msg.match(/enviar|descargar|pagar|finalizar|listo/)) {
        if (orden.length === 0) return "No hay nada que enviar.";
        setTimeout(() => descargarOrden(), 1000);
        return "Descargando tu orden. Muestra el archivo al personal.";
    }
    // Ayuda
    if (msg.match(/ayuda|que puedo hacer|como funciona/)) {
        return "Puedes pedir platillos (ej. '2 tacos'), preguntar ingredientes, quitar/agregar ingredientes (ej. 'sin queso'), ver el total o enviar tu orden.";
    }
    return "No entendí. Puedes pedir algo como '2 tacos al pastor' o preguntar 'ingredientes de la pizza'.";
}
function modificarIngrediente(ingrediente, accion, platilloRef) {
    let item = null;
    if (platilloRef) {
        for (let p in platillosData) if (p.toLowerCase().includes(platilloRef)) { item = orden.find(i => i.nombre === p); break; }
    } else item = orden[orden.length-1];
    if (!item) return "No encuentro ese platillo en tu orden.";
    if (!item.custom) item.custom = { removed: [], added: [] };
    if (accion === 'quitar') {
        if (!item.custom.removed.includes(ingrediente)) item.custom.removed.push(ingrediente);
        item.custom.added = item.custom.added.filter(i => i !== ingrediente);
        renderizarOrden();
        return `He quitado "${ingrediente}" de ${item.nombre}.`;
    } else {
        if (!item.custom.added.includes(ingrediente)) item.custom.added.push(ingrediente);
        item.custom.removed = item.custom.removed.filter(i => i !== ingrediente);
        renderizarOrden();
        return `He añadido "${ingrediente}" a ${item.nombre}.`;
    }
}
function addMessage(text, sender) {
    const cont = document.getElementById('chatbot-messages');
    const div = document.createElement('div');
    div.className = `message ${sender}-message`;
    div.innerHTML = `<div class="message-content"><p>${text}</p><span class="message-time">${new Date().toLocaleTimeString('es-MX', {hour:'2-digit',minute:'2-digit'})}</span></div>`;
    cont.appendChild(div);
    cont.scrollTop = cont.scrollHeight;
}
function scrollChatToBottom() {
    const c = document.getElementById('chatbot-messages');
    if (c) c.scrollTop = c.scrollHeight;
}
function handleChatKeypress(event) { if (event.key === 'Enter') sendMessage(); }

// ==========================================
// RECONOCIMIENTO DE VOZ (activación automática al cargar)
// ==========================================
let recognitionInstance = null;
function activarVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('mic-btn');
    if (!SpeechRecognition) { addMessage('Navegador no soporta reconocimiento de voz.', 'bot'); return; }
    if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch(e) {}
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        return;
    }
    const chatWindow = document.getElementById('chatbot-window');
    if (!chatWindow.classList.contains('active')) toggleChatbot();
    speechSynth.cancel();
    const recognition = new SpeechRecognition();
    recognitionInstance = recognition;
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    micBtn.classList.add('listening');
    micBtn.setAttribute('aria-label', 'Escuchando... toque para detener');
    // Activar animación de burbuja escuchando
    const bubble = document.getElementById('bubble-circle');
    if (bubble) bubble.classList.add('listening');
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        if (bubble) bubble.classList.remove('listening');
        document.getElementById('chatbot-input').value = transcript;
        enviarMensajeDirecto(transcript);
    };
    recognition.onerror = (event) => {
        console.error('Mic error:', event.error);
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        if (bubble) bubble.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        addMessage('Error con el micrófono. Puedes escribir tu mensaje.', 'bot');
    };
    recognition.onend = () => {
        if (recognitionInstance === recognition) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            if (bubble) bubble.classList.remove('listening');
            micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        }
    };
    setTimeout(() => {
        try { recognition.start(); } catch (err) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            if (bubble) bubble.classList.remove('listening');
        }
    }, 150);
}
function enviarMensajeDirecto(texto) {
    if (!texto.trim()) return;
    document.getElementById('chatbot-input').value = '';
    addMessage(texto, 'user');
    const respuesta = processBotMessageLocal(texto);
    setTimeout(() => {
        addMessage(respuesta, 'bot');
        if (isReadAloud) hablar(respuesta);
    }, 600);
}

// ==========================================
// UTILIDADES DE ACCESIBILIDAD
// ==========================================
function toggleAccessPanel() {
    document.getElementById('panel-content').classList.toggle('active');
    document.querySelector('.toggle-panel').setAttribute('aria-expanded', document.getElementById('panel-content').classList.contains('active'));
}
function changeFontSize(delta) {
    const curr = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--font-size-base')) || 16;
    let size = delta === 0 ? 16 : Math.max(12, Math.min(24, curr + delta));
    document.documentElement.style.setProperty('--font-size-base', size + 'px');
    if (isReadAloud) hablar(`Tamaño de texto: ${size} puntos.`);
}
function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    document.getElementById('btn-contrast').classList.toggle('active', isHighContrast);
    if (isReadAloud) hablar(isHighContrast ? 'Alto contraste activado.' : 'Alto contraste desactivado.');
}

// ==========================================
// INICIALIZACIÓN (voz y micrófono desde el inicio)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
        }, i * 80);
    });
    // Voz de bienvenida y micrófono automáticos
    let voiceStarted = false;
    function iniciarTodo() {
        if (voiceStarted) return;
        voiceStarted = true;
        speakWelcome();
        // Activar micrófono tras un breve retardo
        setTimeout(() => activarVoz(), 1200);
    }
    setTimeout(iniciarTodo, 800);
    document.addEventListener('pointerdown', iniciarTodo, { once: true });
    localStorage.removeItem('accessMode');
});
