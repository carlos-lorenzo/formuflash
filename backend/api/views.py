import random
import io


from django.conf import settings

from django.core.mail import send_mail

from django.contrib.auth.tokens import PasswordResetTokenGenerator  
from django.contrib.sites.shortcuts import get_current_site 
from django.contrib.auth import get_user_model

from django.http import HttpRequest, FileResponse
from django.http import JsonResponse

from django.middleware.csrf import get_token


from django.utils.encoding import force_str, force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode  


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework.parsers import  MultiPartParser, FormParser

import pandas as pd

from flashcards.models import Deck, FlashCard, Course
from flashcards.serialisers import FlashCardSerialiser, DeckSerialiser, CourseSerialiser

from users.serialisers import UserRegisterSerialiser, UserSerialiser



account_activation_token = PasswordResetTokenGenerator()
password_reset_token = PasswordResetTokenGenerator()

class Index(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def get(self, request):
		return Response({"status": "API online"}, status=status.HTTP_200_OK)


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

class Activate(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def get(self, request, uidb64, token):
		User = get_user_model()
		try:
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = User.objects.get(user_id=uid)

		except(TypeError, ValueError, OverflowError, User.DoesNotExist):
			user = None
   
		if user is not None and account_activation_token.check_token(user, token):
			user.is_active = True
			user.save()
			return Response({"message": "Cuenta activada"}, status=status.HTTP_200_OK)
		else:
			return Response({"error": "Enlace de activación inválido"}, status=status.HTTP_400_BAD_REQUEST)


class Register(APIView):
	
	permission_classes = (permissions.AllowAny,)
	
	def post(self, request):
		serialiser = UserRegisterSerialiser(data=request.data)
		if serialiser.is_valid():
			user = serialiser.save()
			user.is_active = False
			user.save()
			
   
			current_site = get_current_site(request).domain.split(":")[0]
			
   			
			email_from: str = settings.EMAIL_HOST_USER
			email_to: str = [user.email]
			subject = 'Activate your account'
			token: str = account_activation_token.make_token(user)
			uidb64: str = urlsafe_base64_encode(force_bytes(user.user_id))
			# url = f'http://{current_site}/api/activate/{uidb64}/{token}/'
   
			url = f'http://{current_site}:3000/confirmation?type=activate&uidb64={uidb64}&token={token}'
			
			message = f"""
			<html lang="en" className="scroll-smooth">
				<head></head>
				<body>
					<p>Welcome {user.name}!<br/><br/>
					Please <a href="{url}">Verify</a> your account<br/>
					Free Flash
					</p>
				</body>
			</html>
			"""

			send_mail(subject, message, email_from, email_to, html_message=message)
   
	
			return Response(serialiser.data, status=status.HTTP_201_CREATED)
		return Response(serialiser.errors, status=status.HTTP_400_BAD_REQUEST)




class GetUser(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		serialiser = UserSerialiser(request.user)
		return Response({"user": serialiser.data}, status=status.HTTP_200_OK)


class Logout(APIView):
	def get(self, request):
		request.user.auth_token.delete()
		return Response(status=status.HTTP_200_OK)

class PasswordResetSender(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def post(self, request):
		User = get_user_model()
		email = request.data.get('email', None)
		if not email:
			return Response({"error": "Email not provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			user = User.objects.get(email=email)

		except User.DoesNotExist:
			return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
  
		current_site = get_current_site(request).domain.split(":")[0]

		email_from: str = settings.EMAIL_HOST_USER
		email_to: str = ["clorenzozuniga@gmail.com"] # [user.email]
  
		subject = 'Password Reset'
  
		token: str = password_reset_token.make_token(user)
		uidb64: str = urlsafe_base64_encode(force_bytes(user.user_id))
  
		url = f'http://{current_site}:3000/confirmation?type=reset-password&uidb64={uidb64}&token={token}'
  
		message = f"""
			<html lang="en" className="scroll-smooth">
				<head></head>
				<body>
					<p>Hi {user.name}<br/><br/>
				   	You can reset your password through this link: <a href="{url}">Reset Password</a><br/>
					Free Flash
					</p>
				</body>
			</html>
			"""

		send_mail(subject, message, email_from, email_to, html_message=message)
  
		return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)

class ResetPassword(APIView):
	permission_classes = (permissions.AllowAny,)
	
	def post(self, request):
		User = get_user_model()
		try:
			uidb64 = request.data.get('uidb64', None)
			token = request.data.get('token', None)
			uid = force_str(urlsafe_base64_decode(uidb64))
			user = User.objects.get(user_id=uid)
			
		except(User.DoesNotExist):
			return Response({"error": "Invalid user id"}, status=status.HTTP_400_BAD_REQUEST)
   
		if user is not None and password_reset_token.check_token(user, token):
			password = request.data.get('password', None)
			if not password:
				return Response({"error": "Password not provided"}, status=status.HTTP_400_BAD_REQUEST)
   
			user.set_password(password)
			user.save()

			return Response({"message": "Successful password reset"}, status=status.HTTP_200_OK)
		else:
			return Response({"error": "Invalid password reset token"}, status=status.HTTP_400_BAD_REQUEST)


# Course views
class GetUserCourses(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		user = request.user
		
		courses = Course.objects.filter(owner=user)

		serializer = CourseSerialiser(courses, many=True)

		if not courses:
			return Response({"message": "No courses found"}, status=status.HTTP_204_NO_CONTENT)
  
		return Response({"courses": serializer.data}, status=status.HTTP_200_OK)


class CreateCourse(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		name = request.data.get('name', None)
		user = request.user
		
		if not name:
			return Response({"error": "Course name is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		course = Course(name=name, owner=user)
		course.save()

		serialiser = CourseSerialiser(course)
		
		
		return Response({
	  			"message": "Course created",
				"course": serialiser.data
				}, status=status.HTTP_200_OK)


class DeleteCourse(APIView):
	def post(self, request):
		course_id: int = request.data.get('id', None)
		user = request.user

		if not course_id:
			return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not Course.objects.get(course_id=course_id):
			return Response({"error": "course not found"}, status=status.HTTP_404_NOT_FOUND)

		course = Course.objects.get(course_id=course_id)

		if course.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		course.delete()

		return Response({"message": "Course deleted"}, status=status.HTTP_200_OK)


class RenameCourse(APIView):
	def post(self, request):
		course_id: int = request.data.get('course_id', None)
		name: str = request.data.get('name', None)
		user = request.user

		if not course_id:
			return Response({"error": "course id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not name:
			return Response({"error": "New name not provided"}, status=status.HTTP_400_BAD_REQUEST)

		course = Course.objects.get(course_id=course_id)

		if course.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		course.name = name
		course.save()

		return Response({"message": "Course renamed",
						 "name": name}, status=status.HTTP_200_OK)


# Deck views
class GetUserDecks(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		
		user = request.user
		decks = Deck.objects.filter(owner=user)
		
		if not decks:
			return Response({"message": "No decks found"}, status=status.HTTP_204_NO_CONTENT)
  
  
		serializer = DeckSerialiser(decks, many=True)
		return Response({"decks": serializer.data}, status=status.HTTP_200_OK)

class GetCourseDecks(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		course_id: int = request.GET.get('course_id', None)
		user = request.user
		
		if not course_id:
			return Response({"error": "course_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			course = Course.objects.get(course_id=course_id)
		except Course.DoesNotExist:
			return Response({"error": "course does not exist"}, status=status.HTTP_400_BAD_REQUEST)
		
		decks = Deck.objects.filter(course=course)
		
		"""if not decks:
			return Response({"message": "No decks found"}, status=status.HTTP_204_NO_CONTENT)"""
		
		
		serializer = DeckSerialiser(decks, many=True)
		return Response({"decks": serializer.data}, status=status.HTTP_200_OK)


class CreateDeck(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		name = request.data.get('name', None)
		course_id = request.data.get('course_id', None)
		user = request.user
		
		if not name:
			return Response({"error": "Deck name is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not course_id:
			return Response({"error": "course is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		try:
			course = Course.objects.get(course_id=course_id)
   
		except Course.DoesNotExist:
			return Response({"error": "course does not exist"}, status=status.HTTP_400_BAD_REQUEST)
		
		deck = Deck.objects.create(name=name, owner=user, course=course)

		new_card = FlashCard.objects.create(
			deck=deck,
			question="",
			answer="",
			owner=user
		)

		deck.number_of_cards = 1
		deck.save()
		
		return Response({"message": "Deck created successfully"}, status=status.HTTP_201_CREATED)

	

class GetDeck(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		deck_id: int = request.GET.get('deck_id', None)
		user = request.user
		
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		deck = Deck.objects.get(deck_id=deck_id)
		
		if deck.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
		
		cards = FlashCard.objects.filter(deck=deck)
		serialised_cards = {}
		for card in cards:
			serialised_cards[card.card_id] = FlashCardSerialiser(card).data
			
		serialised_deck = {
			'deck_id': deck.deck_id,
			'name': deck.name,
			'course': deck.course.name,
			'course_id': deck.course.course_id,
			'cards': serialised_cards
		}
		
		return Response(serialised_deck, status=status.HTTP_200_OK)


class DeleteDeck(APIView):
	def post(self, request):
		deck_id: int = request.data.get('id', None)
		user = request.user

		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not Deck.objects.get(deck_id=deck_id):
			return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)

		deck = Deck.objects.get(deck_id=deck_id)

		if deck.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		deck.delete()

		return Response({"message": "Deck deleted"}, status=status.HTTP_200_OK)


class RenameDeck(APIView):
	def post(self, request):
		deck_id: int = request.data.get('deck_id', None)
		name: str = request.data.get('name', None)
		user = request.user

		if not deck_id:
			return Response({"error": "deck id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not name:
			return Response({"error": "New name not provided"}, status=status.HTTP_400_BAD_REQUEST)

		deck = Deck.objects.get(deck_id=deck_id)

		if deck.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		deck.name = name
		deck.save()

		return Response({"message": "Deck renamed",
						 "name": name}, status=status.HTTP_200_OK)


class ImportCardsFromCsv(APIView):
	parser_classes = (MultiPartParser, FormParser)
	
	def put(self, request):
		user = request.user
		deck_id = request.data.get('deck_id', None)	
	
		file = request.FILES["file"]
		
		if not file:
			return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
  
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not Deck.objects.get(deck_id=deck_id):
			return Response({"error": "Deck not found"}, status=status.HTTP_404_NOT_FOUND)

		deck = Deck.objects.get(deck_id=deck_id)
  
		if not deck.owner == user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		try:
			df = pd.read_csv(file)
			df.rename(columns={column: column.lower() for column in df.columns}, inplace=True)
   
			#If columns are missing return error
			if 'question' not in df.columns or 'answer' not in df.columns:
				return Response({"error": "Missing columns"}, status=status.HTTP_400_BAD_REQUEST)
			
			
			if len(df) == 0:
				return Response({"error": "No data in file"}, status=status.HTTP_400_BAD_REQUEST)

			if len(df) >= 1000:
				return Response({"error": "File too large"}, status=status.HTTP_400_BAD_REQUEST)

		
			objs = [
				FlashCard(deck=deck, question=row['question'], answer=row['answer'], owner=user)
				for index, row in df.iterrows()
			]
			created = FlashCard.objects.bulk_create(objs, batch_size=1000)
			
			# Save changes after creation
			FlashCard.objects.bulk_update(created, ["question", "answer", "deck"], batch_size=1000)

			deck.number_of_cards += len(created)
			deck.save()
  
			return Response({"message": "Cards imported"}, status=status.HTTP_200_OK)

		except Exception as e:
			
			return Response({"error": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST)

class DeckToCsv(APIView):
	def get(self, request):
		deck_id = request.GET.get('deck_id', None)
		
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not Deck.objects.get(deck_id=deck_id):
			return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)

		deck = Deck.objects.get(deck_id=deck_id)

		cards = FlashCard.objects.filter(deck=deck)

		# Save the cards to a pandas dataframe
		df = pd.DataFrame(
			list(
				cards.values("question", "answer")
			)
		)

		buffer = io.BytesIO()
		# Write the dataframe to a CSV file
		df.to_csv(buffer, index=False)
		buffer.seek(0) # Rewind the buffer to the beginning of the file

		return FileResponse(buffer, as_attachment=True, filename=f'{deck.name}.csv', content_type='text/csv')
  
# Card views
class UpdateCard(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		card_id: int = request.data.get('card_id', None)
		deck_id: int = request.data.get('deck_id', None)
		question: str = request.data.get('question', None)
		answer: str = request.data.get('answer', None)
		
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not Deck.objects.get(deck_id=deck_id):
			return Response({"error": "Deck not found"}, status=status.HTTP_404_NOT_FOUND)
		
		if not question:
			return Response({"error": "No question provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not answer:
			return Response({"error": "No answer provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		# Create card if it doesn't exist
		if not FlashCard.objects.get(card_id=card_id):
			return Response({"message": "Card not found"}, status=status.HTTP_404_NOT_FOUND)

		
		card = FlashCard.objects.get(card_id=card_id)
		
		if card.owner != request.user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
		
		card.question = question
		card.answer = answer
	
		card.save()
	
		return Response({"message": "Card updated"}, status=status.HTTP_202_ACCEPTED)


class CreateCard(APIView):
	def post(self, request):
		question = request.data.get('question', None)
		answer = request.data.get('answer', None)
		deck_id = request.data.get('deck_id', None)
		user = request.user

		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not Deck.objects.get(deck_id=deck_id):
			return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)

		if not question:
			return Response({"error": "question is required"}, status=status.HTTP_400_BAD_REQUEST)

		if not answer:
			return Response({"error": "answer is required"}, status=status.HTTP_400_BAD_REQUEST)

		card = FlashCard(question=question, answer=answer, deck_id=deck_id, owner=user)
		card.save()

		deck = Deck.objects.get(deck_id=deck_id)
		deck.number_of_cards += 1
		deck.save()
		
		serialiser = FlashCardSerialiser(card)

		return Response({"message": "Card created",
						 "card": serialiser.data}, status=status.HTTP_201_CREATED)

class GetCard(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def get(self, request):
		deck_id: int = request.GET.get('deck_id', None)
		user = request.user
		
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		deck = Deck.objects.get(deck_id=deck_id)
		
		if not deck:
			return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)
		
		if deck.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
		
		cards = FlashCard.objects.filter(deck=deck_id)
		
		
  
		# if last_card_id is set, remove it from possible cards to be selected
		if deck.last_seen_card_id and len(cards) > 1:
			cards = cards.exclude(card_id=deck.last_seen_card_id)
		
		# calculate weights for each card
		weights = []
		for card in cards.iterator():
			weights.append(4 - card.confidence)
		
  
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

		deck.last_seen_card_id = card.card_id
		deck.save()
		
		serializer = FlashCardSerialiser(card)
		return Response({"card": serializer.data}, status=status.HTTP_200_OK)

	

class ResetDeckConfidence(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		deck_id: int = request.data.get('deck_id', None)
		user = request.user
		
		if not deck_id:
			return Response({"error": "deck_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		deck = Deck.objects.get(deck_id=deck_id)
		
		if not deck:
			return Response({"error": "deck not found"}, status=status.HTTP_404_NOT_FOUND)
		
		if deck.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
		
		FlashCard.objects.filter(deck=deck_id).update(confidence=FlashCard.Confidence.NONE)

		deck.last_seen_card_id = None
		
		deck.save()
		
		return Response({"message": "Deck confidence reset"}, status=status.HTTP_200_OK)


class UpdateCardConfidence(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		card_id: int = request.data.get('card_id', None)
		confidence: int = request.data.get('confidence', None)
		user = request.user
		
		if not card_id:
			return Response({"error": "card_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not confidence or confidence not in [FlashCard.Confidence.LOW, FlashCard.Confidence.MEDIUM, FlashCard.Confidence.HIGH]:
			return Response({"error": "confidence is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not FlashCard.objects.get(card_id=card_id):
			return Response({"error": "card not found"}, status=status.HTTP_404_NOT_FOUND)
		
		
		card = FlashCard.objects.get(card_id=card_id)
		
		if card.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
		
		card.confidence = confidence
		card.save()
		
		return Response({"message": "Card confidence updated"}, status=status.HTTP_200_OK)
	
	
 
class DeleteCard(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		card_id: int = request.data.get('card_id', None)
  
		user = request.user
		
		if not card_id:
			return Response({"error": "card_id is required"}, status=status.HTTP_400_BAD_REQUEST)
		
  
		if not FlashCard.objects.get(card_id=card_id):
			return Response({"error": "card not found"}, status=status.HTTP_404_NOT_FOUND)
		
		card = FlashCard.objects.get(card_id=card_id)
		
		if card.owner != user:
			return Response({"error": "unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)

		if card.deck.number_of_cards <= 1:
			return Response({"error": "Why would you want an empty deck?"}, status=status.HTTP_400_BAD_REQUEST)
		
		card.delete()
  
		other_card = FlashCard.objects.filter(deck_id=card.deck_id).exclude(card_id=card_id).order_by('?').first()
		
		card.deck.number_of_cards -= 1
		card.deck.save()
		
		return Response({
					"message": "Card deleted", 
	 				"new_card_id": other_card.card_id
					}, 
				status=status.HTTP_200_OK)





# Profile views
class UpdateProfileInfo(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	
	def post(self, request):
		name: str = request.data.get('name', None)
		email: str = request.data.get('email', None)
		user = request.user
		
		if not name:
			return Response({"error": "No name provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not email:
			return Response({"error": "No email provided"}, status=status.HTTP_400_BAD_REQUEST)
		
		user.name = name
		user.email = email
		
		user.save()
		
		return Response({"message": "Profile updated",
						 "user": UserSerialiser(user).data
						}, status=status.HTTP_200_OK)
		
		
class ChangePassword(APIView):
	def post(self, request):
		
		current_password: str = request.data.get('current_password', None)
		new_password: str = request.data.get('new_password', None)
		confirm_password: str = request.data.get('confirm_password', None)
		user = request.user
		
		if not current_password:
			return Response({"error": "Current password is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not new_password:
			return Response({"error": "New password is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not confirm_password:
			return Response({"error": "Password confirmation is required"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not new_password == confirm_password:
			return Response({"error": "Passwords don't match"}, status=status.HTTP_400_BAD_REQUEST)
		
		if not user.check_password(current_password):
			return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)
		
		
		user.set_password(new_password)
		user.save()
		
		return Response({"message": "Password changed"}, status=status.HTTP_200_OK)