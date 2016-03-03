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

var personType = new graphql.GraphQLObjectType({
    name: 'Person',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        email: { type: graphql.GraphQLString }
    }
});

var petType = new graphql.GraphQLObjectType({
    name: 'Pet',
    fields: {
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString }
    }
});

var nameableType = new graphql.GraphQLUnionType({
    name: 'Nameable',
    types: [personType, petType],
    resolveType: value => {
        if (value.kind == 'pet') {
            return petType;
        }
        if (value.kind == 'person') {
            return personType;
        }
    }
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
                        info.completionPlan.completionPlan.selectionPlansByType.Person.fieldList
                    );
                    console.log( '    with fields', personFields, ' for Person');

                    const petFields = Object.keys(
                        info.completionPlan.completionPlan.selectionPlansByType.Pet.fieldList
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
        ... on Person {
           name
           email
        }
        ... on Pet {
           name
        }
      }
    }
    `,
    rootValue
).then( result => {
    console.log('RESULT:')
    console.log(result.data);
});
