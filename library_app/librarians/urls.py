from django.urls import path
from librarians.views import get_librarians, create_librarian, get_librarian, delete_librarian, update_librarian

urlpatterns = [
    path("", get_librarians, name="get-librarians"),
    path("create", create_librarian, name="create-librarian"),
    path("<int:pk>", get_librarian, name="get-librarian"),
    path("update/<int:pk>", update_librarian, name="update-librarian"),
    path("delete/<int:pk>", delete_librarian, name="delete-librarian")
]
