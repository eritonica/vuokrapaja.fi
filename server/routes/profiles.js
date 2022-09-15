import express from "express";
import profileModel from "../schemas/profile.js";

const router = express.Router();

// POST /profiles
router.post("/profiles", async (req, res) => {
    let hasProfile = await profileModel.findOne({ account: req.session.account._id }).exec();
    if(hasProfile) {
        res.status(400).json({ message: "Profile already exists." });
        return;
    } else {
        let profile = new profileModel({
            account: req.session.account._id,
            type: req.body.type,
            name: req.body.name,
            profession: req.body.profession,
            birthday: req.body.birthday,
            security: req.body.security,
            address: req.body.address,
            description: req.body.description,
            avatar: req.body.avatar,
            phone: req.body.phone,
            email: req.body.email,
            website: req.body.website,
            active: true,
        });
        profile.save();
        res.status(200).json({ message: "Profile created." });
    }
});

// GET /profiles
router.get("/profiles", async (req, res) => {
    let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
    if(profile) {
        if(profile.active) {
            res.status(200).json(profile);
        } else {
            res.status(400).json({ message: "Profile not found." });
        }
    } else {
        res.status(400).json({ message: "Profile not found." });
    }
});

// PUT /profiles
router.put("/profiles", async (req, res) => {
    let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
    if(profile) {
        profile.type = req.body.type;
        profile.name = req.body.name;
        profile.profession = req.body.profession;
        profile.birthday = req.body.birthday;
        profile.security = req.body.security;
        profile.address = req.body.address;
        profile.description = req.body.description;
        profile.avatar = req.body.avatar;
        profile.phone = req.body.phone;
        profile.email = req.body.email;
        profile.website = req.body.website;
        profile.updated = Date.now();
        profile.save();
        res.status(200).json({ message: "Profile updated." });
    } else {
        res.status(400).json({ message: "Profile not found." });
    }
});

// DELETE /profiles
router.delete("/profiles", async (req, res) => {
    let profile = await profileModel.findOne({ account: req.session.account._id }).exec();
    if(profile) {
        profile.active = false;
        profile.updated = Date.now();
        profile.save();
        res.status(200).json({ message: "Profile deleted." });
    } else {
        res.status(400).json({ message: "Profile not found." });
    }
});

export default {
    router,
}