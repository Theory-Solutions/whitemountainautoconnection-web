// --- THEORY SOLUTIONS: FULL PRODUCTION DISPATCH ---

const chatConfig = {
    endpoint: 'https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call',
    bearer: '685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6'
};

let userData = { name: '', phone: '', notes: '' };
let currentStep = 0;

// 1. CALCULATOR LOGIC
const dSize = document.getElementById('dentSize');
const pType = document.getElementById('panelType');
const pRange = document.getElementById('priceRange');

function updateEstimate() {
    if (!dSize || !pType || !pRange) return;
    const low = Math.round(parseInt(dSize.value) * parseFloat(pType.value));
    const high = Math.round(low * 1.5);
    pRange.innerText = `$${low} - $${high}`;
}
dSize?.addEventListener('change', updateEstimate);
pType?.addEventListener('change', updateEstimate);

// 2. CHAT UI FUNCTIONS
const chatBox = document.getElementById('chat-box');
const inputArea = document.getElementById('chat-input-container');

function openBot() {
    document.getElementById('bot-container').style.display = 'flex';
    document.getElementById('bot-launcher').style.display = 'none';
    if (currentStep === 0) nextStep();
}

function closeBot() {
    document.getElementById('bot-container').style.display = 'none';
    document.getElementById('bot-launcher').style.display = 'flex';
}

function addBotMessage(text, delay = 800) {
    const msg = document.createElement('div');
    msg.className = 'bot-msg';
    msg.innerText = "...";
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => { msg.innerText = text; chatBox.scrollTop = chatBox.scrollHeight; }, delay);
}

function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'user-msg';
    msg.innerText = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 3. CONVERSATIONAL FLOW
function nextStep(choice = '') {
    if (currentStep === 0) {
        addBotMessage("Hello! I see you have been browsing our site, do you have some questions?");
        setTimeout(() => {
            addBotMessage("Or would you like to get in contact with a partner in our network?");
            inputArea.innerHTML = `<button onclick="nextStep('Yes')" class="chat-btn">Yes</button><button onclick="closeBot()" class="chat-btn grey">No</button>`;
        }, 1200);
        currentStep = 1;
    } 
    else if (currentStep === 1 && choice === 'Yes') {
        addUserMessage("Yes");
        addBotMessage("Great! We protect your PII—we purge this data every 7 days to protect you and us.");
        setTimeout(() => {
            addBotMessage("What is your name?");
            inputArea.innerHTML = `<input type="text" id="bot-field-input" placeholder="Name..."><button class="send-btn" onclick="handleName()">Send</button>`;
        }, 1000);
        currentStep = 2;
    }
}

function handleName() {
    const name = document.getElementById('bot-field-input').value;
    if (!name) return;
    userData.name = name;
    addUserMessage(name);
    addBotMessage(`Great ${name}, what is a good contact number for you?`);
    inputArea.innerHTML = `<input type="tel" id="bot-field-input" placeholder="Phone..."><button class="send-btn" onclick="handlePhone()">Send</button>`;
}

function handlePhone() {
    const phone = document.getElementById('bot-field-input').value.replace(/\D/g, '');
    if (phone.length !== 10) return alert("Enter 10 digits.");
    userData.phone = phone;
    addUserMessage(phone);
    addBotMessage(`${userData.name}, any comments you wish for us to know?`);
    inputArea.innerHTML = `<textarea id="bot-field-input" placeholder="Notes..."></textarea><button class="send-btn" onclick="finalSubmit()">Send</button>`;
}

async function finalSubmit() {
    // Honeypot check
    if (document.getElementById('hp_email_bot').value !== "") return;

    userData.notes = document.getElementById('bot-field-input').value;
    addUserMessage(userData.notes || "None");
    addBotMessage("Connecting you to our partners...");

    try {
        const res = await fetch(chatConfig.endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${chatConfig.bearer}` 
            },
            body: JSON.stringify({ 
                customer_name: userData.name, 
                phone: userData.phone, 
                zip_code: '85710', // Tucson Base
                service_type: 'pdr', 
                notes: userData.notes 
            })
        });
        if (res.ok) {
            // FIRE GOOGLE CONVERSION
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', { 'send_to': 'AW-17963694572', 'value': 20.0, 'currency': 'USD' });
            }
            addBotMessage(`I'll get this over to our partners, ${userData.name}. You can expect a call/text within a business day!`);
            inputArea.innerHTML = "<b>Sent!</b>";
        }
    } catch (e) { addBotMessage("Connection error. Try again."); }
}

window.onload = () => {
    setTimeout(() => { if (document.getElementById('bot-container').style.display !== 'flex') openBot(); }, 5000);
};