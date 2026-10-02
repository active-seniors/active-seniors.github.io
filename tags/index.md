---
title: Browse by tag
permalink: /tags/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<ul>
{% for tag in site.data.tags %}
{% assign count = site.listings | where_exp: "item", "item.tags contains tag.slug or item.suitable_for contains tag.slug" | size %}
<li><a href="{{ '/tags/' | append: tag.slug | append: '/' | relative_url }}">{{ tag.label }}</a> ({{ count }})</li>
{% endfor %}
</ul>
