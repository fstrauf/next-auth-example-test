import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'MoralisAuth',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          // "message" and "signature" are needed for authorisation
          // we described them in "credentials" above
          const { message, signature } = credentials;

          await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

          const { address, profileId } = (
            await Moralis.Auth.verify({ message, signature, network: 'evm' })
          ).raw;

          const user = { address, profileId, signature };
          // returning the user object and creating  a session
          return user;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  // adding user info to the user session object
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user);
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;

      const chain = EvmChain.POLYGON;

      if (!session) {
        return {
          redirect: {
            destination: '/signin',
            permanent: false,
          },
        };
      }

      await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

      const contract = '0x33e1e8877c94a6524983487e37d9dedaea244b84'

      let nftList = []
      nftList = await Moralis.EvmApi.nft.getWalletNFTs({
        address: session.user.address,
        chain: chain
      });

      // let nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

      // console.log(nftOwned) // check for undefined

      session.nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

      // return {
      //   props: {
      //     message:
      //       nftOwned === undefined ? "Sorry, you don't have our NFT" : "Nice! You have our NFT",
      //     // nftList: nftList.raw.result
      //   },
      // };
      //do NFT check here
      return session;
    },
  },
});