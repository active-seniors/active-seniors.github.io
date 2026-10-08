---
title: Home
---

{% assign activity_tags = "walking,swimming-water-sports,sport-fitness,dance,singing-music,arts-crafts,mindfulness-relaxation,nature-outdoors,cooking-food,learning-talks,social-clubs,volunteering,faith-community" | split: "," %}
{% assign intensity_levels = "none,low,moderate,high" | split: "," %}

<div id="finder-wizard">
  <h2>Find something for you</h2>
  <p>Answer three quick questions and we'll show you activities that might suit — or skip straight to browsing everything.</p>
  <p><a href="#" id="finder-skip-all">Skip the questions — show me everything</a></p>

  <div class="wizard-step" id="wizard-step-0">
    <p class="wizard-progress">Question 1 of 3</p>
    <h3 tabindex="-1">What kind of thing interests you?</h3>
    <p class="wizard-hint">Pick whichever sounds most like you — you can change your mind later.</p>
    <div class="wizard-choices">
      {% for tag in activity_tags %}
      {% assign label = site.data.tag_labels[tag] | default: tag %}
      <button type="button" class="wizard-choice" data-field="tag" data-value="{{ tag }}">{{ label }}</button>
      {% endfor %}
    </div>
    <button type="button" class="wizard-skip-step">Not sure — show me everything</button>
  </div>

  <div class="wizard-step" id="wizard-step-1" hidden>
    <p class="wizard-progress">Question 2 of 3</p>
    <h3 tabindex="-1">How much should it ask of you, physically?</h3>
    <p class="wizard-hint">Just a starting point — you'll be able to change this afterwards.</p>
    <div class="wizard-choices">
      {% for level in intensity_levels %}
      {% case level %}
        {% when 'none' %}{% assign level_label = 'Seated or very gentle' %}
        {% when 'low' %}{% assign level_label = 'Gentle, low effort' %}
        {% when 'moderate' %}{% assign level_label = 'Moderate — some effort' %}
        {% when 'high' %}{% assign level_label = 'Energetic — a good workout' %}
      {% endcase %}
      <button type="button" class="wizard-choice" data-field="intensity" data-value="{{ level }}">{{ level_label }}</button>
      {% endfor %}
    </div>
    <div class="wizard-actions">
      <button type="button" class="wizard-back">&larr; Back</button>
      <button type="button" class="wizard-skip-step">Doesn't matter</button>
    </div>
  </div>

  <div class="wizard-step" id="wizard-step-2" hidden>
    <p class="wizard-progress">Question 3 of 3</p>
    <h3 tabindex="-1">Whereabouts in Guernsey?</h3>
    <p class="wizard-hint">Pick as many parishes as you like, or skip this to see activities across the whole island.</p>
    <div class="wizard-choices">
      {% for parish in site.data.parishes %}
      <button type="button" class="wizard-choice" data-field="parish" data-value="{{ parish }}" aria-pressed="false">{{ parish }}</button>
      {% endfor %}
    </div>
    <div class="wizard-actions">
      <button type="button" class="wizard-back">&larr; Back</button>
      <button type="button" class="wizard-continue">Show my matches</button>
    </div>
  </div>
</div>

<p id="finder-toggle"><a href="#" id="finder-toggle-link">Prefer to see everything at once instead?</a></p>

<div id="browse-panel" hidden>

<h2>Browse by interest</h2>

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

<h2>All listings</h2>

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
<div class="listing-card" data-parish="{{ listing.location.parish }}" data-tags="{{ listing_tags }}" data-intensity="{{ listing.accessibility.physical_intensity | default: 'unrated' }}" data-id="{{ listing.id }}">
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
  <button type="button" class="print-list-toggle" data-id="{{ listing.id }}">Add to print list</button>
</div>
{% else %}
<p>No listings yet — this directory is just getting started.</p>
{% endfor %}
</div>
<p id="no-matches" hidden>No listings match the current filters — try switching more parishes or activity levels back on, or <a href="#" id="clear-tag-filter-2">clear the tag filter</a>.</p>

</div>

<script>
(function () {
  var checkboxes = document.querySelectorAll('.parish-checkbox');
  var cards = document.querySelectorAll('.listing-card');
  var noMatches = document.getElementById('no-matches');
  var resetBtn = document.getElementById('parish-reset');
  var activeTagBanner = document.getElementById('active-tag-filter');
  var activeTagLabel = document.getElementById('active-tag-label');
  var urlParams = new URLSearchParams(window.location.search);

  var activeTag = urlParams.get('tag');
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
  var intensityParam = urlParams.get('intensity');
  if (intensityParam) {
    var wanted = intensityParam.split(',');
    intensityBoxes.forEach(function (cb) { cb.checked = wanted.indexOf(cb.value) !== -1; });
  }

  // Parish, same pattern as intensity — a ?parish=Vale,Castel URL parameter
  // (built by the finder wizard below) pre-selects specific parishes.
  // Absent entirely = every parish checked, same as a fresh unfiltered visit.
  var parishParam = urlParams.get('parish');
  if (parishParam) {
    var wantedParishes = parishParam.split(',');
    checkboxes.forEach(function (cb) { cb.checked = wantedParishes.indexOf(cb.value) !== -1; });
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

<script>
/* Homepage finder — active-seniors.github.io#168. A structured, button-only
 * questionnaire: every answer comes from our own tag/intensity/parish
 * vocabulary, there is no free-text field anywhere. That's not just a
 * build-cost choice — it's a safety one. The open safeguarding item in
 * responsible-design-decisions.md ("chat-style search must not attempt to
 * handle health or crisis disclosures") only applies if there's a box to
 * type a disclosure into; a button grid has no such surface, so this
 * sidesteps that unsolved problem entirely rather than needing to solve it.
 *
 * The wizard never applies filters itself — it just builds the same
 * ?tag=&intensity=&parish= URL a shared link would use, and navigates.
 * That reuses 100% of the existing filter-reading logic above instead of
 * duplicating it, and means a finished search is a normal, bookmarkable,
 * shareable URL.
 */
(function () {
  var wizard = document.getElementById('finder-wizard');
  var browsePanel = document.getElementById('browse-panel');
  var toggleLink = document.getElementById('finder-toggle-link');
  var skipAllLink = document.getElementById('finder-skip-all');
  var steps = document.querySelectorAll('.wizard-step');
  var currentStep = 0;
  var state = { tag: null, intensity: null, parishes: [] };
  var VIEW_KEY = 'jig-finder-view';

  function getStoredView() {
    try { return localStorage.getItem(VIEW_KEY); } catch (e) { return null; }
  }
  function setStoredView(value) {
    try { localStorage.setItem(VIEW_KEY, value); } catch (e) { /* no persistence — view just won't be remembered next visit */ }
  }

  function showStep(index) {
    currentStep = index;
    steps.forEach(function (step, i) { step.hidden = i !== index; });
    var step = steps[index];
    step.querySelectorAll('.wizard-choice').forEach(function (btn) {
      var field = btn.getAttribute('data-field');
      var value = btn.getAttribute('data-value');
      var selected = field === 'parish' ? state.parishes.indexOf(value) !== -1 : state[field] === value;
      btn.classList.toggle('selected', selected);
      if (field === 'parish') { btn.setAttribute('aria-pressed', selected ? 'true' : 'false'); }
    });
    var heading = step.querySelector('h3');
    if (heading) { heading.focus(); }
  }

  function goToResults() {
    var params = new URLSearchParams();
    if (state.tag) { params.set('tag', state.tag); }
    if (state.intensity) { params.set('intensity', state.intensity + ',unrated'); }
    if (state.parishes.length) { params.set('parish', state.parishes.join(',')); }
    params.set('view', 'panel');
    window.location.href = "{{ '/' | relative_url }}?" + params.toString();
  }

  function showPanel() {
    wizard.hidden = true;
    browsePanel.hidden = false;
    toggleLink.textContent = 'Prefer to answer a few quick questions instead?';
    toggleLink.setAttribute('data-mode', 'wizard');
    setStoredView('panel');
  }

  function showWizard() {
    browsePanel.hidden = true;
    wizard.hidden = false;
    toggleLink.textContent = 'Prefer to see everything at once instead?';
    toggleLink.setAttribute('data-mode', 'panel');
    showStep(0);
    setStoredView('wizard');
  }

  wizard.addEventListener('click', function (e) {
    var choice = e.target.closest('.wizard-choice');
    if (choice) {
      var field = choice.getAttribute('data-field');
      var value = choice.getAttribute('data-value');
      if (field === 'parish') {
        var idx = state.parishes.indexOf(value);
        if (idx === -1) { state.parishes.push(value); } else { state.parishes.splice(idx, 1); }
        showStep(currentStep);
        return;
      }
      state[field] = value;
      if (currentStep < steps.length - 1) { showStep(currentStep + 1); } else { goToResults(); }
      return;
    }
    if (e.target.closest('.wizard-skip-step')) {
      if (currentStep < steps.length - 1) { showStep(currentStep + 1); } else { goToResults(); }
      return;
    }
    if (e.target.closest('.wizard-continue')) { goToResults(); return; }
    if (e.target.closest('.wizard-back') && currentStep > 0) { showStep(currentStep - 1); return; }
  });

  skipAllLink.addEventListener('click', function (e) { e.preventDefault(); showPanel(); });

  toggleLink.addEventListener('click', function (e) {
    e.preventDefault();
    if (toggleLink.getAttribute('data-mode') === 'panel') { showPanel(); } else { showWizard(); }
  });

  // A shared/bookmarked filtered link (?tag=, ?intensity=, ?parish=) or an
  // explicit ?view=panel always opens straight to results, never the
  // wizard — someone who followed a specific link wants what it points to,
  // not three more questions first. Otherwise: remembered preference, or
  // the wizard as the default for a first/plain visit.
  var urlParams = new URLSearchParams(window.location.search);
  var hasFilterParams = urlParams.has('tag') || urlParams.has('intensity') || urlParams.has('parish');
  if (urlParams.get('view') === 'panel' || hasFilterParams) {
    showPanel();
  } else if (urlParams.get('view') === 'wizard') {
    showWizard();
  } else if (getStoredView() === 'panel') {
    showPanel();
  } else {
    showWizard();
  }
})();
</script>
