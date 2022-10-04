import express from "express";

import apartmentModel from "../schemas/apartment.js";
import companies from "./companies.js";
import locations from "./locations.js";

const router = express.Router();

const getApartment = async (id) => {
  let apartment = await apartmentModel.findById(id).exec();
  if (apartment) {
    return apartment;
  } else {
    return null;
  }
};

const getApartments = async (ids) => {
  let apartments = await apartmentModel.find({ _id: { $in: ids } }).exec();
  if (apartments) {
    return apartments;
  } else {
    return null;
  }
};

// GET /apartments
router.get("/apartments/:company", async (req, res) => {
  if(companies.checkPermission(req.session.account._id, req.params.company, "read")) {
    let apartments = await apartmentModel.find({ company: req.params.company }).exec();
    res.status(200).json({ message: "success", apartments: apartments });
  } else {
    res.status(401).json({ message: "You do not have permission to read these apartments." });
  }
});

// POST /apartments
router.post("/apartments", async (req, res) => {
  if(companies.checkPermission(req.session.account._id, req.body.company, "write")) {
    let apartment = new apartmentModel({
      creator: req.session.account._id,
      company: req.body.company,
      address: req.body.address,
      zip: req.body.zip,
      cityArea: req.body.cityArea,
      city: req.body.city,
      country: req.body.country,
      rent: req.body.rent,
      rental: req.body.rental,
      release: req.body.release,
      rooms: req.body.rooms,
      size: req.body.size,
      type: req.body.type,
      waterSeperate: req.body.waterSeperate,
      water: req.body.water,
      electricitySeperate: req.body.electricitySeperate,
      electricity: req.body.electricity,
      heatingSeperate: req.body.heatingSeperate,
      use: req.body.use,
      description: req.body.description,
      condition: req.body.condition,
      buildingYear: req.body.buildingYear,
      kitchenType: req.body.kitchenType,
      heating: req.body.heating,
      has: req.body.has,
      suitable: req.body.suitable,
      images: req.body.images,
      default: req.body.default,
      paid: false,
    });
    apartment.save();
    console.log(apartment);
    // Magic happens here! ;) Lets add all possible locations to the location database.
    let keys = ["address", "zip", "cityArea", "city", "country"].reverse();
    let location = "";
    for(let i = 0; i < keys.length; i++) {
      if(apartment[keys[i]].length !== 0) {
        let tmp = "";
        if(location.length !== 0) {
          tmp = ", " + location;
        }
        if(keys[i] == "address") {
          let address = apartment[keys[i]].split(" ");
          location = address[0] + tmp;
        } else {
          location = apartment[keys[i]] + tmp;
        }
        locations.addLocation(location, apartment._id);
      }
    }
    res.status(200).json({ message: "Apartment created." });
  } else {
    res.status(401).json({ message: "You do not have permission to create this apartment." });
  }
});

// UPDATE /apartments/:id
router.put("/apartments/:id", async (req, res) => {
  let apartment = await apartmentModel.findById(req.params.id).exec();
  if (companies.checkPermission(req.session.account._id, apartment._id, "write")) {
    apartment.rent = req.body.rent;
    apartment.rental = req.body.rental;
    apartment.release = req.body.release;
    apartment.rooms = req.body.rooms;
    apartment.size = req.body.size;
    apartment.type = req.body.type;
    apartment.waterSeperate = req.body.waterSeperate;
    apartment.water = req.body.water;
    apartment.electricitySeperate = req.body.electricitySeperate;
    apartment.electricity = req.body.electricity;
    apartment.heatingSeperate = req.body.heatingSeperate;
    apartment.use = req.body.use;
    apartment.description = req.body.description;
    apartment.condition = req.body.condition;
    apartment.buildingYear = req.body.buildingYear;
    apartment.location = req.body.location;
    apartment.kitchenType = req.body.kitchenType;
    apartment.heating = req.body.heating;
    apartment.has = req.body.has;
    apartment.suitable = req.body.suitable;
    apartment.images = req.body.images;
    apartment.default = req.body.default;
    apartment.paid = req.body.paid;
    apartment.save();
    return res.status(200).json({ message: "Apartment updated." });
  } else {
    return res.status(403).json({ message: "You do not have permission to edit this apartment." });
  }
});

// DELETE /apartments/:id
router.delete("/apartments/:id", async (req, res) => {
  let apartment = await apartmentModel.findById(req.params.id).exec();
  if(!apartment) return res.status(404).json({ message: "Apartment not found." });
  if (companies.checkPermission(req.session.account._id, apartment.company, "delete")) {
    apartmentModel.findByIdAndDelete(req.params.id).exec();
    return res.status(200).json({ message: "Apartment deleted." });
  } else {
    return res.status(403).json({ message: "You are not the creator of this apartment." });
  }
});

export default {
  router,
  getApartment,
  getApartments,
};