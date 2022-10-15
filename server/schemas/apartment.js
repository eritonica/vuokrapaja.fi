import mongoose from 'mongoose';


const apartmentSchema = new mongoose.Schema({
  creator: {      // Ilmoituksen luo
    type: mongoose.Schema.Types.ObjectId,
		ref: 'Account',
		required: true,
  },
  company: {      // ilmoituksen yritys
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  address: {      // ilmoituksen osoite
    type: String,
  },
  zip: {          // postinumero
    type: String,
  },
  cityArea: {     // kaupunginosa
    type: String,
  },
  city: {         // kaupunki
    type: String,
  },
  country: {      // maa
    type: String,
  },
  rent: {         // vuokra
    type: Number,
  },
  rental: {       // sopimusmuoto
    type: String,
  },
  deposit: {      // vakuus
    type: String,
  },
  release: {      // vapautuminen
    type: Date,
  },
  rooms: {        // huoneet 2h+k+kph
    type: String,
  },
  size: {         // Koko neliöinä
    type: Number,
  },
  floor: {        // Kerros
    type: String,
  },
  type: {         // asunnon tyyppi
    type: String,
  },
  waterSeperate: {  // vesimaksu erikseen
    type: Boolean,
  },
  water: {        // vesimaksu
    type: Number,
  },
  electricitySeperate: {  // sähkömaksu erikseen
    type: Boolean, 
  },
  electricity: { // sähkömaksu
    type: Number,
  },
  heatingSeperate: { // lämmitysmaksu erikseen
    type: Boolean,
  },
  use: {          // käyttötarkoitus
    type: String,
  },
  description: {  // kuvaus
    type: String,
  },
  condition: {    // kunto
    type: String,
  },
  buildingYear: { // rakennusvuosi
    type: Number,
  },
  kitchenType: {  // keittiön tyyppi
    type: String,
  },
  heating: {      // lämmitys
    type: String,
  },
  has: {          // asunnossa on
    type: Array,
  },
  suitable: {     // sopii
    type: Array,
  },
  images: {       // kuvat
    type: Array,
  },
  housing: {      // Taloyhtiön nimi
    type: String,
  },
  hosting: {      // Isännöinti
    type: String,
  },
  maintenance: {  // Huolto
    type: String,
  },
  responsible: {  // Vastuu kiinteistönhoidosta
    type: String,
  },
  contact: {      // Yhteyshenkilö
    type: String,
  },
  phone: {        // Puhelinnumero
    type: String,
  },
  email: {        // Sähköposti
    type: String,
  },
  website: {      // Kotisivu
    type: String,
  },
  location: {     // Sijainti
    type: String,
  },
  applicationUrl: { // Hakulomake
    type: String,
  },
  private: {      // yksityinen
    type: Boolean,
    default: true,
  },
  paid: {
    type: Boolean,
    required: true,
    default: false,
  },
  created: {      // ilmoituksen luontipäivä
    type: Date,
    required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export default mongoose.model('Apartment', apartmentSchema);