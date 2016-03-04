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
      user: {
        type: userType,
        args: {
          id: { type: graphql.GraphQLString }
        },
        resolve: (source, args, info) => {
          const fields = Object.keys(info.completionPlan.fieldPlans);

          console.log('WILL RESOLVE',
            info.fieldName, 'on', info.parentType.name);
          console.log( '    with fields', fields);

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
    hombre:user(id: "1") {
    id
      ...NameFrag
    }
  }
  fragment NameFrag on User {
    nombre:name
  }
  `,
  rootValue
).then( result => {
  console.log('RESULT:');
  console.log(result.data);
});
