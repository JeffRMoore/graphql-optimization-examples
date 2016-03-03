var graphql = require('graphql');

var data = {
    "1": {
        "id": "1",
        "kind": "pet",
        "name": "Spot"
    },
    "2": {
        "id": "2",
        "kind": "person",
        "name": "Lee",
        "email": "info@example.com"
    },
    "3": {
        "id": "3",
        "kind": "person",
        "name": "Nick",
        "email": "info@example.com"
    }
};

var nameableType = new graphql.GraphQLInterfaceType({
    name: 'Nameable',
    fields: {
        name: { type: graphql.GraphQLString }
    }
});

var personType = new graphql.GraphQLObjectType({
    name: 'Person',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        email: { type: graphql.GraphQLString }
    },
    interfaces: [nameableType],
    isTypeOf: value => value.kind == 'person'
});

var petType = new graphql.GraphQLObjectType({
    name: 'Pet',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString }
    },
    interfaces: [nameableType],
    isTypeOf: value => value.kind == 'pet'
});

var schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'Query',
        fields: {
            namedThings: {
                type: new graphql.GraphQLList(nameableType),
                args: {
                },
                resolve: function (source, args, info) {
                    var fieldPlans, fields;

                    console.log('RESOLVING', info.fieldName, 'on', info.parentType.name, 'as a list');

                    fieldPlans = info.completionPlan.completionPlan.selectionPlansByType.Person.fieldPlans;
                    fields = Object.keys(fieldPlans).map(key => fieldPlans[key].fieldName);
                    console.log( '    with fields', fields, ' for Person');

                    fieldPlans = info.completionPlan.completionPlan.selectionPlansByType.Pet.fieldPlans;
                    fields = Object.keys(fieldPlans).map(key => fieldPlans[key].fieldName);
                    console.log( '    with fields', fields, ' for Pet');

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
      namedThings {
        name
      }
    }
    `,
    rootValue
).then( result => {
    console.log('RESULT:')
    console.log(result.data);
});