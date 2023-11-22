/**
 * Query page
 * 
 * This module describes the query page for a single query
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/navbar';
import axios from 'axios';
import style from '../css/Query.module.css';
import QueryResult from '../components/queryresult';
import config from '../../config.json';
const proxy = config.proxy;

/**
 * Query component.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Query component.
 */
const Query = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [query, setQuery] = useState(null); // Initialize with null
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true); // Introduce loading state
    const [seeQuery, setSeeQuery] = useState(false);
    const [queryResult, setQueryResult] = useState([]);

    /**
     * Handle the change of the comment input
     * 
     * @function
     * @param {Event} event - The event object.
     * @returns {Promise<void>} - A promise that resolves when the comment has been set.
     */ 
    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    /**
     * Handle the sending of a comment
     * 
     * @function
     * @returns {Promise<void>} - A promise that resolves when the comment has been sent. 
     */
    const handleSendComment = () => {
        axios.post(`${proxy}/api/db/post/comment/${query.id}/${username}/${comment}`)
            .then(response => {
                // After successfully sending a comment, update the local state
                setComments(prevComments => [{ username, comment_text: comment }, ...prevComments]);

                // Clear the comment input after sending
                setComment('');
            })
            .catch(error => {
                alert('Error sending comment');
                console.error('Error sending comment:', error);
            });
    };

      /**
 * Function to execute the given query.
 * 
 * @async
 * @function
 * @param {string} query - The query to execute.
 * @returns {Promise<void>} - A promise that resolves when the query has been executed.
 * @throws {Error} - If there's an error fetching the query.
 */
const handleUseQuery = async () => {
    setLoading(true); // Set loading to true when the query is being fetched
    try {
      const response = await axios.get(query.query);
      setQueryResult(response.data);
      setSeeQuery(true);
      setLoading(false); // Set loading to false after fetching query
    } catch (error) {
      console.error('Error fetching query:', error);
      
      // Check if the error is a 404 response
      if (error.response && error.response.status === 404) {
        setLoading(false); // Set loading to false on error
        setSeeQuery(false);
        // Show an alert for a 404 response
        setTimeout(() => {
          window.alert('Query did not return any results. Please try again.');
        }, 0);

      } else {
        // Re-throw the error for other cases
        throw error;
      }
    }
  };

    useEffect(() => {
        const { username, queryid } = router.query;

        if (!username || !queryid) {
            router.push('/');
            return;
        }

        setUsername(username);

        // Fetch the query
        axios.get(`${proxy}/api/db/get/query/${queryid}`)
            .then(r => {
                setQuery(r.data);
            })
            .catch(error => {
                console.error('Error fetching queries:', error);
                setLoading(false); // Set loading to false on error
            });
        // Fetch the comments
        axios.get(`${proxy}/api/db/get/comments/${queryid}`)
                .then(response => {
                    setComments(response.data);
                    setLoading(false); // Set loading to false after fetching comments
                })
                .catch(error => {
                    console.error('Error fetching comments:', error);
                    setLoading(false); // Set loading to false on error
                });
    }, []);

    // Render the component when both query and comments data are available
    return (
        <div>
            <NavBar username={username} />
            <body className={style.body}>
            {loading && <p>Loading...</p> /**Show loading message */} 
            {seeQuery && queryResult !== undefined  && (
                // Show the current query result
                <div>
                    <button onClick={() => setSeeQuery(false)}>Back</button>
                    <QueryResult query={query} queryResult={queryResult} />
                </div>
            )}
            {!seeQuery && query &&(
                // Show current query information and comments
                <div>
                <h1>Query Page</h1>
                <div>
                    <button onClick={handleUseQuery}>Use Query</button>
                    <p>Name: {query.name}</p>
                    <p>Username: {query.username}</p>
                    <p>Query Comment: {query.query_comment}</p>
                    <p>Date: {query.date}</p>
                </div>
                <div>
                    <textarea
                        placeholder="Enter your comment"
                        value={comment}
                        onChange={handleCommentChange}
                    />
                    <button onClick={handleSendComment}>Send Comment</button>
                </div>
                <div>
                    <h2>Comments:</h2>
                    <ul>
                        {comments.map((comment, index) => (
                            <li key={index}>{comment.username}: {comment.comment_text}</li>
                        ))}
                    </ul>
                </div>
                </div>
            )}
            </body>
        </div>
    );
};

export default Query;