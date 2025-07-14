from rest_framework import viewsets
from visitors.serializer import VisitorSerializer
from visitors.models import Visitor
# Create your views here.

class VisitorViewSet(viewsets.ModelViewSet):
    serializer_class = VisitorSerializer
    queryset = Visitor.objects.all()