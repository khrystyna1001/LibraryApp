# Generated by Django 5.2.4 on 2025-07-11 04:08

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("authors", "0001_initial")
    ]

    operations = [
        migrations.CreateModel(
            name="Book",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("published_date", models.DateField()),
                ("is_available", models.BooleanField()),
                (
                    "author",
                    models.ManyToManyField(
                        related_name="books_written", to="authors.author"
                    ),
                ),
            ],
        ),
    ]
