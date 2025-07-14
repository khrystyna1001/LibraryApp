from django.db import models
# Create your models here.
from app.models import Person

class Librarian(Person):
    role = Person.LIBRARIAN

    def get_issued_history(self):
        return self.books_issued.all()