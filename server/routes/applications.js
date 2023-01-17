import express from 'express';

import applicationModel from '../schemas/application.js';

import applicants from './applicants.js';
import accounts from './accounts.js';
import notifications from './notifications.js';
import apartments from './apartments.js';

const router = express.Router();


const getApplicationsCountByApartment = async (id) => {
  let response = await applicationModel.find({ property: id }).exec();
  if (response) {
    return response.length;
  } else {
    return 0;
  }
};

// Get latest application by token
router.get('/applications/latest', async (req, res) => {
  if(!req.headers.token) {
    res.status(400).send({"message": "No token provided."});
  }
  let foundApplication = await applicationModel.findOne({token: req.headers.token}).sort({created: -1}).exec();
  if(foundApplication) {
    let foundApplicants = await applicants.getApplicants(foundApplication._id);
    let application = {
      _id: foundApplication._id,
      apartment: foundApplication.property,
      creator: foundApplication.creator,
      token: foundApplication.token,
      applicantsCount: foundApplication.applicantsCount,
      applicants: foundApplicants,
      desiredStart: (foundApplication.desiredStart) ? foundApplication.desiredStart : Date.now(),
      desiredEnd: (foundApplication.desiredEnd) ? foundApplication.desiredEnd : Date.now(),
      currentAddress: (foundApplication.currentAddress) ? foundApplication.currentAddress : "",
      deposit: (foundApplication.deposit === "") ? [] : String(foundApplication.deposit).split(","),
      pets: (foundApplication.pets) ? foundApplication.pets : "",
      description: (foundApplication.description) ? foundApplication.description : "",
      reason: (foundApplication.reason) ? foundApplication.reason : "",
      creditDescription: (foundApplication.creditDescription) ? foundApplication.creditDescription : "",
      visitation: (foundApplication.visitation) ? foundApplication.visitation : "",
      terms: (foundApplication.terms) ? foundApplication.terms : false,
      status: foundApplication.status,
      created: foundApplication.created,
    }
    res.status(200).send({ "message" : "Application found.", "application" : application });
  } else {
    res.status(404).send({"message": "Application not found"});
  }
});

// Get application count by apartment id
router.get('/applications/apartment/count/:id', async (req, res) => {
  if(!req.params) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(!req.params.id) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(req.params.id == "undefined") {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  let foundApplications = await applicationModel.find({property: req.params.id}).exec();
  if(foundApplications) {
    res.status(200).send({ "message" : "Applications found.", "count" : foundApplications.length });
  } else {
    res.status(404).send({"message": "Application not found"});
  }
});


// Route for getting single application by id
router.get('/applications/:id', async (req, res) => {
  if(!req.params) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(!req.params.id) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(req.params.id == "undefined") {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  let foundApplication = await applicationModel.findById(req.params.id).exec();
  if(foundApplication) {
    let foundApplicants = await applicants.getApplicants(foundApplication._id);
    let application = {
      _id: foundApplication._id,
      apartment: foundApplication.property,
      creator: foundApplication.creator,
      token: foundApplication.token,
      applicantsCount: foundApplication.applicantsCount,
      applicants: foundApplicants,
      desiredStart: (foundApplication.desiredStart) ? foundApplication.desiredStart : Date.now(),
      desiredEnd: (foundApplication.desiredEnd) ? foundApplication.desiredEnd : Date.now(),
      currentAddress: (foundApplication.currentAddress) ? foundApplication.currentAddress : "",
      deposit: (foundApplication.deposit === "") ? [] : String(foundApplication.deposit).split(","),
      pets: (foundApplication.pets) ? foundApplication.pets : "",
      description: (foundApplication.description) ? foundApplication.description : "",
      reason: (foundApplication.reason) ? foundApplication.reason : "",
      creditDescription: (foundApplication.creditDescription) ? foundApplication.creditDescription : "",
      visitation: (foundApplication.visitation) ? foundApplication.visitation : "",
      terms: (foundApplication.terms) ? foundApplication.terms : false,
      status: foundApplication.status,
      created: foundApplication.created,
    }
    res.status(200).send({ "message" : "Application found.", "application" : application });
  } else {
    res.status(404).send({ "message" : "Application not found."});
  }
});

// Route for getting all applications by apartment id
router.get('/applications/apartment/:id', async (req, res) => {
  if(!req.params) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(!req.params.id) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(req.params.id == "undefined") {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  let foundApplications = await applicationModel.find({property: req.params.id}).sort({created: -1}).exec();
  if(foundApplications) {
    let applications = [];
    for(let i = 0; i < foundApplications.length; i++) {
      let foundApplicants = await applicants.getApplicants(foundApplications[i]._id);
      let application = {
        _id: foundApplications[i]._id,
        apartment: foundApplications[i].property,
        creator: foundApplications[i].creator,
        token: foundApplications[i].token,
        applicantsCount: foundApplications[i].applicantsCount,
        applicants: foundApplicants,
        desiredStart: (foundApplications[i].desiredStart) ? foundApplications[i].desiredStart : Date.now(),
        desiredEnd: (foundApplications[i].desiredEnd) ? foundApplications[i].desiredEnd : Date.now(),
        currentAddress: (foundApplications[i].currentAddress) ? foundApplications[i].currentAddress : "",
        deposit: (foundApplications[i].deposit === "") ? [] : String(foundApplications[i].deposit).split(","),
        pets: (foundApplications[i].pets) ? foundApplications[i].pets : "",
        description: (foundApplications[i].description) ? foundApplications[i].description : "",
        reason: (foundApplications[i].reason) ? foundApplications[i].reason : "",
        creditDescription: (foundApplications[i].creditDescription) ? foundApplications[i].creditDescription : "",
        visitation: (foundApplications[i].visitation) ? foundApplications[i].visitation : "",
        terms: (foundApplications[i].terms) ? foundApplications[i].terms : false,
        status: foundApplications[i].status,
        created: foundApplications[i].created,
      }
      applications.push(application);
    }
    res.status(200).send({ "message" : "Application found.", "applications" : applications });
  } else {
    res.status(404).send({"message": "Applications not found"});
  }
});

// Route for posting new application to database with applicants
router.post('/applications', async (req, res) => {
  if(!req.body) {
    res.status(400).send({"message": "No data provided."});
  }
  if(!req.body.apartment) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(!req.body.applicants) {
    res.status(400).send({"message": "No applicants provided."});
  }
  // check if token exists
  // console.log("POST /api/applications", req.body)
  // console.log("Headers: ", req.headers)
  if(req.headers.token !== "undefined") {
    let account = await accounts.getAccountByToken(req.headers.token);
    // console.log("Fetched account: ", account);
    if(account) {
      let application = new applicationModel({
        property: req.body.apartment,
        creator: account._id,
        applicantsCount: req.body.applicants.length,
        desiredStart: req.body.desiredStart,
        desiredEnd: req.body.desiredEnd,
        currentAddress: req.body.currentAddress,
        deposit: req.body.deposit.join(","),
        pets: req.body.pets,
        description: req.body.description,
        reason: req.body.reason,
        creditDescription: req.body.creditDescription,
        visitation: req.body.visitation,
        terms: req.body.terms
      });
      let savedApplication = await application.save();
      if(savedApplication) {
        let savedApplicants = await applicants.addApplicants(savedApplication._id, req.body.applicants);
        // write notification to company that new application has been created
        notifications.sendToApartmentCompany(req.body.apartment, application,
          "New application has been created on apartment" +
          " /company/applications/" + req.body.apartment + "" +
          " Please review it and contact the applicant.")
        if(savedApplicants) {
          res.status(200).send({ "message": "Application added.", "application": savedApplication, "applicants": applicants });
        } else {
          res.status(500).send({ "message": "Error saving applicants."});
        }
      } else {
        res.status(500).send({ "message": "Error saving application."});
      }
    } else {
      res.status(401).send({ "message": "Invalid token."});
    }
  } else {
    let application = new applicationModel({
      property: req.body.apartment,
      applicantsCount: req.body.applicantsCount,
      desiredStart: req.body.desiredStart,
      desiredEnd: req.body.desiredEnd,
      currentAddress: req.body.currentAddress,
      deposit: req.body.deposit.join(","),
      pets: req.body.pets,
      description: req.body.description,
      reason: req.body.reason,
      creditDescription: req.body.creditDescription,
      visitation: req.body.visitation,
      terms: req.body.terms
    });
    let savedApplication = await application.save();
    if(savedApplication) {
      notifications.sendToApartmentCompany(req.body.apartment, application,
        "New application has been created on apartment" +
        " /company/applications/" + req.body.apartment + "" +
        " Please review it and contact the applicant.")
      let savedApplicants = await applicants.addApplicants(savedApplication._id, req.body.applicants);
      if(savedApplicants) {
        res.status(200).send({ "message": "Application added.", "application": savedApplication, "applicants": applicants });
      } else {
        res.status(500).send({ "message": "Error saving applicants."});
      }
    } else {
      res.status(500).send({ "message": "Error saving application."});
    }
  }
});

// Route for rejecting application
router.put("/applications/reject/:id", async (req, res) => {
  if(!req.params.id) {
    res.status(400).send({"message": "No application ID provided."});
  }
  if(req.params.id == "undefined") {
    res.status(400).send({"message": "No application ID provided."});
  }
  let foundApplication = await applicationModel.findOne({_id: req.params.id}).exec();
  if(foundApplication) {
    foundApplication.status = "rejected";
    let savedApplication = await foundApplication.save();
    if(savedApplication) {
      let foundApplicants = await applicants.getApplicants(savedApplication._id);
      let application = {
        _id: savedApplication._id,
        apartment: savedApplication.property,
        creator: savedApplication.creator,
        token: savedApplication.token,
        applicantsCount: savedApplication.applicantsCount,
        applicants: foundApplicants,
        desiredStart: (savedApplication.desiredStart) ? savedApplication.desiredStart : Date.now(),
        desiredEnd: (savedApplication.desiredEnd) ? savedApplication.desiredEnd : Date.now(),
        currentAddress: (savedApplication.currentAddress) ? savedApplication.currentAddress : "",
        deposit: (savedApplication.deposit === "") ? [] : String(savedApplication.deposit).split(","),
        pets: (savedApplication.pets) ? savedApplication.pets : "",
        description: (savedApplication.description) ? savedApplication.description : "",
        reason: (savedApplication.reason) ? savedApplication.reason : "",
        creditDescription: (savedApplication.creditDescription) ? savedApplication.creditDescription : "",
        visitation: (savedApplication.visitation) ? savedApplication.visitation : "",
        terms: (savedApplication.terms) ? savedApplication.terms : false,
        status: savedApplication.status,
        created: savedApplication.created,
      }
      notifications.sendToApplicationCreator(application._id, "rejected");
      res.status(200).send({ "message": "Application rejected.", "application": application });
    } else {
      res.status(500).send({ "message": "Error saving application."});
    }
  } else {
    res.status(404).send({ "message": "Application not found."});
  }
});

// Route for accepting application
router.put("/applications/accept/:id", async (req, res) => {
  if(!req.params.id) {
    res.status(400).send({"message": "No application ID provided."});
  }
  if(req.params.id == "undefined") {
    res.status(400).send({"message": "No application ID provided."});
  }
  let foundApplication = await applicationModel.findOne({_id: req.params.id}).exec();
  if(foundApplication) {
    foundApplication.status = "accepted";
    let savedApplication = await foundApplication.save();
    if(savedApplication) {
      let foundApplicants = await applicants.getApplicants(savedApplication._id);
      let application = {
        _id: savedApplication._id,
        apartment: savedApplication.property,
        creator: savedApplication.creator,
        token: savedApplication.token,
        applicantsCount: savedApplication.applicantsCount,
        applicants: foundApplicants,
        desiredStart: (savedApplication.desiredStart) ? savedApplication.desiredStart : Date.now(),
        desiredEnd: (savedApplication.desiredEnd) ? savedApplication.desiredEnd : Date.now(),
        currentAddress: (savedApplication.currentAddress) ? savedApplication.currentAddress : "",
        deposit: (savedApplication.deposit === "") ? [] : String(savedApplication.deposit).split(","),
        pets: (savedApplication.pets) ? savedApplication.pets : "",
        description: (savedApplication.description) ? savedApplication.description : "",
        reason: (savedApplication.reason) ? savedApplication.reason : "",
        creditDescription: (savedApplication.creditDescription) ? savedApplication.creditDescription : "",
        visitation: (savedApplication.visitation) ? savedApplication.visitation : "",
        terms: (savedApplication.terms) ? savedApplication.terms : false,
        status: savedApplication.status,
        created: savedApplication.created,
      }
      notifications.sendToApplicationCreator(application._id, "accepted");
      res.status(200).send({ "message": "Application accepted.", "application": application });
    } else {
      res.status(500).send({ "message": "Error saving application."});
    }
  } else {
    res.status(404).send({ "message": "Application not found."});
  }
});

// Route for updating application and applicants
router.put('/applications/:id', async (req, res) => {
  // check if token is valid and if it belongs to the creator of the application
  if(req.headers.token) {
    let account = await accounts.getAccountByToken(req.headers.token);
    if(account) {
      let application = await applicationModel.findById(req.params.id).exec();
      if(application) {
        if(application.creator == account._id) {
          application.property = req.body.apartment;
          application.applicantsCount = req.body.applicantsCount;
          application.desiredStart = req.body.desiredStart;
          application.desiredEnd = req.body.desiredEnd;
          application.currentAddress = req.body.currentAddress;
          application.deposit = req.body.deposit.join(",");
          application.pets = req.body.pets;
          application.description = req.body.description;
          application.reason = req.body.reason;
          application.creditDescription = req.body.creditDescription;
          application.visitation = req.body.visitation;
          application.terms = req.body.terms;
          let savedApplication = await application.save();
          if(savedApplication) {
            let updatedApplicants = await applicants.updateApplicants(savedApplication._id, req.body.applicants);
            if(updatedApplicants) {
              res.status(200).send({ "message": "Application updated.", "application": savedApplication, "applicants": updatedApplicants });
            } else {
              res.status(500).send("Error updating applicants.");
            }
          } else {
            res.status(500).send("Error updating application.");
          }
        } else {
          res.status(403).send("You are not the creator of this application.");
        }
      } else {
        res.status(404).send("Application not found.");
      }
    } else {
      res.status(403).send("Invalid token.");
    }
  } else {
    res.status(403).send("No token provided.");
  }
});

// Route for deleting application and applicants
router.delete('/applications/:id', async (req, res) => {
  // check if token is valid and if it belongs to the creator of the application
  if(req.headers.token) {
    let account = await accounts.getAccountByToken(req.headers.token);
    if(account) {
      let application = await applicationModel.findById(req.params.id).exec();
      if(application) {
        if(application.creator == account._id) {
          let deletedApplicants = await applicants.deleteApplicants(application._id);
          if(deletedApplicants) {
            let deletedApplication = await applicationModel.findByIdAndDelete(req.params.id).exec();
            if(deletedApplication) {
              res.status(200).send({ "message": "Application deleted.", "application": deletedApplication, "applicants": deletedApplicants });
            } else {
              res.status(500).send("Error deleting application.");
            }
          } else {
            res.status(500).send("Error deleting applicants.");
          }
        } else {
          res.status(403).send("You are not the creator of this application.");
        }
      } else {
        res.status(404).send("Application not found.");
      }
    } else {
      res.status(403).send("Invalid token.");
    }
  } else {
    res.status(403).send("No token provided.");
  }
});

export default {
  router,
  getApplicationsCountByApartment,
};