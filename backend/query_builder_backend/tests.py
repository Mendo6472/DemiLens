# myapp/tests.py
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import datetime, timedelta


class BigQueryTests(APITestCase):
    def test_get_top_terms_interval_dates(self):
        url = reverse('bigquery-interval-date-top-terms-endpoint')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_rising_terms_interval_dates(self):
        url = reverse('bigquery-interval-top-rising-terms-endpoint')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_terms_dates(self):
        # Calculate 10 days before the current date
        initial_date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        # Calculate 5 days before the current date
        final_date = (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-terms-day-endpoint', args=['Colombia', initial_date, final_date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_rising_terms_dates(self):
        # Calculate 10 days before the current date
        initial_date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        # Calculate 5 days before the current date
        final_date = (datetime.now() - timedelta(days=5)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-rising-terms-date-endpoint', args=['Colombia', initial_date, final_date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_terms_day(self):
        # Calculate 10 days before the current date
        date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-terms-day-endpoint', args=['Colombia', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_rising_terms_day(self):
        # Calculate 10 days before the current date
        date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-rising-terms-day-endpoint', args=['Colombia', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_top_rising_terms_wrong_day(self):
        # Calculate 10 days after the current date
        date = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-rising-terms-day-endpoint', args=['Colombia', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_top_terms_wrong_day(self):
        # Calculate 10 days after the current date
        date = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-terms-day-endpoint', args=['Colombia', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_top_terms_wrong_dates(self):
        # Calculate 10 days after the current date
        initial_date = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')

        # Calculate 5 days after the current date
        final_date = (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-terms-day-endpoint', args=['Colombia', initial_date, final_date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_top_rising_terms_wrong_dates(self):
        # Calculate 10 days after the current date
        initial_date = (datetime.now() + timedelta(days=10)).strftime('%Y-%m-%d')

        # Calculate 5 days after the current date
        final_date = (datetime.now() + timedelta(days=5)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-rising-terms-date-endpoint', args=['Colombia', initial_date, final_date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_top_rising_terms_wrong_country(self):
        # Calculate 10 days before the current date
        date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-rising-terms-day-endpoint', args=['Colombiaaaa', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_top_terms_wrong_country(self):
        # Calculate 10 days before the current date
        date = (datetime.now() - timedelta(days=10)).strftime('%Y-%m-%d')

        url = reverse('bigquery-top-terms-day-endpoint', args=['Colombiaaaa', date])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)