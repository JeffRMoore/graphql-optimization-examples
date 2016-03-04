'use strict';

const graphql = require('graphql');

const data = {
  1: {
    id: '1',
    name: 'Dan',
    location: {
      city: 'London',
      country: 'England'
    }
  },
  2: {
    id: '2',
    name: 'Lee',
    location: {
      city: 'Paris',
      country: 'France'
    }
  },
  3: {
    id: '3',
    name: 'Nick',
    location: {
      city: 'Berlin',
      country: 'Germany'
    }
  }
};

const locationType = new graphql.GraphQLObjectType({
  name: 'Location',
  fields: {
    city: { type: graphql.GraphQLString },
    country: { type: graphql.GraphQLString }
  }
});

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    location: { type: locationType }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: (source, args, info) => {
          const userFields = info.returned.fields;
          const userFieldNames = Object.keys(userFields);

          console.log('WILL RESOLVE',
            info.fieldName, 'on', info.parentType.name);
          console.log( '    with fields', userFieldNames);

          if (userFields.location) {
            userFields.location.forEach(fieldPlan => {
              const locationFieldNames = Object.keys(
                fieldPlan.returned.fields
              );

              console.log('WILL RESOLVE',
                fieldPlan.fieldName, 'on', fieldPlan.parentType.name);
              console.log( '    with fields', locationFieldNames);
            });
          }

          return data[args.id];
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
    user(id: "1") {
      where: location {
        city
      }
    }
  }
  `,
  rootValue
).then( result => {
  console.log('RESULT:');
  console.log(result.data);
});
