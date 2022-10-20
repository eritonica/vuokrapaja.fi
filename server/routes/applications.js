import express from 'express';

import applicationModel from '../schemas/application.js';

import applicants from './applicants.js';
import accounts from './accounts.js';


const router = express.Router();

// Route for getting single application by id
router.get('/applications/:id', async (req, res) => {
  if(!req.params) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  if(!req.params.id) {
    res.status(400).send({"message": "No apartment ID provided."});
  }
  console.log("Getting application by id", req.params.id);
  let application = await applicationModel.findById(req.params.id).exec();
  console.log("Got application by id", application);
  if(application) {
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
  let applications = await applicationModel.find({apartment: req.params.id}).exec();
  if(applications) {
    res.status(200).send(applications);
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
  if(req.headers.token) {
    let account = await accounts.getAccountByToken(req.headers.token);
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
    console.log("Token does not exist!");
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
    application.save();
    let applicants = await applicants.addApplicants(application, req.body.applicants);
    res.status(200).send({ "message": "Application added.", "application": application, "applicants": applicants });
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
  router
};