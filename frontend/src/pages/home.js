'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/navbar';
import styles from '../css/Home.module.css';

const HomeContent = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  useEffect(() => {
    const { username } = router.query;

    if(!username) {
      router.push('/');
    }
    setUsername(username);

    return () => {      
    };

  }, [router.query]);


  const goToQueries = () => {
    router.push(`/queries?username=${username}`);
  };

  const goToQueryBuilder = () => {
    router.push(`/querybuilder?username=${username}`);
  };


  return (
    <div>
      <NavBar username={ username } />
      <body className={styles.body}>
        <div className={styles.content}>
          <h2>What would you like to do today, {username}?</h2>
          <div className={styles.buttonContainer}>
            <button onClick={goToQueries}>Go to Saved Queries</button>
            <button onClick={goToQueryBuilder}>Create a Query</button>
          </div>
        </div>
      </body>
    </div>
  );
};


export default HomeContent;
