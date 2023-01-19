import express from 'express';

import locationModel from '../schemas/location.js';
import sessions from './sessions.js';

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

const getLocation = async (location) => {
  let foundLocation = await locationModel.findOne({ location: location }).exec();
  if (foundLocation) {
    return foundLocation;
  } else {
    return null;
  }
};

const getLocations = async (location) => {
  let foundLocations = await locationModel.find({ location: {$regex: location, $options: 'i'} }).exec();
  if (foundLocations) {
    return foundLocations;
  } else {
    return null;
  }
};

const removeFromLocations = async(apartment) => {
  let locations = await locationModel.find().exec();
  if (locations) {
    for (let i = 0; i < locations.length; i++) {
      if(locations[i].apartments.length == 0) {
        locations[i].remove(); // Does this work?
        continue;
      }
      for (let x = 0; x < locations[i].apartments.length; x++) {
        if (locations[i].apartments[x] == apartment) { // Maybe a bug because ObjectID == string
          delete locations[i].apartments[x];
          locations[i].save(); // Need testing, maybe? :D
        } 
      }
    }
    return true;
  } else {
    return false;
  }
} 

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
  sessions.checkSession(req, res, async () => {
    let location = new locationModel({
      location: req.body.location,
      apartments: req.body.apartments,
    });
    location.save();
    res.status(200).json({ message: 'Location created.' });
  });
});

// UPDATE /locations/:id
// {
//  "location": "string",
//  "apartments": [
//    _id: "string",
//  ]
router.put('/locations/:id', async (req, res) => {
  sessions.checkSession(req, res, async () => {
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
});

// DELETE /locations/:id
router.delete('/locations/:id', async (req, res) => {
  sessions.checkSession(req, res, async () => {
    let location = await locationModel.findById(req.params.id).exec();
    if (location) {
      location.remove();
      res.status(200).json({ message: 'Location deleted.' });
    } else {
      res.status(404).json({ message: 'Location not found.' });
    }
  });
});

export default {
  router,
  addLocation,
  getLocation,
  getLocations,
  removeLocation,
};
