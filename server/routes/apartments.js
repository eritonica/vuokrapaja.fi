import express from "express";

import apartmentModel from "../schemas/apartment.js";
import companies from "./companies.js";
import locations from "./locations.js";
import applications from "./applications.js";

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

router.get("/apartments/:id", async (req, res) => {
  console.log(req.params.id);
  if(req.params.id !== "undefined") {
    let apartment = await apartmentModel.findById(req.params.id).exec();
    if(companies.checkPermission(req.session.account._id, apartment.company, "read")) {
      console.log(apartment);
      res.status(200).json({ message: "success", apartment: apartment });
    } else {
      res.status(401).json({ message: "You do not have permission to read these apartments." });
    }
  }
});

router.get("/apartments/company/:company", async (req, res) => {
  // check if req.params.company is not undefined
  if (req.params.company !== "undefined") {
    if(companies.checkPermission(req.session.account._id, req.params.company, "read")) {
      // console.log(req.params.company);
      let apartments = await apartmentModel.find({ company: req.params.company }).exec();
      if (apartments) {
        let apartmentsArray = [];
        for (let i = 0; i < apartments.length; i++) {
          let count = await applications.getApplicationsCountByApartment(apartments[i]._id);
          let apartment = {
            _id: apartments[i]._id,
            creator: apartments[i].creator,
            company: apartments[i].company,
            address: apartments[i].address,
            zip: apartments[i].zip,
            cityArea: apartments[i].cityArea,
            city: apartments[i].city,
            country: apartments[i].country,
            rent: apartments[i].rent,
            rental: apartments[i].rental,
            release: apartments[i].release,
            rooms: apartments[i].rooms,
            size: apartments[i].size,
            type: apartments[i].type,
            waterSeperate: apartments[i].waterSeperate,
            water: apartments[i].water,
            electricitySeperate: apartments[i].electricitySeperate,
            electricity: apartments[i].electricity,
            heatingSeperate: apartments[i].heatingSeperate,
            use: apartments[i].use,
            description: apartments[i].description,
            condition: apartments[i].condition,
            buildingYear: apartments[i].buildingYear,
            kitchenType: apartments[i].kitchenType,
            heating: apartments[i].heating,
            has: apartments[i].has,
            suitable: apartments[i].suitable,
            images: apartments[i].images,
            deposit: apartments[i].deposit,
            floor: apartments[i].floor,
            housing: apartments[i].housing,
            hosting: apartments[i].hosting,
            maintenance: apartments[i].maintenance,
            responsible: apartments[i].responsible,
            contact: apartments[i].contact,
            phone: apartments[i].phone,
            email: apartments[i].email,
            website: apartments[i].website,
            location: apartments[i].location,
            applicationUrl: apartments[i].applicationUrl,
            default: apartments[i].default,
            paid: apartments[i].paid,
            created: apartments[i].created,
            updated: apartments[i].updated,
            applicationsCount: count,
          };
          apartmentsArray.push(apartment);
        }
        res.status(200).json({ message: "success", apartments: apartmentsArray });
      } else {
        res.status(200).json({ message: "No apartments found." });
      }
    } else {
      res.status(401).json({ message: "You do not have permission to read these apartments." });
    }
  } else {
    res.status(400).json({ message: "You do not have company profile created." });
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
      deposit: req.body.deposit,
      floor: req.body.floor,
      housing: req.body.housing,
      hosting: req.body.hosting,
      maintenance: req.body.maintenance,
      responsible: req.body.responsible,
      contact: req.body.contact,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website,
      location: req.body.location,
      applicationUrl: req.body.applicationUrl,
      default: req.body.default,
      paid: false,
    });
    apartment.save();
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
  if(req.params.id !== "undefined") {
    let apartment = await apartmentModel.findById(req.params.id).exec();
    if (companies.checkPermission(req.session.account._id, apartment._id, "write")) {
      // console.log(req.params);
      // console.log(req.body);
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
      apartment.deposit = req.body.deposit;
      apartment.floor = req.body.floor;
      apartment.housing = req.body.housing;
      apartment.hosting = req.body.hosting;
      apartment.maintenance = req.body.maintenance;
      apartment.responsible = req.body.responsible;
      apartment.contact = req.body.contact;
      apartment.phone = req.body.phone;
      apartment.email = req.body.email;
      apartment.website = req.body.website;
      apartment.location = req.body.location;
      apartment.applicationUrl = req.body.applicationUrl;
      apartment.default = req.body.default;
      apartment.paid = req.body.paid;
      try {
        apartment.save();
      } catch(error) {
        // console.log(error);
      }
      return res.status(200).json({ message: "Apartment updated." });
    } else {
      return res.status(403).json({ message: "You do not have permission to edit this apartment." });
    }
  } else {
    return res.status(400).json({ message: "Apartment not found." });
  }
});

// DELETE /apartments/:id
router.delete("/apartments/:id", async (req, res) => {
  if(req.params.id !== "undefined") {
    let apartment = await apartmentModel.findById(req.params.id).exec();
    if(!apartment) return res.status(404).json({ message: "Apartment not found." });
    if (companies.checkPermission(req.session.account._id, apartment.company, "delete")) {
      apartmentModel.findByIdAndDelete(req.params.id).exec();
      return res.status(200).json({ message: "Apartment deleted." });
    } else {
      return res.status(403).json({ message: "You are not the creator of this apartment." });
    }
  } else {
    return res.status(404).json({ message: "Apartment not found." });
  }
});

export default {
  router,
  getApartment,
  getApartments,
};