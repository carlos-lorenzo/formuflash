from django.urls import path

from . import views


urlpatterns = [
    path("", views.Index.as_view(), name="index"),
    path("posts/", views.Posts.as_view(), name="posts"),
    # path(r'^posts/(?P<slug>[-\w]+)$', views.post_by_slug)
]