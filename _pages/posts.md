---
permalink: /posts/
layout: archive
title: "Blog Posts"
---

{% for post in site.posts %}
  {% include archive-single.html %}
{% endfor %}
