// lib/graphql/client.ts
import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
  from,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { restLink } from "./restLink"; // Import our custom REST adapter
import { TokenManager } from "@/services/authApi";

// HTTP Link - fallback for any actual GraphQL endpoints (if needed later)
const httpLink = createHttpLink({
  uri: "https://alx-project-nexus-u45j.onrender.com/graphql/", // Keep for future GraphQL support
});

// Auth Link - adds authentication headers for protected operations
const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await TokenManager.getAccessToken();

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error getting auth token:", error);
    return {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    };
  }
});

// Apollo Client Configuration
export const apolloClient = new ApolloClient({
  // Use our REST link as the primary link, with HTTP link as fallback
  link: from([
    authLink, // Apply authentication to all requests
    restLink, // Our custom REST-to-GraphQL adapter (primary)
    // httpLink, // Fallback for actual GraphQL endpoints (commented out for now)
  ]),

  cache: new InMemoryCache({
    // Cache configuration for better performance
    typePolicies: {
      Product: {
        keyFields: ["id"], // Use id as the cache key for products
        fields: {
          // Custom merge functions if needed
          rating: {
            merge: true, // Always replace rating data
          },
        },
      },
      Query: {
        fields: {
          products: {
            // Cache products with pagination support
            keyArgs: ["category", "search"], // These args determine cache key
            merge(existing = [], incoming) {
              return incoming; // Replace existing products (for now)
            },
          },
          searchProducts: {
            keyArgs: ["search", "category", "minPrice", "maxPrice", "sortBy"],
            merge(existing, incoming) {
              if (!existing || !existing.products) {
                return incoming;
              }

              // If it's a new page, append products
              if (incoming.products && existing.products) {
                return {
                  ...incoming,
                  products: [...existing.products, ...incoming.products],
                };
              }

              return incoming;
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
      notifyOnNetworkStatusChange: true, // Get loading states for network requests
    },
    query: {
      errorPolicy: "all",
      fetchPolicy: "cache-first", // Use cache when available
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

// Helper function to clear cache when needed
export const clearApolloCache = () => {
  return apolloClient.clearStore();
};

// Helper function to refetch all active queries
export const refetchAllQueries = () => {
  return apolloClient.refetchQueries({
    include: "active",
  });
};

// Helper to reset cache and refetch
export const resetAndRefetch = async () => {
  await apolloClient.clearStore();
  return apolloClient.refetchQueries({
    include: "all",
  });
};
