---
title: Home
---

{% assign activity_tags = "walking,swimming-water-sports,sport-fitness,dance,singing-music,arts-crafts,mindfulness-relaxation,nature-outdoors,cooking-food,learning-talks,social-clubs,volunteering,faith-community" | split: "," %}
{% assign need_tags = "beginners-welcome,dementia-friendly,carer-and-companion-welcome,online-option" | split: "," %}
{% assign intensity_levels = "none,low,moderate,high" | split: "," %}
{% assign empty_arr = "" | split: "," %}

<div id="finder-wizard">
  <h2>Find something for you</h2>
  <p>Answer a few quick questions and we'll show you what might suit you.</p>

  <div class="wizard-step" id="wizard-step-0">
    <p class="wizard-progress">Question 1 of 4</p>
    <h3 tabindex="-1">What kind of thing interests you?</h3>
    <p class="wizard-hint">Pick as many as apply, or skip if none do.</p>
    <div class="wizard-choices">
      {% for tag in activity_tags %}
      {% assign label = site.data.tag_labels[tag] | default: tag %}
      <button type="button" class="wizard-choice" data-field="tag" data-value="{{ tag }}" aria-pressed="false">{{ label }}</button>
      {% endfor %}
    </div>
    <div class="wizard-actions">
      <button type="button" class="wizard-skip-step">Not sure? Skip this question</button>
      <button type="button" class="wizard-continue">Continue</button>
    </div>
  </div>

  <div class="wizard-step" id="wizard-step-1" hidden>
    <p class="wizard-progress">Question 2 of 4</p>
    <h3 tabindex="-1">What are your needs?</h3>
    <p class="wizard-hint">Pick as many as apply, or skip if none do.</p>
    <div class="wizard-choices">
      {% for need in need_tags %}
      {% assign need_label = site.data.tag_labels[need] | default: need %}
      <button type="button" class="wizard-choice" data-field="need" data-value="{{ need }}" aria-pressed="false">{{ need_label }}</button>
      {% endfor %}
    </div>
    <div class="wizard-actions">
      <button type="button" class="wizard-back">&larr; Back</button>
      <button type="button" class="wizard-continue">Continue</button>
    </div>
  </div>

  <div class="wizard-step" id="wizard-step-2" hidden>
    <p class="wizard-progress">Question 3 of 4</p>
    <h3 tabindex="-1">How much should it ask of you, physically?</h3>
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

  <div class="wizard-step" id="wizard-step-3" hidden>
    <p class="wizard-progress">Question 4 of 4</p>
    <h3 tabindex="-1">Whereabouts in Guernsey?</h3>
    <p class="wizard-hint">Pick as many as you like, or none for the whole island.</p>
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
  <p class="finder-helper">Helping someone else? You can <a href="{{ '/how-to-use/#professionals' | relative_url }}">add activities to a print list</a> and print them out together.</p>
</div>

<p id="finder-toggle"><a href="#" id="finder-toggle-link">Prefer to see everything at once?</a></p>

<div id="browse-panel" hidden>

<div id="your-answers" class="your-answers" hidden>
  <h2 tabindex="-1" id="your-answers-heading">Your matches</h2>
  <p id="your-answers-summary"></p>
  <p id="your-answers-count" class="your-answers-count"></p>
  <p class="your-answers-actions">
    <a href="{{ '/?view=wizard' | relative_url }}" class="your-answers-change">Change my answers</a>
    <a href="{{ '/?view=panel' | relative_url }}" id="your-answers-clear">Clear and see everything</a>
  </p>
</div>

<div id="best-match" class="best-match" hidden>
  <strong class="best-match-label">Our top pick for you</strong>
  <h3><a id="best-match-link" href="#"></a></h3>
  <p id="best-match-reason"></p>
  <button type="button" class="print-list-toggle" id="best-match-print-toggle">Add to print list</button>
</div>

<details id="interest-details" class="fold" open>
<summary><h2>What are your interests?</h2></summary>
{% include tag_cloud.html field="tags" url_prefix="/?tag=" param_name="tag" %}
</details>

<details id="needs-details" class="fold" open>
<summary><h2>What are your needs?</h2></summary>
{% include tag_cloud.html field="suitable_for" url_prefix="/?need=" param_name="need" %}
</details>

<h2 id="listings-heading">All listings</h2>

<details id="filter-details" class="fold" open>
<summary><strong>Adjust parishes and activity levels</strong></summary>

<div class="filter-bar">
  <strong>Parish</strong>
  <p class="tag-cloud">
    {% for parish in site.data.parishes %}
    <a class="tag-cloud-item tag-filter-link" href="{{ '/?parish=' | append: parish | url_encode | relative_url }}" data-tag="{{ parish }}" data-param="parish">{{ parish }}</a>
    {% endfor %}
  </p>
  <span class="meta">Pick one or more to narrow by parish, or leave none picked to show every parish. Listings with no parish given are always shown.</span>
</div>

<div class="filter-bar" id="intensity-filter">
  <strong>Activity level</strong>
  <p class="tag-cloud">
    {% for level in intensity_levels %}
    {% assign level_count = 0 %}
    {% for listing in site.listings %}{% if listing.accessibility.physical_intensity == level %}{% assign level_count = level_count | plus: 1 %}{% endif %}{% endfor %}
    <a class="tag-cloud-item tag-filter-link" href="{{ '/?intensity=' | append: level | relative_url }}" data-tag="{{ level }}" data-param="intensity">{{ level | capitalize }} ({{ level_count }})</a>
    {% endfor %}
    {% assign rated_count = 0 %}
    {% for listing in site.listings %}{% if listing.accessibility.physical_intensity %}{% assign rated_count = rated_count | plus: 1 %}{% endif %}{% endfor %}
    {% assign unrated_count = site.listings.size | minus: rated_count %}
    <a class="tag-cloud-item tag-filter-link" href="{{ '/?intensity=unrated' | relative_url }}" data-tag="unrated" data-param="intensity">Not yet rated ({{ unrated_count }})</a>
  </p>
  <span class="meta">How physically demanding an activity is, from none (seated or sedentary) to high. Many listings haven't been rated yet.</span>
</div>
</details>

<div id="listings-container">
{% assign listings = site.listings | sort: "title" %}
{% for listing in listings %}
{% assign lt = listing.tags | default: empty_arr %}
{% assign ls = listing.suitable_for | default: empty_arr %}
{% assign listing_tags = lt | join: " " %}
{% assign listing_needs = ls | join: " " %}
{% assign effective_verified_date = listing.verification.confirmed_by_organiser | default: listing.verification.verified_date | default: "" %}
{% assign review_due_str = listing.verification.review_due | default: "" %}
{% assign cost_confirmed = false %}
{% if listing.cost.amount or listing.cost.amount == 0 %}{% assign cost_confirmed = true %}{% endif %}
{% assign has_schedule = false %}
{% if listing.schedule %}{% assign has_schedule = true %}{% endif %}
{% assign has_venue = false %}
{% if listing.location.venue and listing.location.venue != "" %}{% assign has_venue = true %}{% endif %}
<div class="listing-card" data-parish="{{ listing.location.parish }}" data-tags="{{ listing_tags }}" data-needs="{{ listing_needs }}" data-intensity="{{ listing.accessibility.physical_intensity | default: 'unrated' }}" data-id="{{ listing.id }}" data-verified-date="{{ effective_verified_date }}" data-review-due="{{ review_due_str }}" data-cost-confirmed="{{ cost_confirmed }}" data-has-schedule="{{ has_schedule }}" data-has-venue="{{ has_venue }}">
  {% if listing.source == "demo-data" %}
    <span class="demo-badge">Demo data</span>
  {% elsif listing.verification.verified_by and listing.verification.verified_by != "" %}
    <span class="verify-badge">Verified</span>
  {% elsif listing.verification.confirmed_by_organiser %}
    <span class="verify-badge verify-badge-confirmed">Confirmed by organiser</span>
  {% else %}
    <span class="verify-badge">Not yet verified</span>
  {% endif %}
  <h3><a href="{{ listing.url | relative_url }}">{{ listing.title }}</a></h3>
  <p class="meta">
    {{ listing.category }}
    {% if listing.location.parish %} · {{ listing.location.parish }}{% endif %}
    ·
    {% if listing.cost.amount == 0 and listing.cost.amount_max == nil %}
      <span class="free-pill">Free</span>
    {% elsif listing.cost.amount %}
      {% include price.html value=listing.cost.amount %}{% if listing.cost.amount_max %}–{% include price.html value=listing.cost.amount_max %}{% endif %}
    {% else %}
      cost not confirmed
    {% endif %}
    {% if listing.accessibility.physical_intensity %} · {{ listing.accessibility.physical_intensity }} intensity{% endif %}
  </p>
  {% if listing.tags or listing.suitable_for %}
  <p>
    {% for tag in listing.tags %}<a class="tag tag-filter-link" href="{{ '/?tag=' | append: tag | relative_url }}" data-tag="{{ tag }}" data-param="tag">{{ site.data.tag_labels[tag] | default: tag }}</a>{% endfor %}
    {% for need in listing.suitable_for %}<a class="tag tag-filter-link" href="{{ '/?need=' | append: need | relative_url }}" data-tag="{{ need }}" data-param="need">{{ site.data.tag_labels[need] | default: need }}</a>{% endfor %}
  </p>
  {% endif %}
  <button type="button" class="print-list-toggle" data-id="{{ listing.id }}">Add to print list</button>
</div>
{% else %}
<p>No listings yet — this directory is just getting started.</p>
{% endfor %}
</div>
<p id="no-matches" hidden>No listings match the current filters — try removing one, or <a href="#" id="clear-tag-filter-2">clear all filters</a>.</p>

</div>

<script>
/* "Best match" callout — active-seniors.github.io orchestration#2 (phase 1:
 * deterministic half of the matching agent). Ranking and the reasoning
 * sentence are both plain logic over data already on the page — no API
 * call, no model, nothing that can hallucinate a match that isn't real.
 * Picks the best-documented listing among whatever the filters already
 * narrowed down to (verified status and how much detail is filled in),
 * and explains the pick using exactly the criteria the visitor actually
 * set — never shown over the full, unfiltered directory, where "best
 * match" among hundreds of unrelated listings would mean nothing.
 *
 * A per-listing AI-written "why it's worth a look" blurb (the other half
 * of what was scoped for orchestration#2) is a deliberate follow-up, not
 * done here — it needs its own cost/data-storage decision (a batch
 * script, like the discovery scraper, not a live per-request API call —
 * this is a static site with no backend to hold a key), so it's being
 * kept separate rather than bundled into this change.
 */
var TAG_LABELS = {{ site.data.tag_labels | jsonify }};
var INTENSITY_LABELS = {
  none: 'seated or very gentle',
  low: 'gentle, low effort',
  moderate: 'moderate effort',
  high: 'energetic, a good workout'
};

/* Verification freshness — shared by the listing order below and the
 * matching-agent scoring in computeBestMatch. A listing that's been
 * verified or organiser-confirmed stays "fresh" until its explicit
 * review_due date passes, or — true of effectively every listing today,
 * since review_due isn't populated by anything yet (see
 * active-seniors.github.io#171 / orchestration#3) — until
 * STALE_AFTER_DAYS have passed since the verification/confirmation date
 * itself. 90 days matches the ~3-month review cadence already named as
 * the intended default in planning/listing-frontmatter-schema.md, just
 * not yet automated.
 */
var STALE_AFTER_DAYS = 90;

function classifyVerification(card) {
  var dateStr = card.getAttribute('data-verified-date');
  if (!dateStr) { return { bucket: 2, date: null }; } // never verified or confirmed
  var date = new Date(dateStr + 'T00:00:00');
  var reviewDueStr = card.getAttribute('data-review-due');
  var staleAfter = reviewDueStr
    ? new Date(reviewDueStr + 'T00:00:00')
    : new Date(date.getTime() + STALE_AFTER_DAYS * 86400000);
  var isStale = new Date() > staleAfter;
  return { bucket: isStale ? 1 : 0, date: date }; // 0 = fresh, 1 = stale
}

/* Listing order — active-seniors.github.io (verification weighting ask):
 * verified/confirmed first (most recently confirmed first, then
 * alphabetical), then stale verifications needing a recheck (same
 * ordering), then never-verified listings (alphabetical only, since
 * there's no date to rank by). A one-time layout order via CSS `order`,
 * not a DOM reorder — it doesn't depend on which filters are active, so
 * it only needs computing once, and hidden cards (display: none) ignore
 * their order value regardless.
 */
function applySortOrder(cards) {
  var ranked = Array.prototype.map.call(cards, function (card) {
    var v = classifyVerification(card);
    var titleEl = card.querySelector('h3 a');
    return { card: card, bucket: v.bucket, date: v.date, title: titleEl ? titleEl.textContent : '' };
  });
  ranked.sort(function (a, b) {
    if (a.bucket !== b.bucket) { return a.bucket - b.bucket; }
    if (a.date && b.date) {
      var diff = b.date - a.date; // most recently verified/confirmed first
      if (diff !== 0) { return diff; }
    }
    return a.title.localeCompare(b.title);
  });
  ranked.forEach(function (r, i) { r.card.style.order = i; });
}

function computeBestMatch(cards, filterState) {
  var el = document.getElementById('best-match');

  // Only meaningful when the visitor actually specified something —
  // picking a "top pick" out of the entire unfiltered directory isn't a
  // match, it's just whichever listing happens to be best-documented.
  var hasAny = filterState.tag.length || filterState.need.length || filterState.intensity.length || filterState.parish.length;
  if (!hasAny) {
    el.hidden = true;
    return;
  }

  var visible = Array.prototype.filter.call(cards, function (c) { return !c.hidden; });
  var best = null;
  var bestScore = -1;
  visible.forEach(function (card) {
    var score = 0;
    var v = classifyVerification(card);
    // Verification is the strongest signal by design: fresh verification
    // alone (+4) beats every completeness signal below even if all three
    // are present (max +3) — a verified listing always outranks an
    // unverified one, full stop. A stale-but-once-verified listing (+1)
    // still beats an equally-complete listing that's never been checked.
    if (v.bucket === 0) { score += 4; } else if (v.bucket === 1) { score += 1; }
    if (card.getAttribute('data-cost-confirmed') === 'true') score += 1;
    if (card.getAttribute('data-has-schedule') === 'true') score += 1;
    if (card.getAttribute('data-has-venue') === 'true') score += 1;
    if (score > bestScore) { bestScore = score; best = card; }
  });

  if (!best) {
    el.hidden = true;
    return;
  }

  var titleLink = best.querySelector('h3 a');
  var linkEl = document.getElementById('best-match-link');
  linkEl.setAttribute('href', titleLink.getAttribute('href'));
  linkEl.textContent = titleLink.textContent;

  // Same listing, same data-id — print-list.js's own delegated click
  // handler and its "every button for this id" refresh already keep this
  // button and the matching card's button in sync, no extra wiring needed
  // beyond pointing this one at the right id and asking for a refresh.
  var printBtn = document.getElementById('best-match-print-toggle');
  printBtn.setAttribute('data-id', best.getAttribute('data-id'));
  document.dispatchEvent(new CustomEvent('printlist:change'));

  var reasons = [];
  if (filterState.tag.length) {
    reasons.push(filterState.tag.map(function (t) { return TAG_LABELS[t] ? TAG_LABELS[t].toLowerCase() : t; }).join(' and '));
  }
  if (filterState.need.length) {
    reasons.push(filterState.need.map(function (n) { return TAG_LABELS[n] ? TAG_LABELS[n].toLowerCase() : n; }).join(' and '));
  }
  if (filterState.intensity.length) {
    var levelLabels = filterState.intensity
      .filter(function (l) { return INTENSITY_LABELS[l]; })
      .map(function (l) { return INTENSITY_LABELS[l]; });
    if (levelLabels.length) { reasons.push(levelLabels.join(' or ')); }
  }
  if (filterState.parish.length) {
    reasons.push('in ' + filterState.parish.join(' or '));
  }
  document.getElementById('best-match-reason').textContent = reasons.length
    ? "Matches what you're looking for: " + reasons.join(' · ')
    : "Matches what you're looking for.";

  el.hidden = false;
}

/* Shared filter engine for the homepage results — combined rework for
 * two reports that turned out to be the same root cause (planning#10 +
 * planning#11). Previously every dimension had a different interaction:
 * interest/need chips triggered a full page navigation per click (the
 * reported "jerky... page moves and refreshes" — every single pick
 * reloaded the whole page from scratch); parish/intensity were checkboxes
 * that filtered live but started with everything checked, so narrowing
 * meant unticking most of a 13-item list one at a time (the reported
 * "tedious" untick-to-narrow pattern, inconsistent with the positive
 * pick-to-narrow model interests/needs already used).
 *
 * One engine now drives all four dimensions, the wizard's final handoff,
 * and the browser's back/forward buttons: a single filterState object
 * (plain arrays, empty = show everything — the convention tags/needs
 * already used, parish/intensity now match it) that every chip click —
 * cloud, per-card, parish, intensity — toggles in place via applyFilter(),
 * with no navigation at all. The URL still stays in sync via pushState,
 * so results remain shareable/bookmarkable and the back button actually
 * undoes the last pick instead of doing nothing, without ever reloading
 * the page to get there.
 */
(function () {
  var cards = document.querySelectorAll('.listing-card');
  applySortOrder(cards);
  var noMatches = document.getElementById('no-matches');
  var answersBox = document.getElementById('your-answers');

  var filterState = { tag: [], need: [], parish: [], intensity: [] };

  function readStateFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    ['tag', 'need', 'parish', 'intensity'].forEach(function (key) {
      var v = urlParams.get(key);
      filterState[key] = v ? v.split(',') : [];
    });
  }

  function isAnswered() {
    return !!(filterState.tag.length || filterState.need.length || filterState.parish.length || filterState.intensity.length);
  }

  // Interests (tags) — a listing matches if it carries *any* of the
  // selected interests; picking more than one widens the results rather
  // than narrowing to listings that match every one.
  function matchesTag(card) {
    if (!filterState.tag.length) return true;
    var tags = (card.getAttribute('data-tags') || '').split(' ');
    return filterState.tag.some(function (t) { return tags.indexOf(t) !== -1; });
  }

  // Needs — a second, separate dimension from interests: what the
  // activity accommodates (dementia-friendly, carers welcome...) rather
  // than what kind of thing it is. Same OR-matched pattern. See
  // planning/landing-page-ux.md.
  function matchesNeeds(card) {
    if (!filterState.need.length) return true;
    var needs = (card.getAttribute('data-needs') || '').split(' ');
    return filterState.need.some(function (n) { return needs.indexOf(n) !== -1; });
  }

  function matchesParish(card) {
    if (!filterState.parish.length) return true;
    var parish = card.getAttribute('data-parish');
    // No parish on the listing = always shown; parish filtering only
    // applies to listings that actually have one.
    return !parish || filterState.parish.indexOf(parish) !== -1;
  }

  // Activity level. Unlike parish, a listing with no rating doesn't get a
  // free pass when intensity is filtered — most listings are unrated, so
  // that would make the filter useless. "Not yet rated" is its own
  // pickable chip (value "unrated") instead.
  function matchesIntensity(card) {
    if (!filterState.intensity.length) return true;
    return filterState.intensity.indexOf(card.getAttribute('data-intensity') || 'unrated') !== -1;
  }

  // Marks every chip across all four dimensions — tag cloud, need cloud,
  // parish, intensity, and each card's own tag/need chips — as selected
  // or not, from filterState. Same visual language as the wizard's own
  // .selected buttons.
  function syncSelectedChips() {
    document.querySelectorAll('.tag-filter-link').forEach(function (link) {
      var param = link.getAttribute('data-param');
      var value = link.getAttribute('data-tag');
      var active = filterState[param] ? filterState[param].indexOf(value) !== -1 : false;
      link.classList.toggle('selected', active);
      link.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  // Omits a dimension from the URL entirely when nothing's picked for it
  // (the "absent = show everything" convention), rather than ever writing
  // out a full "everything selected" list. Always pushState, never called
  // for the initial load pass (see skipUrlSync below) — only genuine user
  // picks should create a history entry or touch the address bar.
  function syncUrl() {
    var params = new URLSearchParams();
    ['tag', 'need', 'parish', 'intensity'].forEach(function (key) {
      if (filterState[key].length) { params.set(key, filterState[key].join(',')); }
    });
    params.set('view', 'panel');
    var newUrl = window.location.pathname + '?' + params.toString();
    history.pushState(null, '', newUrl);
  }

  function updateAnswers(count) {
    var answered = isAnswered();
    answersBox.hidden = !answered;
    if (!answered) { return; }
    var parts = [];
    if (filterState.tag.length) { parts.push(filterState.tag.map(function (t) { return TAG_LABELS[t] || t; }).join(', ')); }
    if (filterState.need.length) { parts.push(filterState.need.map(function (n) { return TAG_LABELS[n] || n; }).join(', ')); }
    var ratedLevels = filterState.intensity.filter(function (l) { return INTENSITY_LABELS[l]; });
    if (ratedLevels.length) {
      parts.push(ratedLevels.map(function (lvl) { return INTENSITY_LABELS[lvl].charAt(0).toUpperCase() + INTENSITY_LABELS[lvl].slice(1); }).join(', '));
    }
    if (filterState.parish.length) { parts.push('In ' + filterState.parish.join(', ')); }
    document.getElementById('your-answers-summary').textContent = parts.length ? 'You asked for: ' + parts.join(' · ') : '';
    document.getElementById('your-answers-count').textContent = count === 1 ? '1 activity matches.' : count + ' activities match.';
    document.getElementById('listings-heading').textContent = 'All your matches';
  }

  function applyFilter(options) {
    options = options || {};
    var visibleCount = 0;
    cards.forEach(function (card) {
      var show = matchesParish(card) && matchesIntensity(card) && matchesTag(card) && matchesNeeds(card);
      card.hidden = !show;
      if (show) visibleCount++;
    });
    noMatches.hidden = visibleCount !== 0;
    syncSelectedChips();
    if (!options.skipUrlSync) { syncUrl(); }
    computeBestMatch(cards, filterState);
    updateAnswers(visibleCount);
  }

  function toggleFilter(param, value) {
    if (!filterState.hasOwnProperty(param)) { return; }
    var arr = filterState[param];
    var idx = arr.indexOf(value);
    if (idx === -1) { arr.push(value); } else { arr.splice(idx, 1); }
    applyFilter();
  }

  function clearAll() {
    filterState.tag = [];
    filterState.need = [];
    filterState.parish = [];
    filterState.intensity = [];
    applyFilter();
  }

  // One delegated handler covers every chip in all four dimensions —
  // tag cloud, need cloud, parish, intensity, and each card's own tag/
  // need chips — since they all share this one class and read their
  // dimension + value from data attributes. No reload, ever.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('.tag-filter-link');
    if (!link) { return; }
    var param = link.getAttribute('data-param');
    var value = link.getAttribute('data-tag');
    if (!param || !value) { return; } // malformed — fall through to the plain href
    e.preventDefault();
    toggleFilter(param, value);
  });

  var clearLink2 = document.getElementById('clear-tag-filter-2');
  if (clearLink2) {
    clearLink2.addEventListener('click', function (e) { e.preventDefault(); clearAll(); });
  }
  var clearAllLink = document.getElementById('your-answers-clear');
  if (clearAllLink) {
    clearAllLink.addEventListener('click', function (e) { e.preventDefault(); clearAll(); });
  }

  // Back/forward support — pushState means the address bar can change
  // without the page reloading, so the browser's own back button needs
  // this listener to actually update what's on screen to match.
  window.addEventListener('popstate', function () {
    readStateFromUrl();
    applyFilter({ skipUrlSync: true });
  });

  // skipUrlSync here too — this runs on every load regardless of whether
  // the wizard or the panel ends up visible (the wizard script below
  // decides that afterwards), so it must only ever read the URL, never
  // write it. Writing it unconditionally here previously meant visiting
  // the plain homepage once left the address bar on ?view=panel, so a
  // second visit skipped the wizard entirely — found testing this rework,
  // not a pre-existing bug.
  readStateFromUrl();
  applyFilter({ skipUrlSync: true });

  // One-time, on load only: if we arrived with filters already set (a
  // shared link, or ?view=panel from the wizard before this ran), hide
  // the wizard-toggle line and bring the summary into view. Deliberately
  // not repeated on every live click — the visitor is already looking at
  // the chip they just picked, scrolling the page out from under them on
  // every pick would be its own kind of jarring.
  if (isAnswered()) {
    var toggleP = document.getElementById('finder-toggle');
    if (toggleP) { toggleP.hidden = true; }
    document.addEventListener('DOMContentLoaded', function () {
      var heading = document.getElementById('your-answers-heading');
      if (heading) { heading.focus({ preventScroll: true }); }
      if (answersBox.scrollIntoView) { answersBox.scrollIntoView({ block: 'start' }); }
    });
  }

  // Bridge for the wizard script below — hands its picks straight to this
  // same engine in place of navigating to a fresh ?tag=... URL and
  // reloading to get there. showPanel() (in the wizard script) makes the
  // panel visible first; this applies the filters and does the same
  // "just arrived with answers" focus/scroll the branch above does for a
  // page load.
  window.JIGShowResults = function (wizardState) {
    filterState.tag = wizardState.tags.slice();
    filterState.need = wizardState.needs.slice();
    filterState.parish = wizardState.parishes.slice();
    filterState.intensity = wizardState.intensity ? [wizardState.intensity, 'unrated'] : [];
    applyFilter();
    var toggleP = document.getElementById('finder-toggle');
    if (toggleP) { toggleP.hidden = true; }
    var heading = document.getElementById('your-answers-heading');
    if (heading) { heading.focus({ preventScroll: true }); }
    if (answersBox.scrollIntoView) { answersBox.scrollIntoView({ block: 'start' }); }
  };
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
 * The wizard hands its final picks to window.JIGShowResults (defined in
 * the script above) instead of navigating to a fresh ?tag=&intensity=&
 * parish= URL — that's what it did originally, and shareable/bookmarkable
 * URLs still work exactly the same way via pushState, just without the
 * reload that used to happen to get there (planning#10/#11).
 */
(function () {
  var wizard = document.getElementById('finder-wizard');
  var browsePanel = document.getElementById('browse-panel');
  var toggleLink = document.getElementById('finder-toggle-link');
  var skipAllLink = document.getElementById('finder-skip-all');
  var steps = document.querySelectorAll('.wizard-step');
  var currentStep = 0;
  // tags, needs and parishes are all multi-select (pick as many as
  // apply); intensity is the only single-select question. MULTI_FIELDS
  // maps a multi-select data-field name to its array property on state,
  // so all three are handled by the same code below instead of one-off
  // special-casing each.
  var MULTI_FIELDS = { tag: 'tags', parish: 'parishes', need: 'needs' };
  var state = { tags: [], needs: [], intensity: null, parishes: [] };
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
      var multiKey = MULTI_FIELDS[field];
      var selected = multiKey ? state[multiKey].indexOf(value) !== -1 : state[field] === value;
      btn.classList.toggle('selected', selected);
      if (multiKey) { btn.setAttribute('aria-pressed', selected ? 'true' : 'false'); }
    });
    var heading = step.querySelector('h3');
    if (heading) { heading.focus(); }
  }

  function goToResults() {
    showPanel();
    if (window.JIGShowResults) {
      window.JIGShowResults(state);
    } else {
      // Fallback only — if the panel's own engine somehow isn't
      // available, still get the visitor to their results rather than a
      // dead button, same URL shape the old always-navigate version used.
      var params = new URLSearchParams();
      if (state.tags.length) { params.set('tag', state.tags.join(',')); }
      if (state.needs.length) { params.set('need', state.needs.join(',')); }
      if (state.intensity) { params.set('intensity', state.intensity + ',unrated'); }
      if (state.parishes.length) { params.set('parish', state.parishes.join(',')); }
      params.set('view', 'panel');
      window.location.href = "{{ '/' | relative_url }}?" + params.toString();
    }
  }

  function showPanel() {
    wizard.hidden = true;
    browsePanel.hidden = false;
    toggleLink.textContent = 'Not sure where to start? Answer a few quick questions';
    toggleLink.setAttribute('data-mode', 'wizard');
    setStoredView('panel');
  }

  function showWizard() {
    browsePanel.hidden = true;
    wizard.hidden = false;
    toggleLink.textContent = 'Prefer to see everything at once?';
    toggleLink.setAttribute('data-mode', 'panel');
    showStep(0);
    setStoredView('wizard');
  }

  wizard.addEventListener('click', function (e) {
    var choice = e.target.closest('.wizard-choice');
    if (choice) {
      var field = choice.getAttribute('data-field');
      var value = choice.getAttribute('data-value');
      var multiKey = MULTI_FIELDS[field];
      if (multiKey) {
        var arr = state[multiKey];
        var idx = arr.indexOf(value);
        if (idx === -1) { arr.push(value); } else { arr.splice(idx, 1); }
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
    if (e.target.closest('.wizard-continue')) {
      // Shared by the needs step's "Continue" (not the last step) and the
      // final parish step's "Show my matches" — advance unless this is
      // genuinely the last step, same rule as the single-choice and
      // skip-step branches above.
      if (currentStep < steps.length - 1) { showStep(currentStep + 1); } else { goToResults(); }
      return;
    }
    if (e.target.closest('.wizard-back') && currentStep > 0) { showStep(currentStep - 1); return; }
  });

  if (skipAllLink) { skipAllLink.addEventListener('click', function (e) { e.preventDefault(); showPanel(); }); }

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
  var hasFilterParams = urlParams.has('tag') || urlParams.has('need') || urlParams.has('intensity') || urlParams.has('parish');
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
