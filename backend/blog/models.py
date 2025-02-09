import os
import environ
import contentful
#from django.db import models

# Create your models here.
env = environ.Env()
environ.Env.read_env()

client = contentful.Client(
    env('CTF_SPACE_ID'),
    env('CTF_DELIVERY_KEY')
)   
