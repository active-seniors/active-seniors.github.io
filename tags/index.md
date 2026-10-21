---
title: Browse by tag
permalink: /tags/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<p>Interests (what kind of activity) and needs (what it accommodates) are two different things — see the home page's "What are your interests?"/"What are your needs?" sections. This page lists every possible value of each, including ones with no current listings; click any to see matching listings on the home page.</p>

{% assign activity_tags = "walking,swimming-water-sports,sport-fitness,dance,singing-music,arts-crafts,mindfulness-relaxation,nature-outdoors,cooking-food,learning-talks,social-clubs,volunteering,faith-community" | split: "," %}
{% assign need_tags = "beginners-welcome,dementia-friendly,carer-and-companion-welcome,online-option" | split: "," %}

<h2>Interests</h2>
<ul class="tag-list">
{% for tag in activity_tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag %}{% assign count = count | plus: 1 %}{% endif %}
  {% endfor %}
<li><a href="{{ '/?tag=' | append: tag | relative_url }}">{{ site.data.tag_labels[tag] | default: tag }}</a> ({{ count }})</li>
{% endfor %}
</ul>

<h2>Needs</h2>
<ul class="tag-list">
{% for need in need_tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.suitable_for contains need %}{% assign count = count | plus: 1 %}{% endif %}
  {% endfor %}
<li><a href="{{ '/?need=' | append: need | relative_url }}">{{ site.data.tag_labels[need] | default: need }}</a> ({{ count }})</li>
{% endfor %}
</ul>
