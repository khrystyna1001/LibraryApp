from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework import status
from visitors.serializer import VisitorSerializer
from visitors.models import Visitor
# Create your views here.

@api_view(['GET'])
def get_visitors(request):
    visitors = Visitor.objects.all()
    serializer = VisitorSerializer(visitors, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_visitor(request):
    serializer = VisitorSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_visitor(request, pk):
    try:
        visitor = Visitor.objects.get(pk=pk)
    except Visitor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = VisitorSerializer(author)
    return Response(serializer.data)

@api_view(['PUT'])
def update_visitor(request, pk):
    try:
        visitor = Visitor.objects.get(pk=pk)
    except Visitor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = VisitorSerializer(visitor, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_visitor(request, pk):
    try:
        visitor = Visitor.objects.get(pk=pk)
    except Visitor.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    visitor.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)