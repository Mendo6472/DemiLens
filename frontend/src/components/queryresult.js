/**
 * QueryReuslt component
 * 
 * This module defines the QueryResult component.
 * 
 * @component
 * @example
 * // Example usage in a Next.js page
 * import QueryResult from '../path/to/queryresult';
 * 
 * const MyPage = () => {
 * // calculate query and query result
 *  return (
 *  <div>
 *   <QueryResult query={query} queryResult={queryResult} />
 * </div>
 * );
 * };

 */
import styles from '../css/Queryresult.module.css';
import { useEffect } from 'react';

const QueryResult = ({ query, queryResult }) => {
    useEffect(() => {
    }, [queryResult]);

    /**
    * Render the QueryBuilder component.
    *
    * @returns {JSX.Element} - The JSX element representing the QueryBuilder component.
    */
    return (
        <div>
            <ul className={styles.resultList}>
                {queryResult.map((result, index) => (
                    <li key={index} className={styles.resultItem}>
                        <p>{`Term: ${result.Top_Term}`}</p>
                        {result.rank &&  <p>{`Rank: ${result.rank}`}</p>}
                        {result.Day && <p>{`Date: ${result.Day}`}</p>}
                        {result.percent_gain && <p>{`Percent Gain: ${result.percent_gain}%`}</p>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QueryResult;
