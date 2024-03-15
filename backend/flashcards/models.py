from django.db import models

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    
    def __str__(self) -> str:
        return self.name

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    
    def __str__(self)-> str:
        return self.name
    
class FlashCard(models.Model):
    class Confidence(models.IntegerChoices):
        NONE = 0
        LOW = 1
        MEDIUM = 2
        HIGH = 3
    
    card_id = models.AutoField(primary_key=True)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    confidence = models.IntegerField(choices=Confidence.choices, default=Confidence.NONE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.question