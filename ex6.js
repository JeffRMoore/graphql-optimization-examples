var graphql = require('graphql');

var data = {
    "1": {
        "id": "1",
        "name": "Dan",
        "location": {
            "city": "London",
            "country": "England"
        }
    },
    "2": {
        "id": "2",
        "name": "Lee",
        "location": {
            "city": "Paris",
            "country": "France"
        }
    },
    "3": {
        "id": "3",
        "name": "Nick",
        "location": {
            "city": "Berlin",
            "country": "Germany"
        }
    }
};

var locationType = new graphql.GraphQLObjectType({
    name: 'Location',
    fields: {
        city: { type: graphql.GraphQLString },
        country: { type: graphql.GraphQLString }
    }
});

var userType = new graphql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        location: { type: locationType }
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
                    var fieldPlans = info.completionPlan.fieldPlans;
                    var fields = Object.keys(fieldPlans).map(key => fieldPlans[key].fieldName);
                    console.log('RESOLVING', info.fieldName, 'on', info.parentType.name);
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
      user(id: "1") {
          location {
            city
          }
       }
    }
    `,
    rootValue
).then( result => {
    console.log('RESULT:')
    console.log(result.data);
});
