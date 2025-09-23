import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

// HTTP Link - connects to your partner's GraphQL endpoint
const httpLink = createHttpLink({
  // TODO: Replace with your partner's actual GraphQL endpoint
  uri: "https://api.your-partner-backend.com/graphql",
});

// Auth Link - adds authentication headers if needed
const authLink = setContext((_, { headers }) => {
  // TODO: Get auth token from secure storage when implementing auth
  // const token = await getToken();

  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
});

// Apollo Client Configuration
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // Cache configuration for better performance
    typePolicies: {
      Product: {
        fields: {
          // Cache products by ID for efficient lookups
          id: {
            read(id) {
              return id;
            },
          },
        },
      },
    },
  }),
  // Enable GraphQL dev tools in development
  connectToDevTools: __DEV__,
  // Default options for queries
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
      fetchPolicy: "cache-and-network", // Always try network, but show cache first
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Use cache when available
    },
  },
});
