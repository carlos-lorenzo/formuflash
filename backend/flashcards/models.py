from django.db import models

class Course(models.Model):
    course_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE, null=True)
    def __str__(self) -> str:
        return self.name

class Deck(models.Model):
    deck_id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE, null=True)
    last_seen_card_id = models.IntegerField(null=True, blank=True)
    number_of_cards = models.IntegerField(default=0)
    
    @property
    def cards(self) -> models.QuerySet:
        return FlashCard.objects.filter(deck=self)
    
    @property
    def stats(self) -> dict[str, float | int]:
        MAX_CONFIDENCE = 3
        confidence_sum = (FlashCard.objects.filter(deck=self).aggregate(models.Sum('confidence'))).get("confidence__sum", 0)
        
        completion = (confidence_sum / (self.number_of_cards * MAX_CONFIDENCE)) * 100 # (Obtained confidence / max confidence sum) * 100
        
        confidence_index = confidence_sum / self.number_of_cards
        if confidence_index < 1:
            confidence_index = 1
        confidence = FlashCard.Confidence.choices[int(confidence_index)]
        
        
        return {
            "completion": round(completion, 0),
            "confidence": confidence[0]     
        }
    
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
    question = models.TextField()
    answer = models.TextField()
    confidence = models.IntegerField(choices=Confidence.choices, default=Confidence.NONE)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey("users.User", on_delete=models.CASCADE, null=True)
    
    def __str__(self) -> str:
        return self.question