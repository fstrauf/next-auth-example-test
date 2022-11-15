import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"
import { useAccount, useConnect, useSignMessage, useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import { InjectedConnector } from 'wagmi/connectors/injected';
import axios from 'axios';

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();

  const handleAuth = async () => {

    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({ connector: new InjectedConnector() });

    const userData = { address: account, chain: chain.id, network: 'evm' };

    console.log("header")
    console.log(userData)

    const { data } = await axios.post('/api/auth/request-message', userData, {
      headers: {
        'content-type': 'application/json',
      },
    });

    const message = data.message;

    console.log(message)

    const signature = await signMessageAsync({ message });

    await signIn('credentials', { message, signature, redirect: false, callbackUrl: '/user' });

  
  };


  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${!session && loading ? styles.loading : styles.loaded
            }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <button className={styles.buttonPrimary} onClick={() => handleAuth()}>Authenticate via Metamask</button>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/client">Client</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/server">Server</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected">Protected</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/api-example">API</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin">Admin</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/me">Me</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
