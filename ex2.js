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
            users: {
                type: new graphql.GraphQLList(userType),
                args: {
                },
                resolve: function (source, args, info) {
                    var fields = Object.keys(info.completionPlan.completionPlan.fieldList);

                    console.log('WILL RESOLVE', info.fieldName, 'on', info.parentType.name, 'as a list');
                    console.log( '    with fields', fields);

                    return Object.keys(data).map(key => data[key]);
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
      users {
        name
      }
    }
    `,
    rootValue
).then( result => {
    console.log('RESULT:')
    console.log(result.data);
});