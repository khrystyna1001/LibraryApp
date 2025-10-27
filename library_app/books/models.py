from django.db import models
from django.conf import settings

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
    borrower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='books_borrowed'
    )

    def __str__(self):
        return self.title

