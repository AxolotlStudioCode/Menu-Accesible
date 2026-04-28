// ==========================================
// VARIABLES GLOBALES
// ==========================================
let total = 0;
let orden = [];
let isReadAloud = false;
let isHighContrast = false;
let isBlindMode = false;
let speechSynth = window.speechSynthesis;

// Sistema de doble-tap para modo ciego (sin toast visual)
let pendingAction = null;
let pendingTimeout = null;

// Historial del chat (para el bot local, ya no se usa API externa)
let chatHistory = [];  // Se conserva por si más adelante se reactiva la API

// Datos de platillos
const platillosData = {
    'Tacos al Pastor': { 
        desc: 'Nuestros tacos al pastor están hechos con carne de cerdo marinada durante 24 horas en una mezcla especial de chiles y especias. Se cocinan en un trompo vertical y se sirven con piña fresca, cilantro y cebolla.',
        ingredients: ['Carne de cerdo', 'Chile guajillo', 'Chile ancho', 'Piña natural', 'Achiote', 'Cilantro', 'Cebolla', 'Tortillas de maíz'],
        price: 12.99
    },
    'Hamburguesa Clásica': {
        desc: 'Hamburguesa artesanal de 200g de carne de res premium, preparada al punto que prefieras. Incluye queso cheddar derretido, lechuga fresca, tomate, cebolla y nuestras salsas especiales en pan brioche tostado.',
        ingredients: ['Carne de res molida premium', 'Queso cheddar', 'Lechuga romana', 'Tomate', 'Cebolla', 'Pepinillos', 'Pan brioche', 'Salsas especiales'],
        price: 14.99
    },
    'Pizza Margarita': {
        desc: 'Pizza tradicional italiana con masa artesanal fermentada por 48 horas, salsa de tomate San Marzano, mozzarella di bufala y albahaca fresca. Horneada en horno de leña a 450 grados.',
        ingredients: ['Masa de pizza artesanal', 'Tomates San Marzano', 'Mozzarella di bufala', 'Albahaca fresca', 'Aceite de oliva extra virgen', 'Sal marina', 'Orégano'],
        price: 16.99
    },
    'Sushi Roll California': {
        desc: 'Rollo de sushi estilo California con imitación de cangrejo, aguacate cremoso, pepino fresco y mayonesa picante. Cubierto con semillas de ajonjolí tostadas.',
        ingredients: ['Arroz para sushi', 'Nori (alga marina)', 'Imitación de cangrejo', 'Aguacate', 'Pepino', 'Mayonesa japonesa', 'Semillas de ajonjolí', 'Salsa de soya'],
        price: 18.99
    },
    'Ensalada César': {
        desc: 'Ensalada clásica César con lechuga romana fresca, nuestro aderezo césar casero, crutones de ajo hechos en casa y queso parmesano rallado.',
        ingredients: ['Lechuga romana', 'Queso parmesano', 'Huevo', 'Pan para crutones', 'Aceite de oliva', 'Mostaza Dijon', 'Limón', 'Ajo'],
        price: 11.99
    },
    'Pasta Carbonara': {
        desc: 'Auténtica pasta carbonara romana con espagueti, panceta crujiente, huevo, queso pecorino romano y pimienta negra. Preparada siguiendo la receta tradicional italiana.',
        ingredients: ['Espagueti', 'Panceta', 'Queso pecorino romano', 'Huevo', 'Pimienta negra', 'Sal'],
        price: 15.99
    },
    'Pollo Teriyaki': {
        desc: 'Pechuga de pollo jugosa marinada y glaseada con nuestra salsa teriyaki casera. Se sirve con arroz al vapor, vegetales salteados y semillas de ajonjolí.',
        ingredients: ['Pechuga de pollo', 'Salsa de soya', 'Sake', 'Azúcar', 'Jengibre', 'Ajo', 'Vegetales variados'],
        price: 17.99
    },
    'Filete de Salmón': {
        desc: 'Filete de salmón noruego fresco, cocinado a la parrilla con mantequilla de limón y hierbas finas. Acompañado de puré de papa y espárragos al vapor.',
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
}

// ==========================================
// SISTEMA DE DOBLE-TAP PARA MODO CIEGO
// (sin toast visual, solo confirmación por voz)
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

        pendingTimeout = setTimeout(() => {
            clearPendingAction();
        }, 6000);
    }
}

function clearPendingAction() {
    if (pendingTimeout) { clearTimeout(pendingTimeout); pendingTimeout = null; }
    pendingAction = null;
    // No se crean toasts visuales
}

// ==========================================
// CARRITO DE COMPRAS
// ==========================================
function agregarAlCarrito(nombre, precio) {
    total += precio;
    orden.push({ nombre, precio, id: Date.now() });
    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
    renderizarOrden();
    if (isReadAloud) hablar(`${nombre} agregado a su orden. Precio: ${precio} dólares.`);
}

function eliminarDelCarrito(id) {
    const item = orden.find(i => i.id === id);
    if (item) {
        total -= item.precio;
        orden = orden.filter(i => i.id !== id);
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
        const div = document.createElement('div');
        div.className = 'order-item';
        div.setAttribute('role', 'listitem');
        div.innerHTML = `
            <span>${item.nombre}</span>
            <div class="order-item-right">
                <span class="order-item-price">$${item.precio.toFixed(2)}</span>
                <button class="btn-remove"
                    aria-label="Eliminar ${item.nombre} de la orden"
                    title="Eliminar"
                    onclick="eliminarDelCarrito(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        lista.appendChild(div);
    });
}

function descargarOrden() {
    if (orden.length === 0) {
        alert('Su orden está vacía. Agregue al menos un platillo.');
        return;
    }
    let texto = 'MI ORDEN\n' + '='.repeat(30) + '\n\n';
    orden.forEach((item, i) => {
        texto += `${i + 1}. ${item.nombre} - $${item.precio.toFixed(2)}\n`;
    });
    texto += '\n' + '-'.repeat(30) + '\n';
    texto += `Total: $${total.toFixed(2)}\n\nGracias por su preferencia.\nMuestre esta pantalla al personal.`;
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mi-orden.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
    if (isReadAloud) hablar('Orden descargada. Muestre esta pantalla al personal.');
}

// ==========================================
// VIDEO MODAL
// ==========================================
function abrirVideo(nombre, url) {
    const modal = document.getElementById('video-modal');
    const data = platillosData[nombre];
    document.getElementById('video-title').textContent = nombre;
    document.getElementById('video-frame').src = url + '?autoplay=1';
    document.getElementById('video-description').textContent = data ? data.desc : 'Descripción no disponible.';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (isReadAloud) hablar(`Video informativo de ${nombre}. ${data ? data.desc : ''}`);
}

function cerrarVideo() {
    const modal = document.getElementById('video-modal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.getElementById('video-frame').src = '';
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('video-modal').classList.contains('active')) cerrarVideo();
    }
});

// ==========================================
// ACCESIBILIDAD — lector de pantalla
// ==========================================
function toggleReadAloud() {
    isReadAloud = !isReadAloud;
    const btn = document.getElementById('btn-read');
    btn.classList.toggle('active', isReadAloud);
    if (isReadAloud) {
        hablar('Lector de pantalla activado. Toque cualquier elemento para escuchar su descripción.');
        document.addEventListener('click', leerElemento);
    } else {
        speechSynth.cancel();
        document.removeEventListener('click', leerElemento);
    }
}

function leerElemento(e) {
    const target = e.target;
    let texto = '';
    if (target.closest('.card')) {
        const card = target.closest('.card');
        const nombre = card.getAttribute('data-name');
        const precio = card.getAttribute('data-price');
        const desc = platillosData[nombre] ? platillosData[nombre].desc : '';
        texto = `Platillo: ${nombre}. Precio: ${precio} dólares. ${desc}. Pulse el botón Agregar para ordenar.`;
    } else if (target.closest('.btn-primary')) {
        texto = 'Botón Agregar al carrito';
    } else if (target.closest('.btn-secondary')) {
        texto = 'Botón Ver Video informativo';
    }
    if (texto) hablar(texto);
}

// ==========================================
// PANTALLA DE BIENVENIDA Y SELECCIÓN DE MODO
// ==========================================
function speakWelcome() {
    const texto = "Bienvenido al menú digital accesible. " +
        "Opción uno: Sin barrera de comunicación, navegación visual completa. " +
        "Opción dos: Sordera o hipoacusia, videos con lenguaje de señas. " +
        "Opción tres: Baja visión o ceguera, alto contraste y lector de voz. " +
        "Opción cuatro: Barrera para hablar, chatbot sin interacción verbal. " +
        "Toque cualquier opción para continuar.";
    hablar(texto);
}

// Función auxiliar para cerrar overlays
function hideOverlay(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('hidden');
        setTimeout(() => { if (el.parentNode) el.remove(); }, 500);
    }
}

function selectMode(mode) {
    speechSynth.cancel();

    if (mode === 'blind') {
        // En lugar de aplicar cambios automáticos, mostramos el diálogo de elección
        closeWelcome(); // cierra la bienvenida
        document.getElementById('blind-choice-overlay').style.display = 'flex';
        return; // La configuración del modo ciego se hará en setBlindMode()
    }

    // Otros modos se aplican directamente
    aplicarModo(mode);
    closeWelcome();
}

// Esta función aplica el modo según la elección en el diálogo de ciego
function setBlindMode(choice) {
    hideOverlay('blind-choice-overlay');
    aplicarModo('blind', choice);
}

// Lógica central de aplicación de modos
function aplicarModo(mode, blindChoice = null) {
    switch (mode) {
        case 'deaf':
            document.querySelectorAll('.btn-secondary').forEach(btn => {
                btn.style.borderColor = '#2563EB';
                btn.style.background = '#DBEAFE';
            });
            break;

        case 'blind':
            // Aplicar alto contraste y texto grande
            if (!isHighContrast) toggleHighContrast();
            document.documentElement.style.setProperty('--font-size-base', '20px');
            
            if (blindChoice === 'voice') {
                // Asistente de voz activo
                isReadAloud = true;
                document.getElementById('btn-read').classList.add('active');
                document.addEventListener('click', leerElemento);
                activarModoCiego(); // modo doble-tap y foco
                // Interfaz simplificada
                document.body.classList.add('blind-voice-simplified');
                // Abrir chatbot automáticamente y empezar a escuchar
                const chatWindow = document.getElementById('chatbot-window');
                if (!chatWindow.classList.contains('active')) toggleChatbot();
                // Mensaje de bienvenida del asistente por voz
                hablar('Modo asistente de voz activado. Puede hablarme para hacer su pedido.');
                // Activar el micrófono automáticamente tras un breve retraso
                setTimeout(() => {
                    activarVoz(); // comienza la escucha
                }, 800);
            } else {
                // Usar lector de pantalla: solo mejoras visuales, sin TTS forzado
                isReadAloud = false;
                document.getElementById('btn-read').classList.remove('active');
                document.removeEventListener('click', leerElemento);
                // No se activa el modo ciego de doble‑tap (puede navegar normalmente)
                // Tampoco se simplifica la interfaz
                hablar('Alto contraste y texto grande aplicados. Use su lector de pantalla habitual.');
            }
            break;

        case 'quiet':
            // Barrera para hablar: chatbot abierto, sin más
            closeWelcome();
            setTimeout(() => {
                toggleChatbot();
                setTimeout(() => { document.getElementById('chatbot-input').focus(); }, 150);
            }, 300);
            return; // closeWelcome ya se llamó dentro de selectMode para otros, pero aquí lo aseguramos

        default:
            // default: sin cambios adicionales
            break;
    }
}

function activarModoCiego() {
    isBlindMode = true;
    document.body.classList.add('blind-mode');

    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-download').forEach(btn => {
        const label = btn.getAttribute('aria-label') || btn.textContent.trim();
        btn.addEventListener('click', function(e) {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const fn = () => eval(onclickAttr);
                blindTap(label, fn, e);
            }
        }, true);
    });
}

function closeWelcome() {
    hideOverlay('welcome-overlay');
}

// ==========================================
// CHATBOT (usando SOLO el bot local)
// ==========================================
// La API de Gemini ha sido eliminada para evitar riesgos de seguridad.
// El asistente funciona completamente sin conexión con processBotMessageLocal().

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbot-window');
    const btn = document.querySelector('.chatbot-toggle');
    chatWindow.classList.toggle('active');
    btn.setAttribute('aria-expanded', chatWindow.classList.contains('active'));
    if (chatWindow.classList.contains('active')) {
        setTimeout(() => { document.getElementById('chatbot-input').focus(); }, 100);
    }
}

function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    if (message === '') return;
    addMessage(message, 'user');
    input.value = '';
    // Llamada directa al bot local (sin API)
    const respuesta = processBotMessageLocal(message);
    // Simulamos un pequeño delay para que parezca que "piensa"
    setTimeout(() => {
        addMessage(respuesta, 'bot');
        if (isReadAloud) hablar(respuesta);
    }, 600);
}

// ==========================================
// BOT LOCAL DE RESPUESTA (mejorado)
// ==========================================
function processBotMessageLocal(message) {
    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (msg.match(/hola|buenas|hey|que tal|buenos dias|tardes|noches/)) {
        return "¡Hola! Soy tu asistente virtual. Puedes pedirme el menú, consultar precios o hacer tu pedido directamente.";
    }
    if (msg.match(/recomienda|sugieres|mejor|rico/)) {
        return "Te recomiendo los Tacos al Pastor o la Hamburguesa Clásica. ¿Cuál te gustaría ordenar?";
    }

    if (msg.match(/menu|carta|opciones|comida|que hay|tienen/)) {
        return "Tenemos: Tacos al Pastor ($12.99), Hamburguesa Clásica ($14.99), Pizza Margarita ($16.99), Sushi Roll ($18.99), Ensalada César ($11.99), Pasta Carbonara ($15.99), Pollo Teriyaki ($17.99) y Filete de Salmón ($24.99).";
    }

    const esPregunta = msg.match(/precio|cuesta|cuestan|vale|valen|ingredientes|lleva|contiene|que es|informacion|alergenos/);

    if (esPregunta) {
        if (msg.match(/taco|pastor|tacos/)) return "Los Tacos al Pastor cuestan $12.99 y llevan: Carne de cerdo, piña, cilantro, cebolla y tortillas de maíz.";
        if (msg.match(/hamburguesa|burger/)) return "La Hamburguesa Clásica cuesta $14.99 e incluye res premium, queso cheddar, lechuga, tomate, cebolla, pepinillos y salsas.";
        if (msg.match(/pizza|margarita/)) return "La Pizza Margarita cuesta $16.99. Sus ingredientes son masa artesanal, tomates, mozzarella y albahaca fresca.";
        if (msg.match(/sushi|california|rollo/)) return "El Sushi Roll cuesta $18.99. Lleva arroz, alga nori, cangrejo, aguacate, pepino y mayonesa picante.";
        if (msg.match(/ensalada|cesar/)) return "La Ensalada César cuesta $11.99. Lleva lechuga romana, parmesano, huevo, crutones y aderezo césar.";
        if (msg.match(/pasta|carbonara|espagueti|spaghetti/)) return "La Pasta Carbonara cuesta $15.99 y se prepara con espagueti, panceta, queso pecorino y huevo.";
        if (msg.match(/pollo|teriyaki/)) return "El Pollo Teriyaki tiene un precio de $17.99. Incluye pechuga glaseada, arroz al vapor y vegetales.";
        if (msg.match(/salmon|filete/)) return "El Filete de Salmón vale $24.99 y viene acompañado de puré de papa y espárragos al vapor.";

        return "Si deseas saber el precio o ingredientes de un platillo, menciona su nombre (ej. 'precio de los tacos').";
    }

    let platilloAgregado = false;
    let respuesta = "";

    if (msg.match(/taco|pastor|tacos/)) {
        agregarAlCarrito('Tacos al Pastor', 12.99);
        respuesta = "¡Excelente! He agregado unos Tacos al Pastor a tu orden. ";
        platilloAgregado = true;
    }
    else if (msg.match(/hamburguesa|burger/)) {
        agregarAlCarrito('Hamburguesa Clásica', 14.99);
        respuesta = "¡Listo! Una Hamburguesa Clásica agregada a tu carrito. ";
        platilloAgregado = true;
    }
    else if (msg.match(/pizza|margarita/)) {
        agregarAlCarrito('Pizza Margarita', 16.99);
        respuesta = "¡Marchando una Pizza Margarita! Ya está en tu orden. ";
        platilloAgregado = true;
    }
    else if (msg.match(/sushi|california|rollo/)) {
        agregarAlCarrito('Sushi Roll California', 18.99);
        respuesta = "Sushi Roll California agregado a tu cuenta. ";
        platilloAgregado = true;
    }
    else if (msg.match(/ensalada|cesar/)) {
        agregarAlCarrito('Ensalada César', 11.99);
        respuesta = "Ensalada César agregada. ";
        platilloAgregado = true;
    }
    else if (msg.match(/pasta|carbonara|espagueti|spaghetti/)) {
        agregarAlCarrito('Pasta Carbonara', 15.99);
        respuesta = "Pasta Carbonara en tu carrito. ";
        platilloAgregado = true;
    }
    else if (msg.match(/pollo|teriyaki/)) {
        agregarAlCarrito('Pollo Teriyaki', 17.99);
        respuesta = "Pollo Teriyaki añadido. ";
        platilloAgregado = true;
    }
    else if (msg.match(/salmon|filete/)) {
        agregarAlCarrito('Filete de Salmón', 24.99);
        respuesta = "Filete de Salmón agregado. ";
        platilloAgregado = true;
    }

    if (platilloAgregado) {
        return respuesta + "¿Deseas algo más o preparo la cuenta?";
    }

    if (msg.match(/total|cuenta|llevo|pedido|orden|cuanto es/)) {
        if (orden.length === 0) return "Tu orden está vacía en este momento. ¿Te sirvo algo?";
        return `Llevas ${orden.length} platillos. El total es de $${total.toFixed(2)}. Si ya terminaste, di "descargar orden" o "pagar".`;
    }

    if (msg.match(/quitar|eliminar|borrar|cancelar/)) {
        return "Para quitar un platillo de tu orden, usa el botón con la 'X' roja que está junto al precio en tu carrito visual.";
    }

    if (msg.match(/descargar|pagar|terminar|finalizar|listo|ya/)) {
        if (orden.length === 0) return "No puedes finalizar porque no has pedido nada aún. ¿Qué te ofrezco?";
        setTimeout(() => descargarOrden(), 1000);
        return "¡Perfecto! Estoy descargando el recibo de tu orden. Por favor, muestra el archivo en pantalla al personal.";
    }

    if (msg.match(/gracias|ok|va|bien|perfecto/)) {
        return "¡Con gusto! Aquí sigo si necesitas agregar algo más.";
    }

    return "No te entendí muy bien. Puedes preguntarme '¿qué lleva el sushi?' o pedir directamente 'quiero unos tacos'.";
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    const time = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
            <span class="message-time">${time}</span>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    scrollChatToBottom();
}

function scrollChatToBottom() {
    const container = document.getElementById('chatbot-messages');
    container.scrollTop = container.scrollHeight;
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') sendMessage();
}

// ==========================================
// RECONOCIMIENTO DE VOZ
// ==========================================
let recognitionInstance = null;

function activarVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('mic-btn');

    if (!SpeechRecognition) {
        addMessage('Su navegador no soporta reconocimiento de voz. Use Chrome o Edge.', 'bot');
        return;
    }

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

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        document.getElementById('chatbot-input').value = transcript;
        enviarMensajeDirecto(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Mic error:', event.error);
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        const msgs = {
            'not-allowed': 'Permiso de micrófono denegado. Habilítelo en los ajustes del navegador e intente de nuevo.',
            'permission-denied': 'Permiso de micrófono denegado.',
            'no-speech': 'No escuché nada. Intente de nuevo.',
            'audio-capture': 'No se encontró micrófono.',
            'network': 'Error de red. Verifique su conexión.',
            'aborted': 'Micrófono cancelado.',
        };
        const msg = msgs[event.error] || `Error de micrófono (${event.error}). Intente escribir su mensaje.`;
        addMessage(msg, 'bot');
    };

    recognition.onend = () => {
        if (recognitionInstance === recognition) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        }
    };

    setTimeout(() => {
        try {
            recognition.start();
        } catch (err) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
            console.error('No se pudo iniciar mic:', err);
            addMessage('No se pudo iniciar el micrófono. Verifique los permisos e intente de nuevo.', 'bot');
        }
    }, 150);
}

function enviarMensajeDirecto(texto) {
    if (!texto || texto.trim() === '') return;
    document.getElementById('chatbot-input').value = '';
    addMessage(texto, 'user');
    // Usar solo el bot local
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
    const panel = document.getElementById('panel-content');
    const btn = document.querySelector('.toggle-panel');
    panel.classList.toggle('active');
    btn.setAttribute('aria-expanded', panel.classList.contains('active'));
}

function changeFontSize(delta) {
    const currentStr = getComputedStyle(document.documentElement).getPropertyValue('--font-size-base').trim();
    let currentSize = parseInt(currentStr) || 16;
    if (delta === 0) { currentSize = 16; }
    else { currentSize = Math.max(12, Math.min(24, currentSize + delta)); }
    document.documentElement.style.setProperty('--font-size-base', currentSize + 'px');
    if (isReadAloud) hablar(`Tamaño de texto: ${currentSize} puntos.`);
}

function toggleHighContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
    document.getElementById('btn-contrast').classList.toggle('active', isHighContrast);
    if (isReadAloud) hablar(isHighContrast ? 'Alto contraste activado.' : 'Alto contraste desactivado.');
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });

    let voiceStarted = false;
    function iniciarVozBienvenida() {
        if (voiceStarted) return;
        voiceStarted = true;
        speakWelcome();
    }

    setTimeout(iniciarVozBienvenida, 800);
    document.addEventListener('pointerdown', iniciarVozBienvenida, { once: true });

    // Limpiar modo guardado
    localStorage.removeItem('accessMode');
});
