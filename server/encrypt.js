import crypto from './dependancies/crypto.js';

if(process.argv.length > 1) {
  console.log(crypto.encrypt(process.argv[1]));
}