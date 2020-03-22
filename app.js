const express = require('express');
const bodyParser = require('body-parser');
const garphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql')

const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.use('/graphql' , garphqlHttp({
    schema: buildSchema(`
        
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }


       schema {
           query: RootQuery
           mutation: RootMutation
        }
    
    `),
    rootValue:{
        events: () =>{
            return ['Playing Football' , 'Studing' , 'All-Night Coding'];
        },
        createEvent:(args) =>{
            const eventName = args.name;
            return eventName
        }
    },
    graphiql:true
}));

app.listen(PORT , (req , res) =>{
    console.log(`server has successfull run on port ${PORT}`)
});
