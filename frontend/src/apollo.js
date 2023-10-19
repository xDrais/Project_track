import {ApolloClient,InMemoryCache,ApolloProvider} from '@apollo/client'

const cache = new InMemoryCache({
    typePolicies:{
        Query:{
            fields:{
                projects:{
                    merge(existing,incoming){
                        return incoming;
                    }
                },
            }
        }
    }
})
const client = new ApolloClient({
    uri:"http://localhost:5000/graphql",
    cache:cache
})

export {client}