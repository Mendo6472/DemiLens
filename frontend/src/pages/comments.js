'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import config from '../../config.json';
const proxy = config.proxy;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get(proxy + '/api/db/get/comments/' + id);
        console.log(response.data)
        setComments(response.data); // Assuming the response is an array of queries
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <div>
      <h1>Comments Table</h1>
      <table>
        <thead>
          <tr>
            <th>Query</th>
            <th>Username</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={index}>
              <td>{comment.username}</td>
              <td>{comment.comment_text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Comments;