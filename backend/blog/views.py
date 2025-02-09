from django.http import HttpRequest, JsonResponse


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from .models import client



# Create your views here.
class Index(APIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request: HttpRequest) -> Response:
		"""
		API index endpoint, check whether it is online.

		Args:
				request (HttpRequest): Nothing.

		Returns:
				Response: Response containing JSON with key "status".
		"""
		
		return Response({"status": "API online"}, status=status.HTTP_200_OK)



class Posts(APIView):
	permission_classes = (permissions.AllowAny,)

	def get(self, request: HttpRequest) -> Response:
		"""
		API index endpoint, check whether it is online.

		Args:
				request (HttpRequest): Nothing.

		Returns:
				Response: Response containing JSON with key "status".
		"""
		#entries = client.entries()
		#print(entries)
		return Response({"posts": "some posts"}, status=status.HTTP_200_OK)