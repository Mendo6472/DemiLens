/**
 * Query builder page
 * 
 * This module defines the query builder page
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/navbar';
import axios from 'axios';
import styles from '../css/Querybuilder.module.css';
import QueryResult from '../components/queryresult';
import config from '../../config.json';
const proxy = config.proxy;

const QueryBuilder = () => {
  const router = useRouter(); // The useRouter hook gives us access to the router object
  const [username, setUsername] = useState(''); // Initialize the username state variable
  const [countries, setCountries] = useState([]); // Initialize the countries state variable
  const [maxDate, setMaxDate] = useState(''); // Initialize the maxDate state variable
  const [minDate, setMinDate] = useState(''); // Initialize the minDate state variable 
  const [step, setStep] = useState(0); // Initialize the step state variable
  const [selectedCountry, setSelectedCountry] = useState(''); // Initialize the selectedCountry state variable
  const [selectedQueryType, setSelectedQueryType] = useState(''); // Initialize the selectedQueryType state variable
  const [selectedDateType, setSelectedDateType] = useState(''); // Initialize the selectedDateType state variable
  const [startDate, setStartDate] = useState(''); // Initialize the startDate state variable
  const [endDate, setEndDate] = useState(''); // Initialize the endDate state variable
  const [query, setQuery] = useState(''); // Initialize the query state variable
  const [queryResult, setQueryResult] = useState(undefined); // Initialize the queryResult state variable
  const [queryName, setQueryName] = useState(''); // Initialize the name state variable
  const [queryComment, setQueryComment] = useState(''); // Initialize the query_comment state variable

  useEffect(() => {
    // Get the username from the query parameters
    const { username } = router.query;
    // If the username is not defined, redirect to the login page
    if (!username) {
      router.push('/');
    }
    // Set the username state variable
    setUsername(username);
    // Set the countries state variable
    setCountries(config.countries);

    handleStartBuildingQuery();
    return () => {};
  }, [router.query]);


  /**
   * Fetch the date interval for the top terms query.
   * 
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the date interval has been fetched.
   */
  const getDateIntervalTopTerms = async () => {
    // Fetch the date interval for the top terms query
    await axios
      .get(`${proxy}/api/bigquery/get/top_terms_interval_dates`)
      .then(response => {
        // Destructure the response data
        const [{ min_refresh_date, max_refresh_date }] = response.data;
        // Set the minDate and maxDate state variables
        setMinDate(min_refresh_date);
        setMaxDate(max_refresh_date);
      })
      .catch(error => {
        // Log the error to the console
        console.error('Error fetching max date:', error);
      });
  };

  /**
   * Fetch the date interval for the top rising terms query.
   * 
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the date interval has been fetched.
   */
  const getDateIntervalTopRisingTerms = async () => {
    // Fetch the date interval for the top rising terms query
    await axios
      .get(`${proxy}/api/bigquery/get/top_rising_terms_interval_dates`)
      .then(response => {
        // Destructure the response data
        const [{ min_refresh_date, max_refresh_date }] = response.data;
        // Set the minDate and maxDate state variables
        setMinDate(min_refresh_date);
        setMaxDate(max_refresh_date);
      })
      .catch(error => {
        console.error('Error fetching max date:', error);
      });
  }
    /**
     * Handle the start of the query building process.
     * 
     * @function
     * @returns {Promise<void>} - A promise that resolves when the query building process has started.
     * 
     */
  const handleStartBuildingQuery = () => {
    // Start the query building process
    setStep(1);
  };

    /**
     * Handle the selection of a country.
     * 
     * @function
     * @param {string} country - The country that was selected.
     * @returns {Promise<void>} - A promise that resolves when the country has been selected.
     */
  const handleCountrySelect = country => {
    // Set the selected country
    setSelectedCountry(country);
    // Move to the next step
    setStep(2);
  };


  /**
   * Handle the selection of a query type.
   * 
   * @async
   * @function
   * @param {string} queryType - The query type that was selected.
   * @returns {Promise<void>} - A promise that resolves when the query type has been selected.
   */
  const handleQueryTypeSelect = async queryType => {
    // Set the selected query type
    setSelectedQueryType(queryType);
    // Move to the next step
    setStep(3)
    // Fetch the date interval for the selected query type
    if (queryType === 'top_terms') {
      await getDateIntervalTopTerms();
    } else if (queryType === 'top_rising_terms') {
      await getDateIntervalTopRisingTerms();
    }
    // Move to the next step
    setStep(4);
  };


  /**
   * Handle the selection of a date type.
   * 
   * @function
   * @param {string} dateType - The date type that was selected.
   * @returns {Promise<void>} - A promise that resolves when the date type has been selected.
   */
  const handleDateTypeSelect = dateType => {
    // Set the selected date type
    setSelectedDateType(dateType);
    // Move to the next step
    setStep(5);
  };

  const handleDateRangeSelection = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
    } else if (endDate < startDate) {
      alert('End date cannot be earlier than the start date.');
    } else {
      handleQueryExecution();
    }
  };
  
  const handleSingleDateSelection = () => {
    if (!startDate) {
      alert('Please select a date.');
    } else {
      handleQueryExecution();
    }
  };

  /**
   * Handle the execution of a query.
   * 
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the query has been executed.
   */
  const handleQueryExecution = async () => {
    // Move to the next step
    setStep(6);
    // Initialize the query value
    let queryValue = '';
    // Build the query based on the selected date type
    if (selectedDateType === 'date_interval') {
      // Build the query for a date interval
      queryValue = `${proxy}/api/bigquery/get/${selectedQueryType}_dates/${selectedCountry}/${startDate}/${endDate}`;
    } else if (selectedDateType === 'single_date') {
      // Build the query for a single date
      queryValue = `${proxy}/api/bigquery/get/${selectedQueryType}_day/${selectedCountry}/${startDate}`;
    }
    // Execute the query
    setQuery(queryValue);
  
    // Execute the query
    try {
      await executeQuery(queryValue);
      // Move to the next step
      setStep(7);
    } catch (error) {
      // Log the error to the console
      console.error('Error executing query:', error);
    }
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
const executeQuery = async (query) => {
  try {
    const response = await axios.get(query);
    setQueryResult(response.data);
  } catch (error) {
    console.error('Error fetching query:', error);
    
    // Check if the error is a 404 response
    if (error.response && error.response.status === 404) {
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

  const saveQuery = () => {
    setStep(8);
  }

  const handleSaveQuery = async () => {
    // Save the query
    const postData = {
      query: query,
      name: queryName,
      username: username,
      query_comment: queryComment,
    };
    await axios
      .post(`${proxy}/api/db/post/query`, postData)
      .then(response => {
        // Show an alert
        window.alert('Query saved successfully!');
      })
      .catch(error => {
        // Log the error to the console
        console.error('Error saving query:', error);
      });
  }

  /**
   * Handle the return to the previous step.
   * 
   * @function
   * @returns {Promise<void>} - A promise that resolves when the previous step has been returned to.
   */
  const handleReturnStep = () => {
    // Move to the previous step
    if(step === 0) {
      // Return to the home page
      router.push(`/home?username=${username}`);
    } else if(step === 4) {
      // Return to the country selection step
      setStep(2);
    } else if(step === 7) {
      // Return to the date type selection step
      setStep(5);
    } else{
      // Return to the previous step
      setStep(step - 1);
    }
  }

  /**
   * Render the QueryBuilder component.
   *
   * @returns {JSX.Element} - The JSX element representing the QueryBuilder component.
   */
  return (
    <div>
      <NavBar username={username} />
      <body className={styles.body}>
      <button classname={styles.returnButton} onClick={handleReturnStep}>Return</button>
      <div className={styles.stepContainer}>
      {step === 0 && <div onClick={handleStartBuildingQuery}> Welcome to the query builder! Click me to start! </div>}
      {step === 1 && (
        <div>
          <select onChange={e => handleCountrySelect(e.target.value)}>
            <option value="">Select a country</option>
            {Object.values(countries).map(country => (
                <option key={country} value={country}>
                    {country}
                </option>
            ))}

          </select>
        </div>
      )}
      {step === 2 && (
        <div>
          <button onClick={() => handleQueryTypeSelect('top_terms')}>Top Terms</button>
          <button onClick={() => handleQueryTypeSelect('top_rising_terms')}>Top Rising Terms</button>
        </div>
      )}
      {step === 3 && (
        <div>Loading...</div>
        )}
      {step === 4 && (
        <div>
          <button onClick={() => handleDateTypeSelect('date_interval')}>Date Interval</button>
          <button onClick={() => handleDateTypeSelect('single_date')}>Single Date</button>
        </div>
      )}
      {step === 5 && selectedDateType === 'date_interval' && (
        <div>
          <label>Start Date:</label>
          <input type="date" min={minDate} max={maxDate} onChange={e => setStartDate(e.target.value)} />
          <label>End Date:</label>
          <input type="date" min={minDate} max={maxDate} onChange={e => setEndDate(e.target.value)} />
          <button onClick={handleDateRangeSelection}>Select Date Range</button>
        </div>
      )}
      {step === 5 && selectedDateType === 'single_date' && (
        <div>
          <label>Select Date:</label>
          <input type="date" min={minDate} max={maxDate} onChange={e => setStartDate(e.target.value)} />
          <button onClick={handleSingleDateSelection}>Select Single Date</button>
        </div>
      )}
      {step === 6 && (
        <div>
          Loading Query Result...
        </div>
        )}
        {step === 7 && queryResult !== undefined && (

            <div>
                <button onClick={saveQuery}>Save query</button>
                <QueryResult query={query} queryResult={queryResult} />
            </div>
        )}
        </div>
        {step === 8 && (
    <div>
        <label htmlFor="queryName">Query Name:</label>
        <input
            type="text"
            id="queryName"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
        />

        <label htmlFor="queryComment">Query Comment:</label>
        <input
            type="text"
            id="queryComment"
            value={queryComment}
            onChange={(e) => setQueryComment(e.target.value)}
        />

        <button onClick={handleSaveQuery}>Save query</button>
        <QueryResult query={query} queryResult={queryResult} />
    </div>
)}
        </body>
    </div>
  );
};

export default QueryBuilder;