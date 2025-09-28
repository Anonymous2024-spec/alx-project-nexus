// lib/graphql/restLink.ts
import { ApolloLink, Observable, FetchResult } from "@apollo/client";
import { print } from "graphql";

const API_BASE_URL = "https://alx-project-nexus-u45j.onrender.com/api/v1";

// Data transformation functions
const transformProduct = (apiProduct: any) => ({
  id: apiProduct.id,
  title: apiProduct.name, // map name -> title
  description:
    apiProduct.description || `${apiProduct.brand} ${apiProduct.name}`, // fallback description
  price: parseFloat(apiProduct.price),
  category: apiProduct.category_name,
  image:
    apiProduct.primary_image ||
    `https://via.placeholder.com/300x300?text=${encodeURIComponent(apiProduct.name)}`,
  rating: {
    rate: 4.0 + Math.random(), // Mock rating since API doesn't provide it
    count: Math.floor(Math.random() * 100) + 10,
  },
  // Additional fields from API that might be useful
  brand: apiProduct.brand,
  stock_quantity: apiProduct.stock_quantity,
  seller_name: apiProduct.seller_name,
  is_featured: apiProduct.is_featured,
  created_at: apiProduct.created_at,
});

const transformCategory = (apiCategory: any) => {
  // Your API returns objects like:
  // { id: 1, name: "Electronics", description: "Gadgets and electronic devices", ... }

  if (typeof apiCategory === "object" && apiCategory.name) {
    return apiCategory.name; // Return just the category name string
  }

  // Fallback
  return String(apiCategory);
};

// GraphQL Query Parser
const parseGraphQLOperation = (query: string, variables: any = {}) => {
  const queryStr = query.toLowerCase();

  if (queryStr.includes("query getproducts")) {
    return {
      type: "GET_PRODUCTS",
      variables,
    };
  }

  if (queryStr.includes("query getcategories")) {
    return {
      type: "GET_CATEGORIES",
      variables,
    };
  }

  if (queryStr.includes("query getproductbyid")) {
    return {
      type: "GET_PRODUCT_BY_ID",
      variables,
    };
  }

  if (queryStr.includes("query searchproducts")) {
    return {
      type: "SEARCH_PRODUCTS",
      variables,
    };
  }

  if (queryStr.includes("query getproductsbycategory")) {
    return {
      type: "GET_PRODUCTS_BY_CATEGORY",
      variables,
    };
  }

  if (queryStr.includes("query getfeaturedproducts")) {
    return {
      type: "GET_FEATURED_PRODUCTS",
      variables,
    };
  }

  return { type: "UNKNOWN", variables };
};

// REST API Handlers
const handleGetProducts = async (variables: any) => {
  const params = new URLSearchParams();

  if (variables.limit) params.append("page_size", variables.limit.toString());
  if (variables.offset) {
    const page = Math.floor(variables.offset / (variables.limit || 20)) + 1;
    params.append("page", page.toString());
  }
  if (variables.category) params.append("category_name", variables.category);
  if (variables.search) params.append("search", variables.search);

  const url = `${API_BASE_URL}/products/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Products API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    data: {
      products: data.results.map(transformProduct),
    },
  };
};

const handleGetCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Categories API error: ${response.statusText}`);
  }

  const data = await response.json();

  console.log("RAW CATEGORIES API RESPONSE:", data);

  // FIX: Extract categories from the results array
  let categoriesArray = [];

  if (data.results && Array.isArray(data.results)) {
    categoriesArray = data.results;
  } else if (Array.isArray(data)) {
    categoriesArray = data;
  } else {
    console.warn("Unexpected categories format:", data);
    categoriesArray = [];
  }

  console.log("EXTRACTED CATEGORIES:", categoriesArray);

  return {
    data: {
      categories: categoriesArray.map(transformCategory),
    },
  };
};
const handleGetProductById = async (variables: any) => {
  const response = await fetch(`${API_BASE_URL}/products/${variables.id}/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Product API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    data: {
      product: transformProduct(data),
    },
  };
};

const handleSearchProducts = async (variables: any) => {
  const params = new URLSearchParams();

  if (variables.search) params.append("search", variables.search);
  if (variables.category) params.append("category_name", variables.category);
  if (variables.minPrice)
    params.append("price__gte", variables.minPrice.toString());
  if (variables.maxPrice)
    params.append("price__lte", variables.maxPrice.toString());
  if (variables.limit) params.append("page_size", variables.limit.toString());
  if (variables.offset) {
    const page = Math.floor(variables.offset / (variables.limit || 20)) + 1;
    params.append("page", page.toString());
  }

  // Handle sorting
  if (variables.sortBy) {
    let ordering = "";
    switch (variables.sortBy) {
      case "price_asc":
        ordering = "price";
        break;
      case "price_desc":
        ordering = "-price";
        break;
      case "name":
        ordering = "name";
        break;
      case "newest":
        ordering = "-created_at";
        break;
      default:
        ordering = "name";
    }
    params.append("ordering", ordering);
  }

  const url = `${API_BASE_URL}/products/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Search API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    data: {
      searchProducts: {
        products: data.results.map(transformProduct),
        totalCount: data.count,
        hasMore: !!data.next,
      },
    },
  };
};

const handleGetProductsByCategory = async (variables: any) => {
  const params = new URLSearchParams();
  params.append("category_name", variables.category);
  if (variables.limit) params.append("page_size", variables.limit.toString());
  if (variables.offset) {
    const page = Math.floor(variables.offset / (variables.limit || 20)) + 1;
    params.append("page", page.toString());
  }

  const url = `${API_BASE_URL}/products/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Category products API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    data: {
      productsByCategory: data.results.map(transformProduct),
    },
  };
};

const handleGetFeaturedProducts = async (variables: any) => {
  const params = new URLSearchParams();
  params.append("is_featured", "true");
  if (variables.limit) params.append("page_size", variables.limit.toString());

  const url = `${API_BASE_URL}/products/?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Featured products API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    data: {
      featuredProducts: data.results.map(transformProduct),
    },
  };
};

// Main REST Link
export const restLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const { query, variables } = operation;
    const queryString = print(query);

    const parsedOperation = parseGraphQLOperation(queryString, variables);

    (async () => {
      try {
        let result: FetchResult;

        switch (parsedOperation.type) {
          case "GET_PRODUCTS":
            result = await handleGetProducts(parsedOperation.variables);
            break;

          case "GET_CATEGORIES":
            result = await handleGetCategories();
            break;

          case "GET_PRODUCT_BY_ID":
            result = await handleGetProductById(parsedOperation.variables);
            break;

          case "SEARCH_PRODUCTS":
            result = await handleSearchProducts(parsedOperation.variables);
            break;

          case "GET_PRODUCTS_BY_CATEGORY":
            result = await handleGetProductsByCategory(
              parsedOperation.variables
            );
            break;

          case "GET_FEATURED_PRODUCTS":
            result = await handleGetFeaturedProducts(parsedOperation.variables);
            break;

          default:
            throw new Error(
              `Unsupported GraphQL operation: ${parsedOperation.type}`
            );
        }

        observer.next(result);
        observer.complete();
      } catch (error) {
        console.error("REST Link Error:", error);
        observer.error(error);
      }
    })();
  });
});
