from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView


class QueryAdderEndpoint(APIView):
    def post(self, request):
        """
        Handle POST requests to add a query to the PostgreSQL database.

        :param request: The HTTP request object.
        :return: A JSON response indicating the success or failure of the request.
            - If the request is processed correctly, returns:
                {"message": "Data saved successfully"}
                with HTTP status 201 (Created).
            - If the request data is invalid, returns the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Serialize the data from the request
        serializer = QueryPostSerializer(data=request.data)
        # Check if the serializer is valid
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data saved successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class CommentAdderEndpoint(APIView):
    def post(self, request, query_id, username, comment):
        """
        Handle POST requests to add a comment to the PostgreSQL database.

        :param request: The HTTP request object.

        :return: A JSON response indicating the success or failure of the request.
            - If the request is processed correctly, returns:
                {"message": "Data saved successfully"}
                with HTTP status 201 (Created).
            - If the request data is invalid, returns the serializer errors
                with HTTP status 400 (Bad Request).
        """
        # Serialize the data from the request
        serializer = CommentPostSerializer(data={'query': query_id, 'username': username, 'comment_text': comment})

        # Check if the serializer is valid
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Data saved successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QueriesGetterEndpoint(APIView):
    def get(self, request):
        """
        Handle GET requests to get all the queries from the PostgreSQL database.

        :param request: The HTTP request object.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the queries
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        try:
            # Get all the queries
            queryset = Query.objects.all()
            # Serialize the data from the queryset
            serializer = QueriesGetterSerializer(queryset, many=True)
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class QueryGetterEndpoint(APIView):
    def get(self, request, query_id):
        """
        Handle GET requests to get all the queries from the PostgreSQL database.

        :param request: The HTTP request object.
        :param query_id: The id of the query to get.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the queries
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        try:
            # Get the query with the given id
            queryset = Query.objects.get(id=query_id)
            # Serialize the data from the queryset
            serializer = QueryGetterSerializer(queryset)
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    
class CommentGetterEndpoint(APIView):
    def get(self, request, query_id):
        """
        Handle GET requests to get all the comments for a given query from the PostgreSQL database.

        :param request: The HTTP request object.
        :param query_id: The id of the query to get the comments from.

        :return: A JSON response.
            - If the request is processed correctly, returns: 
                a list of all the comments for the given query
                with HTTP status 200 (OK).
            - If the request data is invalid, returns:
                the serializer errors
                with HTTP status 400 (Bad Request).
        """
        try:
            # Get all the comments for the given query ordered by id
            queryset = Comment.objects.filter(query=query_id).order_by('-id')
            # Serialize the data from the queryset
            serializer = CommentGetterSerializer(queryset, many=True)
            serialized_data = serializer.data
            return Response(serialized_data, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)