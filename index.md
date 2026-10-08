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
  <a class="tag-cloud-item tag-filter-link" href="{{ '/?tag=' | append: tag | relative_url }}" data-tag="{{ tag }}" style="font-size: {{ ratio | times: 0.5 | plus: 0.95 }}rem;">{{ tag }}</a>
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

{% assign intensity_levels = "none,low,moderate,high" | split: "," %}
<div class="filter-bar" id="intensity-filter">
  <strong>Showing activity levels:</strong>
  <span id="intensity-toggles">
    {% for level in intensity_levels %}
    {% assign level_count = 0 %}
    {% for listing in site.listings %}{% if listing.accessibility.physical_intensity == level %}{% assign level_count = level_count | plus: 1 %}{% endif %}{% endfor %}
    <label class="intensity-toggle"><input type="checkbox" class="intensity-checkbox" value="{{ level }}" checked> {{ level | capitalize }} ({{ level_count }})</label>
    {% endfor %}
    {% assign rated_count = 0 %}
    {% for listing in site.listings %}{% if listing.accessibility.physical_intensity %}{% assign rated_count = rated_count | plus: 1 %}{% endif %}{% endfor %}
    {% assign unrated_count = site.listings.size | minus: rated_count %}
    <label class="intensity-toggle"><input type="checkbox" class="intensity-checkbox" value="unrated" checked> Not yet rated ({{ unrated_count }})</label>
  </span>
  <button id="intensity-reset" type="button">Show all</button>
  <br><span class="meta">How physically demanding an activity is, from none (seated or sedentary) to high. Many listings haven't been rated yet — untick "Not yet rated" to see only rated ones.</span>
</div>

<div id="listings-container">
{% assign listings = site.listings | sort: "title" %}
{% for listing in listings %}
{% assign lt = listing.tags | default: empty_arr %}
{% assign ls = listing.suitable_for | default: empty_arr %}
{% assign listing_tags = lt | concat: ls | join: " " %}
<div class="listing-card" data-parish="{{ listing.location.parish }}" data-tags="{{ listing_tags }}" data-intensity="{{ listing.accessibility.physical_intensity | default: 'unrated' }}">
  {% if listing.source == "demo-data" %}
    <span class="demo-badge">Demo data</span>
  {% elsif listing.verification.verified_by and listing.verification.verified_by != "" %}
    <span class="verify-badge">Verified</span>
  {% else %}
    <span class="verify-badge">Not yet verified</span>
  {% endif %}
  <h3><a href="{{ listing.url | relative_url }}">{{ listing.title }}</a></h3>
  <p class="meta">
    {{ listing.category }}
    {% if listing.location.parish %} · {{ listing.location.parish }}{% endif %}
    ·
    {% if listing.cost.amount == 0 %}
      <span class="free-pill">Free</span>
    {% elsif listing.cost.amount %}
      £{{ listing.cost.amount }}
    {% else %}
      cost not confirmed
    {% endif %}
    {% if listing.accessibility.physical_intensity %} · {{ listing.accessibility.physical_intensity }} intensity{% endif %}
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
<p id="no-matches" hidden>No listings match the current filters — try switching more parishes or activity levels back on, or <a href="#" id="clear-tag-filter-2">clear the tag filter</a>.</p>

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

  // Activity level. Unlike parish, a listing with no rating is NOT always
  // shown: most listings are unrated, so that would make the filter useless.
  // "Not yet rated" is its own checkbox instead. A ?intensity=low,none URL
  // parameter pre-selects levels so other pages can link to a filtered view.
  var intensityBoxes = document.querySelectorAll('.intensity-checkbox');
  var intensityParam = new URLSearchParams(window.location.search).get('intensity');
  if (intensityParam) {
    var wanted = intensityParam.split(',');
    intensityBoxes.forEach(function (cb) { cb.checked = wanted.indexOf(cb.value) !== -1; });
  }

  function checkedValues(boxes) {
    return Array.prototype.filter.call(boxes, function (cb) { return cb.checked; })
      .map(function (cb) { return cb.value; });
  }

  function applyFilter() {
    var activeParishes = checkedValues(checkboxes);
    var activeIntensities = checkedValues(intensityBoxes);
    var visibleCount = 0;
    cards.forEach(function (card) {
      var parish = card.getAttribute('data-parish');
      // No parish on the listing = always shown; parish filtering only
      // applies to listings that actually have one.
      var parishOk = !parish || activeParishes.indexOf(parish) !== -1;
      var intensityOk = activeIntensities.indexOf(card.getAttribute('data-intensity') || 'unrated') !== -1;
      var show = parishOk && intensityOk && matchesTag(card);
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
  intensityBoxes.forEach(function (cb) { cb.addEventListener('change', applyFilter); });
  document.getElementById('intensity-reset').addEventListener('click', function () {
    intensityBoxes.forEach(function (cb) { cb.checked = true; });
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
