---
title: Home
---

## Browse by interest

<p class="tag-cloud">
{% assign empty_arr = "" | split: "," %}
{% assign all_tags = "" | split: "," %}
{% for listing in site.listings %}
  {% assign lt = listing.tags | default: empty_arr %}
  {% assign ls = listing.suitable_for | default: empty_arr %}
  {% assign all_tags = all_tags | concat: lt | concat: ls %}
{% endfor %}
{% assign unique_tags = all_tags | uniq | sort %}
{% assign max_count = 0 %}
{% for tag in unique_tags %}
  {% assign c = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag or listing.suitable_for contains tag %}
      {% assign c = c | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% if c > max_count %}{% assign max_count = c %}{% endif %}
{% endfor %}
{% for tag in unique_tags %}
  {% assign count = 0 %}
  {% for listing in site.listings %}
    {% if listing.tags contains tag or listing.suitable_for contains tag %}
      {% assign count = count | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% assign ratio = count | times: 1.0 | divided_by: max_count %}
  {% assign size = ratio | plus: 0.8 %}
  <a class="tag-cloud-item tag-filter-link" href="{{ '/?tag=' | append: tag | relative_url }}" data-tag="{{ tag }}" style="font-size: {{ size }}rem;">{{ tag }}</a>
{% endfor %}
</p>

## All listings

<p id="active-tag-filter" hidden>Filtered by tag: <strong id="active-tag-label"></strong> — <a href="{{ '/' | relative_url }}" id="clear-tag-filter">clear</a></p>

<div class="filter-bar">
  <strong>Showing parishes:</strong>
  <span id="parish-toggles">
    {% for parish in site.data.parishes %}
    <label class="parish-toggle"><input type="checkbox" class="parish-checkbox" value="{{ parish }}" checked> {{ parish }}</label>
    {% endfor %}
  </span>
  <button id="parish-reset" type="button">Show all</button>
  <br><span class="meta">Listings with no parish given are always shown — parish filtering only affects listings that have one.</span>
</div>

<div id="listings-container">
{% assign listings = site.listings | sort: "title" %}
{% for listing in listings %}
{% assign lt = listing.tags | default: empty_arr %}
{% assign ls = listing.suitable_for | default: empty_arr %}
{% assign listing_tags = lt | concat: ls | join: " " %}
<div class="listing-card" data-parish="{{ listing.location.parish }}" data-tags="{{ listing_tags }}">
  {% if listing.source == "demo-data" %}<span class="demo-badge">Demo data</span><br>{% endif %}
  <h3><a href="{{ listing.url | relative_url }}">{{ listing.title }}</a></h3>
  <p class="meta">
    {{ listing.category }}
    {% if listing.location.parish %} · {{ listing.location.parish }}{% endif %}
    {% if listing.cost.amount == 0 %} · Free{% endif %}
  </p>
  {% if listing.tags or listing.suitable_for %}
  <p>
    {% for tag in listing.tags %}<a class="tag" href="{{ '/?tag=' | append: tag | relative_url }}">{{ tag }}</a>{% endfor %}
    {% for tag in listing.suitable_for %}<a class="tag" href="{{ '/?tag=' | append: tag | relative_url }}">{{ tag }}</a>{% endfor %}
  </p>
  {% endif %}
</div>
{% else %}
<p>No listings yet — this directory is just getting started.</p>
{% endfor %}
</div>
<p id="no-matches" hidden>No listings match the current filters — try switching more parishes back on, or <a href="#" id="clear-tag-filter-2">clear the tag filter</a>.</p>

<script>
(function () {
  var checkboxes = document.querySelectorAll('.parish-checkbox');
  var cards = document.querySelectorAll('.listing-card');
  var noMatches = document.getElementById('no-matches');
  var resetBtn = document.getElementById('parish-reset');
  var activeTagBanner = document.getElementById('active-tag-filter');
  var activeTagLabel = document.getElementById('active-tag-label');

  var activeTag = new URLSearchParams(window.location.search).get('tag');
  if (activeTag) {
    activeTagBanner.hidden = false;
    activeTagLabel.textContent = activeTag;
  }

  function matchesTag(card) {
    if (!activeTag) return true;
    var tags = (card.getAttribute('data-tags') || '').split(' ');
    return tags.indexOf(activeTag) !== -1;
  }

  function applyFilter() {
    var activeParishes = Array.prototype.filter.call(checkboxes, function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });
    var visibleCount = 0;
    cards.forEach(function (card) {
      var parish = card.getAttribute('data-parish');
      // No parish on the listing = always shown; parish filtering only
      // applies to listings that actually have one.
      var parishOk = !parish || activeParishes.indexOf(parish) !== -1;
      var show = parishOk && matchesTag(card);
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
  var clearLink2 = document.getElementById('clear-tag-filter-2');
  if (clearLink2) {
    clearLink2.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = "{{ '/' | relative_url }}";
    });
  }

  applyFilter();
})();
</script>
