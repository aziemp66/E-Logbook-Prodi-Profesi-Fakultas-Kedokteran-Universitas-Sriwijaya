const db = require("../models");
const validation = require("../utility/validation");

const getAllUser = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      attributes: [
        "id",
        "username",
        "email",
        "roles",
        "createdAt",
        "updatedAt",
      ],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getElogbookInfo = async (req, res, next) => {
  let stations;
  try {
    stations = await db.Station.findAll();
  } catch (error) {
    return next(error);
  }
  if (!stations) return next(new Error("Stations not found"));

  let diseases;
  try {
    diseases = await db.Disease.findAll();
  } catch (error) {
    return next(error);
  }
  if (!diseases) return next(new Error("Diseases not found"));

  let skills;
  try {
    skills = await db.Skill.findAll();
  } catch (error) {
    return next(error);
  }
  if (!skills) return next(new Error("Skills not found"));

  let hospitals;
  try {
    hospitals = await db.Hospital.findAll();
  } catch (error) {
    return next(error);
  }
  if (!hospitals) return next(new Error("Hospitals not found"));

  let guidances;
  try {
    guidances = await db.Guidance.findAll();
  } catch (error) {
    return next(error);
  }
  if (!guidances) return next(new Error("Guidances not found"));

  res.json({
    diseases,
    skills,
    stations,
    hospitals,
    guidances,
  });
};

const addStation = async (req, res, next) => {
  const { name } = req.body;

  const { error } = validation.addStationValidation({ name });
  if (error) return next(error.details[0]);

  try {
    await db.Station.create({
      name,
    });
  } catch (error) {
    return next(error);
  }
  res.json({
    message: "Station added successfully",
  });
};

const addDisease = async (req, res, next) => {
  const { name, station: stationId } = req.body;

  const { error } = validation.addDiseaseValidation({
    name,
    stationId,
  });
  if (error) return next(error.details[0]);

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  //check if there is a disease with the same name
  let existingDisease;
  try {
    existingDisease = await db.Disease.findOne({
      where: {
        name,
        station: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (existingDisease) return next(new Error("Disease already exists"));

  try {
    await db.Disease.create({
      name,
      station: stationId,
    });
  } catch (error) {
    return next(error);
  }
  res.json({
    message: "Disease added successfully",
  });
};

const addSkill = async (req, res, next) => {
  const { name, station: stationId } = req.body;

  const { error } = validation.addSkillValidation({ name, stationId });
  if (error) return next(error.details[0]);

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  //check if there is a skill with the same name
  let existingSkill;
  try {
    existingSkill = await db.Skill.findOne({
      where: {
        name,
        station: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (existingSkill) return next(new Error("Skill already exists"));

  try {
    await db.Skill.create({
      name,
      station: stationId,
    });
  } catch (error) {
    return next(error);
  }
  res.json({
    message: "Skill added successfully",
  });
};

const addGuidance = async (req, res, next) => {
  const { name } = req.body;

  const { error } = validation.addGuidanceValidation({ name });
  if (error) return next(error.details[0]);

  //check if there is a guidance with the same name
  let existingGuidance;
  try {
    existingGuidance = await db.Guidance.findOne({
      where: {
        name,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (existingGuidance) return next(new Error("Guidance already exists"));

  try {
    await db.Guidance.create({
      name,
    });
    res.json({
      message: "Guidance added successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const addHospital = async (req, res, next) => {
  const { name } = req.body;

  const { error } = validation.addHospitalValidation({ name });
  if (error) return next(error.details[0]);

  //check if there is a hospital with the same name
  let existingHospital;
  try {
    existingHospital = await db.Hospital.findOne({
      where: {
        name,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (existingHospital) return next(new Error("Hospital already exists"));

  try {
    await db.Hospital.create({
      name,
    });
    res.json({
      message: "Hospital added successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateStation = async (req, res, next) => {
  const { id, name } = req.body;

  const { error } = validation.updateStationValidation({ name });
  if (error) return next(error.details[0]);

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  try {
    existingStation.update(
      {
        name,
      },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: "Station updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateDisease = async (req, res, next) => {
  const { id, name, station } = req.body;

  const { error } = validation.updateDiseaseValidation({
    name,
    station,
  });
  if (error) return next(error.details[0]);

  try {
    await db.Disease.update(
      { name, station },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: "Disease updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateSkill = async (req, res, next) => {
  const { id, name, station } = req.body;

  const { error } = validation.updateSkillValidation({
    name,
    station,
  });
  if (error) return next(error.details[0]);

  try {
    await db.Skill.update(
      { name, station },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: "Skill updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateGuidance = async (req, res, next) => {
  const { id, name } = req.body;

  const { error } = validation.updateGuidanceValidation({
    name,
  });
  if (error) return next(error.details[0]);

  try {
    await db.Guidance.update(
      { name },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: "Guidance updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateHospital = async (req, res, next) => {
  const { id, name } = req.body;

  const { error } = validation.updateHospitalValidation({
    name,
  });
  if (error) return next(error.details[0]);

  try {
    await db.Hospital.update(
      { name },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: "Hospital updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteStation = async (req, res, next) => {
  const { id } = req.params;

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  try {
    await db.Station.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: "Station deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteDisease = async (req, res, next) => {
  const { id } = req.params;

  //check if disease exist
  let existingDisease;
  try {
    existingDisease = await db.Disease.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingDisease) return next(new Error("Disease does not exist"));

  try {
    await db.Disease.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: "Disease deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  const { id } = req.params;

  //check if skill exist
  let existingSkill;
  try {
    existingSkill = await db.Skill.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingSkill) return next(new Error("Skill does not exist"));

  try {
    await db.Skill.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: "Skill deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteGuidance = async (req, res, next) => {
  const { id } = req.params;

  //check if guidance exist
  let existingGuidance;
  try {
    existingGuidance = await db.Guidance.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingGuidance) return next(new Error("Guidance does not exist"));

  try {
    await db.Guidance.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: "Guidance deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteHospital = async (req, res, next) => {
  const { id } = req.params;

  //check if hospital exist
  let existingHospital;
  try {
    existingHospital = await db.Hospital.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingHospital) return next(new Error("Hospital does not exist"));

  try {
    await db.Hospital.destroy({
      where: {
        id,
      },
    });
    res.json({
      message: "Hospital deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getAllStudentPresention = async (req, res, next) => {
  let studentPresention;
  try {
    studentPresention = await db.Presention.findAll({});
  } catch (error) {
    return next(error);
  }
  if (!studentPresention) return next(new Error("No student presention"));

  res.json(studentPresention);
};

const addOrUpdateStudentPresention = async (req, res, next) => {
  const { stationId, present, sick, excused, absent, studentId } = req.body;

  const { error } = validation.addStudentPresentionValidation({
    present,
    sick,
    excused,
    absent,
  });
  if (error) return next(error.details[0]);

  //check if student exist
  let existingStudent;
  try {
    existingStudent = await db.User.findOne({
      where: {
        id: studentId,
        roles: "student",
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStudent) return next(new Error("Student does not exist"));

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  let existingPresention;
  try {
    existingPresention = await db.StudentPresention.findOne({
      where: {
        stationId: stationId,
        userId: studentId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingPresention)
    return next(new Error("Student Presention does not exist"));

  try {
    const [data, isCreated] = await db.Presention.findOrCreate({
      where: {
        stationId,
        studentId,
      },
      defaults: {
        studentId,
        stationId,
        present,
        sick,
        excused,
        absent,
      },
    });
    if (!isCreated && data)
      await data.update({ present, sick, excused, absent });
    res.json({
      message: "Student Presention updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const deleteStudentPresention = async (req, res, next) => {
  const { stationId, studentId } = req.body;

  //check if student exist
  let existingStudent;
  try {
    existingStudent = await db.User.findOne({
      where: {
        id: studentId,
        roles: "student",
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStudent) return next(new Error("Student does not exist"));

  //check if station exist
  let existingStation;
  try {
    existingStation = await db.Station.findOne({
      where: {
        id: stationId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingStation) return next(new Error("Station does not exist"));

  let existingPresention;
  try {
    existingPresention = await db.Presention.findOne({
      where: {
        stationId: stationId,
        userId: studentId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingPresention)
    return next(new Error("Student Presention does not exist"));

  try {
    await db.StudentPresention.destroy({
      where: {
        stationId: stationId,
        userId: studentId,
      },
    });
    res.json({
      message: "Student Presention deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserRoles = async (req, res, next) => {
  const { role, id: userId } = req.body;

  if (role === "admin" && !req.user.role.includes("master"))
    return next(new Error("You're not Authorized"));

  const { error } = validation.updateUserRolesValidation({ role });
  if (error) return next(error.details[0]);

  //check if user exist
  let existingUser;
  try {
    existingUser = await db.User.findOne({
      where: {
        id: userId,
      },
    });
  } catch (error) {
    return next(error);
  }
  if (!existingUser) return next(new Error("User does not exist"));
  if (existingUser.id === req.user.id)
    return next(new Error("You can't change your own role"));

  if (existingUser.role === "admin")
    return next(new Error("You're not Authorized"));

  if (
    role !== "student" &&
    role !== "lecturer" &&
    role !== "supervisor" &&
    role !== "admin"
  )
    return next(new Error("Invalid role"));

  try {
    await db.User.update(
      {
        roles: role,
      },
      {
        where: {
          id: existingUser.id,
        },
      }
    );
  } catch (error) {
    return next(error);
  }

  //creating user profile if user is student or lecturer
  if (role === "student" || role === "lecturer") {
    const capitalizeRole = role.charAt(0).toUpperCase() + role.slice(1);
    const profiles = `${capitalizeRole}Profile`;

    const existingUserRole = existingUser.roles;
    if (existingUserRole === "student") {
      existingUser.profile = await db.StudentProfile.findOne({
        where: {
          userId: existingUser.id,
        },
      });
    } else if (existingUserRole === "lecturer") {
      existingUser.profile = await db.LecturerProfile.findOne({
        where: {
          userId: existingUser.id,
        },
      });
    }

    try {
      await db[profiles].findOrCreate({
        where: {
          userId: existingUser.id,
        },
        defaults: {
          userId: existingUser.id,
          firstName:
            (existingUser.profile && existingUser.profile.firstName) ||
            existingUser.username,
          lastName:
            (existingUser.profile && existingUser.profile.lastName) || null,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  res.json({
    message: "User role updated successfully",
  });
};

module.exports = {
  getAllUser,
  getElogbookInfo,
  addStation,
  addDisease,
  addSkill,
  addGuidance,
  addHospital,
  addOrUpdateStudentPresention,
  deleteStudentPresention,
  updateUserRoles,
  updateStation,
  updateDisease,
  updateSkill,
  updateGuidance,
  updateHospital,
  deleteStation,
  deleteDisease,
  deleteSkill,
  deleteGuidance,
  deleteHospital,
};
