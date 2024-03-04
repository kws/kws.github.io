---
title: "Extending the Django Tutorial"
categories:
    - Python
    - Web
    - Django
---

This is a tutorial where I'm going to run through a few very useful "next steps" to the
[Django Tutorial](https://docs.djangoproject.com/en/5.0/intro/tutorial01/). The main purpose of this post
is actually to provide a baseline for a few other tutorials I have in mind, but there should be some helpful
information in here for anyone who has worked through the Django tutorial and wonder what to do next.

It builds on the standard Django Tutorial and assumes you have already completed it. I have done all the code for the tutorial in a [GitHub repository][django-kws-tutorial] and the examples in here are based on this version. You can
also find a working example of the code in this tutorial there in the [kws-extras][kws-extras] branch.
The [README](https://github.com/kws/django-tutorial/blob/main/README.md) file in the repository contains instructions on how to get started.

## Introduction

The Django Tutorial is a great way to get started with Django, but it only scratches the surface of what you can do with the framework. In this tutorial I will show you a few things you can do to extend the tutorial and make it more useful. Particulary how to add a site-wide style for your pages and how to create some sample data for your database, so that it's
easier to get started on developing new features.

You can follow the steps in this tutorial in your own project and in the few places where I will add something that depends on something added in the core tutorial, I will call this out and provide a link to the relevant part of the tutorial.

## Step 1: Configure for site-wide styles

In the core django tutorial, the steps touch on adding a stylesheet to one of the polls pages in [Step 6](https://docs.djangoproject.com/en/5.0/intro/tutorial06/). This is a good start, but it's a lot of hard work if you want to add a consistent style to all of your pages.

The tutorial also covered how to override the admin template by creating a site-wide template folder in [Step 7](https://docs.djangoproject.com/en/5.0/intro/tutorial07/). This step is required for what we are going to do next, so if you are not following the tutorial, then you will have to create a `templates` folder at the top-level of your project and also modify
your `settings.py` file to include this folder in the `DIRS` list of the `TEMPLATES` setting.

In the tutorial this looks like:

```python
# mysite/settings.py

TEMPLATES = [
    {
        ...
        'DIRS': [BASE_DIR / 'templates'],
        ...
    }
]
```

but the actual path to `settings.py` will depend on what names you used for your site when you first set up Django. See [Step 1](https://docs.djangoproject.com/en/5.0/intro/tutorial01/#creating-a-project) of the tutorial for more information on this.

You can read more about configuring the template folder in the [Step 7](https://docs.djangoproject.com/en/5.0/intro/tutorial07/#customizing-your-project-s-templates) of the tutorial.

We also need a global 'static' folder for our stylesheets and other static files. In the same way we add a top-level templates file to the `DIRS` list, we also need to add a top-level `static` folder to the `STATICFILES_DIRS` list in `settings.py`. You may not have `STATICFILES_DIRS` at all in your settings file, in which case you can just add it wherever you like. I tend to add it after the `STATIC_URL` setting, which is usually near the bottom of the file. My file now looks like this:

```python
# mysite/settings.py

[...]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

[...]
```

After having created this folder, my project structure looks like this:

```text
.
├── LICENSE
├── README.md
├── db.sqlite3
├── manage.py
├── mysite/
├── polls/
├── requirements.txt
├── static/
└── templates/
```

## Step 2: Create a global base template

Most sites will have a common layout for all their pages, and it's a good idea to create a base template that all other templates can inherit from. This is a good way to keep your site consistent and to make it easier to make changes to the layout of your site.

Create a file called `base.html` in the `templates` folder. This file will contain the common layout for all your pages. Here is an example of what it might look like:

```html
{% raw %}
<!-- templates/base.html -->
{% load static %}<!DOCTYPE html>
<html>
    <head>
        <title>{% block title %}My Site{% endblock %}</title>
        <link rel="stylesheet" href="{% static 'base.css' %}">
    </head>
    <body>{% block bodycontent %}{% endblock %}</body>
</html>
{% endraw %}
```

To learn more about the template language and how to use it, you can read the [Django documentation](https://docs.djangoproject.com/en/5.0/topics/templates/) and the [template language reference](https://docs.djangoproject.com/en/5.0/ref/templates/language/), but basically what we have done here is:

* Create a global template file
* Load the static template tag that helps us load static files like stylesheets and images with the correct URL
* Define a block for the title of the page. This can later be overridden in other templates.
* Define a block for the body content of the page. This is where the content of the page will go.

Normally a base template will be much more complex, and if you want to see a full example, have a look at the [base.html](https://github.com/django/django/blob/main/django/contrib/admin/templates/admin/base.html) for the Django admin interface.

## Step 3: Create a stylesheet

Now that we have a base template, we can create a stylesheet that will be used for all our pages. Create a file called `base.css` in the `static` folder. This file will contain the styles for all your pages. Here is an example of what it might look like:

```css
/* static/base.css */
body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}
```

This is a very simple example, but it should give you an idea of how to get started. You can add more styles to this file to make your site look the way you want.

## Step 4: Change the pages to use the base template

Now that we have a base template and a stylesheet, we can change the pages in our site to use the base template. We do this by changing the template files for the pages to inherit from the base template. We can do this by adding a line at the top of the template file that looks like this:

```html
{% raw %}
{% extends "base.html" %}
{% endraw %}
```

This line tells Django to use the `base.html` template as the base for the current template. We can then override the blocks in the base template to add content to the page. Here is an example of what the `index.html` file in the `polls/templates/polls` folder might look like after we have added the line:

```html
{% raw %}
<!-- polls/templates/polls/index.html -->
{% extends "base.html" %}

{% block bodycontent %}

{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}

{% endblock %}
{% endraw %}
```

Make the same changes to the other templates in the `polls/templates/polls` and play with the stylesheet or base template to see how it affects the pages.

## Step 5: Add a menu bar to the base template

A common feature of many websites is a sticky header that stays at the top of the page when you scroll. This is a good way to keep the navigation menu always visible, and it's a good way to make your site look more professional. We can add a sticky header to the base template by adding a few lines of CSS and HTML.

In the `base.html` file, add a `div` element at the top of the `body` element that contains the menu items. Here is an example of what it might look like:

```html
{% raw %}
<!-- templates/base.html -->

[...]
    <body>
        <div id="menubar"><a href="/">My Site</a></div>  
        {% block bodycontent %}{% endblock %}
    </body>
[...]
{% endraw %}
```

This adds a section to the page with a hyperlink to the "root" page of the site. We also want to style this so it looks a bit better. Add the following to the `base.css` file:

```css
/* static/base.css */

[...]

#menubar {
    position: -webkit-sticky; /* For Safari */
    position: sticky;
    top: 0;
    background-color: black;
    color: white;
    padding: 30px;
    font-size: 20px;
}

#menubar a { 
    color: white;
    text-decoration: none;
}
```

Now we have a simple menu bar at the top of the page, with the name of the site and a link to the root page. 

What is annoying though is that the root page doesn't exist. Why don't we have it redirect to the polls app?

Let's modify sitewide `urls.py` to include a redirect to the polls app. Modify the `mysite/urls.py` file to look like this:

```python
# mysite/urls.py

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView

urlpatterns = [
    path("", RedirectView.as_view(url="polls/", permanent=True)),
    path("polls/", include("polls.urls")),
    path("admin/", admin.site.urls),
]
```

Now when you visit the root page of the site, you should automatically be redirected to the polls app.

## Step 6: Add some sample data

When you are developing a new feature, it's often useful to have some sample data in your database to work with. This can help you to see how the feature will look and behave with real data, and it can help you to find bugs in your code. In the core tutorial, you created some sample data in the admin interface in [Step 3](https://docs.djangoproject.com/en/5.0/intro/tutorial03/). This is a good way to create sample data, but it's not very efficient if you have a lot of data to create, or if you want to create the same data every time you start your development server.

A better way to create sample data is to use a fixtures file. A fixtures file is a file that contains data in a format that Django can read and use to populate your database. You can create a fixtures file manually or by using the `dumpdata` management command to dump the data from your database into a file, and then you can use the `loaddata` management command to load the data from the file into your database.

In our case, we'll create a file manually so we can have a couple of polls and questions.
Let's start by creating a folder called fixtures inside the polls app, and add a file there
called sample-data.yaml. The contents of the file should look like this:

```yaml
# polls/fixtures/sample-data.yaml

- model: polls.question
  pk: 1
  fields:
    question_text: How are you?
    pub_date: 2024-03-03 12:00:00+00:00
- model: polls.choice
  pk: 1
  fields:
    question: 1
    choice_text: Good
    votes: 0
- model: polls.choice
  pk: 2
  fields:
    question: 1
    choice_text: Bad
    votes: 0
- model: polls.choice
  pk: 3
  fields:
    question: 1
    choice_text: Ugly
    votes: 0

- model: polls.question
  pk: 2
  fields:
    question_text: You've got to fight...
    pub_date: 2024-03-03 13:00:00+00:00
- model: polls.choice
  pk: 4
  fields:
    question: 2
    choice_text: For your right… to party!
    votes: 0
- model: polls.choice
  pk: 5
  fields:
    question: 2
    choice_text: The man
    votes: 0
- model: polls.choice
  pk: 6
  fields:
    question: 2
    choice_text: The urge to nap
    votes: 0
```

I chose to use the YAML format for the fixtures file, but you can also use JSON or XML. The YAML format is a bit more human-readable than the other formats, and it's easy to write by hand. You can read more about the fixtures format in the [Django documentation](https://docs.djangoproject.com/en/5.0/howto/initial-data/).

The downside of using yaml is that you need to install the `pyyaml` package to be able to use it. Let's add it to our requirements file:

```text
# requirements.txt
django>=5.0
PyYAML>=6.0
```

we can now install the package by running `pip install -r requirements.txt`.

Now that we have the fixtures file, we can load the data into our database by running the `loaddata` management command. We can do this by running the following command in the terminal:

```bash
$ python manage.py loaddata polls/fixtures/sample-data.yaml
```

You should see a message that says "Installed 8 object(s) from 1 fixture(s)" if everything went well. You can now visit the polls app and see the sample data.

## Conclusion

In this tutorial, we have extended the Django tutorial by adding a site-wide style for our pages and by creating some sample data for our database. We have also added a menu bar to the base template and changed the root page to redirect to the polls app. I hope you have found this tutorial helpful, and I hope you have learned something new. If you have any questions or comments, please feel free to leave them below.

The code for this tutorial can be found in my [GitHub repository][django-kws-tutorial] and the examples in here are based on this version. You can also find a working example of the code in this tutorial there in the [kws-extras][kws-extras] branch.

[django-kws-tutorial]: https://github.com/kws/django-tutorial/
[kws-extras]: https://github.com/kws/django-tutorial/tree/kws-extras
