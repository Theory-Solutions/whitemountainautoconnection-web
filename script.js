function updateEstimate() {
    const size = parseFloat(document.getElementById('dentSize').value);
    const difficulty = parseFloat(document.getElementById('panelType').value);
    document.getElementById('priceRange').innerText = `$${Math.round(size * difficulty)} - $${Math.round((size + 50) * difficulty)}`;
}
document.getElementById('dentSize').addEventListener('change', updateEstimate);
document.getElementById('panelType').addEventListener('change', updateEstimate);

document.getElementById('lead-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (document.getElementById('hp_email').value !== "") return;

    const zip = document.getElementById('zip_code').value.trim();
    const rawPhone = document.getElementById('phone').value.replace(/\D/g, '');
    
    if (rawPhone.length !== 10 || rawPhone.includes('5555555') || rawPhone === '9119119111') {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true; btn.innerText = "Sending...";

    try {
        const res = await fetch('https://chirnldyffatubstgudq.supabase.co/functions/v1/dispatch-call', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 685a90e030b9bee750f5343a600518bb997f08e6dec99abd43f540f1283dcfb6' 
            },
            body: JSON.stringify({
                customer_name: document.getElementById('customer_name').value,
                phone: rawPhone,
                zip_code: zip,
                notes: document.getElementById('notes').value
            })
        });

        if (res.ok) { alert("Success! A specialist will text you shortly."); document.getElementById('lead-form').reset(); }
        else { throw new Error(); }
    } catch (err) { alert("System busy. Please try again later."); }
    finally { btn.disabled = false; btn.innerText = "Send to Specialist"; }
});