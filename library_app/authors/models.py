from django.db import models

# Create your models here.
from app.models import Person

class Author(Person):
    role = Person.AUTHOR

    def get_books(self):
        return self.books_written.all()