---
title: Home
---

## All listings

{% assign listings = site.listings | sort: "title" %}
{% for listing in listings %}
<div class="listing-card">
  <h3><a href="{{ listing.url | relative_url }}">{{ listing.title }}</a></h3>
  <p class="meta">
    {{ listing.category }}
    {% if listing.location.parish %} · {{ listing.location.parish }}{% endif %}
    {% if listing.cost.amount == 0 %} · Free{% endif %}
  </p>
  {% if listing.tags or listing.suitable_for %}
  <p>
    {% for tag in listing.tags %}<a class="tag" href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a>{% endfor %}
    {% for tag in listing.suitable_for %}<a class="tag" href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a>{% endfor %}
  </p>
  {% endif %}
</div>
{% else %}
<p>No listings yet — this directory is just getting started.</p>
{% endfor %}
