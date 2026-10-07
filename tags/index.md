---
title: Browse by tag
permalink: /tags/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<p>Tags are computed from whatever listings actually exist — click any to see matching listings on the home page.</p>

<ul class="tag-list">
{% assign empty_arr = "" | split: "," %}
{% assign all_tags = "" | split: "," %}
{% for listing in site.listings %}
  {% assign lt = listing.tags | default: empty_arr %}
  {% assign ls = listing.suitable_for | default: empty_arr %}
  {% assign all_tags = all_tags | concat: lt | concat: ls %}
{% endfor %}
{% assign unique_tags = all_tags | uniq | sort %}
{% for tag in unique_tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag or listing.suitable_for contains tag %}
      {% assign count = count | plus: 1 %}
    {% endif %}
  {% endfor %}
<li><a href="{{ '/?tag=' | append: tag | relative_url }}">{{ tag }}</a> ({{ count }})</li>
{% endfor %}
</ul>
