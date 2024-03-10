from rest_framework import serializers

from .models import FlashCard, Deck

class FlashCardSerialiser(serializers.ModelSerializer):
    class Meta:
        model = FlashCard
        fields = '__all__'
        
        
class DeckSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = '__all__'