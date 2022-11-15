import { getSession } from 'next-auth/react';
import Moralis from 'moralis';
import { useRouter } from 'next/router';
import { EvmChain } from '@moralisweb3/evm-utils';

function Protected({message, nftList}) {
    const {push} = useRouter();

    return (
        <div>
            <button onClick={()=> push('/user')}>Profile</button>
            <h3>Protected content</h3>
            <div>{message}</div>
            {/* {nftList.map((e)=>{
                return (
                    <div>{e.ap}</div>
                )
            })} */}
            <pre>{JSON.stringify(nftList, null, 2)}</pre>
        </div>
    );
}


export async function getServerSideProps(context) {

    const session = await getSession(context);
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

    let nftList =[]
    nftList = await Moralis.EvmApi.nft.getWalletNFTs({
        address: session.user.address,
        chain: chain
    });

    let nftOwned = nftList.raw.result.find((nfts) => nfts.token_address === contract)

    console.log(nftOwned) // check for undefined

    return {
        props: {
            message:
            nftOwned === undefined ? "Sorry, you don't have our NFT" : "Nice! You have our NFT",
            // nftList: nftList.raw.result
        },
    };
    
}

export default Protected;