// --- WHITE MOUNTAIN AUTO CONNECTIONS: UNIVERSAL DISPATCHER ---
const chatConfig = {
    endpoint: 'https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call',
    bearer: '685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6'
};

let userData = { name: '', phone: '', notes: '', service: 'pdr', friction: '' };
let currentStep = 0;

const chatBox = document.getElementById('chat-box');
const inputArea = document.getElementById('chat-input-container');

// 1. CORE UI CONTROLS
function openBot(service = 'pdr') {
    userData.service = service; 
    const container = document.getElementById('bot-container');
    const launcher = document.getElementById('bot-launcher');
    if(container) container.style.display = 'flex';
    if(launcher) launcher.style.display = 'none';
    if (currentStep === 0) nextStep();
}

function closeBot() {
    document.getElementById('bot-container').style.display = 'none';
    document.getElementById('bot-launcher').style.display = 'flex';
}

function addBotMessage(text, delay = 800) {
    const msg = document.createElement('div');
    msg.className = 'bot-msg'; msg.innerText = "...";
    chatBox.appendChild(msg); chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => { 
        msg.innerText = text; 
        chatBox.scrollTop = chatBox.scrollHeight; 
    }, delay);
}

function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'user-msg'; msg.innerText = text;
    chatBox.appendChild(msg); chatBox.scrollTop = chatBox.scrollHeight;
}

// 2. CONVERSATIONAL PATHS
function nextStep() {
    const path = window.location.pathname;

    if (currentStep === 0) {
        // HUB NAVIGATION
        if (!path.includes('repair') && !path.includes('detailing') && !path.includes('glass')) {
            addBotMessage("Welcome! Are you looking for help with a specific service area today?");
            setTimeout(() => {
                inputArea.innerHTML = `
                    <button onclick="handleRouting('pdr')" class="chat-btn" style="width:100%; margin-bottom:5px; background: #28A745;">🔨 PDR / Dents</button>
                    <button onclick="handleRouting('collision')" class="chat-btn" style="width:100%; margin-bottom:5px; background: #d32f2f;">🚗 Collision / Paint</button>
                    <button onclick="handleRouting('detailing')" class="chat-btn" style="width:100%; margin-bottom:5px; background: #3498db;">✨ Pro Detailing</button>
                    <button onclick="handleRouting('glass')" class="chat-btn" style="width:100%; background: #f1c40f;">💎 Glass Repair</button>
                `;
            }, 1000);
        } 
        // GLASS TRIAGE
        else if (path.includes('glass')) {
            addBotMessage("Welcome to Glass Triage. Is the windshield crack longer than a credit card?");
            inputArea.innerHTML = `
                <button onclick="handleFriction('Long Crack / Replacement')" class="chat-btn">Yes, Longer</button>
                <button onclick="handleFriction('Small Chip / Repair')" class="chat-btn grey">No, Shorter</button>
            `;
            currentStep = 1;
        }
        // DETAILING TRIAGE
        else if (path.includes('detailing')) {
            addBotMessage("Are we performing a full showroom restoration or a standard maintenance clean?");
            inputArea.innerHTML = `
                <button onclick="handleFriction('Showroom Restoration')" class="chat-btn">Restoration</button>
                <button onclick="handleFriction('Maintenance Clean')" class="chat-btn grey">Maintenance</button>
            `;
            currentStep = 1;
        }
        // PDR / COLLISION TRIAGE
        else {
            addBotMessage(`Hello! I'll connect you with a ${userData.service.toUpperCase()} specialist.`);
            setTimeout(() => {
                addBotMessage("Would you like to start your priority assessment?");
                inputArea.innerHTML = `<button onclick="handleFriction('Standard Intake')" class="chat-btn">Start Now</button>`;
            }, 1000);
            currentStep = 1;
        }
    }
}

function handleRouting(area) {
    addUserMessage(`I need ${area} help.`);
    const routes = { 'pdr': 'pdr-repair.html', 'collision': 'collision-repair.html', 'detailing': 'car-detailing.html', 'glass': 'glass-repair.html' };
    addBotMessage(`Opening our ${area} specialized triage center...`);
    setTimeout(() => { window.location.href = routes[area]; }, 1500);
}

function handleFriction(val) {
    addUserMessage(val);
    userData.friction = val;
    addBotMessage("Got it. What is your name?");
    inputArea.innerHTML = `<input type="text" id="bot-field-input" placeholder="Your name..."><button class="send-btn" onclick="handleName()">Send</button>`;
    currentStep = 2;
}

function handleName() {
    const val = document.getElementById('bot-field-input').value;
    if (!val) return;
    userData.name = val;
    addUserMessage(val);
    addBotMessage(`Nice to meet you, ${val}. What cell number should we use for your priority alerts?`);
    inputArea.innerHTML = `<input type="tel" id="bot-field-input" placeholder="Phone..."><button class="send-btn" onclick="handlePhone()">Send</button>`;
}

function handlePhone() {
    const val = document.getElementById('bot-field-input').value.replace(/\D/g, '');
    if (val.length !== 10) return alert("Please enter 10 digits.");
    userData.phone = val;
    addUserMessage(val);
    addBotMessage("Final step: Please enter the Vehicle Year, Make, and Model. As well as any additional notes we need to know.");
    inputArea.innerHTML = `<textarea id="bot-field-input" placeholder="e.g. 2024 Toyota Tacoma..."></textarea><button class="send-btn" onclick="finalSubmit()">Finish</button>`;
}

// 3. FINAL DISPATCH WITH SAFETY ROUTING
async function finalSubmit() {
    if (document.getElementById('hp_email_bot').value !== "") return;
    
    userData.notes = document.getElementById('bot-field-input').value;
    addUserMessage(userData.notes);
    addBotMessage("Placing you in the Priority Connection Queue...");

    // FINAL SAFETY CHECK: Force service type based on URL
    const path = window.location.pathname;
    let finalService = 'pdr';
    if (path.includes('collision')) finalService = 'collision';
    if (path.includes('detailing')) finalService = 'detailing';
    if (path.includes('glass')) finalService = 'glass';

    const triageSummary = `TRIAGE: ${userData.friction} | VEHICLE: ${userData.notes}`;

    try {
        const res = await fetch(chatConfig.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${chatConfig.bearer}` },
            body: JSON.stringify({ 
                customer_name: userData.name, 
                phone: userData.phone, 
                zip_code: '85901', 
                service_type: finalService, // Correctly routed for DB
                notes: triageSummary 
            })
        });

        if (res.ok) {
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', { 'send_to': 'AW-17963694572', 'value': 20.0, 'currency': 'USD' });
            }
            addBotMessage(`Success! A ${finalService.toUpperCase()} specialist will contact you as soon as they clear their current bay.`);
            inputArea.innerHTML = "<b style='color:#28A745;'>Dispatched!</b>";
        }
    } catch (e) { addBotMessage("Connection error. Please refresh."); }
}

// 4. INITIALIZATION
window.onload = () => {
    const path = window.location.pathname;
    let autoContext = "pdr"; // Default
    
    if (path.includes('collision')) autoContext = "collision";
    if (path.includes('detailing')) autoContext = "detailing";
    if (path.includes('glass')) autoContext = "glass";

    setTimeout(() => { 
        if (document.getElementById('bot-container').style.display !== 'flex') {
            openBot(autoContext);
        } 
    }, 5000);
};