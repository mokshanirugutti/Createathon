from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.IntegerField(null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    otp_purpose = models.CharField(max_length=50, null=True, blank=True)
    
    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()



class Challenge(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    difficulty = models.CharField(
        max_length=20,
        choices=[('beginner', 'Beginner'),
                 ('intermediate', 'Intermediate'),
                 ('advanced', 'Advanced')]
    )
    points = models.IntegerField()
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    test_cases = models.JSONField(default=list)  # Storing test cases as JSON
    created_at = models.DateTimeField(auto_now_add=True)
    
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.name
    
    

class UserProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[('started', 'Started'),
                 ('submitted', 'Submitted'),
                 ('completed', 'Completed')]
    )
    attempts = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE)
    code = models.TextField()
    result = models.JSONField(default=dict)  # Stores execution results
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'),
                 ('failed', 'Failed'),
                 ('passed', 'Passed')]
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
