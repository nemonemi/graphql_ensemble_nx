# Graphql ensemble with NX

- install dependencies
- run `npm start`
- observe 3 services being started
  - author service
  - book servce
  - gateway service (after a re-try)
- Try all 4 queries to get properties at the root, e.g. `author.name` and `book.title` as well as the nested queries `author.book.id` and `book.author.id`
- observe that not all combinations work because (as I suspect) not everything gets resolved correctly

The errors are inconsistent, and it depends on which resolver gets applied. Each time a different thing fails.

E.g.
```
Cannot return null for non-nullable field Book.author.
```
