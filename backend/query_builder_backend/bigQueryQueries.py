import threading
import json
from .serializers import *
from rest_framework.views import APIView
from django.http import JsonResponse
from django.conf import settings
from google.cloud import bigquery
from google.oauth2 import service_account
thread_local = threading.local()

CONFIG_JSON_PATH = getattr(settings, 'CONFIG_PATH', './config.json')
with open(CONFIG_JSON_PATH, 'r') as file:
    config = json.load(file)
# Data for BigQuery
DATASET_ID = config.get('dataset_id')
TOP_TERMS_ID = config.get('top_terms_id')
TOP_RISING_TERMS_ID = config.get('top_rising_terms_id')
 # Create a thread-local storage for the client

@staticmethod
def get_client():
    """
    Get a BigQuery client for the current thread, creating one if necessary.

    :return: A BigQuery client.
    """
    # Retrieve or create a client for the current thread
    if not hasattr(thread_local, "client"):
        # Create a new client for the current thread
        credentials = service_account.Credentials.from_service_account_file(CONFIG_JSON_PATH)
        thread_local.client = bigquery.Client(credentials=credentials)
    # Return the client
    return thread_local.client

class BigQueryTopTermsDay(APIView):
    def get(self, request, country_name, date):
        """
        Handle GET requests to get the top terms for a given day from the BigQuery database.

        :param request: The HTTP request object.
        :param country_name: The country to get the top terms from.
        :param date: The date to get the top terms from.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the top 25 terms for the given day
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Define the parameters to use from the api request
        query_params = [
            bigquery.ScalarQueryParameter("date", "STRING", date),
            bigquery.ScalarQueryParameter("country_name", "STRING", country_name),
        ]
        
        # Query that selects the top 25 terms for a given day
        query = f"""
            SELECT
                term AS Top_Term,
                rank
             FROM `{DATASET_ID}.{TOP_TERMS_ID}`
            WHERE
                refresh_date = @date
                AND
                country_name = @country_name
            GROUP BY Top_Term, rank
            ORDER BY rank ASC
        """

        # Sends the query to the process_query function
        return process_query(query, query_params)
    

class BigQueryTopTermsDate(APIView):
    def get(self, request, country_name, init_date, finish_date):
        """
        Handle GET requests to get the top term for each day in a given range from the BigQuery database.

        :param request: The HTTP request object.
        :param country_name: The country to get the top terms from.
        :param init_date: The initial date to get the top terms from.
        :param finish_date: The final date to get the top terms from.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the top terms for each day in the given range
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Define the parameters to use from the api request
        query_params = [
            bigquery.ScalarQueryParameter("init_date", "STRING", init_date),
            bigquery.ScalarQueryParameter("finish_date", "STRING", finish_date),
            bigquery.ScalarQueryParameter("country_name", "STRING", country_name),
        ]
        
        # Query that selects the top term for each day in the given range
        query = f"""
            SELECT
                refresh_date AS Day,
                term AS Top_Term
             FROM `{DATASET_ID}.{TOP_TERMS_ID}`
            WHERE
                rank = 1
                AND 
                refresh_date BETWEEN @init_date AND @finish_date
                AND
                country_name = @country_name
            GROUP BY Day, Top_Term
            ORDER BY Day DESC
        """

        # Sends the query to the process_query function
        return process_query(query, query_params)
    
class BigQueryTopRisingTermsDay(APIView):
    def get(self, request, country_name, date):
        """
        Handle GET requests to get the top rising terms for a given day from the BigQuery database.

        :param request: The HTTP request object.
        :param country_name: The country to get the top rising terms from.
        :param date: The date to get the top rising terms from.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the top 25 rising terms for the given day
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Define the parameters to use from the api request
        query_params = [
            bigquery.ScalarQueryParameter("date", "STRING", date),
            bigquery.ScalarQueryParameter("country_name", "STRING", country_name),
        ]
        
        # Query that selects the top 25 rising terms for a given day
        query = f"""
            SELECT
                term AS Top_Term,
                rank,
                percent_gain
             FROM `{DATASET_ID}.{TOP_RISING_TERMS_ID}`
            WHERE
                refresh_date = @date
                AND
                country_name = @country_name
            GROUP BY Top_Term, rank, percent_gain
            ORDER BY rank ASC
        """

        # Sends the query to the process_query function
        return process_query(query, query_params)
    
class BigQueryTopRisingTermsDates(APIView):
    def get(self, request, country_name, init_date, finish_date):
        """
        Handle GET requests to get the top rising term for each day in a given range from the BigQuery database.

        :param request: The HTTP request object.
        :param country_name: The country to get the top rising terms from.
        :param init_date: The initial date to get the top rising terms from.
        :param finish_date: The final date to get the top rising terms from.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the top rising terms for each day in the given range
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Define the parameters to use from the api request
        query_params = [
            bigquery.ScalarQueryParameter("init_date", "STRING", init_date),
            bigquery.ScalarQueryParameter("finish_date", "STRING", finish_date),
            bigquery.ScalarQueryParameter("country_name", "STRING", country_name),
        ]
        
        # Query that selects the top rising term for each day in the given range
        query = f"""
            SELECT
                refresh_date AS Day,
                term AS Top_Term,
                percent_gain
             FROM `{DATASET_ID}.{TOP_RISING_TERMS_ID}`
            WHERE
                rank = 1
                AND 
                refresh_date BETWEEN @init_date AND @finish_date
                AND
                country_name = @country_name
            GROUP BY Day, Top_Term, percent_gain
            ORDER BY Day DESC
        """

        # Return the results as JSON
        return process_query(query, query_params)
    
class BigQueryDateIntervalTopTerms(APIView):
    def get(self, request):
        """
        Handle GET requests to get the minimum and maximum date for which we have data for top terms from BigQuery.

        :param request: The HTTP request object.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                the minimum and maximum date for which we have data for top terms
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Query that selects the minimum date for which we have data for top terms
        query = f"""
            SELECT
                MIN(refresh_date) AS min_refresh_date,
                MAX(refresh_date) AS max_refresh_date
             FROM `{DATASET_ID}.{TOP_TERMS_ID}`
        """

        # Return the results as JSON
        return process_query(query, [])
    
class BigQueryDateIntervalTopRisingTerms(APIView):
    def get(self, request):
        """
        Handle GET requests to get the minimum and maximum date for which we have data for top rising terms from BigQuery.

        :param request: The HTTP request object.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                the minimum and maximum date for which we have data for top rising terms
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Query that selects the minimum date for which we have data for top rising terms
        query = f"""
            SELECT
                MIN(refresh_date) AS min_refresh_date,
                MAX(refresh_date) AS max_refresh_date
             FROM `{DATASET_ID}.{TOP_RISING_TERMS_ID}`
        """

        # Return the results as JSON
        return process_query(query, [])
    
@staticmethod
def process_query(query, query_params):
    """
    Process the BigQuery results into a list of dictionaries.

    :param query: The query to run.
    :param query_params: The parameters to use in the query.
    :return: A JSON response with the results of the query.
    """
    try:
        # Get the current thread BigQuery client
        client = get_client()
        # Run the query
        query_job = client.query(
            query,
            job_config=bigquery.QueryJobConfig(query_parameters=query_params),
        )

        # Fetch the results
        results = query_job.result()
        # Process the results
        rows = [dict(row.items()) for row in results]

        # Check if the result set is empty
        if not rows:
            return JsonResponse({"error": "No data found"}, status=404)

        # Return the results as JSON
        return JsonResponse(rows, safe=False)
    # If there is an error, return a JSON response with the error
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)