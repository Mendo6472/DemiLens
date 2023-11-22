"""
URL configuration for bigquery_query_builder project.

The `urlpatterns` list routes URLs to views.
"""
from django.contrib import admin
from django.urls import path
from query_builder_backend.bigQueryQueries import *
from query_builder_backend.databaseQueries import *

urlpatterns = [
    path('admin/', admin.site.urls), # Django admin
    path('api/db/post/query', QueryAdderEndpoint.as_view(), name='db-query-endpoint'), # Endpoint for adding queries to the database
    path('api/db/post/comment/<str:query_id>/<str:username>/<str:comment>', CommentAdderEndpoint.as_view(), name='db-comment-endpoint'), # Endpoint for adding comments to the database
    path('api/db/get/queries', QueriesGetterEndpoint.as_view(), name='db-queries-endpoint'), # Endpoint for getting queries from the database
    path('api/db/get/query/<int:query_id>', QueryGetterEndpoint.as_view(), name='db-query-endpoint'), # Endpoint for getting a query form the database
    path('api/db/get/comments/<int:query_id>', CommentGetterEndpoint.as_view(), name='db-comments-endpoint'), # Endpoint for getting comments from a given query from the database
    path('api/bigquery/get/top_terms_dates/<str:country_name>/<str:init_date>/<str:finish_date>', BigQueryTopTermsDate.as_view(), name='bigquery-top-terms-day-endpoint'), # Endpoint for getting top terms from a given country and date range from BigQuery
    path('api/bigquery/get/top_terms_day/<str:country_name>/<str:date>', BigQueryTopTermsDay.as_view(), name='bigquery-top-terms-day-endpoint'), # Endpoint for getting top terms from a given country and date from BigQuery
    path('api/bigquery/get/top_rising_terms_dates/<str:country_name>/<str:init_date>/<str:finish_date>', BigQueryTopRisingTermsDates.as_view(), name='bigquery-top-rising-terms-date-endpoint'), # Endpoint for getting top rising terms from a given country and date range from BigQuery
    path('api/bigquery/get/top_rising_terms_day/<str:country_name>/<str:date>', BigQueryTopRisingTermsDay.as_view(), name='bigquery-top-rising-terms-day-endpoint'), # Endpoint for getting top rising terms from a given country and date from BigQuery
    path('api/bigquery/get/top_terms_interval_dates', BigQueryDateIntervalTopTerms.as_view(), name='bigquery-interval-date-top-terms-endpoint'), # Endpoint for getting the minimum and maximum date we have data for in the top terms table
    path('api/bigquery/get/top_rising_terms_interval_dates', BigQueryDateIntervalTopRisingTerms.as_view(), name='bigquery-interval-top-rising-terms-endpoint'), # Endpoint for getting the minimum and maximum date we have data for in the top rising terms table
]