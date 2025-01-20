const validator = require('validator');

const validatSignupData = ({ name, email, password }) => {
  if (!name) {
    throw new Error("name is not valid");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong Password");
  }
}
const validateProfileUpdate = (data) => {
  const fieldsAllowedToUpdate = ["name", "about", "profile", "gender", "skills","photoUrl", "age","about"];
  const updateAllowed = Object.keys(data).every(key => fieldsAllowedToUpdate.includes(key));
  if (!updateAllowed) {
    throw new Error("can't be updated");
  }
}
module.exports = {
  validatSignupData,
  validateProfileUpdate,
}