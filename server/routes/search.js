import express from "express";

import Locations from "./locations.js";
import Apartments from "./apartments.js";
import Companies from "./companies.js";

const router = express.Router();

// POST /search/
router.post("/search/", async (req, res) => {
  if(req.body.location) {
    // Find apartments in the location
    let locations = await Locations.getLocations(req.body.location);
    let apartments = [];
    for (let location of locations) {
      for(let apartment of location.apartments) {
        apartments.push(apartment.toString());
      }
    }
    apartments = [...new Set(apartments)];
    // Now get those apartments.
    let foundApartments = await Apartments.getApartments(apartments);
    //console.log(foundApartments);
    let filteredApartments = foundApartments.filter((apartment) => {
      let useFound = false;
      if(req.body.use) {
        if(apartment.use === req.body.use) {
          useFound = true;
        } else if(req.body.use === "Muu" && apartment.use === "") {
          useFound = true;
        }
      } else {
        useFound = true;
      }
      //console.log(useFound);
      let roomFound = false;
      if(req.body.rooms.length > 0) {
        for(let room of req.body.rooms) {
          if(apartment.rooms.includes(room + "h")) {
            roomFound = true;
            break;
          } else if(apartment.rooms.includes(room)) {
            roomFound = true;
            break;
          }
        }
      } else {
        roomFound = true;
      }
      //console.log(roomFound);
      let houseTypeFound = false;
      if(req.body.houseType.length > 0) {
        for(let houseType of req.body.houseType) {
          if(apartment.type === houseType) {
            houseTypeFound = true;
            break;
          }
        }
      } else {
        houseTypeFound = true;
      }
      //console.log(houseTypeFound);
      let priceFound = false;
      if(req.body.minPrice && req.body.maxPrice) {
        if(apartment.rent >= req.body.minPrice && apartment.rent <= req.body.maxPrice) {
          priceFound = true;
        }
      } else {
        priceFound = true;
      }
      //console.log(priceFound);
      let sizeFound = false;
      if(req.body.minSize && req.body.maxSize) {
        if(apartment.size >= req.body.minSize && apartment.size <= req.body.maxSize) {
          sizeFound = true;
        }
      } else {
        sizeFound = true;
      }
      //console.log(sizeFound);
      let heatingFound = false;
      if(req.body.heating.length > 0) {
        for(let heating of req.body.heating) {
          if(apartment.heating === heating) {
            heatingFound = true;
            break;
          }
        }
      } else {
        heatingFound = true;
      }
      //console.log(heatingFound);
      let hasFound = false;
      if(req.body.has.length > 0) {
        for(let has of req.body.has) {
          if(apartment.has.includes(has)) {
            hasFound = true;
            break;
          }
        }
      } else {
        hasFound = true;
      }
      //console.log(hasFound);
      let conditionFound = false;
      if(req.body.condition.length > 0) {
        for(let condition of req.body.condition) {
          if(apartment.condition === condition) {
            conditionFound = true;
            break;
          }
        }
      } else {
        conditionFound = true;
      }
      //console.log(conditionFound);
      let kitchenTypeFound = false;
      if(req.body.kitchenType.length > 0) {
        for(let kitchenType of req.body.kitchenType) {
          if(apartment.kitchenType === kitchenType) {
            kitchenTypeFound = true;
            break;
          }
        }
      } else {
        kitchenTypeFound = true;
      }
      //console.log(kitchenTypeFound);
      let suitableFound = false;
      if(req.body.suitable.length > 0) {
        for(let suitable of req.body.suitable) {
          if(apartment.suitable.includes(suitable)) {
            suitableFound = true;
            break;
          }
        }
      } else {
        suitableFound = true;
      }
      //console.log(suitableFound);
      let showOnlyFound = false;
      if(req.body.showOnly.length > 0) {
        for(let showOnly of req.body.showOnly) {
          if(showOnly == "Kuvalliset") {
            if(apartment.images.length > 0) {
              showOnlyFound = true;
              break;
            }
          } else if(showOnly == "Yksityisten") {
            if(apartment.private == true) {
              showOnlyFound = true;
              break;
            }
          } else if(showOnly == "Välittäjien") {
            if(apartment.private == false) {
              showOnlyFound = true;
              break;
            }
          }
        }
      } else {
        showOnlyFound = true;
      }
      //console.log(showOnlyFound);
      return useFound && roomFound && houseTypeFound && priceFound && sizeFound && heatingFound && hasFound && conditionFound && kitchenTypeFound && suitableFound;
    });
    //console.log(filteredApartments);
    let PaidApartments = filteredApartments.filter(filteredApartments => filteredApartments.paid === true);
    console.log(PaidApartments);

    return res.status(200).json({ message: "success", apartments: PaidApartments });
  } else {
    return res.status(404).json({ error: "No location specified." });
  }
});

router.get("/search/apartment/:apartment", async (req, res) => {
  let apartment = await Apartments.getApartment(req.params.apartment);
  if (apartment) {
    let company = await Companies.getCompany(apartment.company);
    if (company) {
      apartment.company = company;
      return res.status(200).json({ message: "success", apartment: apartment });
    } else {
      res.status(200).json({ message: "success", apartment: apartment });
    }
  } else {
    res.status(404).json({ message: "Apartment not found." });
  }
});



export default { 
  router
};