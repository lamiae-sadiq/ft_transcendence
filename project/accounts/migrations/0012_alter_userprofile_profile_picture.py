# Generated by Django 5.0.7 on 2024-08-01 11:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0011_alter_userprofile_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='profile_picture',
            field=models.ImageField(blank=True, default='images/poro1.jpg', null=True, upload_to='images/'),
        ),
    ]
