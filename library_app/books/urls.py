from django.urls import path
from books.views import get_books, create_book, get_book, delete_book, update_book

urlpatterns = [
    path("", get_books, name="get-books"),
    path("create", create_book, name="create-book"),
    path("<int:pk>", get_book, name="get-book"),
    path("update/<int:pk>", update_book, name="update-book"),
    path("delete/<int:pk>", delete_book, name="delete-book")
]
