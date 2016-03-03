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
                    console.log('WILL RESOLVE', info.fieldName, 'on', info.parentType.name, 'as a list');

                    const personFields = Object.keys(
                        info.completionPlan.elementPlan.selectionPlansByType.Person.fieldList
                    );
                    console.log( '    with fields', personFields, ' for Person');

                    const petFields = Object.keys(
                        info.completionPlan.elementPlan.selectionPlansByType.Pet.fieldList
                    );
                    console.log( '    with fields', petFields, ' for Pet');

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