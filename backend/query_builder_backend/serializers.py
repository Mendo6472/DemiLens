# serializers.py

from rest_framework import serializers
from .models import *

class QueryPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ['query', 'name', 'username', 'query_comment']

class QueryGetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ['id','name', 'query', 'username', 'date', 'query_comment']

class QueriesGetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ['id','name', 'username', 'date']

class CommentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['query', 'username', 'comment_text']

class CommentGetterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'query', 'username', 'comment_text']
