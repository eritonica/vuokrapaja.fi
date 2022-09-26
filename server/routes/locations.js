import express from 'express';

import locationModel from '../schemas/location.js';

const router = express.Router();

const addLocation = async (location, apartment) => {
  let foundLocation = await locationModel.findOne({ location: location }).exec();
  if (foundLocation) {
    foundLocation.apartments.push(apartment);
    foundLocation.save();
  } else {
    location = new locationModel({
      location: location,
      apartments: [apartment],
    });
    location.save();
  }
};

const removeLocation = async (location, apartment) => {
  let foundLocation = await locationModel.findOne({ location: location }).exec();
  if (foundLocation) {
    foundLocation.apartments = foundLocation.apartments.filter((fapartment) => {
      return fapartment !== apartment;
    });
    foundLocation.save();
  }
};

// GET /locations
router.get('/locations', async (req, res) => {
  let locations = await locationModel.find().exec();
  res.status(200).json(locations);
});

// GET /locations/:search
router.get('/locations/:search', async (req, res) => {
  let locations = await locationModel.find({ location: { $regex: req.params.search, $options: 'i' } }).exec();
  res.status(200).json(locations);
});

// The following routes will most likely never be used.

// POST /locations
// {
//  "location": "string",
//  "apartments": [
//    _id: "string",
//  ]
router.post('/locations', async (req, res) => {
  let location = new locationModel({
    location: req.body.location,
    apartments: req.body.apartments,
  });
  location.save();
  res.status(200).json({ message: 'Location created.' });
});

// UPDATE /locations/:id
// {
//  "location": "string",
//  "apartments": [
//    _id: "string",
//  ]
router.put('/locations/:id', async (req, res) => {
  let location = await locationModel.findById(req.params.id).exec();
  if (location) {
    if (req.body.location) {
      location.location = req.body.location;
    }
    if (req.body.apartments) {
      location.apartments = req.body.apartments;
    }
    location.updated = Date.now();
    location.save();
    res.status(200).json({ message: 'Location updated.' });
  } else {
    res.status(404).json({ message: 'Location not found.' });
  }
});

// DELETE /locations/:id
router.delete('/locations/:id', async (req, res) => {
  let location = await locationModel.findById(req.params.id).exec();
  if (location) {
    location.remove();
    res.status(200).json({ message: 'Location deleted.' });
  } else {
    res.status(404).json({ message: 'Location not found.' });
  }
});

export default {
  router,
  addLocation,
  removeLocation,
};
