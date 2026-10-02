---
title: Browse by tag
permalink: /tags/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<ul>
{% for tag in site.data.tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag.slug or listing.suitable_for contains tag.slug %}
      {% assign count = count | plus: 1 %}
    {% endif %}
  {% endfor %}
<li><a href="{{ '/tags/' | append: tag.slug | append: '/' | relative_url }}">{{ tag.label }}</a> ({{ count }})</li>
{% endfor %}
</ul>
