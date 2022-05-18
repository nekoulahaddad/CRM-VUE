const mongoose = require("mongoose");
const Educations = require("../models/education");

const fs = require("fs");
const {
  uploadFilesFromTempToFolder,
  makeUserDir,
  removeUserDir,
  removeDir,
  deleteUserUploadedFile,
  copyFolderRecursively,
} = require("../utils/fs");

const { EDUCATION_PATH, TEMP_PATH } = require("../utils/path");

exports.getEducations = async (req, res, next) => {
  try {
    const data = req.query;
    let myMatch = {};

    if (data.type) {
      myMatch["type"] = data.type;
    }

    if (req.userRole !== "superadmin") {
      if (req.userRole !== "manager" && data.type && data.type !== "lpa") {
        if (data.role && data.role !== "all" && data.role !== "director") {
          myMatch = {
            ...myMatch,
            $and: [
              {
                $or: [
                  {
                    role: data.role,
                  },
                  {
                    role: "all",
                  },
                ],
              },
              {
                $or: [
                  {
                    department: data.department,
                  },
                  {
                    department: "all",
                  },
                ],
              },
            ],
          };
        }
      }
    }

    const educations = await Educations.find(myMatch);
    // console.log("///////////////////////")
    // console.log("Educations")
    // console.log("///////////////////////")
    res.status(201).json({ educations: educations });
  } catch (error) {
    next(error);
  }
};

exports.addEducation = async (req, res, next) => {
  try {
    const dataEducation = req.body;
    const newEducation = await Educations.create(dataEducation);
    console.log("///////////////////////");
    console.log("New Education");
    console.log("///////////////////////");
    await newEducation.save();
    res.status(201).json({
      message: "ADDED",
      event: newEducation,
    });
  } catch (error) {
    next(error);
  }
};

exports.editEducation = async (req, res, next) => {
  try {
    const dataEducation = req.body;
    const educationId = dataEducation.educationId;
    const currentEducation = await Educations.findById(educationId);

    if (dataEducation.title && dataEducation.title !== null) {
      currentEducation.title = dataEducation.title;
    }

    if (dataEducation.role) {
      currentEducation.role = dataEducation.role;
    }
    if (dataEducation.department) {
      currentEducation.department = dataEducation.department;
    }
    if (dataEducation.description && dataEducation.description !== null) {
      currentEducation.description = dataEducation.description;
    }

    const updateEducation = await currentEducation.updateOne(currentEducation);
    console.log("///////////////////////");
    console.log("Updated Education");
    console.log(updateEducation);
    console.log("///////////////////////");
    res.status(204).json({ message: "EDITED" });
  } catch (error) {
    next(error);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    const dataDocument = req.body;
    const currentEducation = await Educations.findById(
      dataDocument.educationId
    );
    for (doc of req.files.document) {
      await makeUserDir(EDUCATION_PATH, `/${currentEducation._id}/`);
      await uploadFilesFromTempToFolder(
        TEMP_PATH,
        EDUCATION_PATH,
        doc.filename,
        `/${currentEducation._id}/`
      );

      let path = `/uploads/educations/${currentEducation._id}/`;

      currentEducation.documents.push({
        title: doc.originalname,
        path: path,
        document: doc.filename,
      });
    }

    await currentEducation.updateOne(currentEducation);

    res.status(204).json({ message: "EDITED" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.deleteEducation = async (req, res, next) => {
  try {
    const educationId = req.body.educationId;
    const deletedEducation = await Educations.findOneAndDelete({
      _id: educationId,
    });
    console.log("///////////////////////");
    console.log("Deleted Education");
    console.log(deletedEducation);
    console.log("///////////////////////");
    res.status(201).json({
      message: "DELETED",
      education: deletedEducation,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const educationId = req.body.educationId;
    const documentId = req.body.documentId;

    const deletedDocument = await Educations.updateOne(
      {
        _id: mongoose.Types.ObjectId(educationId),
      },
      {
        $pull: {
          documents: {
            _id: mongoose.Types.ObjectId(documentId),
          },
        },
      }
    );
    res.status(201).json({
      message: "DELETED",
    });
  } catch (error) {
    next(error);
  }
};
