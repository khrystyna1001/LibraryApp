from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.response import Response
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework import status
from librarians.serializer import LibrarianSerializer
from librarians.models import Librarian
# Create your views here.

@api_view(['GET'])
def get_librarians(request):
    librarians = Librarian.objects.all()
    serializer = LibrarianSerializer(librarians, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_librarian(request):
    serializer = LibrarianSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_librarian(request, pk):
    try:
        librarian = Librarian.objects.get(pk=pk)
    except Librarian.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = LibrarianSerializer(author)
    return Response(serializer.data)

@api_view(['PUT'])
def update_librarian(request, pk):
    try:
        librarian = Librarian.objects.get(pk=pk)
    except Librarian.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = LibrarianSerializer(librarian, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_librarian(request, pk):
    try:
        librarian = Librarian.objects.get(pk=pk)
    except Librarian.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    librarian.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)