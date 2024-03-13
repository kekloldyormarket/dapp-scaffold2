const crypto = require('crypto');

const hash = crypto.createHash('sha256');
hash.update('collect_fund_fee');

const discriminator = hash.digest().slice(0, 8);
console.log(Array.from(discriminator));