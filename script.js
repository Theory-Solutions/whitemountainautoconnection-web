// --- THEORY SOLUTIONS: MASTER PRODUCTION SCRIPT ---

// 1. Ballpark Estimator (For Index Page)
function updateEstimate() {
    const size = document.getElementById('dent_size')?.value;
    const panel = document.getElementById('panel_type')?.value;
    const priceDisplay = document.getElementById('price-range');

    const rates = {
        'dime': { 'standard': '75 - 125', 'complex': '125 - 200' },
        'quarter': { 'standard': '125 - 175', 'complex': '175 - 250' },
        'half-dollar': { 'standard': '175 - 225', 'complex': '225 - 350' },
        'tennis': { 'standard': '250 - 350', 'complex': '350 - 500' }
    };

    if (size && panel && priceDisplay) {
        priceDisplay.innerText = `$${rates[size][panel]}`;
    }
}

// 2. Unified Lead Submission
const leadForm = document.getElementById('collisionForm') || document.getElementById('lead-form');
const submitBtn = document.getElementById('submitBtn');

if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (document.getElementById('hp_email').value !== "") return;

        const phoneInput = document.getElementById('phone');
        const rawPhone = phoneInput.value.replace(/\D/g, '');
        if (rawPhone.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Connecting...";

        const nameVal = (document.getElementById('customer_name') || document.getElementById('name')).value;
        const serviceType = document.getElementById('service_type')?.value || 'pdr';
        
        // Match the database key: zip_code
        const zipVal = (document.getElementById('zip_code') || document.getElementById('zip'))?.value || '85901';

        const payload = {
            customer_name: nameVal,
            phone: rawPhone,
            service_type: serviceType,
            zip_code: zipVal, // DATABASE REQUIREMENT
            notes: `[VEHICLE: ${document.getElementById('vehicle')?.value || 'N/A'}] [CLAIM: ${document.getElementById('claim_type')?.value || 'N/A'}] | ${document.getElementById('notes').value}`,
            source_tag: `google_ads_${serviceType}`
        };

        try {
            const response = await fetch('https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', { 'send_to': 'AW-17963694572', 'value': 20.0, 'currency': 'USD' });
                }
                alert("Success! Your request has been sent.");
                leadForm.reset();
                if (document.getElementById('price-range')) document.getElementById('price-range').innerText = "--";
            } else {
                const errorText = await response.text();
                throw new Error(errorText);
            }
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Submission error: " + err.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = serviceType === 'collision' ? "SEND TO COLLISION SPECIALIST" : "GET FREE ESTIMATE";
        }
    });
}