from rest_framework import viewsets
from visitors.serializer import VisitorSerializer
from django.contrib.auth.mixins import LoginRequiredMixin
from visitors.models import Visitor
# Create your views here.

class VisitorViewSet(LoginRequiredMixin, viewsets.ModelViewSet):
    login_url = "/login/"
    redirect_field_name = "/home"
    serializer_class = VisitorSerializer
    queryset = Visitor.objects.all()