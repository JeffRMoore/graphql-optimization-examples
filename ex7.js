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
    name: { type: graphql.GraphQLString },
    double: {
      type: graphql.GraphQLInt,
      args: {
        num: { type: graphql.GraphQLInt }
      },
      resolve: (source, args) => {
        return args['num'] * 2;
      }
    }
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
          const userFieldsPlans = info.completionPlan.fieldPlans;
          const userFields = Object.keys(userFieldsPlans);

          console.log('WILL RESOLVE',
            info.fieldName, 'on', info.parentType.name);
          console.log( '    with fields', userFields);

          if (userFieldsPlans.double) {
            userFieldsPlans.double.forEach(fieldPlan => {
              console.log('WILL RESOLVE',
                fieldPlan.fieldName, 'on', fieldPlan.parentType.name);
              console.log( '    with arguments', fieldPlan.args);
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
      name
      twenty: double(num: 10)
      forty: double(num: 20)
     }
  }
  `,
  rootValue
).then( result => {
  console.log('RESULT:');
  console.log(result.data);
});
