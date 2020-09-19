const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { response, request } = require("express");

const app = express();

app.use(bodyParser.json());

// Mock database
let person = [];

try {
  person = JSON.parse(fs.readFileSync("person.json")).person;
} catch (error) {
  console.log("No existing file");
}

// Routes or endpoints

// GET a user(login)
app.get("/api/person", async (request, response) => {
  response.send(person);
});

app.get("/api/person/:id", (request, response) => {
  const userId = Number(request.params.id);

  const user = person.find((u) => {
    if (userId === u.id) {
      return true;
    }
  });

  if (!user) {
    response.send(`User with ID ${userId} not found`);
    return;
  }

  response.send(user);
});

// Create/POST a user(register)
app.post("/api/person", (request, response) => {
  const body = request.body;
  response.send(body);

  if (!body.login || !body.name || !body.password) {
    response.send(
      "Bad Request. Validation Error. Missing login, name, or password!"
    );
    return;
  }

  // Add the new product to our existing products array
  person.push(body);

  // Commit the new products array to the database (json file )
  const jsonPayload = {
    person: person,
  };
  fs.writeFileSync("person.json", JSON.stringify(jsonPayload));

  response.send();
});
//Update a users password(forgot password)
app.put("/api/person/:id", (request, response) => {
  const userId = Number(request.params.id);

  const user = person.find((u) => {
    return userId === u.id;
  });
  if (!user) {
    response.send(`Person with login${userId} not found!`);
    return;
  }
  const body = request.body;

  if (body.login) {
    user.login = body.login;
  }

  if (body.name) {
    user.name = body.login;
  }

  if (body.password) {
    user.password = body.password;
  }

  const jsonPayload = {
    person: person,
  };
  fs.writeFileSync("person.json", JSON.stringify(jsonPayload));

  response.send();
});

//Delete a user
app.delete("/api/person/:id", (request, response) => {
  const userId = Number(request.params.id);

  const userIndex = person.findIndex((u) => {
    return userId === u.id;
  });

  if (userIndex === -1) {
    response.send(`Product with ID ${userId} not found!`);
    return;
  }

  person.splice(userIndex, 1);

  const jsonPayload = {
    person: person,
  };
  fs.writeFileSync("person.json", JSON.stringify(jsonPayload));
  response.send("DELETED!");
});

const port = process.env.PORT ? process.env.PORT : 3000;
app.listen(port, () => {
  console.log("Forms API Server Started!");
});
