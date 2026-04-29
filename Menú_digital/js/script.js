// ==========================================
// VARIABLES GLOBALES
// ==========================================
let total = 0;
let orden = [];   // ahora los objetos tienen: { nombre, precio, cantidad, id, custom: { removed: [], added: [] } }
let isReadAloud = false;
let isHighContrast = false;
let isBlindMode = false;
let speechSynth = window.speechSynthesis;

// Sistema de doble-tap para modo ciego (sin toast visual)
let pendingAction = null;
let pendingTimeout = null;

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
}

// ==========================================
// CARRITO DE COMPRAS (soporta cantidades)
// ==========================================
function agregarAlCarrito(nombre, precio, cantidad = 1) {
    if (cantidad <= 0) return;
    // Buscar si ya existe el mismo platillo sin personalizaciones para acumular
    const existente = orden.find(item => item.nombre === nombre && !item.custom?.removed.length && !item.custom?.added.length);
    if (existente) {
        existente.cantidad += cantidad;
        total += precio * cantidad;
    } else {
        orden.push({
            nombre,
            precio,
            cantidad,
            id: Date.now(),
            custom: { removed: [], added: [] }
        });
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
        const div = document.createElement('div');
        div.className = 'order-item';
        div.setAttribute('role', 'listitem');
        let extra = '';
        if (item.custom.removed.length) extra += ` (sin ${item.custom.removed.join(', ')})`;
        if (item.custom.added.length) extra += ` (+${item.custom.added.join(', ')})`;
        div.innerHTML = `
            <span>${item.nombre} x${item.cantidad}${extra}</span>
            <div class="order-item-right">
                <span class="order-item-price">$${(item.precio * item.cantidad).toFixed(2)}</span>
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
        texto += `${i + 1}. ${item.nombre} x${item.cantidad}`;
        if (item.custom.removed.length) texto += ` (sin ${item.custom.removed.join(', ')})`;
        if (item.custom.added.length) texto += ` (+${item.custom.added.join(', ')})`;
        texto += ` - $${(item.precio * item.cantidad).toFixed(2)}\n`;
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
        closeWelcome();
        document.getElementById('blind-choice-overlay').style.display = 'flex';
        return;
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
                activarModoCiego();
                // Interfaz simplificada centrada
                document.body.classList.add('blind-voice-simplified');
                // Abrir chatbot automáticamente y mostrar mensaje de bienvenida
                const chatWindow = document.getElementById('chatbot-window');
                if (!chatWindow.classList.contains('active')) toggleChatbot();
                // Limpiamos mensajes anteriores y ponemos el saludo inicial
                const mensajes = document.getElementById('chatbot-messages');
                mensajes.innerHTML = '';
                const bienvenida = "Bienvenido al menú, ¿qué desea ordenar? Puede preguntarme por los platillos y sus ingredientes así como agregar a la orden.";
                addMessage(bienvenida, 'bot');
                if (isReadAloud) hablar(bienvenida);
                // Activar el micrófono automáticamente tras un breve retraso
                setTimeout(() => {
                    activarVoz();
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
            closeWelcome();
            setTimeout(() => {
                toggleChatbot();
                setTimeout(() => { document.getElementById('chatbot-input').focus(); }, 150);
            }, 300);
            return;

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
// CHATBOT (bot local mejorado con cantidades e ingredientes)
// ==========================================
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
    const respuesta = processBotMessageLocal(message);
    setTimeout(() => {
        addMessage(respuesta, 'bot');
        if (isReadAloud) hablar(respuesta);
    }, 600);
}

// Mapeo de palabras numéricas a dígitos (hasta diez)
const numerosTexto = {
    'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10
};
function extraerCantidad(texto) {
    // Buscar dígito
    const matchNum = texto.match(/\b(\d+)\b/);
    if (matchNum) return parseInt(matchNum[0]);
    // Buscar palabra numérica
    for (let palabra in numerosTexto) {
        if (texto.includes(palabra)) return numerosTexto[palabra];
    }
    return 1; // por defecto
}

function processBotMessageLocal(message) {
    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Saludos
    if (msg.match(/hola|buenas|hey|que tal|buenos dias|tardes|noches/)) {
        return "¡Hola! Puedes pedir tu comida diciendo, por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes.";
    }

    // Pregunta por ingredientes
    const matchIngred = msg.match(/ingredientes|que contiene|que lleva/i);
    if (matchIngred) {
        for (let nombre in platillosData) {
            const regex = new RegExp(nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'i');
            if (msg.match(regex)) {
                const ingr = platillosData[nombre].ingredients.join(', ');
                return `Los ingredientes de ${nombre} son: ${ingr}. Si deseas quitar o agregar algo, indícalo (ej. "sin queso" o "agregar aguacate").`;
            }
        }
        return "Por favor, dime de qué platillo quieres saber los ingredientes.";
    }

    // Comando para modificar un platillo (quitar/agregar ingrediente)
    const modificar = msg.match(/(quitar|sin|eliminar?)\s+([\w\s]+?)(?:\s+(de|del)\s+(.+))?$/);
    if (modificar) {
        const ingrediente = modificar[2].trim();
        const platilloRef = modificar[4] ? modificar[4].trim() : null;
        return modificarIngrediente(ingrediente, 'quitar', platilloRef);
    }
    const agregar = msg.match(/(agregar|añadir|poner|con)\s+([\w\s]+?)(?:\s+(a|en|al)\s+(.+))?$/);
    if (agregar) {
        const ingrediente = agregar[2].trim();
        const platilloRef = agregar[4] ? agregar[4].trim() : null;
        return modificarIngrediente(ingrediente, 'agregar', platilloRef);
    }

    // Pedido con cantidad (soporta números y palabras)
    const cantidad = extraerCantidad(msg);
    let platilloEncontrado = null;
    for (let nombre in platillosData) {
        const regex = new RegExp(nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), 'i');
        if (msg.match(regex)) {
            platilloEncontrado = nombre;
            break;
        }
    }
    if (platilloEncontrado) {
        agregarAlCarrito(platilloEncontrado, platillosData[platilloEncontrado].price, cantidad);
        return `He añadido ${cantidad} ${platilloEncontrado} a tu orden. ¿Algo más?`;
    }

    // Peticiones de total, cuenta, etc.
    if (msg.match(/total|cuenta|llevo|pedido|orden|resumen|cuanto es/)) {
        if (orden.length === 0) return "Tu orden está vacía.";
        let resumen = `Tu orden actual:\n`;
        orden.forEach(item => {
            resumen += `- ${item.nombre} x${item.cantidad} $${(item.precio * item.cantidad).toFixed(2)}\n`;
        });
        resumen += `Total: $${total.toFixed(2)}`;
        return resumen;
    }

    if (msg.match(/descargar|pagar|finalizar|enviar|terminar|listo|ya/)) {
        if (orden.length === 0) return "No hay nada que descargar.";
        setTimeout(() => descargarOrden(), 1000);
        return "Descargando tu orden. Muestra el archivo al personal.";
    }

    if (msg.match(/quitar|eliminar|borrar|cancelar/)) {
        return "Para quitar un platillo de tu orden, usa el botón con la 'X' roja que está junto al precio en tu carrito visual.";
    }

    return "No entendí. Puedes pedir algo como '2 tacos al pastor' o preguntar 'ingredientes de la pizza'.";
}

// Función auxiliar para modificar ingredientes
function modificarIngrediente(ingrediente, accion, platilloRef) {
    // Buscar el platillo en la orden (el último agregado o el especificado)
    let item = null;
    if (platilloRef) {
        for (let p in platillosData) {
            if (p.toLowerCase().includes(platilloRef)) {
                item = orden.find(it => it.nombre === p);
                break;
            }
        }
    } else {
        // Tomar el último agregado
        item = orden[orden.length - 1];
    }
    if (!item) return "No encuentro ese platillo en tu orden actual.";
    if (accion === 'quitar') {
        if (!item.custom) item.custom = { removed: [], added: [] };
        if (!item.custom.removed.includes(ingrediente)) item.custom.removed.push(ingrediente);
        item.custom.added = item.custom.added.filter(i => i !== ingrediente);
        renderizarOrden();
        return `He quitado "${ingrediente}" de ${item.nombre}. Tu orden se ha actualizado.`;
    } else if (accion === 'agregar') {
        if (!item.custom) item.custom = { removed: [], added: [] };
        if (!item.custom.added.includes(ingrediente)) item.custom.added.push(ingrediente);
        item.custom.removed = item.custom.removed.filter(i => i !== ingrediente);
        renderizarOrden();
        return `He añadido "${ingrediente}" a ${item.nombre}. Tu orden se ha actualizado.`;
    }
    return "¿Qué deseas modificar?";
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
            'not-allowed':        'Permiso de micrófono denegado. Habilítelo en los ajustes del navegador e intente de nuevo.',
            'permission-denied':  'Permiso de micrófono denegado.',
            'no-speech':          'No escuché nada. Intente de nuevo.',
            'audio-capture':      'No se encontró micrófono.',
            'network':            'Error de red. Verifique su conexión.',
            'aborted':            'Micrófono cancelado.',
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

    // Limpiar modo guardado para elegir cada vez
    localStorage.removeItem('accessMode');
});
