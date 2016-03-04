var graphql = require('graphql');

var data = {
    "1": {
        "id": "1",
        "name": "Dan"
    },
    "2": {
        "id": "2",
        "name": "Lee"
    },
    "3": {
        "id": "3",
        "name": "Nick"
    }
};

var userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        double: {
            type: graphql.GraphQLInt,
            args: {
                num: { type: graphql.GraphQLInt }
            },
            resolve: function (source, args, info) {
                return args['num'] * 2;
            }
        }
    }
});

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: userType,
                args: {
                    id: { type: graphql.GraphQLString }
                },
                resolve: function (source, args, info) {
                    var userFieldsPlans = info.completionPlan.fieldPlans;
                    var userFields = Object.keys(userFieldsPlans);

                    console.log('WILL RESOLVE', info.fieldName, 'on', info.parentType.name);
                    console.log( '    with fields', userFields);

                    if (userFieldsPlans.double) {
                        userFieldsPlans.double.forEach(fieldPlan => {
                            console.log('WILL RESOLVE', fieldPlan.fieldName, 'on', fieldPlan.parentType.name);
                            console.log( '    with arguments', fieldPlan.args);
                        });
                    }

                    return data[args.id];
                }
            }
        }
    })
});

var rootValue = {};
var promise = graphql.graphql(
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
    console.log('RESULT:')
    console.log(result.data);
});
