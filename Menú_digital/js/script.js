// ==========================================
// VARIABLES GLOBALES
// ==========================================
let total = 0;
let orden = [];
let isReadAloud = false;
let isHighContrast = false;
let isBlindMode = false;
let speechSynth = window.speechSynthesis;
let voiceAssistantEnabled = true; // controla si bot habla y mic está activo

// Sistema de doble-tap para modo ciego
let pendingAction = null;
let pendingTimeout = null;

// Datos de platillos
const platillosData = {
    'Tacos al Pastor': { 
        desc: 'Tres auténticos tacos de cerdo marinado al estilo pastor, preparados con una mezcla artesanal de chiles guajillo y ancho, achiote, especias y zumo de piña natural. La carne se asa lentamente en trompo vertical hasta dorar por fuera y jugosa por dentro. Se sirven sobre tortillas de maíz recién hechas, coronados con trozos de piña fresca caramelizada, cilantro picado y cebolla blanca. Acompañados de salsa roja de chile de árbol, salsa verde tomatillo y rodajas de limón. Una explosión de sabores tradicionales mexicanos que combinan lo ahumado, lo dulce de la piña y el picante de las salsas.',
        ingredients: ['Carne de cerdo', 'Chile guajillo', 'Chile ancho', 'Piña natural', 'Achiote', 'Cilantro', 'Cebolla', 'Tortillas de maíz'],
        price: 12.99
    },
    'Hamburguesa Clásica': {
        desc: 'Hamburguesa artesanal con medallón de carne de res molida premium de 200 gramos, formada a mano y cocinada al término medio para conservar todos sus jugos. Se sirve en un suave pan brioche tostado con mantequilla, untado con mayonesa casera y mostaza Dijon. Lleva lechuga romana crujiente, rodajas de tomate maduro, aros de cebolla morada encurtida, pepinillos artesanales y una generosa capa de queso cheddar fundido. Acompañada de papas fritas crujientes y aderezo especial de la casa. El equilibrio perfecto entre lo clásico y lo gourmet.',
        ingredients: ['Carne de res molida premium', 'Queso cheddar', 'Lechuga romana', 'Tomate', 'Cebolla', 'Pepinillos', 'Pan brioche', 'Salsas especiales'],
        price: 14.99
    },
    'Pizza Margarita': {
        desc: 'Pizza napolitana clásica horneada en horno de piedra a alta temperatura para lograr una base crujiente por fuera y ligeramente esponjosa por dentro. La masa se elabora artesanalmente con 48 horas de fermentación lenta para desarrollar todo su sabor. Se cubre con salsa de tomates San Marzano importados, aplastados a mano con ajo y albahaca. Encima, generosas porciones de mozzarella di bufala fresca y campana que se funde perfectamente. Al salir del horno se añaden hojas de albahaca fresca, un hilo de aceite de oliva extra virgen y una pizca de sal marina en escamas. Sencilla, honesta y perfecta.',
        ingredients: ['Masa de pizza artesanal', 'Tomates San Marzano', 'Mozzarella di bufala', 'Albahaca fresca', 'Aceite de oliva extra virgen', 'Sal marina', 'Orégano'],
        price: 16.99
    },
    'Sushi Roll California': {
        desc: 'Roll de sushi estilo California preparado por nuestro chef con técnica tradicional japonesa. Arroz de sushi sazonado con vinagre de arroz, azúcar y sal, extendido sobre lámina de nori tostada. Se rellena con palitos de imitación de cangrejo, aguacate Hass cremoso maduro en su punto y bastones de pepino fresco. Se enrolla con esterilla de bambú, se reboza en semillas de ajonjolí tostadas y se corta en 8 piezas uniformes. Se sirve con salsa de soya, jengibre en escabeche para limpiar el paladar entre piezas y wasabi al gusto. Una combinación suave, fresca y equilibrada, ideal para quienes se inician en el sushi.',
        ingredients: ['Arroz para sushi', 'Nori (alga marina)', 'Imitación de cangrejo', 'Aguacate', 'Pepino', 'Mayonesa japonesa', 'Semillas de ajonjolí', 'Salsa de soya'],
        price: 18.99
    },
    'Ensalada César': {
        desc: 'La icónica ensalada César preparada con la receta original, sin compromisos. Hojas de lechuga romana seleccionadas, lavadas y secadas, troceadas en piezas generosas para mantener su textura crujiente. El aderezo se prepara al momento emulsionando yema de huevo, filete de anchoa, ajo asado, jugo de limón, mostaza Dijon y aceite de oliva hasta lograr una crema sedosa. Se añade queso parmesano reggiano recién rallado en abundancia. Los crutones de pan de campo se hornean con ajo, romero y aceite hasta dorarlos perfectamente. Se termina con pimienta negra recién molida y más parmesano en lascas. Fresca, cremosa y llena de carácter.',
        ingredients: ['Lechuga romana', 'Queso parmesano', 'Huevo', 'Pan para crutones', 'Aceite de oliva', 'Mostaza Dijon', 'Limón', 'Ajo'],
        price: 11.99
    },
    'Pasta Carbonara': {
        desc: 'Auténtica pasta carbonara romana elaborada con la receta tradicional, sin crema de leche — como manda la tradición. Espagueti de sémola de trigo duro cocido al dente en agua con sal abundante. La salsa se prepara fuera del fuego mezclando yemas de huevo frescas con queso pecorino romano rallado fino y pimienta negra recién molida en cantidad generosa, creando una emulsión untuosa y sedosa. La panceta curada se dora en sartén hasta quedar crujiente y aromática. Se mezcla todo rápidamente con el calor residual de la pasta para que el huevo no cuaje. El resultado es un plato cremoso, intenso y profundamente sabroso, fiel a la Roma de siempre.',
        ingredients: ['Espagueti', 'Panceta', 'Queso pecorino romano', 'Huevo', 'Pimienta negra', 'Sal'],
        price: 15.99
    },
    'Pollo Teriyaki': {
        desc: 'Pechuga de pollo de libre pastoreo marinada durante 12 horas en salsa teriyaki casera elaborada con salsa de soya japonesa, sake, mirin, azúcar morena, jengibre fresco rallado y ajo. Se sella a fuego alto en plancha de hierro para lograr esa costra caramelizada exterior característica, y se termina al horno para conservar toda su jugosidad interior. Se glasea al final con más salsa reducida hasta obtener un acabado brillante y lacado. Se sirve sobre arroz jazmín al vapor, acompañado de verduras salteadas con aceite de sésamo: brócoli, zanahoria, pimientos y ejotes. Un platillo equilibrado, aromático y lleno de umami.',
        ingredients: ['Pechuga de pollo', 'Salsa de soya', 'Sake', 'Azúcar', 'Jengibre', 'Ajo', 'Vegetales variados'],
        price: 17.99
    },
    'Filete de Salmón': {
        desc: 'Filete de salmón noruego fresco de 220 gramos, de carne firme, color rosado intenso y sabor suave. Se sella primero en sartén con mantequilla clarificada para lograr una piel crujiente y dorada, luego se termina al horno con hierbas frescas: eneldo, perejil y tomillo. Se baña con beurre blanc de limón amarillo, alcaparras y cebollín para realzar su sabor natural sin opacarlo. Se acompaña de papas cambray asadas con romero y aceite de oliva, más un bouquet de espárragos verdes salteados con mantequilla y flor de sal. Un plato elegante, ligero y nutritivo que celebra la calidad del producto.',
        ingredients: ['Filete de salmón noruego', 'Limón', 'Mantequilla', 'Perejil', 'Eneldo', 'Papas', 'Espárragos', 'Sal y pimienta'],
        price: 24.99
    }
};

// ==========================================
// SISTEMA DE VOZ
// ==========================================
function hablar(texto, onEnd) {
    if (!voiceAssistantEnabled) { if (onEnd) onEnd(); return; }
    if (speechSynth.speaking) speechSynth.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = 'es-MX';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const circle = document.getElementById('bubble-circle');
    if (circle && isBlindMode) {
        circle.classList.remove('listening', 'idle');
        circle.classList.add('speaking');
    }
    utterance.onend = () => {
        if (circle && isBlindMode) {
            circle.classList.remove('speaking');
            circle.classList.add('idle');
        }
        if (onEnd) onEnd();
    };
    speechSynth.speak(utterance);
}

// ==========================================
// SISTEMA DE DOBLE-TAP PARA MODO CIEGO
// ==========================================
function blindTap(label, fn, event) {
    if (!isBlindMode) { fn(); return; }
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
// CARRITO DE COMPRAS
// ==========================================
function agregarAlCarrito(nombre, precio, cantidad = 1, removidos = [], agregados = []) {
    if (cantidad <= 0) return;
    orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: removidos, added: agregados } });
    total += precio * cantidad;
    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
    renderizarOrden();
    if (isReadAloud) hablar(`${nombre} agregado a su orden.`);
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
    if (isReadAloud) hablar('Orden descargada. Muestre el archivo al personal.');
}

// ==========================================
// MODAL DE INGREDIENTES (para clientes videntes)
// ==========================================
let ingredienteModalCallback = null;

function abrirModalIngredientes(nombre, precio) {
    const data = platillosData[nombre];
    if (!data) { agregarAlCarrito(nombre, precio, 1); return; }

    // Crear modal
    let modal = document.getElementById('ingredientes-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ingredientes-modal';
        modal.className = 'ingredientes-modal-overlay';
        document.body.appendChild(modal);
    }

    const checkboxes = data.ingredients.map(ing =>
        `<label class="ing-check">
            <input type="checkbox" value="${ing}" checked>
            <span>${ing}</span>
        </label>`
    ).join('');

    modal.innerHTML = `
        <div class="ingredientes-modal-content" role="dialog" aria-modal="true" aria-labelledby="ing-modal-title">
            <button class="ingredientes-modal-close" onclick="cerrarModalIngredientes()" aria-label="Cerrar">
                <i class="fas fa-times"></i>
            </button>
            <h3 id="ing-modal-title"><i class="fas fa-utensils"></i> ${nombre}</h3>
            <p class="ing-modal-sub">Desmarque los ingredientes que no desea:</p>
            <div class="ing-checks-grid">
                ${checkboxes}
            </div>
            <div class="ing-modal-actions">
                <button class="btn btn-primary ing-confirm-btn" onclick="confirmarIngredientes('${nombre}', ${precio})">
                    <i class="fas fa-plus-circle"></i> Agregar al carrito
                </button>
                <button class="btn btn-secondary" onclick="cerrarModalIngredientes()">Cancelar</button>
            </div>
        </div>`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModalIngredientes() {
    const modal = document.getElementById('ingredientes-modal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

function confirmarIngredientes(nombre, precio) {
    const modal = document.getElementById('ingredientes-modal');
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    const todos = platillosData[nombre].ingredients;
    const seleccionados = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);
    const removidos = todos.filter(i => !seleccionados.includes(i));
    cerrarModalIngredientes();
    agregarAlCarrito(nombre, precio, 1, removidos, []);
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
    if (e.key === 'Escape') {
        if (document.getElementById('video-modal').classList.contains('active')) cerrarVideo();
        const ingModal = document.getElementById('ingredientes-modal');
        if (ingModal && ingModal.classList.contains('active')) cerrarModalIngredientes();
    }
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
        const nombre = card.dataset.name;
        const precio = card.dataset.price;
        const desc = card.dataset.desc || '';
        texto = `Platillo: ${nombre}. Precio: ${precio} pesos. ${desc}`;
    } else if (target.closest('.btn-primary[data-action="agregar"]')) {
        const btn = target.closest('[data-action="agregar"]');
        texto = `Agregar ${btn.dataset.nombre} a la orden por ${btn.dataset.precio} pesos.`;
    } else if (target.closest('.btn-secondary')) {
        texto = 'Botón: Ver descripción y video del platillo.';
    }
    if (texto) hablar(texto);
}

// ==========================================
// PANTALLA DE BIENVENIDA Y SELECCIÓN DE MODO
// ==========================================
let modoSeleccionRecognition = null;
let micSeleccionActivo = true; // controla si el mic de selección está activo

function iniciarMicSeleccion() {
    if (!micSeleccionActivo) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (modoSeleccionRecognition) return;
    const rec = new SpeechRecognition();
    modoSeleccionRecognition = rec;
    rec.lang = 'es-MX';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
        const texto = e.results[0][0].transcript.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        modoSeleccionRecognition = null;
        if (texto.includes('sin barrera') || texto.includes('uno') || texto.includes('1')) {
            detenerMicSeleccion(); selectMode('default');
        } else if (texto.includes('sordera') || texto.includes('hipoacusia') || texto.includes('dos') || texto.includes('2')) {
            detenerMicSeleccion(); selectMode('deaf');
        } else if (texto.includes('ceguera') || texto.includes('baja vision') || texto.includes('tres') || texto.includes('3')) {
            detenerMicSeleccion(); selectMode('blind');
        } else if (texto.includes('hablar') || texto.includes('barrera') || texto.includes('cuatro') || texto.includes('4')) {
            detenerMicSeleccion(); selectMode('quiet');
        } else if (texto.includes('silenciar') || texto.includes('detener') || texto.includes('parar')) {
            micSeleccionActivo = false;
            detenerMicSeleccion();
        } else {
            // No reconoció opción válida — reintentar
            setTimeout(() => iniciarMicSeleccion(), 500);
        }
    };
    rec.onerror = () => {
        modoSeleccionRecognition = null;
        if (micSeleccionActivo) setTimeout(() => iniciarMicSeleccion(), 1000);
    };
    rec.onend = () => {
        if (modoSeleccionRecognition === rec) modoSeleccionRecognition = null;
        // Reiniciar automáticamente si sigue activo y no se eligió nada
        if (micSeleccionActivo && !modoSeleccionRecognition) {
            setTimeout(() => iniciarMicSeleccion(), 600);
        }
    };
    try { rec.start(); } catch(e) { modoSeleccionRecognition = null; }
}

function detenerMicSeleccion() {
    micSeleccionActivo = false;
    if (modoSeleccionRecognition) {
        try { modoSeleccionRecognition.stop(); } catch(e) {}
        modoSeleccionRecognition = null;
    }
}

function mostrarPantallaSeleccion() {
    micSeleccionActivo = true;
    const welcomeEl = document.getElementById('welcome-overlay');
    if (welcomeEl) {
        welcomeEl.style.display = 'flex';
        // Siempre hablar las opciones al mostrar pantalla de selección (persona puede ser ciega)
        setTimeout(() => {
            hablar(
                "Bienvenido al menú digital accesible. " +
                "Opción uno: Sin barrera de comunicación. " +
                "Opción dos: Sordera o hipoacusia. " +
                "Opción tres: Baja visión o ceguera. " +
                "Opción cuatro: Barrera para hablar. " +
                "Puede decirlo por voz o tocar el botón. " +
                "Diga silenciar para detener el audio.",
                () => {
                    // Iniciar mic después de que termina de hablar
                    if (micSeleccionActivo) iniciarMicSeleccion();
                }
            );
        }, 400);
    }
}

function speakWelcome() {
    hablar(
        "Bienvenido al menú digital accesible. " +
        "Opción uno: Sin barrera de comunicación. " +
        "Opción dos: Sordera o hipoacusia. " +
        "Opción tres: Baja visión o ceguera. " +
        "Opción cuatro: Barrera para hablar. " +
        "Puede decirlo por voz o tocar el botón."
    );
}

function hideOverlay(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); setTimeout(() => el.remove(), 500); }
}

function selectMode(mode) {
    speechSynth.cancel();
    detenerMicSeleccion();
    if (mode === 'blind') {
        closeWelcome();
        // Mostrar overlay de elección ciego y hablar las opciones
        const overlay = document.getElementById('blind-choice-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => {
                hablar(
                    "¿Cómo prefiere interactuar? " +
                    "Opción uno: Lector de pantalla del dispositivo. Usa el TTS de su teléfono. " +
                    "Opción dos: Chatbot IA por voz. El asistente de voz inteligente le atiende hablando. " +
                    "Opción tres: Lector de voz de la página. Alto contraste y lector integrado activado automáticamente. " +
                    "Diga uno, dos o tres, o toque el botón.",
                    () => iniciarMicElegirCiego()
                );
            }, 200);
        }
        return;
    }
    aplicarModo(mode);
    closeWelcome();
}

// Mic para elegir entre voice/reader en blind-choice-overlay
let blindChoiceRec = null;
function iniciarMicElegirCiego() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || blindChoiceRec) return;
    const rec = new SpeechRecognition();
    blindChoiceRec = rec;
    rec.lang = 'es-MX';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
        blindChoiceRec = null;
        const texto = e.results[0][0].transcript.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (texto.includes('uno') || texto.includes('1') || texto.includes('tts') || texto.includes('lector') || texto.includes('telefono') || texto.includes('dispositivo')) {
            setBlindMode('tts');
        } else if (texto.includes('dos') || texto.includes('2') || texto.includes('voz') || texto.includes('asistente') || texto.includes('chatbot') || texto.includes('ia')) {
            setBlindMode('voice');
        } else if (texto.includes('tres') || texto.includes('3') || texto.includes('contraste') || texto.includes('pantalla')) {
            setBlindMode('reader');
        } else {
            setTimeout(() => iniciarMicElegirCiego(), 500);
        }
    };
    rec.onerror = () => { blindChoiceRec = null; setTimeout(() => iniciarMicElegirCiego(), 1000); };
    rec.onend = () => { if (blindChoiceRec === rec) blindChoiceRec = null; };
    try { rec.start(); } catch(e) { blindChoiceRec = null; }
}

function setBlindMode(choice) {
    if (blindChoiceRec) { try { blindChoiceRec.stop(); } catch(e) {} blindChoiceRec = null; }
    hideOverlay('blind-choice-overlay');
    aplicarModo('blind', choice);
    sessionStorage.setItem('blindChoice', choice);
}

function aplicarModo(mode, blindChoice = null) {
    sessionStorage.setItem('accessMode', mode);

    // Por defecto, ocultar el chatbot en todos los modos excepto donde se necesita
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) chatbotContainer.style.display = 'none';

    switch (mode) {
        case 'deaf':
            document.querySelectorAll('.btn-secondary').forEach(b => { b.style.borderColor = '#2563EB'; b.style.background = '#DBEAFE'; });
            // Mostrar chatbot en modo sordo también (pueden escribir)
            if (chatbotContainer) chatbotContainer.style.display = '';
            break;
        case 'blind':
            if (!isHighContrast) toggleHighContrast();
            document.documentElement.style.setProperty('--font-size-base', '20px');
            if (blindChoice === 'voice') {
                isReadAloud = true;
                voiceAssistantEnabled = true;
                document.getElementById('btn-read').classList.add('active');
                document.addEventListener('click', leerElemento);
                activarModoCiego();
                document.body.classList.add('blind-voice-simplified');
                // Solo en este modo aparece la burbuja de voz
                document.getElementById('blind-bubble').classList.remove('hidden');
                // Chatbot visible pero sin botón toggle (la burbuja lo controla)
                if (chatbotContainer) chatbotContainer.style.display = '';
                const mensajes = document.getElementById('chatbot-messages');
                mensajes.innerHTML = '';
                addMessage("¡Hola! Soy su asistente de pedido. Diga el nombre de un platillo para pedirlo, pregunte ingredientes, o diga «ver mi orden» o «pagar». ¡Toque la burbuja cuando quiera hablar!", 'bot');

                const savedOrden = sessionStorage.getItem('ordenGuardada');
                if (savedOrden) {
                    try {
                        const parsed = JSON.parse(savedOrden);
                        if (parsed.items && parsed.items.length > 0) {
                            orden = parsed.items;
                            total = parsed.total;
                            document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
                            renderizarOrden();
                            let resumen = "Bienvenido de nuevo. Su orden anterior tiene: ";
                            parsed.items.forEach(i => resumen += `${i.cantidad} ${i.nombre}, `);
                            resumen += `Total: ${total.toFixed(2)} pesos. ¿Desea continuar o hacer cambios?`;
                            setTimeout(() => {
                                actualizarBurbujaEstado('speaking', 'Escúchame...');
                                hablar(resumen, () => {
                                    actualizarBurbujaEstado('idle', 'Toca para hablar');
                                    setTimeout(() => activarVozCiego(), 600);
                                });
                            }, 500);
                            return;
                        }
                    } catch(e) {}
                }

                const mensajeBienvenida = "Hola, bienvenido. Soy su asistente de voz. Puedo ayudarle a pedir platillos, consultar ingredientes, personalizar su orden y enviarla al personal. Por ejemplo, puede decir: quiero dos tacos al pastor, o, ¿qué ingredientes tiene la hamburguesa? Toque la burbuja cuando quiera hablar. ¿Qué desea ordenar hoy?";
                setTimeout(() => {
                    actualizarBurbujaEstado('speaking', 'Escúchame...');
                    hablar(mensajeBienvenida, () => {
                        actualizarBurbujaEstado('idle', 'Toca para hablar');
                        setTimeout(() => activarVozCiego(), 600);
                    });
                }, 500);
            } else if (blindChoice === 'tts') {
                // Modo TTS del dispositivo: interfaz visual normal con ARIA enriquecido
                // La burbuja de voz NO aparece - el TTS del teléfono (VoiceOver/TalkBack) lo hace
                document.getElementById('blind-bubble').classList.add('hidden');
                document.body.classList.add('blind-tts-mode');
                isReadAloud = false; // No usamos el TTS interno de la página
                voiceAssistantEnabled = false;
                // Chatbot oculto en este modo
                if (chatbotContainer) chatbotContainer.style.display = 'none';
                // Aplicar ARIA live region y focus en el título del menú
                setTimeout(() => {
                    const titulo = document.querySelector('.section-title');
                    if (titulo) titulo.focus();
                }, 300);
            } else {
                // reader: TTS de la página activado automáticamente (no chatbot, no burbuja)
                isReadAloud = true;
                voiceAssistantEnabled = true;
                document.getElementById('btn-read').classList.add('active');
                document.addEventListener('click', leerElemento);
                document.getElementById('blind-bubble').classList.add('hidden');
                // Anunciar activación por voz de la página
                setTimeout(() => {
                    hablar(
                        "Lector de voz de la página activado. Puede navegar el menú y escuchar las descripciones de cada platillo. " +
                        "Toque cualquier tarjeta para escuchar el platillo. " +
                        "Toque el botón Agregar para añadirlo a su orden."
                    );
                }, 300);
            }
            break;
        case 'quiet':
            closeWelcome();
            document.getElementById('blind-bubble').classList.add('hidden');
            // En modo silencio sí se muestra el chatbot
            if (chatbotContainer) chatbotContainer.style.display = '';
            setTimeout(() => { toggleChatbot(); setTimeout(() => document.getElementById('chatbot-input').focus(), 150); }, 300);
            break;
        default:
            // Modo default: burbuja no aparece, chatbot disponible
            document.getElementById('blind-bubble').classList.add('hidden');
            if (chatbotContainer) chatbotContainer.style.display = '';
            break;
    }
}

function activarModoCiego() {
    isBlindMode = true;
    document.body.classList.add('blind-mode');
}

// ==========================================
// CONTROL DE BURBUJA MODO CIEGO
// ==========================================
function actualizarBurbujaEstado(estado, textoStatus) {
    const circle = document.getElementById('bubble-circle');
    const status = document.getElementById('bubble-status');
    const glyph  = document.getElementById('bubble-icon-glyph');
    if (!circle) return;
    circle.classList.remove('speaking', 'listening', 'idle');
    circle.classList.add(estado);
    if (status) status.textContent = textoStatus || '';
    if (glyph) {
        glyph.className = estado === 'speaking' ? 'fas fa-volume-high' : 'fas fa-microphone';
    }
}

// Versión especial de activarVoz para modo ciego
function activarVozCiego() {
    if (!isBlindMode) { activarVoz(); return; }
    if (!voiceAssistantEnabled) {
        actualizarBurbujaEstado('idle', 'Asistente silenciado');
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        actualizarBurbujaEstado('idle', 'Voz no disponible');
        hablar('Su navegador no soporta reconocimiento de voz. Por favor escriba su pedido.');
        return;
    }
    if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch(e) {}
        recognitionInstance = null;
        actualizarBurbujaEstado('idle', 'Toca para hablar');
        return;
    }
    speechSynth.cancel();
    const recognition = new SpeechRecognition();
    recognitionInstance = recognition;
    recognition.lang = 'es-MX';
    recognition.continuous = false;
    recognition.interimResults = false;
    actualizarBurbujaEstado('listening', 'Escuchando...');
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionInstance = null;
        actualizarBurbujaEstado('speaking', 'Procesando...');
        document.getElementById('chatbot-input').value = transcript;
        addMessage(transcript, 'user');
        const respuesta = processBotMessageLocal(transcript);
        setTimeout(() => {
            addMessage(respuesta, 'bot');
            actualizarBurbujaEstado('speaking', 'Respondiendo...');
            hablar(respuesta, () => {
                if (voiceAssistantEnabled) {
                    actualizarBurbujaEstado('idle', 'Toca para hablar');
                    setTimeout(() => activarVozCiego(), 800);
                } else {
                    actualizarBurbujaEstado('idle', 'Asistente silenciado');
                }
            });
        }, 400);
    };
    recognition.onerror = (event) => {
        console.error('Mic error:', event.error);
        recognitionInstance = null;
        if (voiceAssistantEnabled) {
            actualizarBurbujaEstado('idle', 'Toca para hablar');
        }
    };
    recognition.onend = () => {
        if (recognitionInstance === recognition) {
            recognitionInstance = null;
            if (voiceAssistantEnabled) actualizarBurbujaEstado('idle', 'Toca para hablar');
        }
    };
    setTimeout(() => {
        try { recognition.start(); } catch(err) {
            recognitionInstance = null;
            actualizarBurbujaEstado('idle', 'Toca para hablar');
        }
    }, 100);
}

function closeWelcome() { hideOverlay('welcome-overlay'); }

// ==========================================
// DESACTIVAR / REACTIVAR ASISTENTE DE VOZ
// ==========================================
function desactivarTTS() {
    speechSynth.cancel();
    voiceAssistantEnabled = false;
    isReadAloud = false;
    document.getElementById('btn-read').classList.remove('active');
    document.removeEventListener('click', leerElemento);
    if (recognitionInstance) {
        try { recognitionInstance.stop(); } catch(e) {}
        recognitionInstance = null;
    }
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.classList.remove('listening');
    if (isBlindMode) actualizarBurbujaEstado('idle', 'Asistente silenciado');
}

// ==========================================
// CHATBOT
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

    // Silenciar / activar asistente
    if (msg.includes('silenciar') || msg.includes('desactivar asistente') || msg.includes('silencio')) {
        desactivarTTS();
        if (recognitionInstance) { try { recognitionInstance.stop(); } catch(e) {} recognitionInstance = null; }
        return "Asistente de voz silenciado.";
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
                return `${nombre} lleva: ${platillosData[nombre].ingredients.join(', ')}. ¿Deseas quitar o agregar algo?`;
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
            // Guardar orden en sessionStorage para recuperar en recarga
            sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));
            return `He añadido ${cantidad} ${nombre} a tu orden. ¿Algo más?`;
        }
    }
    // Resumen / cuenta / total
    if (msg.match(/total|cuenta|resumen|orden|que llevo|cuanto es/)) {
        if (orden.length === 0) return "Tu orden está vacía.";
        let resumen = "Tu orden tiene: ";
        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre} a ${(i.precio*i.cantidad).toFixed(2)} pesos. `);
        resumen += `El total es ${total.toFixed(2)} pesos.`;
        return resumen;
    }
    // Pagar / enviar / finalizar
    if (msg.match(/enviar|descargar|pagar|finalizar|listo|cobrar/)) {
        if (orden.length === 0) return "No hay nada que enviar.";
        let resumen = "Finalizando su orden. Tiene: ";
        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre}. `);
        resumen += `Total a pagar: ${total.toFixed(2)} pesos. Descargando archivo.`;
        setTimeout(() => descargarOrden(), 1200);
        return resumen;
    }
    // Ayuda
    if (msg.match(/ayuda|que puedo hacer|como funciona/)) {
        return "Puedes pedir platillos (ej. '2 tacos'), preguntar ingredientes, quitar ingredientes (ej. 'sin queso'), ver el total, o pagar.";
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
// RECONOCIMIENTO DE VOZ (chatbot normal)
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
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        document.getElementById('chatbot-input').value = transcript;
        enviarMensajeDirecto(transcript);
    };
    recognition.onerror = (event) => {
        recognitionInstance = null;
        micBtn.classList.remove('listening');
        micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        addMessage('Error con el micrófono. Puedes escribir tu mensaje.', 'bot');
    };
    recognition.onend = () => {
        if (recognitionInstance === recognition) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
            micBtn.setAttribute('aria-label', 'Activar micrófono para dictado de voz');
        }
    };
    setTimeout(() => {
        try { recognition.start(); } catch (err) {
            recognitionInstance = null;
            micBtn.classList.remove('listening');
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
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach((card, i) => {
        card.style.opacity = '0'; card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1'; card.style.transform = 'translateY(0)';
        }, i * 80);
    });

    // Asegurar que la burbuja siempre esté oculta al inicio
    const bubble = document.getElementById('blind-bubble');
    if (bubble) bubble.classList.add('hidden');

    // Ocultar chatbot por defecto hasta que se elija el modo adecuado
    const chatbotContainer = document.getElementById('chatbot-container');
    if (chatbotContainer) chatbotContainer.style.display = 'none';

    // ── MANEJO INLINE DEL BOTÓN "VER VIDEO" ──────────────────────────────
    // Interceptar clicks en .btn-video-toggle para mostrar descripción debajo de la tarjeta
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-video-toggle');
        if (!btn) return;

        // Si es modo ciego-voz, dejar que el sistema de blindTap lo maneje
        if (isBlindMode && document.body.classList.contains('blind-voice-simplified')) return;

        e.stopPropagation();
        const card = btn.closest('.card');
        if (!card) return;

        const descPanel = card.querySelector('.card-video-desc');
        const nombre = btn.dataset.nombre;
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
            // Cerrar descripción inline
            btn.setAttribute('aria-expanded', 'false');
            btn.innerHTML = '<i class="fas fa-play-circle"></i> Ver Video';
            if (descPanel) {
                descPanel.hidden = true;
                descPanel.innerHTML = '';
            }
        } else {
            // Abrir descripción inline
            btn.setAttribute('aria-expanded', 'true');
            btn.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar';
            const data = platillosData[nombre];
            if (descPanel && data) {
                const ingredsList = data.ingredients.map(i => `<li>${i}</li>`).join('');
                descPanel.innerHTML = `
                    <div class="video-desc-inner">
                        <p class="video-desc-text">${data.desc}</p>
                        <details class="video-desc-ingredients">
                            <summary><i class="fas fa-list-ul"></i> Ingredientes</summary>
                            <ul>${ingredsList}</ul>
                        </details>
                        <button class="btn-open-video-modal" onclick="abrirVideo('${nombre}', '${btn.dataset.url}')">
                            <i class="fas fa-play"></i> Ver video completo
                        </button>
                    </div>`;
                descPanel.hidden = false;
                // Si es modo TTS, leer descripción para el lector de pantalla del dispositivo
                if (document.body.classList.contains('blind-tts-mode')) {
                    descPanel.setAttribute('tabindex', '-1');
                    setTimeout(() => descPanel.focus(), 100);
                }
            }
        }
    }, true); // capture para que corra antes del delegado global

    // sessionStorage: persiste en recarga, no en cierre de pestaña
    const savedMode = sessionStorage.getItem('accessMode');
    const savedBlindChoice = sessionStorage.getItem('blindChoice');

    if (savedMode) {
        if (savedMode === 'blind' && savedBlindChoice) {
            aplicarModo('blind', savedBlindChoice);
        } else {
            aplicarModo(savedMode);
        }
    } else {
        setTimeout(() => mostrarPantallaSeleccion(), 400);
    }
});
