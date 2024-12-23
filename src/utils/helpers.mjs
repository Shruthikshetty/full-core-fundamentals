import bcrypt from "bcrypt";
// Define the number of salt rounds for hashing
const saltRounds = 10;

// Function to hash a password
export const hashPassword = (password) => {
  // Generate a salt using the specified number of rounds
  const salt = bcrypt.genSaltSync(saltRounds);
  // Hash the password with the generated salt
  return bcrypt.hashSync(password, salt);
};

// Function to compare a plain password with a hashed password
export const comparePassord = (plain, hashed) => {
  return bcrypt.compareSync(plain, hashed);
};
