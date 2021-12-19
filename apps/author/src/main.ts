import * as express from 'express';
import { getGraphQLParameters, processRequest, renderGraphiQL, shouldRenderGraphiQL } from 'graphql-helix';
import schema from './app/schema';

const app = express();

app.use(express.json());

app.use('/', async (req, res) => {
  const request = {
    body: req.body,
    headers: req.headers,
    method: req.method,
    query: req.query,
  };

  if (shouldRenderGraphiQL(request)) {
    res.send(renderGraphiQL());
  } else {
    const { operationName, query, variables } = getGraphQLParameters(request);

    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema,
    });

    if (result.type === 'RESPONSE') {
      result.headers.forEach(({ name, value }) => res.setHeader(name, value));
      res.status(result.status);
      res.json(result.payload);
    } else {
      // graphql-helix also supports subscriptions and incremental delivery (i.e. @defer and @stream directives)
      // out of the box. See the repo for more complete examples that also implement those features.
    }
  }
});

app.listen(4100, () => console.log('Now browse to http://localhost:4100'));
