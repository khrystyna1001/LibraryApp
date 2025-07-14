from django.urls import path
from authors.views import get_authors, create_author, get_author, delete_author, update_author

urlpatterns = [
    path("", get_authors, name="get-authors"),
    path("create", create_author, name="create-author"),
    path("<int:pk>", get_author, name="get-author"),
    path("update/<int:pk>", update_author, name="update-author"),
    path("delete/<int:pk>", delete_author, name="delete-author")
]
