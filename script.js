// ============================================================
// WHITE MOUNTAIN AUTO CONNECTIONS — Universal Dispatcher
// ============================================================
const chatConfig = {
    endpoint: 'https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call',
    bearer:   '685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6'
};

let userData    = { name: '', phone: '', notes: '', service: 'pdr', friction: '' };
let currentStep = 0;
let botOpened   = false;

const chatBox   = document.getElementById('chat-box');
const inputArea = document.getElementById('chat-input-container');

// ─── 1. CORE UI ──────────────────────────────────────────────

function openBot(service = 'pdr') {
    userData.service = service;
    const container = document.getElementById('bot-container');
    const launcher  = document.getElementById('bot-launcher');
    if (container) container.style.display = 'flex';
    if (launcher)  launcher.style.display  = 'none';
    if (currentStep === 0) nextStep();
    botOpened = true;
}

function closeBot() {
    document.getElementById('bot-container').style.display = 'none';
    document.getElementById('bot-launcher').style.display  = 'flex';
}

// Typing indicator then message
function addBotMessage(text, delay = 700) {
    const typing = document.createElement('div');
    typing.className = 'bot-msg';
    typing.style.cssText = 'opacity:0.6; font-style:italic; font-size:0.85rem;';
    typing.textContent = '…';
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        typing.style.cssText = '';
        typing.textContent = text;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, delay);
}

function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'user-msg';
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ─── 2. CONVERSATION PATHS ───────────────────────────────────

function nextStep() {
    const path = window.location.pathname;

    if (currentStep !== 0) return;

    // HUB PAGE → Route to service
    if (!path.match(/pdr|collision|detailing|glass/)) {
        addBotMessage("Hi! Which service can we help you with today?");
        setTimeout(() => {
            inputArea.innerHTML = `
                <button onclick="handleRouting('pdr')"       class="chat-btn" style="width:100%; margin-bottom:6px; background:#2e7d32;">🔨 PDR / Dents</button>
                <button onclick="handleRouting('collision')" class="chat-btn" style="width:100%; margin-bottom:6px; background:#d32f2f;">🚗 Collision / Paint</button>
                <button onclick="handleRouting('detailing')" class="chat-btn" style="width:100%; margin-bottom:6px; background:#0288d1;">✨ Pro Detailing</button>
                <button onclick="handleRouting('glass')"     class="chat-btn" style="width:100%; background:#b8860b;">💎 Glass / Rock Chips</button>
            `;
        }, 900);
    }
    // GLASS TRIAGE
    else if (path.includes('glass')) {
        addBotMessage("Welcome to Glass Triage! Quick question: is the windshield crack longer than a credit card?");
        setTimeout(() => {
            inputArea.innerHTML = `
                <button onclick="handleFriction('Long Crack / Needs Replacement')" class="chat-btn" style="flex:1;">Yes, It's Long</button>
                <button onclick="handleFriction('Small Chip / Repair Candidate')"  class="chat-btn grey" style="flex:1;">No, Small Chip</button>
            `;
        }, 900);
        currentStep = 1;
    }
    // DETAILING TRIAGE
    else if (path.includes('detailing')) {
        addBotMessage("Great choice! Are we looking at a full showroom restoration or a maintenance clean?");
        setTimeout(() => {
            inputArea.innerHTML = `
                <button onclick="handleFriction('Full Showroom Restoration')" class="chat-btn" style="flex:1;">Full Restoration</button>
                <button onclick="handleFriction('Maintenance Interior Clean')" class="chat-btn grey" style="flex:1;">Maintenance Clean</button>
            `;
        }, 900);
        currentStep = 1;
    }
    // PDR TRIAGE
    else if (path.includes('pdr')) {
        addBotMessage("Welcome to PDR Triage! Is the damage from hail, or is it a single dent/door ding?");
        setTimeout(() => {
            inputArea.innerHTML = `
                <button onclick="handleFriction('Hail Damage — Multiple Dents')" class="chat-btn" style="flex:1; background:#e8a020; color:#1a3044;">Hail Damage</button>
                <button onclick="handleFriction('Single Dent / Door Ding')"      class="chat-btn grey" style="flex:1;">Door Ding / Dent</button>
            `;
        }, 900);
        currentStep = 1;
    }
    // COLLISION TRIAGE
    else {
        addBotMessage("I'll connect you with a Collision specialist. How severe is the damage?");
        setTimeout(() => {
            inputArea.innerHTML = `
                <button onclick="handleFriction('Minor Cosmetic — Scuffs / Scratches')" class="chat-btn grey" style="width:100%; margin-bottom:6px;">Minor (Scuffs / Scratches)</button>
                <button onclick="handleFriction('Moderate — Panel / Bumper Damage')"    class="chat-btn"     style="width:100%; margin-bottom:6px;">Moderate (Panel / Bumper)</button>
                <button onclick="handleFriction('Major — Structural / Airbag Damage')"  class="chat-btn"     style="width:100%; background:#d32f2f;">Major / Structural</button>
            `;
        }, 900);
        currentStep = 1;
    }
}

function handleRouting(area) {
    addUserMessage(`I need ${area} help.`);
    const routes = {
        pdr:       'pdr-repair.html',
        collision: 'collision-repair.html',
        detailing: 'car-detailing.html',
        glass:     'glass-repair.html'
    };
    addBotMessage(`Opening the ${area.toUpperCase()} specialist center…`);
    setTimeout(() => { window.location.href = routes[area]; }, 1400);
}

function handleFriction(val) {
    addUserMessage(val);
    userData.friction = val;
    inputArea.innerHTML = '';
    addBotMessage("Perfect. What's your name?");
    setTimeout(() => {
        inputArea.innerHTML = `
            <input type="text"  id="bot-field-input" placeholder="Your name…" autocomplete="given-name">
            <button class="send-btn" onclick="handleName()">→</button>
        `;
        const inp = document.getElementById('bot-field-input');
        inp.focus();
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') handleName(); });
    }, 800);
    currentStep = 2;
}

function handleName() {
    const val = (document.getElementById('bot-field-input').value || '').trim();
    if (!val) return;
    userData.name = val;
    addUserMessage(val);
    inputArea.innerHTML = '';
    addBotMessage(`Nice to meet you, ${val}! What's the best cell number to reach you for your priority update?`);
    setTimeout(() => {
        inputArea.innerHTML = `
            <input type="tel"  id="bot-field-input" placeholder="(928) 555-0100" autocomplete="tel">
            <button class="send-btn" onclick="handlePhone()">→</button>
        `;
        const inp = document.getElementById('bot-field-input');
        inp.focus();
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') handlePhone(); });
    }, 800);
}

function handlePhone() {
    const raw = (document.getElementById('bot-field-input').value || '').replace(/\D/g, '');
    if (raw.length !== 10) {
        document.getElementById('bot-field-input').style.border = '2px solid #d32f2f';
        document.getElementById('bot-field-input').placeholder = 'Please enter 10-digit number';
        return;
    }
    userData.phone = raw;
    addUserMessage(formatPhone(raw));
    inputArea.innerHTML = '';
    addBotMessage("Last step — tell us your Vehicle Year, Make, and Model, plus any details about the damage.");
    setTimeout(() => {
        inputArea.innerHTML = `
            <textarea id="bot-field-input" placeholder="e.g. 2022 Ford F-150 — large hail dents on hood and roof…" style="width:100%; min-height:70px; resize:none; padding:10px; border:1.5px solid #e2e8f0; border-radius:8px; font-family:inherit; font-size:14px;"></textarea>
            <button class="send-btn" onclick="finalSubmit()" style="width:100%; border-radius:8px; padding:12px;">Send Request →</button>
        `;
        document.getElementById('bot-field-input').focus();
    }, 800);
}

function formatPhone(digits) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

// ─── 3. FINAL DISPATCH ───────────────────────────────────────

async function finalSubmit() {
    if (document.getElementById('hp_email_bot').value !== '') return; // honeypot

    const notes = (document.getElementById('bot-field-input').value || '').trim();
    if (!notes) {
        document.getElementById('bot-field-input').style.border = '2px solid #d32f2f';
        return;
    }
    userData.notes = notes;
    addUserMessage(notes);
    inputArea.innerHTML = '';
    addBotMessage("Placing you in the Priority Queue… 🔄");

    // Final safety: confirm service type from URL
    const path = window.location.pathname;
    let finalService = 'pdr';
    if (path.includes('collision')) finalService = 'collision';
    if (path.includes('detailing')) finalService = 'detailing';
    if (path.includes('glass'))     finalService = 'glass';

    const triageSummary = `TRIAGE: ${userData.friction} | VEHICLE: ${userData.notes}`;

    try {
        const res = await fetch(chatConfig.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatConfig.bearer}`
            },
            body: JSON.stringify({
                customer_name: userData.name,
                phone:         userData.phone,
                zip_code:      '85901',
                service_type:  finalService,
                notes:         triageSummary
            })
        });

        if (res.ok) {
            // Fire GA4 conversion event
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', {
                    send_to: 'AW-17963694572',
                    value:    20.0,
                    currency: 'USD'
                });
                gtag('event', 'lead_submitted', {
                    service_type: finalService
                });
            }
            addBotMessage(`✅ You're in the queue, ${userData.name}! A ${finalService.toUpperCase()} specialist will contact you at ${formatPhone(userData.phone)} shortly.`);
            setTimeout(() => {
                addBotMessage("While you wait — if your damage is covered by comprehensive insurance, your out-of-pocket cost may be $0. Mention that to your specialist!");
            }, 2000);
            inputArea.innerHTML = `<p style="color:#2e7d32; font-weight:700; text-align:center; width:100%; padding:8px;">✓ Priority Request Sent!</p>`;
        } else {
            addBotMessage("We received your info but hit a small snag. Please refresh and try again, or call us directly.");
        }
    } catch (e) {
        addBotMessage("Connection error. Please refresh the page and try again.");
        console.error('Dispatch error:', e);
    }
}

// ─── 4. AUTO-OPEN (gentler — 9 seconds, not 4) ───────────────

window.addEventListener('load', () => {
    const path = window.location.pathname;

    let autoContext = 'pdr';
    if (path.includes('collision')) autoContext = 'collision';
    if (path.includes('detailing')) autoContext = 'detailing';
    if (path.includes('glass'))     autoContext = 'glass';

    // Pulse the launcher button after 5s to draw attention (less aggressive than auto-open)
    setTimeout(() => {
        const launcher = document.getElementById('bot-launcher');
        if (launcher && !botOpened) {
            launcher.style.animation = 'pulse-launcher 1s ease 3';
        }
    }, 5000);

    // Auto-open after 9 seconds if not yet opened
    setTimeout(() => {
        const container = document.getElementById('bot-container');
        if (container && container.style.display !== 'flex' && !botOpened) {
            openBot(autoContext);
        }
    }, 9000);
});
