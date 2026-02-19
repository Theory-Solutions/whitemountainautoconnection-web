// --- 1. Price Calculator Logic ---
const dentSize = document.getElementById('dentSize');
const panelType = document.getElementById('panelType');
const priceRange = document.getElementById('priceRange');

function updateEstimate() {
    const base = parseInt(dentSize.value);
    const multiplier = parseFloat(panelType.value);
    const min = Math.round(base * multiplier);
    const max = Math.round(min * 1.5);
    priceRange.innerText = `$${min} - $${max}`;
}

dentSize.addEventListener('change', updateEstimate);
panelType.addEventListener('change', updateEstimate);

// --- 2. Google Ads Conversion Trigger ---
function triggerGoogleConversion() {
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': 'AW-17963694572', 
            'value': 20.0, // Your target CPL
            'currency': 'USD'
        });
        console.log('Google Ads conversion signal sent.');
    }
}

// --- 3. Lead Form Submission ---
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('submitBtn');

leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Honeypot check for bots
    if (document.getElementById('hp_email').value !== "") return;

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";

    const formData = {
        customer_name: document.getElementById('customer_name').value,
        phone: document.getElementById('phone').value,
        zip_code: document.getElementById('zip_code').value,
        notes: document.getElementById('notes').value,
        source_tag: 'google_ads_pdr_showlow', // Tracks lead source in Supabase
        created_at: new Date().toISOString()
    };

    try {
        // --- Replace URL below with your actual Theory Solutions API/Supabase endpoint ---
        const response = await fetch('YOUR_SUPABASE_OR_API_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Success: Trigger the Google Ads conversion
            triggerGoogleConversion();
            
            alert("Success! A local PDR specialist will text you shortly for a quote.");
            leadForm.reset();
            updateEstimate();
        } else {
            throw new Error('Submission failed');
        }
    } catch (err) {
        console.error(err);
        alert("Connection error. Please call us directly for a quote.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send to Specialist";
    }
});