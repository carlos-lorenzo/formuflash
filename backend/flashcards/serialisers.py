from rest_framework import serializers

from .models import FlashCard, Deck, Course

class FlashCardSerialiser(serializers.ModelSerializer):
    class Meta:
        model = FlashCard
        fields = '__all__'
        
        
class DeckSerialiser(serializers.ModelSerializer):
    stats = serializers.DictField()
    class Meta:
        model = Deck
        fields = '__all__'
        
        

class CourseSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
        
        
