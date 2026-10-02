---
title: Home
---

## Browse by interest

<p class="tag-cloud">
{% assign max_count = 0 %}
{% for tag in site.data.tags %}
  {% assign c = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag.slug or listing.suitable_for contains tag.slug %}
      {% assign c = c | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% if c > max_count %}{% assign max_count = c %}{% endif %}
{% endfor %}
{% for tag in site.data.tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag.slug or listing.suitable_for contains tag.slug %}
      {% assign count = count | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% if count > 0 %}
    {% assign ratio = count | times: 1.0 | divided_by: max_count %}
    {% assign size = ratio | plus: 0.8 %}
    <a class="tag-cloud-item" href="{{ '/tags/' | append: tag.slug | append: '/' | relative_url }}" style="font-size: {{ size }}rem;">{{ tag.label }}</a>
  {% endif %}
{% endfor %}
</p>

## All listings

<div class="filter-bar">
  <strong>Showing parishes:</strong>
  <span id="parish-toggles">
    {% for parish in site.data.parishes %}
    <label class="parish-toggle"><input type="checkbox" class="parish-checkbox" value="{{ parish }}" checked> {{ parish }}</label>
    {% endfor %}
  </span>
  <button id="parish-reset" type="button">Show all</button>
</div>

<div id="listings-container">
{% assign listings = site.listings | sort: "title" %}
{% for listing in listings %}
<div class="listing-card" data-parish="{{ listing.location.parish }}">
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
</div>
<p id="no-matches" hidden>No listings in the selected parishes — try switching more back on.</p>

<script>
(function () {
  var checkboxes = document.querySelectorAll('.parish-checkbox');
  var cards = document.querySelectorAll('.listing-card');
  var noMatches = document.getElementById('no-matches');
  var resetBtn = document.getElementById('parish-reset');

  function applyFilter() {
    var active = Array.prototype.filter.call(checkboxes, function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });
    var visibleCount = 0;
    cards.forEach(function (card) {
      var show = active.indexOf(card.getAttribute('data-parish')) !== -1;
      card.hidden = !show;
      if (show) visibleCount++;
    });
    noMatches.hidden = visibleCount !== 0;
  }

  checkboxes.forEach(function (cb) { cb.addEventListener('change', applyFilter); });
  resetBtn.addEventListener('click', function () {
    checkboxes.forEach(function (cb) { cb.checked = true; });
    applyFilter();
  });
})();
</script>
