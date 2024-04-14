from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from . import views

urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    
    path("get_csrf_token", views.GetCSRFToken.as_view(), name="csrftoken"),
    
    path("login", obtain_auth_token, name="login"),
    path("get_user", views.User.as_view(), name="user"),
    path("logout", views.Logout.as_view(), name="logout"),
    
    path("update_user", views.UpdateProfileInfo.as_view(), name="update_user"),
    path("change_password", views.ChangePassword.as_view(), name="change_password"),
    
    path("create_course", views.CreateCourse.as_view(), name="create_course"),
    path("get_courses", views.GetUserCourses.as_view(), name="courses"),
    path("delete_course", views.DeleteCourse.as_view(), name="delete_course"),
    path("rename_course", views.RenameCourse.as_view(), name="rename_course"),
    
    path("create_deck", views.CreateDeck.as_view(), name="create_deck"),
    path("course_decks", views.GetCourseDecks.as_view(), name="course_decks"),
    path("user_decks", views.GetUserDecks.as_view(), name="all_user_decks"),
    path("fetch_deck", views.GetDeck.as_view(), name="fetch_deck"),
    path("delete_deck", views.DeleteDeck.as_view(), name="delete_deck"),
    path("rename_deck", views.RenameDeck.as_view(), name="rename_deck"),
    
    path("create_card", views.CreateCard.as_view(), name="create_card"),
    path("fetch_deck_card", views.GetCard.as_view(), name="fetch_card"),
    path("update_card", views.UpdateCard.as_view(), name="update_card"),
    path("update_confidence", views.UpdateCardConfidence.as_view(), name="update_confidence"),
    path("delete_card", views.DeleteCard.as_view(), name="delete_card"),
    
    
]