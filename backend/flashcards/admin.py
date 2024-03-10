from django.contrib import admin

from .models import Course, Deck, FlashCard
# Register your models here.
admin.site.register(Course)
admin.site.register(Deck)
admin.site.register(FlashCard)