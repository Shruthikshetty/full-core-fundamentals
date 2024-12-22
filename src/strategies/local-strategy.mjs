import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

// This function serializes the user object and stores the user ID in the session.
// The user ID will be used to identify the user in subsequent requests.
passport.serializeUser((user, done) => {
  console.log(`Inside the Serialized User`);
  console.log(user);

  done(null, user.id);
});

// will run when with make next api call
passport.deserializeUser((id, done) => {
  console.log(`Inside the Deserialized`, "id : ", id);
  try {
    const findUser = mockUsers.find((user) => user.id === Number(id));
    if (!findUser) throw new Error("User not found");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

// use our local stratergy
export default passport.use(
  new Strategy({ usernameField: "name" }, (username, password, done) => {
    console.log(`Useranme : ${username} , Password : ${password}`);

    try {
      const findUser = mockUsers.find((user) => user.name === username);
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Invalied password");
      // null since no error
      done(null, findUser);
    } catch (err) {
      // takes a err and then a user that may be a fasly value
      done(err, null);
    }
  })
);
