from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    author = models.ManyToManyField(
        'authors.Author',
        related_name='books_written'
    )
    published_date = models.DateField()
    is_available = models.BooleanField()

