import crypto from './dependancies/crypto.js';

if(process.argv.length > 1) {
  let data = process.argv[2];
  console.log(data);
  let encrypted = crypto.encrypt(data);
  console.log(encrypted);
  console.log(crypto.compare(data, encrypted));
}