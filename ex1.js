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

// Define our user type, with two string fields; `id` and `name`
var userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
    }
});

// Define our schema, with one top level field, named `user`, that
// takes an `id` argument and returns the User with that ID.
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
                    var fieldPlans = info.completionPlan.fieldPlans;
                    var fields = Object.keys(fieldPlans).map(key => fieldPlans[key].fieldName);
                    console.log('Reading ', info.fieldName, ' from ', info.parentType.name, ' with ', fields);
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
    console.log(result);
});