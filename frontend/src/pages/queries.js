'use client'
import style from '../css/Queries.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/navbar';
import axios from 'axios';
import config from '../../config.json';
const proxy = config.proxy;

const Queries = ({ queries }) => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [userQueries, setUserQueries] = useState([]);

  useEffect(() => {
    const { username } = router.query;

    if (!username) {
      router.push('/');
    }

    setUsername(username);

    // Make a request to fetch queries
    axios.get(`${proxy}/api/db/get/queries`)
      .then(response => {
        setUserQueries(response.data); // Assuming the API response is an array of objects
      })
      .catch(error => {
        console.error('Error fetching queries:', error);
      });

    return () => {
    };
  }, [router.query]);

  const goToQuery = (queryid) => {
    router.push(`/query?queryid=${queryid}&username=${username}`);
  };

  return (
    <div>
    <NavBar username={username} />
    <body className={style.body}>
      <h1>Queries Page</h1>
      <ul>
        {userQueries.map((query, index) => (
          <li
            key={index}
            className={style.queryItem} // Apply the new style class here
            onClick={() => goToQuery(query.id)}
          >
            <p>Name: {query.name}</p>
            <p>Username: {query.username}</p>
          </li>
        ))}
      </ul>
    </body>
  </div>
  );
};

export default Queries;