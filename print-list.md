---
title: Your print list
permalink: /print-list/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<h2>Your print list</h2>

<p class="print-list-intro">Nothing here is saved beyond this browser tab — closing it clears the list. No account, no login, nothing sent anywhere; the list only ever exists on this device.</p>

<div class="print-list-actions">
  <button type="button" id="print-this-list">Print this list</button>
  <button type="button" id="clear-print-list">Clear list</button>
</div>

<p id="print-list-empty-message" hidden>Your print list is empty. Go back to <a href="{{ '/' | relative_url }}">all listings</a> and tap "Add to print list" on anything worth printing for someone.</p>

<div id="print-list-items">
{% for listing in site.listings %}
<article class="print-item" data-id="{{ listing.id }}" hidden>
  <h3>{{ listing.title }}</h3>
  <p class="print-item-meta">
    {{ listing.category }}
    {% if listing.location.parish %} · {{ listing.location.parish }}{% endif %}
  </p>

  <div class="print-item-rows">
    <p><strong>Cost:</strong>
      {% if listing.cost.amount == 0 %}Free
      {% elsif listing.cost.amount %}£{{ listing.cost.amount }}{% if listing.cost.currency and listing.cost.currency != "GBP" %} {{ listing.cost.currency }}{% endif %}
      {% elsif listing.cost.notes and listing.cost.notes != "" %}{{ listing.cost.notes }}
      {% else %}Not confirmed — ask the organiser
      {% endif %}
    </p>
    {% if listing.schedule %}
    <p><strong>When:</strong> {{ listing.schedule.frequency }}{% if listing.schedule.day %} on {{ listing.schedule.day }}{% endif %}{% if listing.schedule.time %} at {{ listing.schedule.time }}{% endif %}</p>
    {% endif %}
    <p><strong>Where:</strong>
      {% if listing.location.venue %}{{ listing.location.venue }}{% if listing.location.area_notes %} — {{ listing.location.area_notes }}{% endif %}
      {% else %}Not given — likely online or ask the organiser
      {% endif %}
    </p>
    {% if listing.accessibility and listing.accessibility.physical_intensity %}
    <p><strong>Physical intensity:</strong> {{ listing.accessibility.physical_intensity }}</p>
    {% endif %}
  </div>

  {% if listing.organiser %}
  <div class="print-item-organiser">
    <strong>To find out more:</strong>
    {% if listing.organiser.name %}<div>{{ listing.organiser.name }}</div>{% endif %}
    {% if listing.organiser.contact_phone and listing.organiser.contact_phone != "" %}<div>Phone: {{ listing.organiser.contact_phone }}</div>{% endif %}
    {% if listing.organiser.contact_email and listing.organiser.contact_email != "" %}<div>Email: {{ listing.organiser.contact_email }}</div>{% endif %}
    {% if listing.organiser.website and listing.organiser.website != "" %}<div>Website: {{ listing.organiser.website }}</div>{% endif %}
  </div>
  {% endif %}

  <button type="button" class="print-list-toggle" data-id="{{ listing.id }}" data-label-add="Add to print list" data-label-remove="Remove from this list">Remove from this list</button>
</article>
{% endfor %}
</div>

<script>
(function () {
  var items = document.querySelectorAll('.print-item');
  var emptyMessage = document.getElementById('print-list-empty-message');
  var actions = document.querySelector('.print-list-actions');

  function render() {
    var ids = window.PrintList ? window.PrintList.get() : [];
    var visible = 0;
    items.forEach(function (item) {
      var show = ids.indexOf(item.getAttribute('data-id')) !== -1;
      item.hidden = !show;
      if (show) visible++;
    });
    emptyMessage.hidden = visible !== 0;
    actions.hidden = visible === 0;
  }

  document.addEventListener('printlist:change', render);

  // print-list.js loads deferred, so it's guaranteed to have run — and
  // window.PrintList to exist — by the time DOMContentLoaded fires, even
  // though this inline script runs earlier, as soon as the parser reaches it.
  document.addEventListener('DOMContentLoaded', render);

  document.getElementById('print-this-list').addEventListener('click', function () {
    window.print();
  });
  document.getElementById('clear-print-list').addEventListener('click', function () {
    if (window.PrintList) { window.PrintList.clear(); }
  });
})();
</script>
