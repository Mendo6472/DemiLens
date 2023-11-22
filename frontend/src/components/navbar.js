/** 
 * NavBar component
 * 
 * This module defines the NavBar component.
 * 
 * @component
 * @example
 * // Example usage in a Next.js page
 * import NavBar from '../path/to/navbar';
 * // get username from query parameter
 * const MyPage = () => {
 *  return (
 *   <div>
 *    <NavBar username={username} />
 *   </div>
 * );
 * };
 * 
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../css/Navbar.module.css';

const NavBar = ({ username }) => {
    const router = useRouter();
  const [showSidePanel, setShowSidePanel] = useState(false);

  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
  };

  const goToQueries = () => {
    router.push(`/queries?username=${username}`);
  };

  const goToQueryBuilder = () => {
    router.push(`/querybuilder?username=${username}`);
  };

  const goToHomePage = () => {
    router.push(`/home?username=${username}`);
  };

  return (
    <div>
      <div className={styles.banner}>
        <div className = {styles.buttonContainer}>
        <button className={styles.togglePanelButton} onClick={toggleSidePanel}>
          Toggle Panel
        </button>
        <button className={styles.homeButton} onClick={goToHomePage}>
          Home
        </button>
        </div>
        <h1 className={styles.welcomeText}>Welcome, {username}!</h1>
      </div>

      <div className={styles.sidePanel} style={{ left: showSidePanel ? '0' : '-250px' }}>
        <div className={styles.sidePanelContent}>
            <button className={styles.togglePanelButton} onClick={goToQueries}>Saved queries</button>
            <button className={styles.togglePanelButton} onClick={goToQueryBuilder}>Create query</button>
            <p className={styles.username}>{username}</p>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
