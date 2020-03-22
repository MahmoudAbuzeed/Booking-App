require('dotenv').config();

const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const garphqlHttp = require("express-graphql");
const { buildSchema } = require("graphql");

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());

app.use(
  "/graphql",
  garphqlHttp({
    schema: buildSchema(`
    
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }


    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }
        
    type RootQuery {
        events: [Event!]!
    }

    type RootMutation {
         createEvent(eventInput: EventInput): Event
    }


    schema {
        query: RootQuery
        mutation: RootMutation
    }
    
    `),
    rootValue: {
      events: () => {
        return Event.find()
        .then(events =>{
           return events.map(event =>{
            return { ...event._doc};
            });
        })
        .catch(err =>{
            throw err;
        })
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        return event
          .save()
          .then(result => {
            console.log(result);
            return { ...result._doc, _id: result._doc._id.toString() };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },
    graphiql: true
  })
);

const PORT = process.env.PORT || 3000 ; 

app.listen(PORT, () =>{

    console.log(`Server run on port ${PORT}`);
}); 


// ----------- DB Config -----------//

mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology:true
}); 

mongoose.connection.on('connected', ( ) => {
    console.log('Connected to the database');
});
mongoose.connection.on('error', (err) => {
    console.error(`Failed to connected to the database: ${err}`);
});

module.exports = app;

