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
        name: { type: graphql.GraphQLString }
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
                    var fields = Object.keys(info.completionPlan.fieldPlans);

                    console.log('WILL RESOLVE', info.fieldName, 'on', info.parentType.name);
                    console.log( '    with fields', fields);

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
    console.log('RESULT:')
    console.log(result.data);
});