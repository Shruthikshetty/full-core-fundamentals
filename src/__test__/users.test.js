import { getUserById, createUserHandler } from "../handlers/users.mjs";
import { mockUsers } from "../utils/constants.mjs";
import validator from "express-validator";
import helpers from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { response } from "express";

jest.mock("../mongoose/schemas/user.mjs");

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => [{ msg: "invalied username " }]),
  })),
  matchedData: jest.fn(() => ({
    name: "jane",
    displayName: "jane smith",
    password: "hello2",
  })),
}));

jest.mock("../utils/helpers.mjs", () => ({
  hashPassword: jest.fn((password) => `hashed_${password}`),
}));

const mockRequest = {
  params: {
    id: 1,
  },
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
  sendStatus: jest.fn(),
};

// This block contains tests for the users route
describe("testing the users by id route", () => {
  // Test case for getting a user by ID
  it("get users by id", () => {
    getUserById(mockRequest, mockResponse);
    // Check if the response send method was called
    expect(mockResponse.send).toHaveBeenCalled();
    // Ensure the response status method was not called
    expect(mockResponse.status).not.toHaveBeenCalled();
    // Verify that the correct user data was sent in the response
    expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[0]);
    // send must be called once
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
  });

  it("get uers but with 404 when user not found ", () => {
    // change mock req
    mockRequest.params.id = 100;

    getUserById(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.send).toHaveBeenCalledWith("User not found");
  });
});

describe("create users", () => {
  const mockRequest = {};

  it("should return a status of 400 when there are errors", async () => {
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.validationResult).toHaveBeenCalledTimes(1);
    expect(validator.validationResult).toHaveBeenCalledWith(mockRequest);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledWith({
      errors: [{ msg: "invalied username " }],
    });
  });

  it("user is created with status 201", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockResolvedValueOnce({
        id: 2,
        name: "jane",
        displayName: "jane smith",
        password: "hashed_hello2",
      });
    await createUserHandler(mockRequest, mockResponse);
    expect(validator.matchedData).toHaveBeenCalledWith(mockRequest);
    expect(helpers.hashPassword).toHaveBeenCalledWith("hello2");
    expect(helpers.hashPassword).toHaveReturnedWith("hashed_hello2");
    expect(User).toHaveBeenCalledWith({
      name: "jane",
      displayName: "jane smith",
      password: "hashed_hello2",
    });

    //console.log(User.mock);
    //expect(User.mock.instances[0].save).toHaveBeenCalled();
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.send).toHaveBeenCalledWith({
      id: 2,
      name: "jane",
      displayName: "jane smith",
      password: "hashed_hello2",
    });
  });

  it("it should send status code of 400 when save method fails ", async () => {
    jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
      isEmpty: jest.fn(() => true),
    }));

    const saveMethod = jest
      .spyOn(User.prototype, "save")
      .mockImplementationOnce(() =>
        Promise.reject("Failed to save to database")
      );
    await createUserHandler(mockRequest, mockResponse);
    expect(saveMethod).toHaveBeenCalled();
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(400);
  });
});
