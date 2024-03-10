from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class UserManager(BaseUserManager):
	def create_user(self, email: str, password: str, name: str):
		if not email:
			raise ValueError('An email is required.')

		if not password:
			raise ValueError('A password is required.')

		if not name:
			raise ValueError('A name is required.')


		email = self.normalize_email(email)
		user = self.model(email=email, name=name, is_staff=False)
		user.set_password(password)
  
		user.save()
		return user

	
 
	def create_superuser(self, email: str, password: str, name: str):
		if not email:
			raise ValueError('An email is required.')

		if not password:
			raise ValueError('A password is required.')

		if not name:
			raise ValueError('A name is required.')

		
		user = self.create_user(email=email, password=password, name=name)
		user.is_superuser = True
		user.is_staff = True
		
		user.save()
		return user


class User(AbstractBaseUser, PermissionsMixin):
    
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	name = models.CharField(max_length=50)
	is_staff = models.BooleanField(default=False)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name']
	
 	
 
	objects = UserManager()
 
	def __str__(self):
		return f"{self.name.capitalize()} {self.surname.capitalize()}"
		
