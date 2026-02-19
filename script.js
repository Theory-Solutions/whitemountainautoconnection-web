// --- 1. Ballpark Repair Estimator Logic ---
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

// Listen for changes on the dropdowns
dentSize.addEventListener('change', updateEstimate);
panelType.addEventListener('change', updateEstimate);

// --- 2. Google Ads Conversion Signal ---
function triggerGoogleConversion() {
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            'send_to': 'AW-17963694572',
            'value': 20.0, // Your target Cost Per Lead (CPL)
            'currency': 'USD'
        });
        console.log('Google Ads conversion signal successfully sent.');
    }
}

// --- 3. Lead Form Submission to Database ---
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('submitBtn');

leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Honeypot check for bots to protect your budget
    if (document.getElementById('hp_email').value !== "") return;

    submitBtn.disabled = true;
    submitBtn.innerText = "Sending to Specialist...";

    const formData = {
        customer_name: document.getElementById('customer_name').value,
        phone: document.getElementById('phone').value,
        zip_code: document.getElementById('zip_code').value,
        notes: document.getElementById('notes').value,
        source_tag: 'google_ads_pdr_showlow', // Tags lead source for Theory Solutions
        created_at: new Date().toISOString()
    };

    try {
        // Replace with your actual Theory Solutions / Supabase endpoint
        const response = await fetch('YOUR_SUPABASE_OR_API_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // SUCCESS: Trigger the Google Ads conversion signal
            triggerGoogleConversion();
            
            alert("Success! A local PDR specialist will text you shortly for a quote.");
            leadForm.reset();
            updateEstimate(); // Reset estimator to default
        } else {
            throw new Error('Submission failed');
        }
    } catch (err) {
        console.error(err);
        alert("Connection error. Please try again or call us directly.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send to Specialist";
    }
});