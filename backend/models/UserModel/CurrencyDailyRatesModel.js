const mongoose = require('mongoose');

const currencyRateSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  months: [
    {
      startMonth: { type: Date, required: true },
      endMonth: { type: Date, required: true },
      days: [
        {
          date: { type: Date, required: true },
          rates: [
            {
              currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency', required: true },
              value: { type: Number, required: true }
            }
          ]
        }
      ]
    }
  ]
});

const CurrencyRate = mongoose.model('CurrencyRate', currencyRateSchema);

const UserCredential = (userDbConnection) => {
    return userDbConnection.model("UserCredential", UserCredentialSchema);
  };
module.exports = CurrencyRate;
