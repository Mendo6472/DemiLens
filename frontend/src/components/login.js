/**
 * Login component
 * 
 * This module defines the Login component.
 * 
 * @component
 * @example
 * // Example usage in a Next.js page
 * import Login from '../path/to/login';
 * 
 * const MyPage = () => {
 *   return (
 *    <div>
 *     <Login />
 *   </div>
 *   );
 * };
 *
 * export default MyPage;
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../css/Login.module.css'; // Import the CSS file

const Login = () => {
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState(''); // Initialize the username state variable
  
  /**
   * This function is called when the user clicks the Login button.
   * It redirects the user to the home page with the username as a query parameter.
   * 
   * @function
   * @returns {Promise<void>} - Redirects the user to the home page
   */
  const handleLogin = () => {
    router.push(`/home?username=${username}`);
  };
  
   /**
   * Render the QueryBuilder component.
   *
   * @returns {JSX.Element} - The JSX element representing the Login component.
   */
  return (
    <body className={styles.body}>
      <div className={styles.loginContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.loginHeading}>Login</h1>
          <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.loginInput} // Add this line
          />
          <button className={styles.loginButton} onClick={handleLogin}>Login</button>
        </div>
      </div>
    </body>
    );
  };
  
  export default Login;
  