// --- THEORY SOLUTIONS: PRODUCTION DISPATCH & CALCULATOR ---

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

// 2. LEAD SUBMISSION
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('submitBtn');

if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Honeypot check for bots
        if (document.getElementById('hp_email').value !== "") return;

        // Clean phone number
        const rawPhone = document.getElementById('phone').value.replace(/\D/g, '');
        if (rawPhone.length !== 10) { 
            alert("Please enter a valid 10-digit phone number."); 
            return; 
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Finding Specialist...";

        try {
            const response = await fetch('https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6'
                },
                body: JSON.stringify({
                    customer_name: document.getElementById('customer_name').value,
                    phone: rawPhone,
                    zip_code: document.getElementById('zip_code').value || '85901',
                    service_type: 'pdr',
                    notes: document.getElementById('notes').value
                })
            });

            if (response.ok) {
                // GOOGLE ADS CONVERSION TRACKING
                if (typeof gtag === 'function') {
                    gtag('event', 'conversion', { 
                        'send_to': 'AW-17963694572', 
                        'value': 20.0, 
                        'currency': 'USD' 
                    });
                }
                
                alert("Success! Our Show Low specialist will text you shortly to get photos. Remember, all data is purged in 7 days.");
                leadForm.reset();
            } else {
                alert("The system is busy. Please try again or call us.");
            }
        } catch (err) {
            alert("Connection error. Please check your signal.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = "CONNECT & GET ESTIMATE";
        }
    });
}