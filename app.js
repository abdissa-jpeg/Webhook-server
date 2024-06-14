const express = require("express");
const Flutterwave = require("flutterwave-node-v3");
const Invoice = require("./models/invoiceModel");
const Contract = require("./models/contractModel");
const Transaction = require("./models/transactionModel");
const Withdrawal = require("./models/withdrawalModel");
const Balance = require("./models/balanceModel");
const { PAYSTACK_SECRET_KEY, PAYSTACK_SECRET_HASH, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = require("./config");


const flw = new Flutterwave(FLW_PUBLIC_KEY, FLW_SECRET_KEY);
const app = express();

app.use(express.json());

app.post("/flutterWaveWebhook", async (req, res) => {
  try {
    // If you specified a secret hash, check for the signature
    const secretHash = FLW_SECRET_HASH;
    const signature = req.headers["verif-hash"];
    if (!signature || signature !== secretHash) {
      // This request isn't from Flutterwave; discard
      res.status(401).end();
    }
    const payload = req.body;
    // It's a good idea to log all received events.
    console.log("Payload: /n/n")
    console.log(payload);
    const response = await flw.Transaction.verify({ id: payload.id });
    const invoiceDetails = await Invoice.findById(response.data.meta.invoiceId);
    const contract = await Contract.findById(invoiceDetails.contractId);
    console.log("Response: /n/n")
    console.log(response);
    if (
      response.data.status === "successful" &&
      response.data.amount === invoiceDetails.amount &&
      response.data.currency === contract.paymentCurrency
    ) {
      // Inform the customer their payment was successful
      invoiceDetails.status = "Fully Paid";
      await invoiceDetails.save();
      const withdrawalMethod = await Withdrawal.findOne({userId: contract.talentId});
      await Transaction.create({
        invoiceId: invoiceDetails._id,
        companyId: contract.companyId,
        talentId: contract.talentId,
        withdrawalId:withdrawalMethod._id,
        transactionType:"Payment",
        transactionMethod: "FlutterWave",
        transactionDetails: response.data,
      });
      const currency = response.data.currency
      const totalReceivable = response.data.amount_settled;
      await Balance.findOneAndUpdate(
        { talentId: invoiceDetails.talentId },
        { $inc: { [`balance.${currency}`]: totalReceivable } },
        { upsert: true }
      );
      return res
        .status(200)
        .json({
          status: "Success",
          message: "Payment verification successful",
        });
    } else {
      // Inform the customer their payment was unsuccessful
      return res
        .status(400)
        .json({ status: "Failed", message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});

app.post("/stripeWebhook", express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const payload = event.data.object;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = payload;
      console.log('PaymentIntent was successful!');
      
      const invoiceDetails = await Invoice.findById(paymentIntent.metadata.invoiceId);
      const contract = await Contract.findById(invoiceDetails.contractId);

      if (invoiceDetails.amount == paymentIntent.amount_received / 100 && contract.paymentCurrency == paymentIntent.currency.toUpperCase()) {
        invoiceDetails.status = "Fully Paid";
        await invoiceDetails.save();
        
        const withdrawalMethod = await Withdrawal.findOne({ userId: contract.talentId });

        await Transaction.create({
          invoiceId: invoiceDetails._id,
          companyId: contract.companyId,
          talentId: contract.talentId,
          withdrawalId: withdrawalMethod._id,
          transactionType: "Payment",
          transactionMethod: "Stripe",
          transactionDetails: paymentIntent,
        });

        const currency = paymentIntent.currency.toUpperCase();
        const totalReceivable = paymentIntent.amount_received / 100;

        await Balance.findOneAndUpdate(
          { talentId: invoiceDetails.talentId },
          { $inc: { [`balance.${currency}`]: totalReceivable } },
          { upsert: true }
        );

        res.status(200).json({
          status: "Success",
          message: "Payment verification successful",
        });
      } else {
        res.status(400).json({
          status: "Failed",
          message: "Payment verification failed",
        });
      }
      break;
    case 'checkout.session.completed':
      // Handle checkout session completed event
      const session = payload;
      console.log('Checkout session completed!');

      const invoiceId = session.metadata.invoiceId;
      const invoiceDetails = await Invoice.findById(invoiceId);
      const contract = await Contract.findById(invoiceDetails.contractId);

      // Perform necessary actions for successful checkout session completion
      // Update invoice status, record transaction, update balance, etc.

      res.status(200).json({
        status: "Success",
        message: "Checkout session completed",
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      res.status(400).json({ status: "Failed", message: "Unhandled event type" });
      break;
  }
});

app.post("/paystackWebhook", async (req, res) => {
  try {
    const secretHash = PAYSTACK_SECRET_HASH;
    const signature = req.headers["x-paystack-signature"];
    if (!signature || signature !== secretHash) {
      return res.status(401).end();
    }

    const payload = req.body;
    console.log("Paystack Payload:\n", payload);

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${payload.data.reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });
    const paymentData = response.data.data;
    console.log("Paystack Response:\n", paymentData);

    const invoiceDetails = await Invoice.findById(paymentData.metadata.invoiceId);
    const contract = await Contract.findById(invoiceDetails.contractId);

    if (paymentData.status === "success" &&
        paymentData.amount / 100 === invoiceDetails.amount &&
        paymentData.currency.toUpperCase() === contract.paymentCurrency) {

      invoiceDetails.status = "Fully Paid";
      await invoiceDetails.save();

      const withdrawalMethod = await Withdrawal.findOne({ userId: contract.talentId });

      await Transaction.create({
        invoiceId: invoiceDetails._id,
        companyId: contract.companyId,
        talentId: contract.talentId,
        withdrawalId: withdrawalMethod._id,
        transactionType: "Payment",
        transactionMethod: "Paystack",
        transactionDetails: paymentData,
      });

      const currency = paymentData.currency.toUpperCase();
      const totalReceivable = paymentData.amount / 100;

      await Balance.findOneAndUpdate(
        { talentId: invoiceDetails.talentId },
        { $inc: { [`balance.${currency}`]: totalReceivable } },
        { upsert: true }
      );

      return res.status(200).json({
        status: "Success",
        message: "Payment verification successful",
      });
    } else {
      return res.status(400).json({
        status: "Failed",
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
});



module.exports = app;