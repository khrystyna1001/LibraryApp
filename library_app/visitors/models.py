from django.db import models

# Create your models here.
from app.models import Person

class Visitor(Person):
    role = Person.VISITOR

    def get_borrowed_history(self):
        return self.books_borrowed.all()