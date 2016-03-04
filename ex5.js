'use strict';

const graphql = require('graphql');

const data = {
  1: {
    id: '1',
    kind: 'pet',
    name: 'Spot'
  },
  2: {
    id: '2',
    kind: 'person',
    name: 'Lee',
    email: 'info@example.com'
  },
  3: {
    id: '3',
    kind: 'person',
    name: 'Nick',
    email: 'info@example.com'
  }
};

const personType = new graphql.GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    email: { type: graphql.GraphQLString }
  }
});

const petType = new graphql.GraphQLObjectType({
  name: 'Pet',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

const nameableType = new graphql.GraphQLUnionType({
  name: 'Nameable',
  types: [ personType, petType ],
  resolveType: value => {
    if (value.kind === 'pet') {
      return petType;
    }
    if (value.kind === 'person') {
      return personType;
    }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      namedThings: {
        type: new graphql.GraphQLList(nameableType),
        args: {},
        resolve: (source, args, info) => {
          console.log('WILL RESOLVE',
            info.fieldName, 'on', info.parentType.name, 'as a list');

          const typeChoices =
            info.returned.listElement.typeChoices;

          const personFieldNames = Object.keys(
                typeChoices.Person.fields
            );
          console.log( '    with fields', personFieldNames, ' for Person');

          const petFieldNames = Object.keys(
                typeChoices.Pet.fields
            );
          console.log( '    with fields', petFieldNames, ' for Pet');

          return Object.keys(data).map(key => data[key]);
        }
      }
    }
  })
});

const rootValue = {};
graphql.graphql(
  schema,
  `
  {
    namedThings {
      ... on Person {
        name
        email
      }
      ... on Pet {
        name
      }
    }
  }
  `,
  rootValue
).then( result => {
  console.log('RESULT:');
  console.log(result.data);
});
