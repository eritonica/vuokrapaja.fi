import express from 'express';

import applicantModel from '../schemas/applicant.js';

const addApplicants = async (application, applicants) => {
  if(!application) {
    throw new Error("No application provided.");
  }
  if(!applicants) {
    throw new Error("No applicants provided.");
  }
  for(let i = 0; i < applicants.length; i++) {
    let applicant = new applicantModel({
      application: application,
      name: applicants[i].name,
      birthday: applicants[i].birthday,
      phone: applicants[i].phone,
      email: applicants[i].email,
      workplace: applicants[i].workplace,
      monthlyIncome: applicants[i].monthlyIncome,
      smoking: applicants[i].smoking,
      credits: applicants[i].credits
    });
    applicant.save();
  }
  return getApplicants(application);
}

const getApplicants = async (application) => {
  if(!application) {
    throw new Error("No application provided.");
  }
  let applicants = await applicantModel.find({application: application}).exec();
  console.log(applicants);
  if(!applicants) {
    throw new Error("No applicants found.");
  }
  return applicants;
}

const deleteApplicants = async (application) => {
  if(!application) {
    throw new Error("No application provided.");
  }
  let applicants = applicantModel.find({application: application}).exec();
  if(!applicants) {
    throw new Error("No applicants found.");
  }
  for(let i = 0; i < applicants.length; i++) {
    applicantModel.deleteOne({_id: applicants[i]._id}).exec();
  }
  return true; 
}

const updateApplicants = async (application, applicants) => {
  if(!application) {
    throw new Error("No application provided.");
  }
  if(!applicants) {
    throw new Error("No applicants provided.");
  }
  deleteApplicants(application);
  addApplicants(application, applicants);
  return getApplicants(application);
}

export default {
  addApplicants,
  getApplicants,
  deleteApplicants,
  updateApplicants
};