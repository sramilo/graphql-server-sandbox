import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from 'uuid';
import axios from "axios";

const typeDefs = gql`
    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        check: String
        id: ID!
    }

    type Query {
        personCount: Int!
        allPersons(hasPhone: YesNo): [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person!
        editNumber(
            name: String!
            phone: String!
        ): Person
    }
`

const resolvers = {
    Query: {
        personCount: () => persons.length,
        allPersons: async (root, args) => {
            const { data: persons } = await axios.get("http://localhost:3000/persons")
            if (!args.hasPhone) return persons;

            const byPhone = person =>
                args.hasPhone === "YES" ? person.phone : !person.phone;

            return persons.filter(byPhone);
        },
        findPerson: (root, args) => {
            const { name } = args;
            return persons?.find(p => p.name === name)
        }
    },
    Mutation: {
        addPerson: (root, args) => {
            // const { name, phone, street, city } = args;
            if (persons.find(p => p.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name
                });
            }
            const person = { ...args, id: uuid() }
            persons.push(person);
            return person;
        },
        editNumber: (root, args) => {
            const personIndex = persons.findIndex(p => p.name === args.name);
            if (personIndex === -1) { return null; }

            const person = persons[personIndex];
            const updatedPerson = { ...person, phone: args.phone };
            persons[personIndex] = updatedPerson;

            return updatedPerson;
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        },
    }
}


const server = new ApolloServer({
    typeDefs,
    resolvers
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})