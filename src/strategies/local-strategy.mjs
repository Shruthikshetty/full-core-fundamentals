/**
 * NOTE :--
 * storage is still local data is from mongoose
 */
import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";
import { comparePassord } from "../utils/helpers.mjs";
// This function serializes the user object and stores the user ID in the session.
// The user ID will be used to identify the user in subsequent requests.
passport.serializeUser((user, done) => {
  console.log(`Inside the Serialized User`);
  console.log(user);

  done(null, user.id);
});

// will run when with make next api call
passport.deserializeUser(async (id, done) => {
  console.log(`Inside the Deserialized`, "id : ", id);
  try {
    // find user by id gets a singe record of that id
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

// use our local stratergy
export default passport.use(
  new Strategy({ usernameField: "name" }, async (username, password, done) => {
    //console.log(`Useranme : ${username} , Password : ${password}`);

    try {
      // find one is used to get a single recored by mentioned key
      const findUser = await User.findOne({ name: username });
      if (!findUser) throw new Error("user not found");
      if (!comparePassord(password, findUser.password))
        throw new Error("wrong passord");
      done(null, findUser);
    } catch (err) {
      // takes a err and then a user that may be a fasly value
      done(err, null);
    }
  })
);
