const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const { authMiddleware } = require("./utils/auth");

const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

// typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

// Apollo server's schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Apollo server w/ Express app as middleware
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));

  // log where to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });

