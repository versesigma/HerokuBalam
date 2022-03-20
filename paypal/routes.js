var express = require('express');
const router = express.Router();
const braintree = require('braintree');

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.PAYPAL_MERCHANT_ID || '',
  publicKey: process.env.PAYPAL_PUBLIC_KEY || '',
  privateKey: process.env.PAYPAL_PRIVATE_KEY || '',
});

router.get('/create_token', function (req, res) {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.json({success: false});
    }
    res.json({clientToken: response.clientToken, success: true});
  });
});

router.post('/checkout', async (req, res) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  // const deviceDataFromTheClient = req.body.deviceData;
  const amountFromClient = req.body.amount;
  console.log(req.body);
  gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromTheClient,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.json({success: false});
      }
      res.json(result);
    }
  );
  // Use payment method nonce here
});

module.exports = router;
