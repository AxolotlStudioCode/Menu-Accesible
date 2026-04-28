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
let pendingAction = null;       // { fn, label } — acción pendiente de confirmar
let pendingTimeout = null;      // timeout para limpiar la acción pendiente

// Historial del chat para la IA (multi-turn)
let chatHistory = [];

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
// (EL TOAST VISUAL HA SIDO ELIMINADO —
//  solo queda la confirmación por voz)
// ==========================================
function blindTap(label, fn, event) {
    if (!isBlindMode) {
        fn();
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (pendingAction && pendingAction.label === label) {
        // Segundo toque: confirmar y ejecutar
        clearPendingAction();
        hablar('Confirmado. ' + label);
        fn();
    } else {
        // Primer toque: describir por voz (sin toast visual)
        clearPendingAction();
        pendingAction = { fn, label };
        hablar(label + '. Toque de nuevo para confirmar.');

        // Auto-cancelar tras 6 segundos sin segundo toque
        pendingTimeout = setTimeout(() => {
            clearPendingAction();
        }, 6000);
    }
}

function clearPendingAction() {
    if (pendingTimeout) { clearTimeout(pendingTimeout); pendingTimeout = null; }
    pendingAction = null;
    // NOTA: Ya no se elimina ningún toast del DOM porque no se crea
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
// PANTALLA DE BIENVENIDA
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

function selectMode(mode) {
    if (mode !== 'blind') {
        speechSynth.cancel();
    }

    localStorage.setItem('accessMode', mode);
    switch (mode) {
        case 'deaf':
            document.querySelectorAll('.btn-secondary').forEach(btn => {
                btn.style.borderColor = '#2563EB';
                btn.style.background = '#DBEAFE';
            });
            break;

        case 'blind':
            if (!isHighContrast) toggleHighContrast();
            document.documentElement.style.setProperty('--font-size-base', '20px');
            isReadAloud = true;
            document.getElementById('btn-read').classList.add('active');
            document.addEventListener('click', leerElemento);
            activarModoCiego();
            hablar('Modo baja visión activado. Alto contraste y lector de voz habilitados. Toque cualquier platillo para escuchar su descripción. Toque dos veces los botones para confirmar su acción.');
            break;

        case 'quiet':
            closeWelcome();
            setTimeout(() => {
                toggleChatbot();
                setTimeout(() => { document.getElementById('chatbot-input').focus(); }, 150);
            }, 300);
            return;

        default:
            break;
    }
    closeWelcome();
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
    const overlay = document.getElementById('welcome-overlay');
    overlay.classList.add('hidden');
    setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 500);
}

// ==========================================
// CHATBOT CON GEMINI API
// ==========================================
const GEMINI_API_KEY = 'AIzaSyCu4ATmisfziZgVhWZP27zZAr5Ued3k3m4';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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
    chatHistory.push({ role: 'user', parts: [{ text: message }] });
    callGeminiAPI(message);
}

async function callGeminiAPI(userMessage) {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="message-content"><span class="typing-dots"><span></span><span></span><span></span></span></div>';
    document.getElementById('chatbot-messages').appendChild(typingDiv);
    scrollChatToBottom();

    const menuResumen = Object.entries(platillosData).map(([nombre, data]) =>
        `- ${nombre}: $${data.price} | Ingredientes: ${data.ingredients.join(', ')}`
    ).join('\n');

    const ordenActual = orden.length > 0
        ? orden.map(i => `${i.nombre} ($${i.precio.toFixed(2)})`).join(', ') + ` | Total: $${total.toFixed(2)}`
        : 'vacía';

    const systemInstruction = `Eres el asistente virtual de un menú digital inclusivo. Tu objetivo es facilitar la toma de pedidos a personas con barreras de comunicación.
Responde en español, de forma muy cálida, concisa (máximo 2 oraciones) y con lenguaje sencillo.

MENÚ ESTRICTO DISPONIBLE (No ofrezcas nada fuera de esta lista):
${menuResumen}

CARRITO ACTUAL DEL CLIENTE: ${ordenActual}

REGLAS CRÍTICAS DE OPERACIÓN:
1. Si el cliente pide información (alergenos, precios), responde amablemente basándote solo en el menú.
2. Si el cliente PIDE o ORDENA un platillo, confirma verbalmente la orden y AÑADE OBLIGATORIAMENTE AL FINAL de tu respuesta la etiqueta exacta: [AGREGAR:Nombre Exacto].
   Ejemplo de usuario: "Me das unos tacos"
   Tu respuesta: "Claro que sí, enseguida preparamos tus Tacos al Pastor. [AGREGAR:Tacos al Pastor]"
3. OJO: No uses la etiqueta [AGREGAR:...] si el usuario solo está preguntando por el platillo.
4. Si el cliente pide la cuenta, finalizar o descargar, despídete amablemente y añade AL FINAL: [DESCARGAR_ORDEN].`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: chatHistory,
                generationConfig: { 
                    temperature: 0.2,
                    maxOutputTokens: 150
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();
        typingDiv.remove();

        if (!response.ok) {
            console.error('Gemini API HTTP error:', response.status, data);
            throw new Error(`HTTP ${response.status}: ${data?.error?.message || 'Sin detalle'}`);
        }

        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
            chatHistory.push({ role: 'model', parts: [{ text: rawText }] });
            const botText = procesarComandosIA(rawText);
            addMessage(botText, 'bot');
            if (isReadAloud) hablar(botText);
        } else {
            throw new Error('Respuesta vacía de Gemini');
        }
    } catch (error) {
        if (typingDiv.parentNode) typingDiv.remove();
        console.error('Error Gemini API:', error);
        const fallback = processBotMessageLocal(userMessage);
        chatHistory.push({ role: 'model', parts: [{ text: fallback }] });
        addMessage(fallback, 'bot');
        if (isReadAloud) hablar(fallback);
    }
}

function procesarComandosIA(texto) {
    const agregarMatch = texto.match(/\[AGREGAR:([^\]]+)\]/);
    if (agregarMatch) {
        const nombre = agregarMatch[1].trim();
        const platillo = platillosData[nombre];
        if (platillo) {
            agregarAlCarrito(nombre, platillo.price);
        }
        return texto.replace(/\[AGREGAR:[^\]]+\]/, '').trim();
    }

    if (texto.includes('[DESCARGAR_ORDEN]')) {
        setTimeout(() => descargarOrden(), 500);
        return texto.replace('[DESCARGAR_ORDEN]', '').trim();
    }

    return texto;
}

function processBotMessageLocal(message) {
    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (msg.match(/hola|buenas|hey|que tal|buenos dias|tardes|noches/)) {
        return "¡Hola! El asistente inteligente está en mantenimiento, pero te atiendo yo. Puedes pedirme el menú, ordenar algún platillo o consultar precios.";
    }
    if (msg.match(/recomienda|sugieres|mejor|rico/)) {
        return "¡Te recomiendo mucho los Tacos al Pastor o la Hamburguesa Clásica! Son los favoritos de la casa. ¿Te gustaría ordenar alguno?";
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

        return "Si deseas saber el precio o ingredientes de un platillo, por favor menciona su nombre (ej. 'precio de los tacos' o 'qué lleva la pizza').";
    }

    let platilloAgregado = false;
    let respuesta = "";

    if (msg.match(/taco|pastor|tacos/)) {
        agregarAlCarrito('Tacos al Pastor', 12.99);
        respuesta = "¡Excelente elección! He agregado unos Tacos al Pastor a tu orden. ";
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
        respuesta = "Sushi Roll California agregado a tu cuenta. ¡Delicioso! ";
        platilloAgregado = true;
    }
    else if (msg.match(/ensalada|cesar/)) {
        agregarAlCarrito('Ensalada César', 11.99);
        respuesta = "Una opción fresca. Ensalada César agregada a tu orden. ";
        platilloAgregado = true;
    }
    else if (msg.match(/pasta|carbonara|espagueti|spaghetti/)) {
        agregarAlCarrito('Pasta Carbonara', 15.99);
        respuesta = "¡Mamma mia! Pasta Carbonara en tu carrito. ";
        platilloAgregado = true;
    }
    else if (msg.match(/pollo|teriyaki/)) {
        agregarAlCarrito('Pollo Teriyaki', 17.99);
        respuesta = "Pollo Teriyaki añadido a tu orden. ¡Buena elección! ";
        platilloAgregado = true;
    }
    else if (msg.match(/salmon|filete/)) {
        agregarAlCarrito('Filete de Salmón', 24.99);
        respuesta = "Un Filete de Salmón agregado a tu cuenta. ";
        platilloAgregado = true;
    }

    if (platilloAgregado) {
        return respuesta + "¿Deseas algo más o te preparo la cuenta?";
    }

    if (msg.match(/total|cuenta|llevo|pedido|orden|cuanto es/)) {
        if (orden.length === 0) return "Tu orden está vacía en este momento. ¿Te sirvo algo?";
        return `Llevas ${orden.length} platillos. El total es de $${total.toFixed(2)}. Si ya terminaste, dime "descargar orden" o "pagar".`;
    }

    if (msg.match(/quitar|eliminar|borrar|cancelar/)) {
        return "Para quitar un platillo de tu orden, por favor usa el botón con la 'X' roja que está junto al precio en tu carrito visual.";
    }

    if (msg.match(/descargar|pagar|terminar|finalizar|listo|ya/)) {
        if (orden.length === 0) return "No puedes finalizar porque no has pedido nada aún. ¿Qué te ofrezco?";
        setTimeout(() => descargarOrden(), 1000);
        return "¡Perfecto! Estoy descargando el recibo de tu orden. Por favor, muestra el archivo en pantalla al personal.";
    }

    if (msg.match(/gracias|ok|va|bien|perfecto/)) {
        return "¡Con gusto! Aquí sigo si necesitas agregar algo más.";
    }

    return "No te entendí muy bien. Recuerda que puedes preguntarme cosas como '¿qué lleva el sushi?', o pedir directamente 'quiero unos tacos'.";
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
// RECONOCIMIENTO DE VOZ — CORREGIDO Y ROBUSTO
// ==========================================
let recognitionInstance = null;

function activarVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const micBtn = document.getElementById('mic-btn');

    if (!SpeechRecognition) {
        addMessage('Su navegador no soporta reconocimiento de voz. Use Chrome o Edge.', 'bot');
        return;
    }

    // Si ya está escuchando, detener la instancia actual
    if (recognitionInstance) {
        try {
            recognitionInstance.stop();
        } catch (e) {
            // Ignorar errores al detener
        }
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        return;
    }

    // Asegurar que el chat esté abierto
    const chatWindow = document.getElementById('chatbot-window');
    if (!chatWindow.classList.contains('active')) toggleChatbot();

    // Cancelar TTS antes de activar el micrófono
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
        // Limpiar estado ANTES de enviar el mensaje
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
            'permission-denied':  'Permiso de micrófono denegado. Habilítelo en los ajustes del navegador e intente de nuevo.',
            'no-speech':          'No escuché nada. Intente de nuevo hablando cerca del micrófono.',
            'audio-capture':      'No se encontró micrófono. Verifique que su dispositivo tenga uno conectado.',
            'network':            'Error de red al procesar la voz. Verifique su conexión.',
            'aborted':            'Micrófono cancelado.',
        };
        const msg = msgs[event.error] || `Error de micrófono (${event.error}). Intente escribir su mensaje.`;
        addMessage(msg, 'bot');
    };

    recognition.onend = () => {
        // Solo limpiar si este recognition sigue siendo la instancia activa
        if (recognitionInstance === recognition) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        }
    };

    // Pequeño retraso para asegurar que TTS se haya cancelado completamente
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
    chatHistory.push({ role: 'user', parts: [{ text: texto }] });
    callGeminiAPI(texto);
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
    // Animación de entrada para las tarjetas
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 80);
    });

    // Voz de bienvenida automática
    let voiceStarted = false;
    function iniciarVozBienvenida() {
        if (voiceStarted) return;
        voiceStarted = true;
        speakWelcome();
    }

    setTimeout(iniciarVozBienvenida, 800);

    // Respaldo para iOS/Android: arrancar en el primer toque
    document.addEventListener('pointerdown', iniciarVozBienvenida, { once: true });

    // Limpiar modo guardado para elegir cada vez
    localStorage.removeItem('accessMode');
});