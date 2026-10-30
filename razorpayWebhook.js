// PLACEHOLDER. Future: verify X-Razorpay-Signature over the RAW body with
// RAZORPAY_WEBHOOK_SECRET, insert event id into webhook_events (unique) for idempotency,
// then update payments/bookings. Never trust browser success messages.
module.exports=(req,res)=>{res.status(503).json({error:'Webhook not enabled yet.'})};
