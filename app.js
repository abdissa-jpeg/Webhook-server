const express = require("express");
const Flutterwave = require("flutterwave-node-v3");
const Invoice = require("./models/invoiceModel");
const Contract = require("./models/contractModel");
const Transaction = require("./models/transactionModel");
const { FLW_SECRET_HASH, FLW_PUBLIC_KEY, FLW_SECRET_KEY } = require("./config");
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
    const invoiceDetails = await Invoice.findById(payload.txRef);
    const contract = await Contract.findById(invoiceDetails.contractId);
    const response = await flw.Transaction.verify({ id: payload.id });
    console.log("Response: /n/n")
    console.log(response);
    if (
      response.data.status === "successful" &&
      response.data.amount === invoiceDetails.amount &&
      response.data.currency === contract.paymentCurrency
    ) {
      // Inform the customer their payment was successful
      invoiceDetails.status = "Paid";
      await invoiceDetails.save();
      const transaction = await Transaction.create({
        invoiceId: invoiceDetails._id,
        companyId: contract.companyId,
        talentId: contract.talentId,
        paymentMethod: "FlutterWave",
        transactionDetails: response,
      });

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

module.exports = app;