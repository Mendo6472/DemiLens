from django.db import models

class Query(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    query = models.TextField()
    username = models.CharField(max_length=50)
    date = models.DateField(auto_now_add=True)
    query_comment = models.TextField()

    def __str__(self):
        return f"Query {self.id} - {self.username}"

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    query = models.ForeignKey(Query, on_delete=models.CASCADE)
    username = models.CharField(max_length=50)
    comment_text = models.TextField()

    def __str__(self):
        return f"Comment {self.id} on Query {self.query.id} - {self.username}"
