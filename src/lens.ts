import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const APIURL = "https://api.lens.dev/";

const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export const queryHandle = async (handle: string) => {
  const query = `
query Profile {
  profile(request: { handle: "${handle}" }) {
    id
    name
    ownedBy
  }
}
`;
  const response = await apolloClient.query({
    query: gql(query),
  });

  return response?.data?.profile?.ownedBy;
};
