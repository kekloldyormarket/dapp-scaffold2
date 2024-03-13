const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// your routes go here
const fetch = require('node-fetch');

app.use(cors());
app.use(express.json());

app.post('/create-token-account', async (req, res) => {
  try {
  const response = await fetch('https://referral.jup.ag/api/referral/EEpusENSuFrXqUKYDA3XAarQWNjCLtBZBvJKAePHTBYS/token-accounts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      mint: req.body.mint,
      feePayer: req.body.feePayer,
    }),
  });

  const data = await response.json();
  res.json(data);
} catch (err){
  console.error(err.message);
res.sendStatus(200)
}
});

app.listen(3001, () => console.log('Server running on port 3000'));