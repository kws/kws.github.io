---
title: "Django Tutorial: Authentication"
categories:
    - Python
    - Web
    - Django
---

This is a tutorial on how to use Django's built-in authentication system and how to create sign-in, sign-up, and sign-out views.

It builds on the standard [Django tutorial](https://docs.djangoproject.com/en/5.0/intro/tutorial01/) and assumes you have already completed it. I have done all the code for the tutorial in a [GitHub repository](...) and the examples in here are based on this version.

## Introduction

Django comes with a built-in authentication system that is easy to use and very flexible. It provides a way to manage users, groups, and permissions. It also provides a way to authenticate users and to create views for sign-in, sign-up, and sign-out.

The [django documentation on the topic][django-auth] is very good and I recommend you read it for a fuller picture, but in this tutorial I will hopefully explain how it all fits together.

If you haven't done so already, you should complete the [Django tutorial](https://docs.djangoproject.com/en/5.0/intro/tutorial01/) before starting this one, or alternatively you can checkout the code from my [GitHub repository][django-kws-tutorial] and start from there. In the repository I have created tags for each of the individual steps of the original tutorial so you can start from Step 7 if you want to code along, or check out the tutorial-authentication branch if you just want to see the final result.

## Step 1: Check that everything is working

I will you show you unix command line steps to get everything set up and running. If you are using Windows, you will need to adapt the commands accordingly. This all assumes you have git, python and pip installed. 

```bash
# Clone the repository
$ git clone https://github.com/kws/django-tutorial.git

# Change into the directory
$ cd django-tutorial

# Create a virtual environment
$ python -m venv venv

# Activate the virtual environment
$ source venv/bin/activate

# Install the requirements
$ pip install -r requirements.txt

# Run the migrations
$ python manage.py migrate

# Create a superuser
$ python manage.py createsuperuser

# Run the server
$ python manage.py runserver
```

You should now be able to see the tutorial polls app at [http://localhost:8000/polls/](http://localhost:8000/polls/) and the admin interface at [http://localhost:8000/admin/](http://localhost:8000/admin/). You should be able to log in to the admin interface with the superuser you created. However, for the first part of this, make sure you are not logged in. You can use the logout link in the admin interface to log out.

## Step 2: Restrict access to the polls application

The first thing we want to do is to restrict access to the polls application. We want to make it so that only logged in users can vote. We can do this by adding a `@login_required` decorator to the `vote` view in `polls/views.py`:

```python
# polls/views.py

from django.contrib.auth.decorators import login_required

[...]

@login_required
def vote(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    [...]

```

Assuming you have some polls set up (if not, you can create some in the admin interface), you can visit [http://localhost:8000/polls/](http://localhost:8000/polls/) and you should now see that you are redirected to the login page when you try to vote. As we haven't created a login page yet, you will see a 404 error. We will fix this in the next step. But you can test that the login_required decorator is working by logging in through admin and then trying to vote again.

## Step 3: Create a login view

In the example above we saw that attempting to access a page that requires login redirects us to the login page at `/accounts/login/`. This is a default URL that is provided by Django's authentication system. We can override this by creating our own login view and URL, and all this is explained in the [django documentation][django-auth]. However, django also provides a set of [default views][django-auth-views] for authentication that we can use, and this is what we will do.

From the [default views documentation][django-auth-views] we see that we only need to add one line to our site `urls.py` to include the default views:

```python
# mysite/urls.py

urlpatterns = [
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")), # Add the default authentication views
]
```

We still need to provide a template for the login view, and we can do this by creating a directory called `registration` in the top level `templates` directory and then creating a file called `login.html` in this directory. The contents of the file should be:

```html
{% raw %}
<form method="post">
    {% csrf_token %}
    {{ form }}
    <input type="submit" value="Login">
</form>
{% endraw %}
```

This is a very simple form that uses the `{{ form }}` template tag to render the form fields. This is provided by the default login view and we don't need to do anything else. If you visit [http://localhost:8000/accounts/login/](http://localhost:8000/accounts/login/) you should now see the login form.

 The `csrf_token` tag must be used to prevent [cross-site request forgery][csrf] attacks.

[django-kws-tutorial]: https://github.com/kws/django-tutorial/
[django-auth]: https://docs.djangoproject.com/en/5.0/topics/auth/default
[django-auth-views]: https://docs.djangoproject.com/en/5.0/topics/auth/default/#module-django.contrib.auth.views
[csrf]: https://docs.djangoproject.com/en/5.0/ref/csrf/
