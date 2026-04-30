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

// UTILIDAD: FORMATEAR PRECIO PARA TTS

// ==========================================

// Convierte 12.99 → "12 pesos con 99 centavos" para evitar que el TTS lo lea como fecha

function precioParaVoz(precio) {

    const n = parseFloat(precio);

    if (isNaN(n)) return precio;

    const pesos = Math.floor(n);

    const centavos = Math.round((n - pesos) * 100);

    if (centavos === 0) return `${pesos} pesos`;

    return `${pesos} pesos con ${centavos} centavos`;

}



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

function agregarAlCarrito(nombre, precio, cantidad = 1, removidos = [], agregados = [], silencioso = false) {

    if (cantidad <= 0) return;

    orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: removidos, added: agregados } });

    total += precio * cantidad;

    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);

    renderizarOrden();

    if (isReadAloud && !silencioso) hablar(`${nombre} agregado a su orden.`);

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

// ACCESIBILIDAD — lector de pantalla con doble toque real

// ==========================================

// El sistema usa un ID único por elemento para detectar "mismo elemento tocado dos veces"

// independientemente de dónde exactamente toca el dedo dentro del elemento.



let readerPendingKey = null;   // string identificador del elemento pendiente

let readerPendingTimeout = null;

let readerPendingAction = null;



function clearReaderPending() {

    if (readerPendingTimeout) { clearTimeout(readerPendingTimeout); readerPendingTimeout = null; }

    readerPendingKey = null;

    readerPendingAction = null;

}



// Obtener una clave estable para identificar el elemento tocado

function getElementKey(target) {

    // Botón con data-action tiene nombre único

    const btnAction = target.closest('[data-action]');

    if (btnAction) {

        return (btnAction.dataset.action || '') + '::' + (btnAction.dataset.nombre || btnAction.dataset.action);

    }

    // Tarjeta de platillo

    const card = target.closest('.card[data-name]');

    if (card) return 'card::' + card.dataset.name;

    // Botón genérico: usar aria-label o texto

    const btn = target.closest('button');

    if (btn) return 'btn::' + (btn.getAttribute('aria-label') || btn.textContent.trim()).slice(0, 40);

    return null;

}



// Construir la info (texto a leer + acción a ejecutar en segundo toque) según el elemento

function describir(target) {

    // ── Botón AGREGAR ──────────────────────────────────────────────────────

    const btnAgregar = target.closest('[data-action="agregar"]');

    if (btnAgregar) {

        const nombre = btnAgregar.dataset.nombre;

        const precio = btnAgregar.dataset.precio;

        const platillo = platillosData[nombre];

        // Ingredientes breves para que sepa qué va a pedir

        const ings = platillo ? platillo.ingredients.slice(0, 4).join(', ') : '';

        const textoIngs = ings ? ` Lleva: ${ings}.` : '';

        return {

            texto: `Agregar ${nombre}. ${precioParaVoz(precio)}.${textoIngs} Toque de nuevo para agregar a su orden.`,

            // Agregar directo en modo reader, sin modal visual

            action: () => {

                agregarAlCarrito(nombre, parseFloat(precio), 1, [], [], true);

                hablar(`${nombre} agregado a su orden. Total: ${precioParaVoz(total)}.`);

            }

        };

    }



    // ── Botón VER VIDEO ────────────────────────────────────────────────────

    const btnVideo = target.closest('.btn-video-toggle, [data-action="video"]');

    if (btnVideo) {

        const nombre = btnVideo.dataset.nombre || '';

        const url = btnVideo.dataset.url || '';

        const platillo = platillosData[nombre];

        // Descripción corta (la de la tarjeta, no el párrafo largo)

        const card = btnVideo.closest('.card');

        const descCorta = card ? (card.querySelector('.card-description')?.textContent?.trim() || '') : '';

        const ings = platillo ? 'Ingredientes: ' + platillo.ingredients.join(', ') + '.' : '';

        return {

            texto: `Ver video de ${nombre}. ${descCorta} ${ings} Toque de nuevo para abrir el video.`,

            action: () => abrirVideo(nombre, url)

        };

    }



    // ── Botón DESCARGAR ORDEN ──────────────────────────────────────────────

    const btnDescargar = target.closest('[data-action="descargar"]');

    if (btnDescargar) {

        return {

            texto: `Descargar orden. Toque de nuevo para guardar su orden como archivo.`,

            action: () => descargarOrden()

        };

    }



    // ── TARJETA (zona fuera de botones) ────────────────────────────────────

    const card = target.closest('.card');

    if (card && !target.closest('button')) {

        const nombre = card.dataset.name;

        const precio = card.dataset.price;

        // Usar la descripción corta que ya existe en la tarjeta, NO el párrafo largo

        const descCorta = card.querySelector('.card-description')?.textContent?.trim() || '';

        const platillo = platillosData[nombre];

        const ings = platillo ? platillo.ingredients.slice(0, 5).join(', ') : '';

        const textoIngs = ings ? ` Ingredientes principales: ${ings}.` : '';

        // Alérgenos

        const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.trim()).join(', ');

        const textoAlerg = badges ? ` Contiene: ${badges}.` : '';

        return {

            texto: `${nombre}. ${precioParaVoz(precio)}. ${descCorta}${textoIngs}${textoAlerg} Toque de nuevo para explorar opciones.`,

            action: null  // segundo toque en la tarjeta genérica no hace nada especial

        };

    }



    // ── BOTÓN GENÉRICO ─────────────────────────────────────────────────────

    const btn = target.closest('button');

    if (btn) {

        const lbl = btn.getAttribute('aria-label') || btn.textContent.trim();

        if (!lbl) return null;

        // Capturar referencia estable antes del setTimeout

        const btnRef = btn;

        return {

            texto: `${lbl}. Toque de nuevo para activar.`,

            action: () => {

                // Disparar click nativo sin pasar por el listener del reader

                isReadAloud = false;

                btnRef.click();

                isReadAloud = true;

            }

        };

    }



    return null;

}



function leerElemento(e) {

    // Zonas donde el reader NO debe interceptar

    if (e.target.closest('.accessibility-panel') || e.target.closest('.panel-content')) return;

    // Modal de video abierto: dejar pasar todos sus clicks (cerrar, iframe, etc.)

    if (document.getElementById('video-modal').classList.contains('active')) return;

    // Boton X de eliminar item del carrito

    if (e.target.closest('.btn-remove')) return;

    // Modal de ingredientes abierto

    const ingModal = document.getElementById('ingredientes-modal');

    if (ingModal && ingModal.classList.contains('active')) return;



    const key = getElementKey(e.target);

    if (!key) return;



    e.preventDefault();

    e.stopPropagation();



    if (readerPendingKey && readerPendingKey === key) {

        // SEGUNDO TOQUE: ejecutar accion

        const actionToRun = readerPendingAction;

        clearReaderPending();

        speechSynth.cancel();

        if (actionToRun) {

            hablar('Confirmado.');

            setTimeout(() => actionToRun(), 400);

        }

    } else {

        // PRIMER TOQUE: leer descripcion

        const info = describir(e.target);

        if (!info) return;

        clearReaderPending();

        readerPendingKey = key;

        readerPendingAction = info.action;

        speechSynth.cancel();

        hablar(info.texto);

        readerPendingTimeout = setTimeout(() => clearReaderPending(), 10000);

    }

}



function toggleReadAloud() {

    isReadAloud = !isReadAloud;

    document.getElementById('btn-read').classList.toggle('active', isReadAloud);

    clearReaderPending();

    if (isReadAloud) {

        hablar('Lector de pantalla activado. Toque una vez para escuchar. Toque dos veces para confirmar.');

        document.addEventListener('click', leerElemento, true);

    } else {

        speechSynth.cancel();

        document.removeEventListener('click', leerElemento, true);

    }

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

        welcomeEl.classList.add('visible');

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

    if (!el) return;

    el.classList.remove('visible');

    el.style.display = 'none';

}



function selectMode(mode) {

    speechSynth.cancel();

    detenerMicSeleccion();

    if (mode === 'blind') {

        closeWelcome();

        const overlay = document.getElementById('blind-choice-overlay');

        if (overlay) {

            overlay.style.display = 'flex';

            overlay.classList.add('visible');

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

                document.addEventListener('click', leerElemento, true);

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

                            resumen += `Total: ${precioParaVoz(total)}. Mantenga presionada la burbuja para hablar.`;

                            setTimeout(() => {

                                actualizarBurbujaEstado('speaking', 'Escúchame...');

                                hablar(resumen, () => {

                                    actualizarBurbujaEstado('idle', 'Mantén presionado');

                                });

                            }, 500);

                            return;

                        }

                    } catch(e) {}

                }



                const mensajeBienvenida = "Hola, bienvenido. Soy su asistente de voz. Mantenga presionada la burbuja para hablar y suéltela cuando termine. Por ejemplo, puede decir: quiero dos tacos al pastor, o, qué ingredientes tiene la hamburguesa.";

                setTimeout(() => {

                    actualizarBurbujaEstado('speaking', 'Escúchame...');

                    hablar(mensajeBienvenida, () => {

                        actualizarBurbujaEstado('idle', 'Mantén presionado');

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

                document.addEventListener('click', leerElemento, true);

                document.getElementById('blind-bubble').classList.add('hidden');

                // Anunciar activación

                setTimeout(() => {

                    hablar(

                        "Lector de pantalla activado. Toque una vez cualquier elemento para escuchar su descripción. " +

                        "Toque dos veces el mismo elemento para confirmar la acción. " +

                        "Por ejemplo: toque Agregar una vez para escuchar el platillo, y toque Agregar de nuevo para añadirlo a su orden."

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



// ==========================================

// PUSH-TO-TALK — modo ciego voz

// ==========================================

// El usuario mantiene presionado la burbuja para hablar y suelta para que el bot conteste.

// No hay auto-reinicio ni colisiones de estado.



let pttRecognition = null;   // instancia activa de SpeechRecognition

let pttTranscript = '';      // lo que captó el micrófono

let pttPresionado = false;   // ¿está el botón presionado ahora mismo?

let pttReinicioTimer = null; // timer para reinicio suave

let pttTouchId = null;       // identificador de touch activo (evita multi-touch)



// ── Helper interno: crear y arrancar una instancia de reconocimiento PTT ──────

function _crearRecPTT() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();

    rec.lang = 'es-MX';

    rec.continuous = true;

    rec.interimResults = true;   // interimResults=true para detectar voz más rápido

    rec.maxAlternatives = 1;



    rec.onresult = (event) => {

        // Acumular solo resultados finales; los interinos solo sirven para confirmar que hay voz

        for (let i = event.resultIndex; i < event.results.length; i++) {

            if (event.results[i].isFinal) {

                pttTranscript += event.results[i][0].transcript + ' ';

            }

        }

    };



    rec.onerror = (event) => {

        // 'no-speech' es normal — el browser expiró el silencio.

        // Si el botón sigue presionado, simplemente reiniciamos.

        if (event.error === 'no-speech' || event.error === 'audio-capture') {

            pttRecognition = null;

            if (pttPresionado) _reiniciarRecPTT();

            return;

        }

        console.warn('PTT error:', event.error);

        pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    rec.onend = () => {

        // El navegador detuvo el reconocimiento por su cuenta.

        // Si el botón aún está presionado, volvemos a arrancar.

        if (pttRecognition === rec) pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    return rec;

}



function _reiniciarRecPTT() {

    // Pequeño delay para evitar colisión de instancias ("already started")

    if (pttReinicioTimer) return;

    pttReinicioTimer = setTimeout(() => {

        pttReinicioTimer = null;

        if (!pttPresionado) return;

        const rec = _crearRecPTT();

        if (!rec) return;

        pttRecognition = rec;

        try { rec.start(); } catch(err) {

            pttRecognition = null;

            pttPresionado = false;

            actualizarBurbujaEstado('idle', 'Mantén presionado');

        }

    }, 200);

}



function iniciarEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Rastrear el identificador de toque para evitar multi-touch espurio

        if (e.type === 'touchstart') {

            if (pttTouchId !== null) return;  // ya hay un toque activo

            pttTouchId = e.changedTouches[0].identifier;

        }

    }

    if (!voiceAssistantEnabled) return;

    if (pttPresionado) return;

    pttPresionado = true;

    pttTranscript = '';



    // Si el bot estaba hablando, silenciarlo

    speechSynth.cancel();



    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        hablar('Su navegador no soporta reconocimiento de voz.');

        pttPresionado = false;

        pttTouchId = null;

        return;

    }



    actualizarBurbujaEstado('listening', 'Habla ahora...');



    const rec = _crearRecPTT();

    if (!rec) {

        pttPresionado = false;

        pttTouchId = null;

        return;

    }

    pttRecognition = rec;

    try {

        rec.start();

    } catch(err) {

        pttPresionado = false;

        pttRecognition = null;

        pttTouchId = null;

        actualizarBurbujaEstado('idle', 'Mantén presionado');

    }

}



function detenerEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Verificar que es el mismo toque que inició (evita disparos falsos de mouseleave)

        if (e.type === 'touchend' || e.type === 'touchcancel') {

            const touchId = e.changedTouches[0].identifier;

            if (touchId !== pttTouchId) return;

            pttTouchId = null;

        } else if (e.type === 'mouseleave' && !pttPresionado) {

            return; // mouseleave sin estar presionado: ignorar

        }

    }

    if (!pttPresionado) return;

    pttPresionado = false;



    // Cancelar reinicio pendiente

    if (pttReinicioTimer) { clearTimeout(pttReinicioTimer); pttReinicioTimer = null; }



    // Detener reconocimiento activo

    if (pttRecognition) {

        try { pttRecognition.stop(); } catch(err) {}

        pttRecognition = null;

    }



    const texto = pttTranscript.trim();

    pttTranscript = '';



    if (!texto) {

        actualizarBurbujaEstado('idle', 'Mantén presionado');

        hablar('No escuché nada. Mantén presionado y habla cerca del micrófono.');

        return;

    }



    // Procesar el texto capturado

    actualizarBurbujaEstado('speaking', 'Procesando...');

    document.getElementById('chatbot-input').value = texto;

    addMessage(texto, 'user');



    const respuesta = processBotMessageLocal(texto);

    setTimeout(() => {

        addMessage(respuesta, 'bot');

        actualizarBurbujaEstado('speaking', 'Respondiendo...');

        hablar(respuesta, () => {

            if (voiceAssistantEnabled) {

                actualizarBurbujaEstado('idle', 'Mantén presionado');

            }

        });

    }, 200);

}



// Mantener activarVozCiego como alias por si algún otro código lo llama

function activarVozCiego() {

    // No se usa en push-to-talk — no-op para evitar errores

}



function closeWelcome() { hideOverlay('welcome-overlay'); }



// ==========================================

// DESACTIVAR / REACTIVAR ASISTENTE DE VOZ

// ==========================================

function desactivarTTS() {

    speechSynth.cancel();

    voiceAssistantEnabled = false;

    isReadAloud = false;

    clearReaderPending();

    // Limpiar push-to-talk si estaba activo

    pttPresionado = false;

    if (pttRecognition) { try { pttRecognition.stop(); } catch(e) {} pttRecognition = null; }

    document.getElementById('btn-read').classList.remove('active');

    document.removeEventListener('click', leerElemento, true);

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

const numerosTexto = { 'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10, 'media docena':6, 'docena':12 };

function extraerCantidad(texto) {

    const matchNum = texto.match(/\b(\d+)\b/);

    if (matchNum) return parseInt(matchNum[0]);

    for (let p in numerosTexto) if (texto.includes(p)) return numerosTexto[p];

    return 1;

}



// Aliases y palabras clave alternativas para detectar platillos por nombre parcial o coloquial

const platilloAliases = {

    'Tacos al Pastor': ['taco', 'tacos', 'pastor', 'taquito', 'taquitos', 'taco pastor', 'tacos pastor', 'al pastor'],

    'Hamburguesa Clásica': ['hamburguesa', 'hamburguesas', 'burger', 'burguesa', 'hamburgesa', 'hamburger', 'clasica', 'clásica'],

    'Pizza Margarita': ['pizza', 'pizzas', 'margarita', 'margherita', 'margaritas', 'piza'],

    'Sushi Roll California': ['sushi', 'sushis', 'roll', 'rolls', 'california', 'cangrejo', 'maki', 'makis', 'rollo', 'rollos', 'roll california', 'sushi california', 'sushi roll'],

    'Ensalada César': ['ensalada', 'ensaladas', 'cesar', 'césar', 'ensalada cesar', 'ensalada verde'],

    'Pasta Carbonara': ['pasta', 'pastas', 'carbonara', 'espagueti', 'spaghetti', 'spagueti', 'carbonara pasta'],

    'Pollo Teriyaki': ['pollo', 'pollos', 'teriyaki', 'pollo teriyaki', 'teriyaky', 'pollo asian'],

    'Filete de Salmón': ['salmon', 'salmón', 'filete', 'filete salmon', 'filete de salmon', 'pescado']

};



// Encontrar platillo por nombre exacto o alias en el texto

function encontrarPlatillo(msg) {

    // Primero búsqueda exacta por nombre completo

    for (let nombre in platillosData) {

        if (msg.includes(nombre.toLowerCase())) return nombre;

    }

    // Luego búsqueda por aliases

    for (let nombre in platilloAliases) {

        const aliases = platilloAliases[nombre];

        for (let alias of aliases) {

            if (msg.includes(alias)) return nombre;

        }

    }

    return null;

}



// ── Detectar si el mensaje habla de MODIFICAR ingredientes (quitar/agregar) ──

// Retorna { accion, ingrediente, platilloRef } o null

function detectarModIngrediente(msg) {

    // Palabras clave de QUITAR ingrediente

    const regexQuitar = /\b(sin|quitar|quita|quítame|quitame|sin el|sin la|sin los|sin las|elimina|eliminar|omite|omitir|no quiero|no le pongas|no pongas|retirar|retira|remueve|remover|sin poner)\b\s+(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:de\s+(?:la\s+|el\s+|los\s+|las\s+)?|del\s+|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;

    // Palabras clave de AGREGAR ingrediente (extra/adicional, NO pedido nuevo)

    const regexAgregar = /\b(con extra|extra|adicional|agrega|agregar|añade|añadir|ponle|ponme|más|mas)\s+(?:de\s+)?(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:a\s+(?:la\s+|el\s+)?|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;



    let m = msg.match(regexQuitar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        // Validar que el "ingrediente" no sea un platillo completo (ej "sin tacos" es otro platillo)

        if (ing && !encontrarPlatillo(ing)) return { accion: 'quitar', ingrediente: ing, platilloRef: ref || null };

    }

    m = msg.match(regexAgregar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        if (ing && !encontrarPlatillo(ing)) return { accion: 'agregar', ingrediente: ing, platilloRef: ref || null };

    }

    return null;

}



// ── Detectar si el mensaje es para ELIMINAR un platillo de la orden ──────────

// Distinto a "quitar ingrediente": "quita la pizza de mi orden", "borra los tacos"

function detectarEliminarPlatillo(msg) {

    const regexElim = /\b(eliminar|elimina|quitar|quita|borrar|borra|remover|remueve|cancel|cancelar|cancela|ya no quiero|no quiero|saca|sacar)\b/;

    const regexRef  = /\b(de mi orden|de la orden|del pedido|del carrito|de mi pedido)\b/;

    // Si dice "quita/elimina + platillo + [de la orden]"

    if (!regexElim.test(msg)) return null;

    // Verificar que hay un platillo mencionado

    const platillo = encontrarPlatillo(msg);

    if (!platillo) return null;

    // Si también dice "ingrediente" conocido del platillo en la orden → es mod. de ingrediente

    // Si no, es eliminación de platillo

    return platillo;

}



function processBotMessageLocal(message) {

    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");



    // 1. Silenciar / activar asistente

    if (msg.match(/\b(silenciar|desactivar asistente|silencio|detente|stop)\b/)) {

        desactivarTTS();

        if (recognitionInstance) { try { recognitionInstance.stop(); } catch(e) {} recognitionInstance = null; }

        return "Asistente de voz silenciado. Puedes seguir escribiendo si lo necesitas.";

    }



    // 2. Saludos

    if (msg.match(/\b(hola|buenas|hey|que tal|buenos dias|tardes|noches|hi|hello)\b/)) {

        return "¡Hola! Puedes pedir diciendo por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes, o di 'menú' para escuchar las opciones.";

    }



    // 3. Menú completo

    if (msg.match(/\b(menu|platillos|opciones|que hay|que sirven|que ofrecen|carta|que tienen)\b/)) {

        let menuTxt = "Platillos disponibles: ";

        for (let nombre in platillosData) menuTxt += `${nombre} a ${precioParaVoz(platillosData[nombre].price)}, `;

        return menuTxt.replace(/, $/, '') + ". Puedes pedir con cantidad, ej. 'dos tacos' o 'tres pizzas'.";

    }



    // 4. Precio de un platillo

    if (msg.match(/\b(cuanto cuesta|precio|cuanto vale|cuanto es el|cuanto son)\b/)) {

        const platilloPrecio = encontrarPlatillo(msg);

        if (platilloPrecio) return `${platilloPrecio} cuesta ${precioParaVoz(platillosData[platilloPrecio].price)}.`;

        return "Dime de qué platillo quieres saber el precio. Por ejemplo: '¿cuánto cuesta el salmón?'";

    }



    // 5. Descripción / información de platillo

    if (msg.match(/\b(describe|descripcion|como es|que es|cuentame|informacion)\b/)) {

        const platilloDesc = encontrarPlatillo(msg);

        if (platilloDesc) return `${platilloDesc}: ${platillosData[platilloDesc].desc.slice(0, 200)}...`;

        return "Dime de qué platillo quieres la descripción.";

    }



    // 6. Ingredientes de un platillo

    if (msg.match(/\b(ingredientes|que contiene|que lleva|que tiene|componentes|alergen)\b/)) {

        const platillo = encontrarPlatillo(msg);

        if (platillo) {

            return `${platillo} lleva: ${platillosData[platillo].ingredients.join(', ')}. ¿Deseas quitar o agregar algún ingrediente? Por ejemplo: 'sin cebolla' o 'extra queso'.`;

        }

        return "Dime de qué platillo quieres saber los ingredientes. Por ejemplo: '¿qué ingredientes tiene el sushi?'";

    }



    // 7. Resumen / cuenta / total (ANTES de procesar platillos para que "ver mi orden" no agregue nada)

    if (msg.match(/\b(total|cuenta|resumen|que llevo|cuanto es|cuanto debo|cuanto seria|mi orden|ver orden|ver mi orden|que pedí|que pedi|mi pedido)\b/)) {

        if (orden.length === 0) return "Tu orden está vacía. Puedes pedir algo diciendo el nombre del platillo.";

        let resumen = "Tu orden tiene: ";

        orden.forEach(i => {

            resumen += `${i.cantidad} ${i.nombre}`;

            if (i.custom.removed.length) resumen += ` sin ${i.custom.removed.join(' ni ')}`;

            if (i.custom.added.length) resumen += ` con extra ${i.custom.added.join(' y ')}`;

            resumen += `, a ${precioParaVoz(i.precio * i.cantidad)}. `;

        });

        resumen += `El total es ${precioParaVoz(total)}.`;

        return resumen;

    }



    // 8. Pagar / enviar / finalizar

    if (msg.match(/\b(enviar|descargar|pagar|finalizar|listo|cobrar|terminar|ya es todo|eso es todo|confirmar|confirma)\b/)) {

        if (orden.length === 0) return "No hay nada que enviar. ¿Qué deseas ordenar?";

        let resumen = "Finalizando su orden. Tiene: ";

        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre}. `);

        resumen += `Total a pagar: ${precioParaVoz(total)}. Descargando archivo para mostrar al personal.`;

        setTimeout(() => descargarOrden(), 1200);

        return resumen;

    }



    // 9. Ayuda

    if (msg.match(/\b(ayuda|como funciona|ayudame|comandos)\b/)) {

        return "Puedes decir: 'quiero 2 tacos', 'dame una pizza', 'ingredientes del sushi', 'sin queso a la hamburguesa', 'extra cebolla', 'quita la pizza de mi orden', 'cuánto es el total', o 'ya es todo' para finalizar.";

    }



    // ── A partir de aquí, orden importa: MODIFICAR antes de AGREGAR ──────────



    // 10. ELIMINAR PLATILLO DE LA ORDEN

    //     "quita la pizza", "elimina los tacos", "ya no quiero el salmón"

    //     Solo si hay platillo Y hay verbo de eliminar (sin "ingrediente" claro)

    const platilloParaEliminar = detectarEliminarPlatillo(msg);

    if (platilloParaEliminar) {

        // Verificar que NO es una modificación de ingrediente (si hay ingrediente entre quitar y platillo)

        const modCheck = detectarModIngrediente(msg);

        if (!modCheck) {

            const idx = orden.findIndex(i => i.nombre === platilloParaEliminar);

            if (idx !== -1) {

                const nombreEl = orden[idx].nombre;

                eliminarDelCarrito(orden[idx].id);

                sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

                return `He eliminado ${nombreEl} de tu orden. ¿Algo más?`;

            }

            return `No tienes ${platilloParaEliminar} en tu orden actualmente. ¿Algo más en que pueda ayudarte?`;

        }

    }



    // 11. MODIFICAR INGREDIENTE (quitar o agregar extra)

    //     "sin cebolla", "quita el queso", "extra guacamole a los tacos"

    const modIng = detectarModIngrediente(msg);

    if (modIng) {

        return modificarIngrediente(modIng.ingrediente, modIng.accion, modIng.platilloRef);

    }



    // 12. AGREGAR PLATILLO A LA ORDEN

    //     "quiero 2 tacos", "dame una pizza", "dos hamburguesas"

    const platilloDetectado = encontrarPlatillo(msg);

    if (platilloDetectado) {

        const cantidad = extraerCantidad(msg);

        agregarAlCarrito(platilloDetectado, platillosData[platilloDetectado].price, cantidad);

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        const precioVoz = precioParaVoz(platillosData[platilloDetectado].price * cantidad);

        return `He añadido ${cantidad} ${platilloDetectado} a tu orden por ${precioVoz}. ¿Deseas algo más, o quieres quitar algún ingrediente?`;

    }



    // Respuesta por defecto

    return "No entendí bien. Puedes pedir algo como '2 tacos al pastor', 'una pizza', 'sin cebolla', 'quita los tacos de mi orden', o di 'menú' para escuchar todas las opciones.";

}

function modificarIngrediente(ingredienteRaw, accion, platilloRef) {

    let item = null;



    // Buscar el ítem en la orden

    if (platilloRef && platilloRef.trim()) {

        const ref = platilloRef.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (let p in platillosData) {

            const pNorm = p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (pNorm.includes(ref) || ref.includes(pNorm.split(' ')[0])) {

                item = orden.find(i => i.nombre === p);

                if (item) break;

            }

        }

    }

    // Si no encontró por platilloRef, usar el último ítem de la orden

    if (!item) item = orden[orden.length - 1];



    if (!item) return "No tienes ningún platillo en la orden. ¿Qué deseas pedir?";

    if (!item.custom) item.custom = { removed: [], added: [] };



    // Normalizar ingrediente

    const ing = ingredienteRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();



    // Intentar hacer coincidir con ingrediente real del platillo (fuzzy)

    const platData = platillosData[item.nombre];

    let ingReal = ingredienteRaw; // fallback: usar lo que dijo el usuario

    if (platData) {

        const match = platData.ingredients.find(i => {

            const iNorm = i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            return iNorm.includes(ing) || ing.includes(iNorm.split(' ')[0]);

        });

        if (match) ingReal = match;

    }



    if (accion === 'quitar') {

        if (!item.custom.removed.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.removed.push(ingReal);

        }

        item.custom.added = item.custom.added.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he quitado "${ingReal}" de ${item.nombre}. ¿Algo más que desees cambiar?`;

    } else {

        if (!item.custom.added.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.added.push(ingReal);

        }

        item.custom.removed = item.custom.removed.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he añadido extra "${ingReal}" a ${item.nombre}. ¿Algo más?`;

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



        // En modo reader, leerElemento lo maneja (abre modal directo en 2do toque)

        if (isReadAloud && !isBlindMode) return;



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



    // ── BURBUJA PTT: registrar eventos aquí (no inline) para mayor control ──

    const bubbleBtn = document.getElementById('bubble-tap-btn');

    if (bubbleBtn) {

        // Mouse (desktop / emulador)

        bubbleBtn.addEventListener('mousedown', (e) => { e.preventDefault(); iniciarEscucha(e); });

        bubbleBtn.addEventListener('mouseup',   (e) => { e.preventDefault(); detenerEscucha(e); });

        bubbleBtn.addEventListener('mouseleave',(e) => { if (pttPresionado) detenerEscucha(e); });



        // Touch (móvil): passive:false para poder llamar preventDefault()

        bubbleBtn.addEventListener('touchstart',  (e) => iniciarEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchend',    (e) => detenerEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchcancel', (e) => detenerEscucha(e), { passive: false });

    }



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

});    'Pollo Teriyaki': {

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

// UTILIDAD: FORMATEAR PRECIO PARA TTS

// ==========================================

// Convierte 12.99 → "12 pesos con 99 centavos" para evitar que el TTS lo lea como fecha

function precioParaVoz(precio) {

    const n = parseFloat(precio);

    if (isNaN(n)) return precio;

    const pesos = Math.floor(n);

    const centavos = Math.round((n - pesos) * 100);

    if (centavos === 0) return `${pesos} pesos`;

    return `${pesos} pesos con ${centavos} centavos`;

}



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

function agregarAlCarrito(nombre, precio, cantidad = 1, removidos = [], agregados = [], silencioso = false) {

    if (cantidad <= 0) return;

    orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: removidos, added: agregados } });

    total += precio * cantidad;

    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);

    renderizarOrden();

    if (isReadAloud && !silencioso) hablar(`${nombre} agregado a su orden.`);

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

// ACCESIBILIDAD — lector de pantalla con doble toque real

// ==========================================

// El sistema usa un ID único por elemento para detectar "mismo elemento tocado dos veces"

// independientemente de dónde exactamente toca el dedo dentro del elemento.



let readerPendingKey = null;   // string identificador del elemento pendiente

let readerPendingTimeout = null;

let readerPendingAction = null;



function clearReaderPending() {

    if (readerPendingTimeout) { clearTimeout(readerPendingTimeout); readerPendingTimeout = null; }

    readerPendingKey = null;

    readerPendingAction = null;

}



// Obtener una clave estable para identificar el elemento tocado

function getElementKey(target) {

    // Botón con data-action tiene nombre único

    const btnAction = target.closest('[data-action]');

    if (btnAction) {

        return (btnAction.dataset.action || '') + '::' + (btnAction.dataset.nombre || btnAction.dataset.action);

    }

    // Tarjeta de platillo

    const card = target.closest('.card[data-name]');

    if (card) return 'card::' + card.dataset.name;

    // Botón genérico: usar aria-label o texto

    const btn = target.closest('button');

    if (btn) return 'btn::' + (btn.getAttribute('aria-label') || btn.textContent.trim()).slice(0, 40);

    return null;

}



// Construir la info (texto a leer + acción a ejecutar en segundo toque) según el elemento

function describir(target) {

    // ── Botón AGREGAR ──────────────────────────────────────────────────────

    const btnAgregar = target.closest('[data-action="agregar"]');

    if (btnAgregar) {

        const nombre = btnAgregar.dataset.nombre;

        const precio = btnAgregar.dataset.precio;

        const platillo = platillosData[nombre];

        // Ingredientes breves para que sepa qué va a pedir

        const ings = platillo ? platillo.ingredients.slice(0, 4).join(', ') : '';

        const textoIngs = ings ? ` Lleva: ${ings}.` : '';

        return {

            texto: `Agregar ${nombre}. ${precioParaVoz(precio)}.${textoIngs} Toque de nuevo para agregar a su orden.`,

            // Agregar directo en modo reader, sin modal visual

            action: () => {

                agregarAlCarrito(nombre, parseFloat(precio), 1, [], [], true);

                hablar(`${nombre} agregado a su orden. Total: ${precioParaVoz(total)}.`);

            }

        };

    }



    // ── Botón VER VIDEO ────────────────────────────────────────────────────

    const btnVideo = target.closest('.btn-video-toggle, [data-action="video"]');

    if (btnVideo) {

        const nombre = btnVideo.dataset.nombre || '';

        const url = btnVideo.dataset.url || '';

        const platillo = platillosData[nombre];

        // Descripción corta (la de la tarjeta, no el párrafo largo)

        const card = btnVideo.closest('.card');

        const descCorta = card ? (card.querySelector('.card-description')?.textContent?.trim() || '') : '';

        const ings = platillo ? 'Ingredientes: ' + platillo.ingredients.join(', ') + '.' : '';

        return {

            texto: `Ver video de ${nombre}. ${descCorta} ${ings} Toque de nuevo para abrir el video.`,

            action: () => abrirVideo(nombre, url)

        };

    }



    // ── Botón DESCARGAR ORDEN ──────────────────────────────────────────────

    const btnDescargar = target.closest('[data-action="descargar"]');

    if (btnDescargar) {

        return {

            texto: `Descargar orden. Toque de nuevo para guardar su orden como archivo.`,

            action: () => descargarOrden()

        };

    }



    // ── TARJETA (zona fuera de botones) ────────────────────────────────────

    const card = target.closest('.card');

    if (card && !target.closest('button')) {

        const nombre = card.dataset.name;

        const precio = card.dataset.price;

        // Usar la descripción corta que ya existe en la tarjeta, NO el párrafo largo

        const descCorta = card.querySelector('.card-description')?.textContent?.trim() || '';

        const platillo = platillosData[nombre];

        const ings = platillo ? platillo.ingredients.slice(0, 5).join(', ') : '';

        const textoIngs = ings ? ` Ingredientes principales: ${ings}.` : '';

        // Alérgenos

        const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.trim()).join(', ');

        const textoAlerg = badges ? ` Contiene: ${badges}.` : '';

        return {

            texto: `${nombre}. ${precioParaVoz(precio)}. ${descCorta}${textoIngs}${textoAlerg} Toque de nuevo para explorar opciones.`,

            action: null  // segundo toque en la tarjeta genérica no hace nada especial

        };

    }



    // ── BOTÓN GENÉRICO ─────────────────────────────────────────────────────

    const btn = target.closest('button');

    if (btn) {

        const lbl = btn.getAttribute('aria-label') || btn.textContent.trim();

        if (!lbl) return null;

        // Capturar referencia estable antes del setTimeout

        const btnRef = btn;

        return {

            texto: `${lbl}. Toque de nuevo para activar.`,

            action: () => {

                // Disparar click nativo sin pasar por el listener del reader

                isReadAloud = false;

                btnRef.click();

                isReadAloud = true;

            }

        };

    }



    return null;

}



function leerElemento(e) {

    // Zonas donde el reader NO debe interceptar

    if (e.target.closest('.accessibility-panel') || e.target.closest('.panel-content')) return;

    // Modal de video abierto: dejar pasar todos sus clicks (cerrar, iframe, etc.)

    if (document.getElementById('video-modal').classList.contains('active')) return;

    // Boton X de eliminar item del carrito

    if (e.target.closest('.btn-remove')) return;

    // Modal de ingredientes abierto

    const ingModal = document.getElementById('ingredientes-modal');

    if (ingModal && ingModal.classList.contains('active')) return;



    const key = getElementKey(e.target);

    if (!key) return;



    e.preventDefault();

    e.stopPropagation();



    if (readerPendingKey && readerPendingKey === key) {

        // SEGUNDO TOQUE: ejecutar accion

        const actionToRun = readerPendingAction;

        clearReaderPending();

        speechSynth.cancel();

        if (actionToRun) {

            hablar('Confirmado.');

            setTimeout(() => actionToRun(), 400);

        }

    } else {

        // PRIMER TOQUE: leer descripcion

        const info = describir(e.target);

        if (!info) return;

        clearReaderPending();

        readerPendingKey = key;

        readerPendingAction = info.action;

        speechSynth.cancel();

        hablar(info.texto);

        readerPendingTimeout = setTimeout(() => clearReaderPending(), 10000);

    }

}



function toggleReadAloud() {

    isReadAloud = !isReadAloud;

    document.getElementById('btn-read').classList.toggle('active', isReadAloud);

    clearReaderPending();

    if (isReadAloud) {

        hablar('Lector de pantalla activado. Toque una vez para escuchar. Toque dos veces para confirmar.');

        document.addEventListener('click', leerElemento, true);

    } else {

        speechSynth.cancel();

        document.removeEventListener('click', leerElemento, true);

    }

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

        welcomeEl.classList.add('visible');

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

    if (!el) return;

    el.classList.remove('visible');

    el.style.display = 'none';

}



function selectMode(mode) {

    speechSynth.cancel();

    detenerMicSeleccion();

    if (mode === 'blind') {

        closeWelcome();

        const overlay = document.getElementById('blind-choice-overlay');

        if (overlay) {

            overlay.style.display = 'flex';

            overlay.classList.add('visible');

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

                document.addEventListener('click', leerElemento, true);

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

                            resumen += `Total: ${precioParaVoz(total)}. Mantenga presionada la burbuja para hablar.`;

                            setTimeout(() => {

                                actualizarBurbujaEstado('speaking', 'Escúchame...');

                                hablar(resumen, () => {

                                    actualizarBurbujaEstado('idle', 'Mantén presionado');

                                });

                            }, 500);

                            return;

                        }

                    } catch(e) {}

                }



                const mensajeBienvenida = "Hola, bienvenido. Soy su asistente de voz. Mantenga presionada la burbuja para hablar y suéltela cuando termine. Por ejemplo, puede decir: quiero dos tacos al pastor, o, qué ingredientes tiene la hamburguesa.";

                setTimeout(() => {

                    actualizarBurbujaEstado('speaking', 'Escúchame...');

                    hablar(mensajeBienvenida, () => {

                        actualizarBurbujaEstado('idle', 'Mantén presionado');

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

                document.addEventListener('click', leerElemento, true);

                document.getElementById('blind-bubble').classList.add('hidden');

                // Anunciar activación

                setTimeout(() => {

                    hablar(

                        "Lector de pantalla activado. Toque una vez cualquier elemento para escuchar su descripción. " +

                        "Toque dos veces el mismo elemento para confirmar la acción. " +

                        "Por ejemplo: toque Agregar una vez para escuchar el platillo, y toque Agregar de nuevo para añadirlo a su orden."

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



// ==========================================

// PUSH-TO-TALK — modo ciego voz

// ==========================================

// El usuario mantiene presionado la burbuja para hablar y suelta para que el bot conteste.

// No hay auto-reinicio ni colisiones de estado.



let pttRecognition = null;   // instancia activa de SpeechRecognition

let pttTranscript = '';      // lo que captó el micrófono

let pttPresionado = false;   // ¿está el botón presionado ahora mismo?

let pttReinicioTimer = null; // timer para reinicio suave

let pttTouchId = null;       // identificador de touch activo (evita multi-touch)



// ── Helper interno: crear y arrancar una instancia de reconocimiento PTT ──────

function _crearRecPTT() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();

    rec.lang = 'es-MX';

    rec.continuous = true;

    rec.interimResults = true;   // interimResults=true para detectar voz más rápido

    rec.maxAlternatives = 1;



    rec.onresult = (event) => {

        // Acumular solo resultados finales; los interinos solo sirven para confirmar que hay voz

        for (let i = event.resultIndex; i < event.results.length; i++) {

            if (event.results[i].isFinal) {

                pttTranscript += event.results[i][0].transcript + ' ';

            }

        }

    };



    rec.onerror = (event) => {

        // 'no-speech' es normal — el browser expiró el silencio.

        // Si el botón sigue presionado, simplemente reiniciamos.

        if (event.error === 'no-speech' || event.error === 'audio-capture') {

            pttRecognition = null;

            if (pttPresionado) _reiniciarRecPTT();

            return;

        }

        console.warn('PTT error:', event.error);

        pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    rec.onend = () => {

        // El navegador detuvo el reconocimiento por su cuenta.

        // Si el botón aún está presionado, volvemos a arrancar.

        if (pttRecognition === rec) pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    return rec;

}



function _reiniciarRecPTT() {

    // Pequeño delay para evitar colisión de instancias ("already started")

    if (pttReinicioTimer) return;

    pttReinicioTimer = setTimeout(() => {

        pttReinicioTimer = null;

        if (!pttPresionado) return;

        const rec = _crearRecPTT();

        if (!rec) return;

        pttRecognition = rec;

        try { rec.start(); } catch(err) {

            pttRecognition = null;

            pttPresionado = false;

            actualizarBurbujaEstado('idle', 'Mantén presionado');

        }

    }, 200);

}



function iniciarEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Rastrear el identificador de toque para evitar multi-touch espurio

        if (e.type === 'touchstart') {

            if (pttTouchId !== null) return;  // ya hay un toque activo

            pttTouchId = e.changedTouches[0].identifier;

        }

    }

    if (!voiceAssistantEnabled) return;

    if (pttPresionado) return;

    pttPresionado = true;

    pttTranscript = '';



    // Si el bot estaba hablando, silenciarlo

    speechSynth.cancel();



    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        hablar('Su navegador no soporta reconocimiento de voz.');

        pttPresionado = false;

        pttTouchId = null;

        return;

    }



    actualizarBurbujaEstado('listening', 'Habla ahora...');



    const rec = _crearRecPTT();

    if (!rec) {

        pttPresionado = false;

        pttTouchId = null;

        return;

    }

    pttRecognition = rec;

    try {

        rec.start();

    } catch(err) {

        pttPresionado = false;

        pttRecognition = null;

        pttTouchId = null;

        actualizarBurbujaEstado('idle', 'Mantén presionado');

    }

}



function detenerEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Verificar que es el mismo toque que inició (evita disparos falsos de mouseleave)

        if (e.type === 'touchend' || e.type === 'touchcancel') {

            const touchId = e.changedTouches[0].identifier;

            if (touchId !== pttTouchId) return;

            pttTouchId = null;

        } else if (e.type === 'mouseleave' && !pttPresionado) {

            return; // mouseleave sin estar presionado: ignorar

        }

    }

    if (!pttPresionado) return;

    pttPresionado = false;



    // Cancelar reinicio pendiente

    if (pttReinicioTimer) { clearTimeout(pttReinicioTimer); pttReinicioTimer = null; }



    // Detener reconocimiento activo

    if (pttRecognition) {

        try { pttRecognition.stop(); } catch(err) {}

        pttRecognition = null;

    }



    const texto = pttTranscript.trim();

    pttTranscript = '';



    if (!texto) {

        actualizarBurbujaEstado('idle', 'Mantén presionado');

        hablar('No escuché nada. Mantén presionado y habla cerca del micrófono.');

        return;

    }



    // Procesar el texto capturado

    actualizarBurbujaEstado('speaking', 'Procesando...');

    document.getElementById('chatbot-input').value = texto;

    addMessage(texto, 'user');



    const respuesta = processBotMessageLocal(texto);

    setTimeout(() => {

        addMessage(respuesta, 'bot');

        actualizarBurbujaEstado('speaking', 'Respondiendo...');

        hablar(respuesta, () => {

            if (voiceAssistantEnabled) {

                actualizarBurbujaEstado('idle', 'Mantén presionado');

            }

        });

    }, 200);

}



// Mantener activarVozCiego como alias por si algún otro código lo llama

function activarVozCiego() {

    // No se usa en push-to-talk — no-op para evitar errores

}



function closeWelcome() { hideOverlay('welcome-overlay'); }



// ==========================================

// DESACTIVAR / REACTIVAR ASISTENTE DE VOZ

// ==========================================

function desactivarTTS() {

    speechSynth.cancel();

    voiceAssistantEnabled = false;

    isReadAloud = false;

    clearReaderPending();

    // Limpiar push-to-talk si estaba activo

    pttPresionado = false;

    if (pttRecognition) { try { pttRecognition.stop(); } catch(e) {} pttRecognition = null; }

    document.getElementById('btn-read').classList.remove('active');

    document.removeEventListener('click', leerElemento, true);

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

const numerosTexto = { 'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10, 'media docena':6, 'docena':12 };

function extraerCantidad(texto) {

    const matchNum = texto.match(/\b(\d+)\b/);

    if (matchNum) return parseInt(matchNum[0]);

    for (let p in numerosTexto) if (texto.includes(p)) return numerosTexto[p];

    return 1;

}



// Aliases y palabras clave alternativas para detectar platillos por nombre parcial o coloquial

const platilloAliases = {

    'Tacos al Pastor': ['taco', 'tacos', 'pastor', 'taquito', 'taquitos', 'taco pastor', 'tacos pastor', 'al pastor'],

    'Hamburguesa Clásica': ['hamburguesa', 'hamburguesas', 'burger', 'burguesa', 'hamburgesa', 'hamburger', 'clasica', 'clásica'],

    'Pizza Margarita': ['pizza', 'pizzas', 'margarita', 'margherita', 'margaritas', 'piza'],

    'Sushi Roll California': ['sushi', 'sushis', 'roll', 'rolls', 'california', 'cangrejo', 'maki', 'makis', 'rollo', 'rollos', 'roll california', 'sushi california', 'sushi roll'],

    'Ensalada César': ['ensalada', 'ensaladas', 'cesar', 'césar', 'ensalada cesar', 'ensalada verde'],

    'Pasta Carbonara': ['pasta', 'pastas', 'carbonara', 'espagueti', 'spaghetti', 'spagueti', 'carbonara pasta'],

    'Pollo Teriyaki': ['pollo', 'pollos', 'teriyaki', 'pollo teriyaki', 'teriyaky', 'pollo asian'],

    'Filete de Salmón': ['salmon', 'salmón', 'filete', 'filete salmon', 'filete de salmon', 'pescado']

};



// Encontrar platillo por nombre exacto o alias en el texto

function encontrarPlatillo(msg) {

    // Primero búsqueda exacta por nombre completo

    for (let nombre in platillosData) {

        if (msg.includes(nombre.toLowerCase())) return nombre;

    }

    // Luego búsqueda por aliases

    for (let nombre in platilloAliases) {

        const aliases = platilloAliases[nombre];

        for (let alias of aliases) {

            if (msg.includes(alias)) return nombre;

        }

    }

    return null;

}



// ── Detectar si el mensaje habla de MODIFICAR ingredientes (quitar/agregar) ──

// Retorna { accion, ingrediente, platilloRef } o null

function detectarModIngrediente(msg) {

    // Palabras clave de QUITAR ingrediente

    const regexQuitar = /\b(sin|quitar|quita|quítame|quitame|sin el|sin la|sin los|sin las|elimina|eliminar|omite|omitir|no quiero|no le pongas|no pongas|retirar|retira|remueve|remover|sin poner)\b\s+(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:de\s+(?:la\s+|el\s+|los\s+|las\s+)?|del\s+|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;

    // Palabras clave de AGREGAR ingrediente (extra/adicional, NO pedido nuevo)

    const regexAgregar = /\b(con extra|extra|adicional|agrega|agregar|añade|añadir|ponle|ponme|más|mas)\s+(?:de\s+)?(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:a\s+(?:la\s+|el\s+)?|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;



    let m = msg.match(regexQuitar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        // Validar que el "ingrediente" no sea un platillo completo (ej "sin tacos" es otro platillo)

        if (ing && !encontrarPlatillo(ing)) return { accion: 'quitar', ingrediente: ing, platilloRef: ref || null };

    }

    m = msg.match(regexAgregar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        if (ing && !encontrarPlatillo(ing)) return { accion: 'agregar', ingrediente: ing, platilloRef: ref || null };

    }

    return null;

}



// ── Detectar si el mensaje es para ELIMINAR un platillo de la orden ──────────

// Distinto a "quitar ingrediente": "quita la pizza de mi orden", "borra los tacos"

function detectarEliminarPlatillo(msg) {

    const regexElim = /\b(eliminar|elimina|quitar|quita|borrar|borra|remover|remueve|cancel|cancelar|cancela|ya no quiero|no quiero|saca|sacar)\b/;

    const regexRef  = /\b(de mi orden|de la orden|del pedido|del carrito|de mi pedido)\b/;

    // Si dice "quita/elimina + platillo + [de la orden]"

    if (!regexElim.test(msg)) return null;

    // Verificar que hay un platillo mencionado

    const platillo = encontrarPlatillo(msg);

    if (!platillo) return null;

    // Si también dice "ingrediente" conocido del platillo en la orden → es mod. de ingrediente

    // Si no, es eliminación de platillo

    return platillo;

}



function processBotMessageLocal(message) {

    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");



    // 1. Silenciar / activar asistente

    if (msg.match(/\b(silenciar|desactivar asistente|silencio|detente|stop)\b/)) {

        desactivarTTS();

        if (recognitionInstance) { try { recognitionInstance.stop(); } catch(e) {} recognitionInstance = null; }

        return "Asistente de voz silenciado. Puedes seguir escribiendo si lo necesitas.";

    }



    // 2. Saludos

    if (msg.match(/\b(hola|buenas|hey|que tal|buenos dias|tardes|noches|hi|hello)\b/)) {

        return "¡Hola! Puedes pedir diciendo por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes, o di 'menú' para escuchar las opciones.";

    }



    // 3. Menú completo

    if (msg.match(/\b(menu|platillos|opciones|que hay|que sirven|que ofrecen|carta|que tienen)\b/)) {

        let menuTxt = "Platillos disponibles: ";

        for (let nombre in platillosData) menuTxt += `${nombre} a ${precioParaVoz(platillosData[nombre].price)}, `;

        return menuTxt.replace(/, $/, '') + ". Puedes pedir con cantidad, ej. 'dos tacos' o 'tres pizzas'.";

    }



    // 4. Precio de un platillo

    if (msg.match(/\b(cuanto cuesta|precio|cuanto vale|cuanto es el|cuanto son)\b/)) {

        const platilloPrecio = encontrarPlatillo(msg);

        if (platilloPrecio) return `${platilloPrecio} cuesta ${precioParaVoz(platillosData[platilloPrecio].price)}.`;

        return "Dime de qué platillo quieres saber el precio. Por ejemplo: '¿cuánto cuesta el salmón?'";

    }



    // 5. Descripción / información de platillo

    if (msg.match(/\b(describe|descripcion|como es|que es|cuentame|informacion)\b/)) {

        const platilloDesc = encontrarPlatillo(msg);

        if (platilloDesc) return `${platilloDesc}: ${platillosData[platilloDesc].desc.slice(0, 200)}...`;

        return "Dime de qué platillo quieres la descripción.";

    }



    // 6. Ingredientes de un platillo

    if (msg.match(/\b(ingredientes|que contiene|que lleva|que tiene|componentes|alergen)\b/)) {

        const platillo = encontrarPlatillo(msg);

        if (platillo) {

            return `${platillo} lleva: ${platillosData[platillo].ingredients.join(', ')}. ¿Deseas quitar o agregar algún ingrediente? Por ejemplo: 'sin cebolla' o 'extra queso'.`;

        }

        return "Dime de qué platillo quieres saber los ingredientes. Por ejemplo: '¿qué ingredientes tiene el sushi?'";

    }



    // 7. Resumen / cuenta / total (ANTES de procesar platillos para que "ver mi orden" no agregue nada)

    if (msg.match(/\b(total|cuenta|resumen|que llevo|cuanto es|cuanto debo|cuanto seria|mi orden|ver orden|ver mi orden|que pedí|que pedi|mi pedido)\b/)) {

        if (orden.length === 0) return "Tu orden está vacía. Puedes pedir algo diciendo el nombre del platillo.";

        let resumen = "Tu orden tiene: ";

        orden.forEach(i => {

            resumen += `${i.cantidad} ${i.nombre}`;

            if (i.custom.removed.length) resumen += ` sin ${i.custom.removed.join(' ni ')}`;

            if (i.custom.added.length) resumen += ` con extra ${i.custom.added.join(' y ')}`;

            resumen += `, a ${precioParaVoz(i.precio * i.cantidad)}. `;

        });

        resumen += `El total es ${precioParaVoz(total)}.`;

        return resumen;

    }



    // 8. Pagar / enviar / finalizar

    if (msg.match(/\b(enviar|descargar|pagar|finalizar|listo|cobrar|terminar|ya es todo|eso es todo|confirmar|confirma)\b/)) {

        if (orden.length === 0) return "No hay nada que enviar. ¿Qué deseas ordenar?";

        let resumen = "Finalizando su orden. Tiene: ";

        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre}. `);

        resumen += `Total a pagar: ${precioParaVoz(total)}. Descargando archivo para mostrar al personal.`;

        setTimeout(() => descargarOrden(), 1200);

        return resumen;

    }



    // 9. Ayuda

    if (msg.match(/\b(ayuda|como funciona|ayudame|comandos)\b/)) {

        return "Puedes decir: 'quiero 2 tacos', 'dame una pizza', 'ingredientes del sushi', 'sin queso a la hamburguesa', 'extra cebolla', 'quita la pizza de mi orden', 'cuánto es el total', o 'ya es todo' para finalizar.";

    }



    // ── A partir de aquí, orden importa: MODIFICAR antes de AGREGAR ──────────



    // 10. ELIMINAR PLATILLO DE LA ORDEN

    //     "quita la pizza", "elimina los tacos", "ya no quiero el salmón"

    //     Solo si hay platillo Y hay verbo de eliminar (sin "ingrediente" claro)

    const platilloParaEliminar = detectarEliminarPlatillo(msg);

    if (platilloParaEliminar) {

        // Verificar que NO es una modificación de ingrediente (si hay ingrediente entre quitar y platillo)

        const modCheck = detectarModIngrediente(msg);

        if (!modCheck) {

            const idx = orden.findIndex(i => i.nombre === platilloParaEliminar);

            if (idx !== -1) {

                const nombreEl = orden[idx].nombre;

                eliminarDelCarrito(orden[idx].id);

                sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

                return `He eliminado ${nombreEl} de tu orden. ¿Algo más?`;

            }

            return `No tienes ${platilloParaEliminar} en tu orden actualmente. ¿Algo más en que pueda ayudarte?`;

        }

    }



    // 11. MODIFICAR INGREDIENTE (quitar o agregar extra)

    //     "sin cebolla", "quita el queso", "extra guacamole a los tacos"

    const modIng = detectarModIngrediente(msg);

    if (modIng) {

        return modificarIngrediente(modIng.ingrediente, modIng.accion, modIng.platilloRef);

    }



    // 12. AGREGAR PLATILLO A LA ORDEN

    //     "quiero 2 tacos", "dame una pizza", "dos hamburguesas"

    const platilloDetectado = encontrarPlatillo(msg);

    if (platilloDetectado) {

        const cantidad = extraerCantidad(msg);

        agregarAlCarrito(platilloDetectado, platillosData[platilloDetectado].price, cantidad);

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        const precioVoz = precioParaVoz(platillosData[platilloDetectado].price * cantidad);

        return `He añadido ${cantidad} ${platilloDetectado} a tu orden por ${precioVoz}. ¿Deseas algo más, o quieres quitar algún ingrediente?`;

    }



    // Respuesta por defecto

    return "No entendí bien. Puedes pedir algo como '2 tacos al pastor', 'una pizza', 'sin cebolla', 'quita los tacos de mi orden', o di 'menú' para escuchar todas las opciones.";

}

function modificarIngrediente(ingredienteRaw, accion, platilloRef) {

    let item = null;



    // Buscar el ítem en la orden

    if (platilloRef && platilloRef.trim()) {

        const ref = platilloRef.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (let p in platillosData) {

            const pNorm = p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (pNorm.includes(ref) || ref.includes(pNorm.split(' ')[0])) {

                item = orden.find(i => i.nombre === p);

                if (item) break;

            }

        }

    }

    // Si no encontró por platilloRef, usar el último ítem de la orden

    if (!item) item = orden[orden.length - 1];



    if (!item) return "No tienes ningún platillo en la orden. ¿Qué deseas pedir?";

    if (!item.custom) item.custom = { removed: [], added: [] };



    // Normalizar ingrediente

    const ing = ingredienteRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();



    // Intentar hacer coincidir con ingrediente real del platillo (fuzzy)

    const platData = platillosData[item.nombre];

    let ingReal = ingredienteRaw; // fallback: usar lo que dijo el usuario

    if (platData) {

        const match = platData.ingredients.find(i => {

            const iNorm = i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            return iNorm.includes(ing) || ing.includes(iNorm.split(' ')[0]);

        });

        if (match) ingReal = match;

    }



    if (accion === 'quitar') {

        if (!item.custom.removed.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.removed.push(ingReal);

        }

        item.custom.added = item.custom.added.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he quitado "${ingReal}" de ${item.nombre}. ¿Algo más que desees cambiar?`;

    } else {

        if (!item.custom.added.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.added.push(ingReal);

        }

        item.custom.removed = item.custom.removed.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he añadido extra "${ingReal}" a ${item.nombre}. ¿Algo más?`;

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



        // En modo reader, leerElemento lo maneja (abre modal directo en 2do toque)

        if (isReadAloud && !isBlindMode) return;



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



    // ── BURBUJA PTT: registrar eventos aquí (no inline) para mayor control ──

    const bubbleBtn = document.getElementById('bubble-tap-btn');

    if (bubbleBtn) {

        // Mouse (desktop / emulador)

        bubbleBtn.addEventListener('mousedown', (e) => { e.preventDefault(); iniciarEscucha(e); });

        bubbleBtn.addEventListener('mouseup',   (e) => { e.preventDefault(); detenerEscucha(e); });

        bubbleBtn.addEventListener('mouseleave',(e) => { if (pttPresionado) detenerEscucha(e); });



        // Touch (móvil): passive:false para poder llamar preventDefault()

        bubbleBtn.addEventListener('touchstart',  (e) => iniciarEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchend',    (e) => detenerEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchcancel', (e) => detenerEscucha(e), { passive: false });

    }



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

});        ingredients: ['Pechuga de pollo', 'Salsa de soya', 'Sake', 'Azúcar', 'Jengibre', 'Ajo', 'Vegetales variados'],

        price: 17.99

    },

    'Filete de Salmón': {

        desc: 'Filete de salmón noruego fresco de 220 gramos, de carne firme, color rosado intenso y sabor suave. Se sella primero en sartén con mantequilla clarificada para lograr una piel crujiente y dorada, luego se termina al horno con hierbas frescas: eneldo, perejil y tomillo. Se baña con beurre blanc de limón amarillo, alcaparras y cebollín para realzar su sabor natural sin opacarlo. Se acompaña de papas cambray asadas con romero y aceite de oliva, más un bouquet de espárragos verdes salteados con mantequilla y flor de sal. Un plato elegante, ligero y nutritivo que celebra la calidad del producto.',

        ingredients: ['Filete de salmón noruego', 'Limón', 'Mantequilla', 'Perejil', 'Eneldo', 'Papas', 'Espárragos', 'Sal y pimienta'],

        price: 24.99

    }

};



// ==========================================

// UTILIDAD: FORMATEAR PRECIO PARA TTS

// ==========================================

// Convierte 12.99 → "12 pesos con 99 centavos" para evitar que el TTS lo lea como fecha

function precioParaVoz(precio) {

    const n = parseFloat(precio);

    if (isNaN(n)) return precio;

    const pesos = Math.floor(n);

    const centavos = Math.round((n - pesos) * 100);

    if (centavos === 0) return `${pesos} pesos`;

    return `${pesos} pesos con ${centavos} centavos`;

}



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

function agregarAlCarrito(nombre, precio, cantidad = 1, removidos = [], agregados = [], silencioso = false) {

    if (cantidad <= 0) return;

    orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: removidos, added: agregados } });

    total += precio * cantidad;

    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);

    renderizarOrden();

    if (isReadAloud && !silencioso) hablar(`${nombre} agregado a su orden.`);

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

// ACCESIBILIDAD — lector de pantalla con doble toque real

// ==========================================

// El sistema usa un ID único por elemento para detectar "mismo elemento tocado dos veces"

// independientemente de dónde exactamente toca el dedo dentro del elemento.



let readerPendingKey = null;   // string identificador del elemento pendiente

let readerPendingTimeout = null;

let readerPendingAction = null;



function clearReaderPending() {

    if (readerPendingTimeout) { clearTimeout(readerPendingTimeout); readerPendingTimeout = null; }

    readerPendingKey = null;

    readerPendingAction = null;

}



// Obtener una clave estable para identificar el elemento tocado

function getElementKey(target) {

    // Botón con data-action tiene nombre único

    const btnAction = target.closest('[data-action]');

    if (btnAction) {

        return (btnAction.dataset.action || '') + '::' + (btnAction.dataset.nombre || btnAction.dataset.action);

    }

    // Tarjeta de platillo

    const card = target.closest('.card[data-name]');

    if (card) return 'card::' + card.dataset.name;

    // Botón genérico: usar aria-label o texto

    const btn = target.closest('button');

    if (btn) return 'btn::' + (btn.getAttribute('aria-label') || btn.textContent.trim()).slice(0, 40);

    return null;

}



// Construir la info (texto a leer + acción a ejecutar en segundo toque) según el elemento

function describir(target) {

    // ── Botón AGREGAR ──────────────────────────────────────────────────────

    const btnAgregar = target.closest('[data-action="agregar"]');

    if (btnAgregar) {

        const nombre = btnAgregar.dataset.nombre;

        const precio = btnAgregar.dataset.precio;

        const platillo = platillosData[nombre];

        // Ingredientes breves para que sepa qué va a pedir

        const ings = platillo ? platillo.ingredients.slice(0, 4).join(', ') : '';

        const textoIngs = ings ? ` Lleva: ${ings}.` : '';

        return {

            texto: `Agregar ${nombre}. ${precioParaVoz(precio)}.${textoIngs} Toque de nuevo para agregar a su orden.`,

            // Agregar directo en modo reader, sin modal visual

            action: () => {

                agregarAlCarrito(nombre, parseFloat(precio), 1, [], [], true);

                hablar(`${nombre} agregado a su orden. Total: ${precioParaVoz(total)}.`);

            }

        };

    }



    // ── Botón VER VIDEO ────────────────────────────────────────────────────

    const btnVideo = target.closest('.btn-video-toggle, [data-action="video"]');

    if (btnVideo) {

        const nombre = btnVideo.dataset.nombre || '';

        const url = btnVideo.dataset.url || '';

        const platillo = platillosData[nombre];

        // Descripción corta (la de la tarjeta, no el párrafo largo)

        const card = btnVideo.closest('.card');

        const descCorta = card ? (card.querySelector('.card-description')?.textContent?.trim() || '') : '';

        const ings = platillo ? 'Ingredientes: ' + platillo.ingredients.join(', ') + '.' : '';

        return {

            texto: `Ver video de ${nombre}. ${descCorta} ${ings} Toque de nuevo para abrir el video.`,

            action: () => abrirVideo(nombre, url)

        };

    }



    // ── Botón DESCARGAR ORDEN ──────────────────────────────────────────────

    const btnDescargar = target.closest('[data-action="descargar"]');

    if (btnDescargar) {

        return {

            texto: `Descargar orden. Toque de nuevo para guardar su orden como archivo.`,

            action: () => descargarOrden()

        };

    }



    // ── TARJETA (zona fuera de botones) ────────────────────────────────────

    const card = target.closest('.card');

    if (card && !target.closest('button')) {

        const nombre = card.dataset.name;

        const precio = card.dataset.price;

        // Usar la descripción corta que ya existe en la tarjeta, NO el párrafo largo

        const descCorta = card.querySelector('.card-description')?.textContent?.trim() || '';

        const platillo = platillosData[nombre];

        const ings = platillo ? platillo.ingredients.slice(0, 5).join(', ') : '';

        const textoIngs = ings ? ` Ingredientes principales: ${ings}.` : '';

        // Alérgenos

        const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.trim()).join(', ');

        const textoAlerg = badges ? ` Contiene: ${badges}.` : '';

        return {

            texto: `${nombre}. ${precioParaVoz(precio)}. ${descCorta}${textoIngs}${textoAlerg} Toque de nuevo para explorar opciones.`,

            action: null  // segundo toque en la tarjeta genérica no hace nada especial

        };

    }



    // ── BOTÓN GENÉRICO ─────────────────────────────────────────────────────

    const btn = target.closest('button');

    if (btn) {

        const lbl = btn.getAttribute('aria-label') || btn.textContent.trim();

        if (!lbl) return null;

        // Capturar referencia estable antes del setTimeout

        const btnRef = btn;

        return {

            texto: `${lbl}. Toque de nuevo para activar.`,

            action: () => {

                // Disparar click nativo sin pasar por el listener del reader

                isReadAloud = false;

                btnRef.click();

                isReadAloud = true;

            }

        };

    }



    return null;

}



function leerElemento(e) {

    // Zonas donde el reader NO debe interceptar

    if (e.target.closest('.accessibility-panel') || e.target.closest('.panel-content')) return;

    // Modal de video abierto: dejar pasar todos sus clicks (cerrar, iframe, etc.)

    if (document.getElementById('video-modal').classList.contains('active')) return;

    // Boton X de eliminar item del carrito

    if (e.target.closest('.btn-remove')) return;

    // Modal de ingredientes abierto

    const ingModal = document.getElementById('ingredientes-modal');

    if (ingModal && ingModal.classList.contains('active')) return;



    const key = getElementKey(e.target);

    if (!key) return;



    e.preventDefault();

    e.stopPropagation();



    if (readerPendingKey && readerPendingKey === key) {

        // SEGUNDO TOQUE: ejecutar accion

        const actionToRun = readerPendingAction;

        clearReaderPending();

        speechSynth.cancel();

        if (actionToRun) {

            hablar('Confirmado.');

            setTimeout(() => actionToRun(), 400);

        }

    } else {

        // PRIMER TOQUE: leer descripcion

        const info = describir(e.target);

        if (!info) return;

        clearReaderPending();

        readerPendingKey = key;

        readerPendingAction = info.action;

        speechSynth.cancel();

        hablar(info.texto);

        readerPendingTimeout = setTimeout(() => clearReaderPending(), 10000);

    }

}



function toggleReadAloud() {

    isReadAloud = !isReadAloud;

    document.getElementById('btn-read').classList.toggle('active', isReadAloud);

    clearReaderPending();

    if (isReadAloud) {

        hablar('Lector de pantalla activado. Toque una vez para escuchar. Toque dos veces para confirmar.');

        document.addEventListener('click', leerElemento, true);

    } else {

        speechSynth.cancel();

        document.removeEventListener('click', leerElemento, true);

    }

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

                document.addEventListener('click', leerElemento, true);

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

                            resumen += `Total: ${precioParaVoz(total)}. Mantenga presionada la burbuja para hablar.`;

                            setTimeout(() => {

                                actualizarBurbujaEstado('speaking', 'Escúchame...');

                                hablar(resumen, () => {

                                    actualizarBurbujaEstado('idle', 'Mantén presionado');

                                });

                            }, 500);

                            return;

                        }

                    } catch(e) {}

                }



                const mensajeBienvenida = "Hola, bienvenido. Soy su asistente de voz. Mantenga presionada la burbuja para hablar y suéltela cuando termine. Por ejemplo, puede decir: quiero dos tacos al pastor, o, qué ingredientes tiene la hamburguesa.";

                setTimeout(() => {

                    actualizarBurbujaEstado('speaking', 'Escúchame...');

                    hablar(mensajeBienvenida, () => {

                        actualizarBurbujaEstado('idle', 'Mantén presionado');

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

                document.addEventListener('click', leerElemento, true);

                document.getElementById('blind-bubble').classList.add('hidden');

                // Anunciar activación

                setTimeout(() => {

                    hablar(

                        "Lector de pantalla activado. Toque una vez cualquier elemento para escuchar su descripción. " +

                        "Toque dos veces el mismo elemento para confirmar la acción. " +

                        "Por ejemplo: toque Agregar una vez para escuchar el platillo, y toque Agregar de nuevo para añadirlo a su orden."

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



// ==========================================

// PUSH-TO-TALK — modo ciego voz

// ==========================================

// El usuario mantiene presionado la burbuja para hablar y suelta para que el bot conteste.

// No hay auto-reinicio ni colisiones de estado.



let pttRecognition = null;   // instancia activa de SpeechRecognition

let pttTranscript = '';      // lo que captó el micrófono

let pttPresionado = false;   // ¿está el botón presionado ahora mismo?

let pttReinicioTimer = null; // timer para reinicio suave

let pttTouchId = null;       // identificador de touch activo (evita multi-touch)



// ── Helper interno: crear y arrancar una instancia de reconocimiento PTT ──────

function _crearRecPTT() {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const rec = new SpeechRecognition();

    rec.lang = 'es-MX';

    rec.continuous = true;

    rec.interimResults = true;   // interimResults=true para detectar voz más rápido

    rec.maxAlternatives = 1;



    rec.onresult = (event) => {

        // Acumular solo resultados finales; los interinos solo sirven para confirmar que hay voz

        for (let i = event.resultIndex; i < event.results.length; i++) {

            if (event.results[i].isFinal) {

                pttTranscript += event.results[i][0].transcript + ' ';

            }

        }

    };



    rec.onerror = (event) => {

        // 'no-speech' es normal — el browser expiró el silencio.

        // Si el botón sigue presionado, simplemente reiniciamos.

        if (event.error === 'no-speech' || event.error === 'audio-capture') {

            pttRecognition = null;

            if (pttPresionado) _reiniciarRecPTT();

            return;

        }

        console.warn('PTT error:', event.error);

        pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    rec.onend = () => {

        // El navegador detuvo el reconocimiento por su cuenta.

        // Si el botón aún está presionado, volvemos a arrancar.

        if (pttRecognition === rec) pttRecognition = null;

        if (pttPresionado) _reiniciarRecPTT();

    };



    return rec;

}



function _reiniciarRecPTT() {

    // Pequeño delay para evitar colisión de instancias ("already started")

    if (pttReinicioTimer) return;

    pttReinicioTimer = setTimeout(() => {

        pttReinicioTimer = null;

        if (!pttPresionado) return;

        const rec = _crearRecPTT();

        if (!rec) return;

        pttRecognition = rec;

        try { rec.start(); } catch(err) {

            pttRecognition = null;

            pttPresionado = false;

            actualizarBurbujaEstado('idle', 'Mantén presionado');

        }

    }, 200);

}



function iniciarEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Rastrear el identificador de toque para evitar multi-touch espurio

        if (e.type === 'touchstart') {

            if (pttTouchId !== null) return;  // ya hay un toque activo

            pttTouchId = e.changedTouches[0].identifier;

        }

    }

    if (!voiceAssistantEnabled) return;

    if (pttPresionado) return;

    pttPresionado = true;

    pttTranscript = '';



    // Si el bot estaba hablando, silenciarlo

    speechSynth.cancel();



    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        hablar('Su navegador no soporta reconocimiento de voz.');

        pttPresionado = false;

        pttTouchId = null;

        return;

    }



    actualizarBurbujaEstado('listening', 'Habla ahora...');



    const rec = _crearRecPTT();

    if (!rec) {

        pttPresionado = false;

        pttTouchId = null;

        return;

    }

    pttRecognition = rec;

    try {

        rec.start();

    } catch(err) {

        pttPresionado = false;

        pttRecognition = null;

        pttTouchId = null;

        actualizarBurbujaEstado('idle', 'Mantén presionado');

    }

}



function detenerEscucha(e) {

    if (e) {

        e.preventDefault();

        e.stopPropagation();

        // Verificar que es el mismo toque que inició (evita disparos falsos de mouseleave)

        if (e.type === 'touchend' || e.type === 'touchcancel') {

            const touchId = e.changedTouches[0].identifier;

            if (touchId !== pttTouchId) return;

            pttTouchId = null;

        } else if (e.type === 'mouseleave' && !pttPresionado) {

            return; // mouseleave sin estar presionado: ignorar

        }

    }

    if (!pttPresionado) return;

    pttPresionado = false;



    // Cancelar reinicio pendiente

    if (pttReinicioTimer) { clearTimeout(pttReinicioTimer); pttReinicioTimer = null; }



    // Detener reconocimiento activo

    if (pttRecognition) {

        try { pttRecognition.stop(); } catch(err) {}

        pttRecognition = null;

    }



    const texto = pttTranscript.trim();

    pttTranscript = '';



    if (!texto) {

        actualizarBurbujaEstado('idle', 'Mantén presionado');

        hablar('No escuché nada. Mantén presionado y habla cerca del micrófono.');

        return;

    }



    // Procesar el texto capturado

    actualizarBurbujaEstado('speaking', 'Procesando...');

    document.getElementById('chatbot-input').value = texto;

    addMessage(texto, 'user');



    const respuesta = processBotMessageLocal(texto);

    setTimeout(() => {

        addMessage(respuesta, 'bot');

        actualizarBurbujaEstado('speaking', 'Respondiendo...');

        hablar(respuesta, () => {

            if (voiceAssistantEnabled) {

                actualizarBurbujaEstado('idle', 'Mantén presionado');

            }

        });

    }, 200);

}



// Mantener activarVozCiego como alias por si algún otro código lo llama

function activarVozCiego() {

    // No se usa en push-to-talk — no-op para evitar errores

}



function closeWelcome() { hideOverlay('welcome-overlay'); }



// ==========================================

// DESACTIVAR / REACTIVAR ASISTENTE DE VOZ

// ==========================================

function desactivarTTS() {

    speechSynth.cancel();

    voiceAssistantEnabled = false;

    isReadAloud = false;

    clearReaderPending();

    // Limpiar push-to-talk si estaba activo

    pttPresionado = false;

    if (pttRecognition) { try { pttRecognition.stop(); } catch(e) {} pttRecognition = null; }

    document.getElementById('btn-read').classList.remove('active');

    document.removeEventListener('click', leerElemento, true);

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

const numerosTexto = { 'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10, 'media docena':6, 'docena':12 };

function extraerCantidad(texto) {

    const matchNum = texto.match(/\b(\d+)\b/);

    if (matchNum) return parseInt(matchNum[0]);

    for (let p in numerosTexto) if (texto.includes(p)) return numerosTexto[p];

    return 1;

}



// Aliases y palabras clave alternativas para detectar platillos por nombre parcial o coloquial

const platilloAliases = {

    'Tacos al Pastor': ['taco', 'tacos', 'pastor', 'taquito', 'taquitos', 'taco pastor', 'tacos pastor', 'al pastor'],

    'Hamburguesa Clásica': ['hamburguesa', 'hamburguesas', 'burger', 'burguesa', 'hamburgesa', 'hamburger', 'clasica', 'clásica'],

    'Pizza Margarita': ['pizza', 'pizzas', 'margarita', 'margherita', 'margaritas', 'piza'],

    'Sushi Roll California': ['sushi', 'sushis', 'roll', 'rolls', 'california', 'cangrejo', 'maki', 'makis', 'rollo', 'rollos', 'roll california', 'sushi california', 'sushi roll'],

    'Ensalada César': ['ensalada', 'ensaladas', 'cesar', 'césar', 'ensalada cesar', 'ensalada verde'],

    'Pasta Carbonara': ['pasta', 'pastas', 'carbonara', 'espagueti', 'spaghetti', 'spagueti', 'carbonara pasta'],

    'Pollo Teriyaki': ['pollo', 'pollos', 'teriyaki', 'pollo teriyaki', 'teriyaky', 'pollo asian'],

    'Filete de Salmón': ['salmon', 'salmón', 'filete', 'filete salmon', 'filete de salmon', 'pescado']

};



// Encontrar platillo por nombre exacto o alias en el texto

function encontrarPlatillo(msg) {

    // Primero búsqueda exacta por nombre completo

    for (let nombre in platillosData) {

        if (msg.includes(nombre.toLowerCase())) return nombre;

    }

    // Luego búsqueda por aliases

    for (let nombre in platilloAliases) {

        const aliases = platilloAliases[nombre];

        for (let alias of aliases) {

            if (msg.includes(alias)) return nombre;

        }

    }

    return null;

}



// ── Detectar si el mensaje habla de MODIFICAR ingredientes (quitar/agregar) ──

// Retorna { accion, ingrediente, platilloRef } o null

function detectarModIngrediente(msg) {

    // Palabras clave de QUITAR ingrediente

    const regexQuitar = /\b(sin|quitar|quita|quítame|quitame|sin el|sin la|sin los|sin las|elimina|eliminar|omite|omitir|no quiero|no le pongas|no pongas|retirar|retira|remueve|remover|sin poner)\b\s+(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:de\s+(?:la\s+|el\s+|los\s+|las\s+)?|del\s+|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;

    // Palabras clave de AGREGAR ingrediente (extra/adicional, NO pedido nuevo)

    const regexAgregar = /\b(con extra|extra|adicional|agrega|agregar|añade|añadir|ponle|ponme|más|mas)\s+(?:de\s+)?(?:el\s+|la\s+|los\s+|las\s+)?([a-záéíóúñ][a-záéíóúñ\s]{1,30}?)(?:\s+(?:a\s+(?:la\s+|el\s+)?|en\s+(?:la\s+|el\s+)?|al\s+)(.+))?$/i;



    let m = msg.match(regexQuitar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        // Validar que el "ingrediente" no sea un platillo completo (ej "sin tacos" es otro platillo)

        if (ing && !encontrarPlatillo(ing)) return { accion: 'quitar', ingrediente: ing, platilloRef: ref || null };

    }

    m = msg.match(regexAgregar);

    if (m) {

        const ing = (m[2] || '').trim().replace(/\s+/g, ' ');

        const ref = (m[3] || '').trim();

        if (ing && !encontrarPlatillo(ing)) return { accion: 'agregar', ingrediente: ing, platilloRef: ref || null };

    }

    return null;

}



// ── Detectar si el mensaje es para ELIMINAR un platillo de la orden ──────────

// Distinto a "quitar ingrediente": "quita la pizza de mi orden", "borra los tacos"

function detectarEliminarPlatillo(msg) {

    const regexElim = /\b(eliminar|elimina|quitar|quita|borrar|borra|remover|remueve|cancel|cancelar|cancela|ya no quiero|no quiero|saca|sacar)\b/;

    const regexRef  = /\b(de mi orden|de la orden|del pedido|del carrito|de mi pedido)\b/;

    // Si dice "quita/elimina + platillo + [de la orden]"

    if (!regexElim.test(msg)) return null;

    // Verificar que hay un platillo mencionado

    const platillo = encontrarPlatillo(msg);

    if (!platillo) return null;

    // Si también dice "ingrediente" conocido del platillo en la orden → es mod. de ingrediente

    // Si no, es eliminación de platillo

    return platillo;

}



function processBotMessageLocal(message) {

    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");



    // 1. Silenciar / activar asistente

    if (msg.match(/\b(silenciar|desactivar asistente|silencio|detente|stop)\b/)) {

        desactivarTTS();

        if (recognitionInstance) { try { recognitionInstance.stop(); } catch(e) {} recognitionInstance = null; }

        return "Asistente de voz silenciado. Puedes seguir escribiendo si lo necesitas.";

    }



    // 2. Saludos

    if (msg.match(/\b(hola|buenas|hey|que tal|buenos dias|tardes|noches|hi|hello)\b/)) {

        return "¡Hola! Puedes pedir diciendo por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes, o di 'menú' para escuchar las opciones.";

    }



    // 3. Menú completo

    if (msg.match(/\b(menu|platillos|opciones|que hay|que sirven|que ofrecen|carta|que tienen)\b/)) {

        let menuTxt = "Platillos disponibles: ";

        for (let nombre in platillosData) menuTxt += `${nombre} a ${precioParaVoz(platillosData[nombre].price)}, `;

        return menuTxt.replace(/, $/, '') + ". Puedes pedir con cantidad, ej. 'dos tacos' o 'tres pizzas'.";

    }



    // 4. Precio de un platillo

    if (msg.match(/\b(cuanto cuesta|precio|cuanto vale|cuanto es el|cuanto son)\b/)) {

        const platilloPrecio = encontrarPlatillo(msg);

        if (platilloPrecio) return `${platilloPrecio} cuesta ${precioParaVoz(platillosData[platilloPrecio].price)}.`;

        return "Dime de qué platillo quieres saber el precio. Por ejemplo: '¿cuánto cuesta el salmón?'";

    }



    // 5. Descripción / información de platillo

    if (msg.match(/\b(describe|descripcion|como es|que es|cuentame|informacion)\b/)) {

        const platilloDesc = encontrarPlatillo(msg);

        if (platilloDesc) return `${platilloDesc}: ${platillosData[platilloDesc].desc.slice(0, 200)}...`;

        return "Dime de qué platillo quieres la descripción.";

    }



    // 6. Ingredientes de un platillo

    if (msg.match(/\b(ingredientes|que contiene|que lleva|que tiene|componentes|alergen)\b/)) {

        const platillo = encontrarPlatillo(msg);

        if (platillo) {

            return `${platillo} lleva: ${platillosData[platillo].ingredients.join(', ')}. ¿Deseas quitar o agregar algún ingrediente? Por ejemplo: 'sin cebolla' o 'extra queso'.`;

        }

        return "Dime de qué platillo quieres saber los ingredientes. Por ejemplo: '¿qué ingredientes tiene el sushi?'";

    }



    // 7. Resumen / cuenta / total (ANTES de procesar platillos para que "ver mi orden" no agregue nada)

    if (msg.match(/\b(total|cuenta|resumen|que llevo|cuanto es|cuanto debo|cuanto seria|mi orden|ver orden|ver mi orden|que pedí|que pedi|mi pedido)\b/)) {

        if (orden.length === 0) return "Tu orden está vacía. Puedes pedir algo diciendo el nombre del platillo.";

        let resumen = "Tu orden tiene: ";

        orden.forEach(i => {

            resumen += `${i.cantidad} ${i.nombre}`;

            if (i.custom.removed.length) resumen += ` sin ${i.custom.removed.join(' ni ')}`;

            if (i.custom.added.length) resumen += ` con extra ${i.custom.added.join(' y ')}`;

            resumen += `, a ${precioParaVoz(i.precio * i.cantidad)}. `;

        });

        resumen += `El total es ${precioParaVoz(total)}.`;

        return resumen;

    }



    // 8. Pagar / enviar / finalizar

    if (msg.match(/\b(enviar|descargar|pagar|finalizar|listo|cobrar|terminar|ya es todo|eso es todo|confirmar|confirma)\b/)) {

        if (orden.length === 0) return "No hay nada que enviar. ¿Qué deseas ordenar?";

        let resumen = "Finalizando su orden. Tiene: ";

        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre}. `);

        resumen += `Total a pagar: ${precioParaVoz(total)}. Descargando archivo para mostrar al personal.`;

        setTimeout(() => descargarOrden(), 1200);

        return resumen;

    }



    // 9. Ayuda

    if (msg.match(/\b(ayuda|como funciona|ayudame|comandos)\b/)) {

        return "Puedes decir: 'quiero 2 tacos', 'dame una pizza', 'ingredientes del sushi', 'sin queso a la hamburguesa', 'extra cebolla', 'quita la pizza de mi orden', 'cuánto es el total', o 'ya es todo' para finalizar.";

    }



    // ── A partir de aquí, orden importa: MODIFICAR antes de AGREGAR ──────────



    // 10. ELIMINAR PLATILLO DE LA ORDEN

    //     "quita la pizza", "elimina los tacos", "ya no quiero el salmón"

    //     Solo si hay platillo Y hay verbo de eliminar (sin "ingrediente" claro)

    const platilloParaEliminar = detectarEliminarPlatillo(msg);

    if (platilloParaEliminar) {

        // Verificar que NO es una modificación de ingrediente (si hay ingrediente entre quitar y platillo)

        const modCheck = detectarModIngrediente(msg);

        if (!modCheck) {

            const idx = orden.findIndex(i => i.nombre === platilloParaEliminar);

            if (idx !== -1) {

                const nombreEl = orden[idx].nombre;

                eliminarDelCarrito(orden[idx].id);

                sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

                return `He eliminado ${nombreEl} de tu orden. ¿Algo más?`;

            }

            return `No tienes ${platilloParaEliminar} en tu orden actualmente. ¿Algo más en que pueda ayudarte?`;

        }

    }



    // 11. MODIFICAR INGREDIENTE (quitar o agregar extra)

    //     "sin cebolla", "quita el queso", "extra guacamole a los tacos"

    const modIng = detectarModIngrediente(msg);

    if (modIng) {

        return modificarIngrediente(modIng.ingrediente, modIng.accion, modIng.platilloRef);

    }



    // 12. AGREGAR PLATILLO A LA ORDEN

    //     "quiero 2 tacos", "dame una pizza", "dos hamburguesas"

    const platilloDetectado = encontrarPlatillo(msg);

    if (platilloDetectado) {

        const cantidad = extraerCantidad(msg);

        agregarAlCarrito(platilloDetectado, platillosData[platilloDetectado].price, cantidad);

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        const precioVoz = precioParaVoz(platillosData[platilloDetectado].price * cantidad);

        return `He añadido ${cantidad} ${platilloDetectado} a tu orden por ${precioVoz}. ¿Deseas algo más, o quieres quitar algún ingrediente?`;

    }



    // Respuesta por defecto

    return "No entendí bien. Puedes pedir algo como '2 tacos al pastor', 'una pizza', 'sin cebolla', 'quita los tacos de mi orden', o di 'menú' para escuchar todas las opciones.";

}

function modificarIngrediente(ingredienteRaw, accion, platilloRef) {

    let item = null;



    // Buscar el ítem en la orden

    if (platilloRef && platilloRef.trim()) {

        const ref = platilloRef.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        for (let p in platillosData) {

            const pNorm = p.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (pNorm.includes(ref) || ref.includes(pNorm.split(' ')[0])) {

                item = orden.find(i => i.nombre === p);

                if (item) break;

            }

        }

    }

    // Si no encontró por platilloRef, usar el último ítem de la orden

    if (!item) item = orden[orden.length - 1];



    if (!item) return "No tienes ningún platillo en la orden. ¿Qué deseas pedir?";

    if (!item.custom) item.custom = { removed: [], added: [] };



    // Normalizar ingrediente

    const ing = ingredienteRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();



    // Intentar hacer coincidir con ingrediente real del platillo (fuzzy)

    const platData = platillosData[item.nombre];

    let ingReal = ingredienteRaw; // fallback: usar lo que dijo el usuario

    if (platData) {

        const match = platData.ingredients.find(i => {

            const iNorm = i.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            return iNorm.includes(ing) || ing.includes(iNorm.split(' ')[0]);

        });

        if (match) ingReal = match;

    }



    if (accion === 'quitar') {

        if (!item.custom.removed.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.removed.push(ingReal);

        }

        item.custom.added = item.custom.added.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he quitado "${ingReal}" de ${item.nombre}. ¿Algo más que desees cambiar?`;

    } else {

        if (!item.custom.added.find(i => i.toLowerCase() === ingReal.toLowerCase())) {

            item.custom.added.push(ingReal);

        }

        item.custom.removed = item.custom.removed.filter(i => i.toLowerCase() !== ingReal.toLowerCase());

        renderizarOrden();

        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));

        return `Listo, he añadido extra "${ingReal}" a ${item.nombre}. ¿Algo más?`;

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



        // En modo reader, leerElemento lo maneja (abre modal directo en 2do toque)

        if (isReadAloud && !isBlindMode) return;



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



    // ── BURBUJA PTT: registrar eventos aquí (no inline) para mayor control ──

    const bubbleBtn = document.getElementById('bubble-tap-btn');

    if (bubbleBtn) {

        // Mouse (desktop / emulador)

        bubbleBtn.addEventListener('mousedown', (e) => { e.preventDefault(); iniciarEscucha(e); });

        bubbleBtn.addEventListener('mouseup',   (e) => { e.preventDefault(); detenerEscucha(e); });

        bubbleBtn.addEventListener('mouseleave',(e) => { if (pttPresionado) detenerEscucha(e); });



        // Touch (móvil): passive:false para poder llamar preventDefault()

        bubbleBtn.addEventListener('touchstart',  (e) => iniciarEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchend',    (e) => detenerEscucha(e), { passive: false });

        bubbleBtn.addEventListener('touchcancel', (e) => detenerEscucha(e), { passive: false });

    }



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

});// ==========================================
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
function agregarAlCarrito(nombre, precio, cantidad = 1, removidos = [], agregados = [], silencioso = false) {
    if (cantidad <= 0) return;
    orden.push({ nombre, precio, cantidad, id: Date.now(), custom: { removed: removidos, added: agregados } });
    total += precio * cantidad;
    document.getElementById('total-precio').innerText = '$' + total.toFixed(2);
    renderizarOrden();
    if (isReadAloud && !silencioso) hablar(`${nombre} agregado a su orden.`);
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
// ACCESIBILIDAD — lector de pantalla con doble toque real
// ==========================================
// El sistema usa un ID único por elemento para detectar "mismo elemento tocado dos veces"
// independientemente de dónde exactamente toca el dedo dentro del elemento.

let readerPendingKey = null;   // string identificador del elemento pendiente
let readerPendingTimeout = null;
let readerPendingAction = null;

function clearReaderPending() {
    if (readerPendingTimeout) { clearTimeout(readerPendingTimeout); readerPendingTimeout = null; }
    readerPendingKey = null;
    readerPendingAction = null;
}

// Obtener una clave estable para identificar el elemento tocado
function getElementKey(target) {
    // Botón con data-action tiene nombre único
    const btnAction = target.closest('[data-action]');
    if (btnAction) {
        return (btnAction.dataset.action || '') + '::' + (btnAction.dataset.nombre || btnAction.dataset.action);
    }
    // Tarjeta de platillo
    const card = target.closest('.card[data-name]');
    if (card) return 'card::' + card.dataset.name;
    // Botón genérico: usar aria-label o texto
    const btn = target.closest('button');
    if (btn) return 'btn::' + (btn.getAttribute('aria-label') || btn.textContent.trim()).slice(0, 40);
    return null;
}

// Construir la info (texto a leer + acción a ejecutar en segundo toque) según el elemento
function describir(target) {
    // ── Botón AGREGAR ──────────────────────────────────────────────────────
    const btnAgregar = target.closest('[data-action="agregar"]');
    if (btnAgregar) {
        const nombre = btnAgregar.dataset.nombre;
        const precio = btnAgregar.dataset.precio;
        const platillo = platillosData[nombre];
        // Ingredientes breves para que sepa qué va a pedir
        const ings = platillo ? platillo.ingredients.slice(0, 4).join(', ') : '';
        const textoIngs = ings ? ` Lleva: ${ings}.` : '';
        return {
            texto: `Agregar ${nombre}. ${precioParaVoz(precio)}.${textoIngs} Toque de nuevo para agregar a su orden.`,
            // Agregar directo en modo reader, sin modal visual
            action: () => {
                agregarAlCarrito(nombre, parseFloat(precio), 1, [], [], true);
                hablar(`${nombre} agregado a su orden. Total: ${precioParaVoz(total)}.`);
            }
        };
    }

    // ── Botón VER VIDEO ────────────────────────────────────────────────────
    const btnVideo = target.closest('.btn-video-toggle, [data-action="video"]');
    if (btnVideo) {
        const nombre = btnVideo.dataset.nombre || '';
        const url = btnVideo.dataset.url || '';
        const platillo = platillosData[nombre];
        // Descripción corta (la de la tarjeta, no el párrafo largo)
        const card = btnVideo.closest('.card');
        const descCorta = card ? (card.querySelector('.card-description')?.textContent?.trim() || '') : '';
        const ings = platillo ? 'Ingredientes: ' + platillo.ingredients.join(', ') + '.' : '';
        return {
            texto: `Ver video de ${nombre}. ${descCorta} ${ings} Toque de nuevo para abrir el video.`,
            action: () => abrirVideo(nombre, url)
        };
    }

    // ── Botón DESCARGAR ORDEN ──────────────────────────────────────────────
    const btnDescargar = target.closest('[data-action="descargar"]');
    if (btnDescargar) {
        return {
            texto: `Descargar orden. Toque de nuevo para guardar su orden como archivo.`,
            action: () => descargarOrden()
        };
    }

    // ── TARJETA (zona fuera de botones) ────────────────────────────────────
    const card = target.closest('.card');
    if (card && !target.closest('button')) {
        const nombre = card.dataset.name;
        const precio = card.dataset.price;
        // Usar la descripción corta que ya existe en la tarjeta, NO el párrafo largo
        const descCorta = card.querySelector('.card-description')?.textContent?.trim() || '';
        const platillo = platillosData[nombre];
        const ings = platillo ? platillo.ingredients.slice(0, 5).join(', ') : '';
        const textoIngs = ings ? ` Ingredientes principales: ${ings}.` : '';
        // Alérgenos
        const badges = Array.from(card.querySelectorAll('.badge')).map(b => b.textContent.trim()).join(', ');
        const textoAlerg = badges ? ` Contiene: ${badges}.` : '';
        return {
            texto: `${nombre}. ${precioParaVoz(precio)}. ${descCorta}${textoIngs}${textoAlerg} Toque de nuevo para explorar opciones.`,
            action: null  // segundo toque en la tarjeta genérica no hace nada especial
        };
    }

    // ── BOTÓN GENÉRICO ─────────────────────────────────────────────────────
    const btn = target.closest('button');
    if (btn) {
        const lbl = btn.getAttribute('aria-label') || btn.textContent.trim();
        if (!lbl) return null;
        // Capturar referencia estable antes del setTimeout
        const btnRef = btn;
        return {
            texto: `${lbl}. Toque de nuevo para activar.`,
            action: () => {
                // Disparar click nativo sin pasar por el listener del reader
                isReadAloud = false;
                btnRef.click();
                isReadAloud = true;
            }
        };
    }

    return null;
}

function leerElemento(e) {
    // Zonas donde el reader NO debe interceptar
    if (e.target.closest('.accessibility-panel') || e.target.closest('.panel-content')) return;
    // Modal de video abierto: dejar pasar todos sus clicks (cerrar, iframe, etc.)
    if (document.getElementById('video-modal').classList.contains('active')) return;
    // Boton X de eliminar item del carrito
    if (e.target.closest('.btn-remove')) return;
    // Modal de ingredientes abierto
    const ingModal = document.getElementById('ingredientes-modal');
    if (ingModal && ingModal.classList.contains('active')) return;

    const key = getElementKey(e.target);
    if (!key) return;

    e.preventDefault();
    e.stopPropagation();

    if (readerPendingKey && readerPendingKey === key) {
        // SEGUNDO TOQUE: ejecutar accion
        const actionToRun = readerPendingAction;
        clearReaderPending();
        speechSynth.cancel();
        if (actionToRun) {
            hablar('Confirmado.');
            setTimeout(() => actionToRun(), 400);
        }
    } else {
        // PRIMER TOQUE: leer descripcion
        const info = describir(e.target);
        if (!info) return;
        clearReaderPending();
        readerPendingKey = key;
        readerPendingAction = info.action;
        speechSynth.cancel();
        hablar(info.texto);
        readerPendingTimeout = setTimeout(() => clearReaderPending(), 10000);
    }
}

function toggleReadAloud() {
    isReadAloud = !isReadAloud;
    document.getElementById('btn-read').classList.toggle('active', isReadAloud);
    clearReaderPending();
    if (isReadAloud) {
        hablar('Lector de pantalla activado. Toque una vez para escuchar. Toque dos veces para confirmar.');
        document.addEventListener('click', leerElemento, true);
    } else {
        speechSynth.cancel();
        document.removeEventListener('click', leerElemento, true);
    }
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
                document.addEventListener('click', leerElemento, true);
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
                            resumen += `Total: ${precioParaVoz(total)}. Mantenga presionada la burbuja para hablar.`;
                            setTimeout(() => {
                                actualizarBurbujaEstado('speaking', 'Escúchame...');
                                hablar(resumen, () => {
                                    actualizarBurbujaEstado('idle', 'Mantén presionado');
                                });
                            }, 500);
                            return;
                        }
                    } catch(e) {}
                }

                const mensajeBienvenida = "Hola, bienvenido. Soy su asistente de voz. Mantenga presionada la burbuja para hablar y suéltela cuando termine. Por ejemplo, puede decir: quiero dos tacos al pastor, o, qué ingredientes tiene la hamburguesa.";
                setTimeout(() => {
                    actualizarBurbujaEstado('speaking', 'Escúchame...');
                    hablar(mensajeBienvenida, () => {
                        actualizarBurbujaEstado('idle', 'Mantén presionado');
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
                document.addEventListener('click', leerElemento, true);
                document.getElementById('blind-bubble').classList.add('hidden');
                // Anunciar activación
                setTimeout(() => {
                    hablar(
                        "Lector de pantalla activado. Toque una vez cualquier elemento para escuchar su descripción. " +
                        "Toque dos veces el mismo elemento para confirmar la acción. " +
                        "Por ejemplo: toque Agregar una vez para escuchar el platillo, y toque Agregar de nuevo para añadirlo a su orden."
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

// ==========================================
// PUSH-TO-TALK — modo ciego voz
// ==========================================
// El usuario mantiene presionado la burbuja para hablar y suelta para que el bot conteste.
// No hay auto-reinicio ni colisiones de estado.

let pttRecognition = null;   // instancia activa de SpeechRecognition
let pttTranscript = '';      // lo que captó el micrófono
let pttPresionado = false;   // ¿está el botón presionado ahora mismo?

function iniciarEscucha(e) {
    if (e) e.preventDefault();   // evitar doble-fire en touch + mouse
    if (!voiceAssistantEnabled) return;
    if (pttPresionado) return;    // ya está activo
    pttPresionado = true;
    pttTranscript = '';

    // Feedback visual inmediato
    const circle = document.getElementById('bubble-circle');
    if (circle) { circle.classList.remove('idle', 'speaking'); circle.classList.add('pressing'); }

    // Si el bot estaba hablando, silenciarlo para escuchar al usuario
    speechSynth.cancel();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        hablar('Su navegador no soporta reconocimiento de voz.');
        pttPresionado = false;
        return;
    }

    actualizarBurbujaEstado('listening', 'Habla ahora...');

    const rec = new SpeechRecognition();
    pttRecognition = rec;
    rec.lang = 'es-MX';
    rec.continuous = true;        // captura mientras el botón está presionado
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
        // Acumular todos los resultados mientras el botón sigue presionado
        for (let i = event.resultIndex; i < event.results.length; i++) {
            pttTranscript += event.results[i][0].transcript + ' ';
        }
    };

    rec.onerror = (event) => {
        // 'no-speech' es normal si el usuario no habló — no hacer nada dramático
        if (event.error !== 'no-speech') {
            console.error('PTT error:', event.error);
        }
        pttPresionado = false;
        pttRecognition = null;
        actualizarBurbujaEstado('idle', 'Manten presionado');
    };

    rec.onend = () => {
        pttRecognition = null;
        // Si aún está presionado y terminó solo (timeout del navegador), reiniciar
        if (pttPresionado) {
            try {
                const rec2 = new SpeechRecognition();
                pttRecognition = rec2;
                rec2.lang = 'es-MX';
                rec2.continuous = true;
                rec2.interimResults = false;
                rec2.onresult = rec.onresult;
                rec2.onerror = rec.onerror;
                rec2.onend = rec.onend;
                rec2.start();
            } catch(err) {
                pttPresionado = false;
                actualizarBurbujaEstado('idle', 'Manten presionado');
            }
        }
    };

    try {
        rec.start();
    } catch(err) {
        pttPresionado = false;
        pttRecognition = null;
        actualizarBurbujaEstado('idle', 'Manten presionado');
    }
}

function detenerEscucha(e) {
    if (e) e.preventDefault();
    if (!pttPresionado) return;
    pttPresionado = false;

    // Quitar feedback visual de presionado
    const circle = document.getElementById('bubble-circle');
    if (circle) circle.classList.remove('pressing');

    // Detener reconocimiento
    if (pttRecognition) {
        try { pttRecognition.stop(); } catch(err) {}
        pttRecognition = null;
    }

    const texto = pttTranscript.trim();
    pttTranscript = '';

    if (!texto) {
        // Nada captado — volver a idle
        actualizarBurbujaEstado('idle', 'Mantén presionado');
        return;
    }

    // Mostrar lo que dijo el usuario y procesar
    actualizarBurbujaEstado('speaking', 'Procesando...');
    document.getElementById('chatbot-input').value = texto;
    addMessage(texto, 'user');

    const respuesta = processBotMessageLocal(texto);
    setTimeout(() => {
        addMessage(respuesta, 'bot');
        actualizarBurbujaEstado('speaking', 'Respondiendo...');
        hablar(respuesta, () => {
            if (voiceAssistantEnabled) {
                actualizarBurbujaEstado('idle', 'Mantén presionado');
            }
        });
    }, 300);
}

// Mantener activarVozCiego como alias por si algún otro código lo llama
function activarVozCiego() {
    // No se usa en push-to-talk — no-op para evitar errores
}

function closeWelcome() { hideOverlay('welcome-overlay'); }

// ==========================================
// DESACTIVAR / REACTIVAR ASISTENTE DE VOZ
// ==========================================
function desactivarTTS() {
    speechSynth.cancel();
    voiceAssistantEnabled = false;
    isReadAloud = false;
    clearReaderPending();
    // Limpiar push-to-talk si estaba activo
    pttPresionado = false;
    if (pttRecognition) { try { pttRecognition.stop(); } catch(e) {} pttRecognition = null; }
    document.getElementById('btn-read').classList.remove('active');
    document.removeEventListener('click', leerElemento, true);
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
const numerosTexto = { 'un':1, 'uno':1, 'una':1, 'dos':2, 'tres':3, 'cuatro':4, 'cinco':5, 'seis':6, 'siete':7, 'ocho':8, 'nueve':9, 'diez':10, 'media docena':6, 'docena':12 };
function extraerCantidad(texto) {
    const matchNum = texto.match(/\b(\d+)\b/);
    if (matchNum) return parseInt(matchNum[0]);
    for (let p in numerosTexto) if (texto.includes(p)) return numerosTexto[p];
    return 1;
}

// Aliases y palabras clave alternativas para detectar platillos por nombre parcial o coloquial
const platilloAliases = {
    'Tacos al Pastor': ['taco', 'tacos', 'pastor', 'taquito', 'taquitos', 'taco pastor', 'tacos pastor', 'al pastor'],
    'Hamburguesa Clásica': ['hamburguesa', 'hamburguesas', 'burger', 'burguesa', 'hamburgesa', 'hamburger', 'clasica', 'clásica'],
    'Pizza Margarita': ['pizza', 'pizzas', 'margarita', 'margherita', 'margaritas', 'piza'],
    'Sushi Roll California': ['sushi', 'sushis', 'roll', 'rolls', 'california', 'cangrejo', 'maki', 'makis', 'rollo', 'rollos', 'roll california', 'sushi california', 'sushi roll'],
    'Ensalada César': ['ensalada', 'ensaladas', 'cesar', 'césar', 'ensalada cesar', 'ensalada verde'],
    'Pasta Carbonara': ['pasta', 'pastas', 'carbonara', 'espagueti', 'spaghetti', 'spagueti', 'carbonara pasta'],
    'Pollo Teriyaki': ['pollo', 'pollos', 'teriyaki', 'pollo teriyaki', 'teriyaky', 'pollo asian'],
    'Filete de Salmón': ['salmon', 'salmón', 'filete', 'filete salmon', 'filete de salmon', 'pescado']
};

// Encontrar platillo por nombre exacto o alias en el texto
function encontrarPlatillo(msg) {
    // Primero búsqueda exacta por nombre completo
    for (let nombre in platillosData) {
        if (msg.includes(nombre.toLowerCase())) return nombre;
    }
    // Luego búsqueda por aliases
    for (let nombre in platilloAliases) {
        const aliases = platilloAliases[nombre];
        for (let alias of aliases) {
            if (msg.includes(alias)) return nombre;
        }
    }
    return null;
}

function processBotMessageLocal(message) {
    const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Silenciar / activar asistente
    if (msg.match(/silenciar|desactivar asistente|silencio|para|detente|stop/)) {
        desactivarTTS();
        if (recognitionInstance) { try { recognitionInstance.stop(); } catch(e) {} recognitionInstance = null; }
        return "Asistente de voz silenciado.";
    }

    // Saludos
    if (msg.match(/hola|buenas|hey|que tal|buenos dias|tardes|noches|hi|hello/)) {
        return "¡Hola! Puedes pedir tu comida diciendo, por ejemplo: 'quiero 2 tacos al pastor'. También puedo informarte sobre ingredientes o decirte el menú completo.";
    }
    // Menú completo
    if (msg.match(/menu|platillos|comida|que tiene|opciones|que hay|que sirven|que ofrecen|carta/)) {
        let menuTxt = "Platillos disponibles: ";
        for (let nombre in platillosData) menuTxt += `${nombre} a ${precioParaVoz(platillosData[nombre].price)}, `;
        return menuTxt.replace(/, $/, '') + ". Puedes pedir uno o varios con cantidad, ej. 'dos tacos' o 'tres pizzas'.";
    }
    // Ingredientes de un platillo específico
    if (msg.match(/ingredientes|que contiene|que lleva|tiene|componentes|alergen/)) {
        const platillo = encontrarPlatillo(msg);
        if (platillo) {
            return `${platillo} lleva: ${platillosData[platillo].ingredients.join(', ')}. ¿Deseas quitar o agregar algún ingrediente?`;
        }
        return "Dime de qué platillo quieres saber los ingredientes. Por ejemplo: '¿qué ingredientes tiene el sushi?'";
    }
    // Modificar ingrediente — quitar
    const modQuitar = msg.match(/(quitar|sin|eliminar|no quiero|no le pongas|omitir|remove)\s+(el\s+|la\s+|los\s+|las\s+)?([\w\s]+?)(?:\s+(de|del|en|al)\s+(.+))?$/);
    if (modQuitar) return modificarIngrediente((modQuitar[3] || '').trim(), 'quitar', modQuitar[5]?.trim());
    // Modificar ingrediente — agregar
    const modAgregar = msg.match(/(agregar|añadir|poner|con extra|extra|adicional|add)\s+(el\s+|la\s+|los\s+|las\s+)?([\w\s]+?)(?:\s+(a|en|al|sobre)\s+(.+))?$/);
    if (modAgregar) return modificarIngrediente((modAgregar[3] || '').trim(), 'agregar', modAgregar[5]?.trim());

    // Pedido con cantidad — detectar intención de ordenar + platillo
    // Patrones: "quiero X tacos", "dame X sushi", "ponme X pizza", "pide X hamburguesa", "agrega X pollo", etc.
    const intencionPedir = msg.match(/(quiero|quisiera|dame|ponme|pedir|pide|agrega|agregar|añade|ordenar|orden|trae|traeme|deseo|necesito|deme|ponle|va|van)/);
    const platilloDetectado = encontrarPlatillo(msg);
    if (platilloDetectado) {
        const cantidad = extraerCantidad(msg);
        agregarAlCarrito(platilloDetectado, platillosData[platilloDetectado].price, cantidad);
        sessionStorage.setItem('ordenGuardada', JSON.stringify({ items: orden, total }));
        const precioVoz = precioParaVoz(platillosData[platilloDetectado].price * cantidad);
        return `He añadido ${cantidad} ${platilloDetectado} a tu orden. Total de ese artículo: ${precioVoz}. ¿Algo más?`;
    }
    // Resumen / cuenta / total
    if (msg.match(/total|cuenta|resumen|orden|que llevo|cuanto es|cuanto debo|cuanto seria|pedido|mi orden/)) {
        if (orden.length === 0) return "Tu orden está vacía. Puedes pedir algo diciendo el nombre del platillo.";
        let resumen = "Tu orden tiene: ";
        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre} a ${precioParaVoz(i.precio * i.cantidad)}. `);
        resumen += `El total es ${precioParaVoz(total)}.`;
        return resumen;
    }
    // Eliminar un platillo de la orden
    if (msg.match(/eliminar|quitar de la orden|borrar|remover|cancel/)) {
        const platilloEliminar = encontrarPlatillo(msg);
        if (platilloEliminar) {
            const idx = orden.findIndex(i => i.nombre === platilloEliminar);
            if (idx !== -1) {
                eliminarDelCarrito(orden[idx].id);
                return `He eliminado ${platilloEliminar} de tu orden.`;
            }
            return `No tienes ${platilloEliminar} en tu orden.`;
        }
    }
    // Pagar / enviar / finalizar
    if (msg.match(/enviar|descargar|pagar|finalizar|listo|cobrar|terminar|ya es todo|eso es todo|confirmar|confirma/)) {
        if (orden.length === 0) return "No hay nada que enviar. ¿Qué deseas ordenar?";
        let resumen = "Finalizando su orden. Tiene: ";
        orden.forEach(i => resumen += `${i.cantidad} ${i.nombre}. `);
        resumen += `Total a pagar: ${precioParaVoz(total)}. Descargando archivo para mostrar al personal.`;
        setTimeout(() => descargarOrden(), 1200);
        return resumen;
    }
    // Precio de un platillo
    if (msg.match(/cuanto cuesta|precio|cuanto vale|cuanto es el|cuanto son/)) {
        const platilloPrecio = encontrarPlatillo(msg);
        if (platilloPrecio) return `${platilloPrecio} cuesta ${precioParaVoz(platillosData[platilloPrecio].price)}.`;
        return "Dime de qué platillo quieres saber el precio. Por ejemplo: '¿cuánto cuesta el salmón?'";
    }
    // Descripción de un platillo
    if (msg.match(/describe|descripcion|como es|que es|cuéntame|cuentame|informacion/)) {
        const platilloDesc = encontrarPlatillo(msg);
        if (platilloDesc) return `${platilloDesc}: ${platillosData[platilloDesc].desc}`;
        return "Dime de qué platillo quieres la descripción.";
    }
    // Ayuda
    if (msg.match(/ayuda|que puedo hacer|como funciona|ayudame|commands|comandos/)) {
        return "Puedes decir: 'quiero 2 tacos', 'dame una pizza', 'ingredientes del sushi', 'sin queso la hamburguesa', 'cuánto es el total', o 'ya es todo' para finalizar tu orden.";
    }
    // Respuesta por defecto
    return "No entendí bien. Puedes pedir algo como '2 tacos al pastor', 'una pizza', 'qué ingredientes tiene el sushi', o di 'menú' para escuchar todas las opciones.";
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

        // En modo reader, leerElemento lo maneja (abre modal directo en 2do toque)
        if (isReadAloud && !isBlindMode) return;

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
