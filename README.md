# graphql-optimization-examples

Examples of cases a look-ahead resolver might have to handle.

requires the version of graph-ql in this fork:

https://github.com/JeffRMoore/graphql-js

## Example 1

Basic example showing that no code is required to handle fragments or renaming.

OUTPUT:

```
WILL RESOLVE user on Query
    with fields [ 'id', 'name' ]
RESULT:
{ hombre: { id: '1', nombre: 'Dan' } }
```

## Example 2

This example demonstrates a return type containing a list.  Still easy.

OUTPUT:

```
WILL RESOLVE users on Query as a list
    with fields [ 'name' ]
RESULT:
{ users: [ { name: 'Dan' }, { name: 'Lee' }, { name: 'Nick' } ] }
```

## Example 3

This example shows a GraphQLInterfaceType implementation using isTypeOf.

OUTPUT:

```
WILL RESOLVE namedThings on Query as a list
    with fields [ 'name' ]  for Person
    with fields [ 'name' ]  for Pet
RESULT:
{ namedThings: [ { name: 'Spot' }, { name: 'Lee' }, { name: 'Nick' } ] }
```

## Example 4

This example shows a GraphQLInterfaceType implementation using resolveType.

OUTPUT:

```
WILL RESOLVE namedThings on Query as a list
    with fields [ 'name' ]  for Person
    with fields [ 'name' ]  for Pet
RESULT:
{ namedThings: [ { name: 'Spot' }, { name: 'Lee' }, { name: 'Nick' } ] }
```

## Example 5

This example shows a GraphQLUnionType.

OUTPUT:

```
WILL RESOLVE namedThings on Query as a list
    with fields [ 'name', 'email' ]  for Person
    with fields [ 'name' ]  for Pet
RESULT:
{ namedThings: 
   [ { name: 'Spot' },
     { name: 'Lee', email: 'info@example.com' },
     { name: 'Nick', email: 'info@example.com' } ] }
```

## Example 6

This example demonstrates looking ahead across GraphQLObjectType boundaries as one might
using dependant objects or a document oriented data store.

It is a little more complicated here to cross layers because of potential aliasing and
the potential to include a field more than once.

OUTPUT:

```
WILL RESOLVE user on Query
    with fields [ 'location' ]
WILL RESOLVE location on User
    with fields [ 'city' ]
RESULT:
{ user: { where: { city: 'London' } } }
```

## Example 7

This example demonstrates looking ahead into a field with arguments.

Again, there is complexity since the same field may appear more than once in a selection with
different arguments.

OUTPUT:

```
WILL RESOLVE user on Query
    with fields [ 'name', 'double' ]
WILL RESOLVE double on User
    with arguments { num: 10 }
WILL RESOLVE double on User
    with arguments { num: 20 }
RESULT:
{ user: { name: 'Dan', twenty: 20, forty: 40 } }
```
