// 1. BALLPARK CALCULATOR LOGIC
function updateEstimate() {
    const size = parseFloat(document.getElementById('dentSize').value);
    const difficulty = parseFloat(document.getElementById('panelType').value);
    
    // Calculate low and high ranges based on industry standards
    const low = Math.round(size * difficulty);
    const high = Math.round((size + 50) * difficulty);
    
    document.getElementById('priceRange').innerText = `$${low} - $${high}`;
}

// Auto-update when user changes selections
document.getElementById('dentSize').addEventListener('change', updateEstimate);
document.getElementById('panelType').addEventListener('change', updateEstimate);

// Smooth scroll to lead form
function scrollToForm() {
    document.getElementById('lead-section').scrollIntoView({ behavior: 'smooth' });
}

// 2. SECURE FORM SUBMISSION
let isSubmitting = false; // Prevents double-clicks

document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // A. HONEYPOT BOT CHECK
    // If a bot fills out the hidden email field, we silently stop
    if (document.getElementById('hp_email').value !== "") {
        console.warn("Bot detected.");
        return; 
    }

    // B. GEOGRAPHIC LOCK (Show Low, Pinetop, Lakeside Zips)
    const zip = document.getElementById('zip_code').value.trim();
    const validZips = ['85901', '85902', '85911', '85912', '85929', '85935']; 
    if (!validZips.includes(zip)) {
        alert("Sorry! We only provide service to Show Low, Pinetop, and Lakeside at this time.");
        return;
    }

    // C. PHONE NUMBER VALIDATION
    // Remove all non-numbers (dashes, spaces, etc.)
    const rawPhone = document.getElementById('phone').value.replace(/\D/g, '');
    
    // Rule: Must be 10 digits, no 911, no 555-5555, no repeating same-digit (1111111111)
    const isFake = /^(.)\1{9}$/.test(rawPhone) || rawPhone.includes('5555555'); 
    const isEmergency = rawPhone === '911';

    if (rawPhone.length !== 10 || isFake || isEmergency) {
        alert("Please enter a valid 10-digit mobile phone number so our specialist can text you.");
        return;
    }

    // D. PREPARE SUBMISSION
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;
    isSubmitting = true;

    const formData = {
        customer_name: document.getElementById('customer_name').value,
        phone: rawPhone,
        zip_code: zip,
        service_type: 'PDR',
        notes: document.getElementById('notes').value
    };

    try {
        // Calling your Supabase Edge Function
        const response = await fetch('https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6' 
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert("Success! Your request has been sent to our local specialist.");
            document.getElementById('lead-form').reset();
        } else {
            throw new Error("Dispatch failed");
        }
    } catch (error) {
        alert("System busy. Please call or try again later.");
        console.error('Error:', error);
    } finally {
        submitBtn.innerText = "Send to Specialist";
        submitBtn.disabled = false;
        isSubmitting = false;
    }
});