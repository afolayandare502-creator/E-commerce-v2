const https = require('https');
const Order = require('../models/Order');

// Make a generic HTTPS request wrapped in a Promise
const makePaystackRequest = (method, path, data = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: path,
            method: method,
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, res => {
            let body = '';
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(body);
                    resolve(response);
                } catch (e) {
                    reject(new Error('Failed to parse Paystack response'));
                }
            });
        });

        req.on('error', error => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
};

exports.initializePayment = async (req, res) => {
    try {
        const { email, amountKobo, orderIds } = req.body;

        if (!email || !amountKobo || !orderIds) {
            return res.status(400).json({ message: 'Email, amountKobo, and orderIds are required.' });
        }

        const params = {
            email: email,
            amount: amountKobo,
            metadata: {
                orderIds: JSON.stringify(orderIds)
            },
            callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:5500/Pages/payment-callback.html'
        };

        const paystackRes = await makePaystackRequest('POST', '/transaction/initialize', params);

        if (!paystackRes.status) {
            throw new Error(paystackRes.message || 'Paystack initialization failed');
        }

        res.json({
            authorizationUrl: paystackRes.data.authorization_url,
            reference: paystackRes.data.reference
        });
    } catch (error) {
        console.error('Initialize Payment Error:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({ success: false, message: 'Transaction reference is required.' });
        }

        console.log('[Paystack Verify] Reference received:', reference);

        const paystackRes = await makePaystackRequest('GET', `/transaction/verify/${reference}`);

        console.log('[Paystack Verify] Paystack API response status:', paystackRes.status);
        console.log('[Paystack Verify] Paystack API message:', paystackRes.message);
        console.log('[Paystack Verify] Transaction status:', paystackRes.data?.status);
        console.log('[Paystack Verify] Gateway response:', paystackRes.data?.gateway_response);

        if (!paystackRes.status) {
            return res.status(400).json({ success: false, message: paystackRes.message || 'Verification failed at Paystack' });
        }

        const txData = paystackRes.data;

        if (txData.status === 'success') {
            // Extract the orderIds from metadata
            let orderIds = [];
            try {
                if (txData.metadata && txData.metadata.orderIds) {
                    orderIds = JSON.parse(txData.metadata.orderIds);
                }
            } catch (e) {
                console.error('[Paystack Verify] Failed to parse metadata order IDs', e);
            }

            console.log('[Paystack Verify] Order IDs to mark as paid:', orderIds);

            // Mark orders as paid
            if (orderIds.length > 0) {
                await Order.updateMany(
                    { _id: { $in: orderIds } },
                    { 
                        $set: { 
                            status: 'Paid',
                            paymentMethod: 'Paystack',
                            paystackReference: reference
                        } 
                    }
                );
                console.log('[Paystack Verify] Orders updated to Paid');
            }

            return res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            // Transaction was not successful — pass Paystack's actual reason
            const reason = txData.gateway_response || `Payment status: ${txData.status}`;
            console.log('[Paystack Verify] Payment NOT successful. Reason:', reason);
            return res.status(400).json({ success: false, message: reason });
        }
    } catch (error) {
        console.error('[Paystack Verify] Server Error:', error);
        res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};
