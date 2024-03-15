import random

from django.http import HttpRequest
from django.http import JsonResponse
from django.middleware.csrf import get_token


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status


from flashcards.models import Deck, FlashCard
from flashcards.serialisers import FlashCardSerialiser, DeckSerialiser

from users.serialisers import UserRegisterSerialiser, UserSerialiser

class Index(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request):
        return Response({"Status": "API online"}, status=status.HTTP_200_OK)


class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request: HttpRequest) -> Response:
        """
        API index endpoint, check whether it is online.

        Args:
            request (HttpRequest): Nothing.

        Returns:
            Response: Response containing JSON with key "status".
        """
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token})


class User(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        serialiser = UserSerialiser(request.user)
        return Response({"user": serialiser.data}, status=status.HTTP_200_OK)
    


# Deck views
class GetDecks(APIView):
    permission_classes = (permissions.AllowAny,)
    
    def get(self, request):
        decks = Deck.objects.all()
        serializer = DeckSerialiser(decks, many=True)
        return Response({"decks": serializer.data}, status=status.HTTP_200_OK)

class GetDeck(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        deck_id: int = request.GET.get('deck_id', None)
        
        if not deck_id:
            return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        deck = Deck.objects.get(deck_id=deck_id)
        cards = FlashCard.objects.filter(deck=deck)
        serialised_cards = {}
        for card in cards:
            serialised_cards[card.card_id] = FlashCardSerialiser(card).data
            
        serialised_deck = {
            'name': deck.name,
            'course': deck.course.name,
            'cards': serialised_cards
        }
        
        return Response(serialised_deck, status=status.HTTP_200_OK)



# Card views
class CreateCard(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        card_id: int = request.data.get('card_id', None)
        deck_id: int = request.data.get('deck_id', None)
        question: str = request.data.get('question', None)
        answer: str = request.data.get('answer', None)
        
        if not deck_id:
            return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not Deck.objects.get(deck_id=deck_id):
            return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not question:
            return Response({"error": "question is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not answer:
            return Response({"error": "answer is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not FlashCard.objects.get(card_id=card_id):
            card = FlashCard(
                deck=Deck.objects.get(deck_id=deck_id),
                question=question,
                answer=answer,
            )
            card.save()
            
            return Response({"message": "Card created"}, status=status.HTTP_200_OK)

        else:
            card = FlashCard.objects.get(card_id=card_id)
            card.question = question
            card.answer = answer
        
            card.save()
        
            return Response({"message": "Card updated"}, status=status.HTTP_200_OK)

class GetCard(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        deck_id: int = request.GET.get('deck_id', None)
        
        if not deck_id:
            return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not Deck.objects.get(deck_id=deck_id):
            return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)
        
        cards = FlashCard.objects.filter(deck=deck_id)
        
        
        
        # calculate weights for each card
        weights = []
        for card in cards.iterator():
            weights.append(card.confidence)
        
        # select a card with weighted probability
        total_weight = sum(weights)
        r = random.uniform(0, total_weight)
        cum_weight = 0
        for i, w in enumerate(weights):
            cum_weight += w
            if r < cum_weight:
                card = cards[i]
                break
        else:
            card = cards[0]
        
        serializer = FlashCardSerialiser(card)
        return Response({"card": serializer.data}, status=status.HTTP_200_OK)
    


class UpdateCardConfidence(APIView):
    def post(self, request):
        card_id: int = request.data.get('card_id', None)
        confidence: int = request.data.get('confidence', None)
        
        if not card_id:
            return Response({"error": "card_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not confidence or confidence not in [FlashCard.Confidence.LOW, FlashCard.Confidence.MEDIUM, FlashCard.Confidence.HIGH]:
            return Response({"error": "confidence is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not FlashCard.objects.get(card_id=card_id):
            return Response({"error": "card not found"}, status=status.HTTP_404_NOT_FOUND)
        
        card = FlashCard.objects.get(card_id=card_id)
        card.confidence = confidence
        card.save()
        
        return Response({"message": "Card confidence updated"}, status=status.HTTP_200_OK)
    
        