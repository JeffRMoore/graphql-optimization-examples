'use strict';

const graphql = require('graphql');

const data = {
  1: {
    id: '1',
    name: 'Dan'
  },
  2: {
    id: '2',
    name: 'Lee'
  },
  3: {
    id: '3',
    name: 'Nick'
  }
};

const userType = new graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString }
  }
});

const schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new graphql.GraphQLList(userType),
        args: {},
        resolve: (source, args, info) => {
          const fields = Object.keys(
            info.completionPlan.elementPlan.fieldPlans
          );

          console.log('WILL RESOLVE',
            info.fieldName, 'on', info.parentType.name, 'as a list');
          console.log( '    with fields', fields);

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
    users {
      name
    }
  }
  `,
  rootValue
).then( result => {
  console.log('RESULT:');
  console.log(result.data);
});
