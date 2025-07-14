from django.db import models

# Create your models here.
class Person(models.Model):
    AUTHOR = "AUTHOR"
    LIBRARIAN = "LIBRARIAN"
    VISITOR = "VISITOR"
    ROLE_CHOICES = [
        (AUTHOR, 'Author'),
        (LIBRARIAN, 'Librarian'),
        (VISITOR, 'Visitor'),
    ]

    

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    role = models.CharField(
            max_length=10,
            choices=ROLE_CHOICES,
    )

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()