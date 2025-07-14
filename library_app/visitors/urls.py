from django.urls import path
from visitors.views import get_visitors, create_visitor, get_visitor, delete_visitor, update_visitor

urlpatterns = [
    path("", get_visitors, name="get-visitors"),
    path("create", create_visitor, name="create-visitor"),
    path("<int:pk>", get_visitor, name="get-visitor"),
    path("update/<int:pk>", update_visitor, name="update-visitor"),
    path("delete/<int:pk>", delete_visitor, name="delete-visitor")
]
