from django.urls import path
from . import views

urlpatterns = [
    path("", views.login_reg_index, name="login_reg_index"),
    path('api/register_user/', views.register_user, name="register_user"),
    path('api/login_user/', views.login_user, name="login_user"),
    path('api/log_out_user/', views.logout_user, name="logout_user"),
    path("chat/room=<str:room_name>/", views.room, name="room"),
    path('api/change_room/', views.change_room, name="change_room"),
]