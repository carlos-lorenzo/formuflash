from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("get_csrf_token", views.GetCSRFToken.as_view(), name="csrftoken"),
    path("login", obtain_auth_token, name="login"),
    path("user", views.User.as_view(), name="user"),
    path("decks", views.GetDecks.as_view(), name="decks"),
    path("fetch_deck_card", views.GetCard.as_view(), name="fetch_card"),
]