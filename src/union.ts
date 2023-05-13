import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const APIURL = "https://api.thegraph.com/subgraphs/name/geraldhost/union";

const apolloClient = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export const queryStaker = async (address: string) => {
  const query = `
query Staker {
  stakers(where:{account: "${address}"}) {
    id
    account
    stakedAmount
  }
}
`;

  const response = await apolloClient.query({
    query: gql(query),
  });

  const stakers = response?.data?.stakers;

  return stakers.length === 0 ? 0 : stakers[0].stakedAmount;
};
