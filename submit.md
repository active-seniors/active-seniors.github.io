---
title: Submit a listing
permalink: /submit/
---

<p><a href="{{ '/' | relative_url }}">&larr; All listings</a></p>

<h2>Submit an activity, club, or volunteering opportunity</h2>
<p>Know of a group, class, or opportunity that should be listed? Fill in what you can below — you don't need a GitHub account. Every submission is checked by a person before it goes live, so it's fine if some fields are a guess or left blank.</p>

{% if site.submission_endpoint == "" or site.submission_endpoint == nil %}
<div class="notice">
  <strong>This form isn't live yet.</strong> The submission bridge hasn't been deployed — see
  <a href="https://github.com/active-seniors/orchestration/tree/main/submission">orchestration/submission</a>
  for setup. You can still fill the form in below to see how it works, but submitting won't do anything until a
  <code>submission_endpoint</code> is configured in <code>_config.yml</code>.
</div>
{% endif %}

<form id="submission-form" novalidate>
  <fieldset>
    <legend>The basics</legend>

    <label for="title">Name of the activity/group <span aria-hidden="true">*</span></label>
    <input type="text" id="title" name="title" required>

    <label for="description">Description <span aria-hidden="true">*</span></label>
    <textarea id="description" name="description" rows="4" required placeholder="What happens, who it's for, anything that helps someone decide if it's right for them."></textarea>

    <label for="category">Category <span aria-hidden="true">*</span></label>
    <select id="category" name="category" required>
      <option value="">Choose one&hellip;</option>
      <option value="sports">Sports</option>
      <option value="society">Society</option>
      <option value="volunteering">Volunteering</option>
      <option value="social">Social</option>
      <option value="arts-hobby">Arts / hobby</option>
      <option value="faith">Faith</option>
      <option value="other">Other</option>
    </select>
  </fieldset>

  <fieldset>
    <legend>Where and when</legend>

    <label for="parish">Parish</label>
    <select id="parish" name="parish">
      <option value="">Not sure / varies</option>
      {% for parish in site.data.parishes %}
      <option value="{{ parish }}">{{ parish }}</option>
      {% endfor %}
    </select>

    <label for="venue">Venue</label>
    <input type="text" id="venue" name="venue" placeholder="e.g. Candie Gardens, meet at the bandstand">

    <label for="frequency">How often</label>
    <select id="frequency" name="frequency">
      <option value="">Not sure / varies</option>
      <option value="weekly">Weekly</option>
      <option value="fortnightly">Fortnightly</option>
      <option value="monthly">Monthly</option>
      <option value="one-off">One-off</option>
    </select>

    <label for="day">Day</label>
    <input type="text" id="day" name="day" placeholder="e.g. Tuesday">

    <label for="time">Time</label>
    <input type="text" id="time" name="time" placeholder="e.g. 10:00">
  </fieldset>

  <fieldset>
    <legend>Cost and access</legend>

    <label for="cost_amount">Cost (£, 0 if free)</label>
    <input type="number" id="cost_amount" name="cost_amount" min="0" step="0.01">

    <label for="cost_notes">Cost notes</label>
    <input type="text" id="cost_notes" name="cost_notes" placeholder="e.g. £5 voluntary donation, no one turned away">

    <label>Accessibility</label>
    <label class="checkbox-inline"><input type="checkbox" name="mobility" value="wheelchair-accessible"> Wheelchair accessible</label>
    <label class="checkbox-inline"><input type="checkbox" name="mobility" value="seating-available"> Seating available</label>
    <label class="checkbox-inline"><input type="checkbox" name="sensory" value="hearing-loop"> Hearing loop</label>

    <label for="physical_intensity">Physical intensity</label>
    <select id="physical_intensity" name="physical_intensity">
      <option value="">Not sure</option>
      <option value="none">None</option>
      <option value="low">Low</option>
      <option value="moderate">Moderate</option>
      <option value="high">High</option>
    </select>

    <label>Suitable for</label>
    <label class="checkbox-inline"><input type="checkbox" name="suitable_for" value="beginners-welcome"> Beginners welcome</label>
    <label class="checkbox-inline"><input type="checkbox" name="suitable_for" value="dementia-friendly"> Dementia-friendly</label>
  </fieldset>

  <fieldset>
    <legend>Your details (the organiser or point of contact for this listing)</legend>

    <label for="organiser_name">Name <span aria-hidden="true">*</span></label>
    <input type="text" id="organiser_name" name="organiser_name" required>

    <label for="organiser_email">Email <span aria-hidden="true">*</span></label>
    <input type="email" id="organiser_email" name="organiser_email" required>

    <label for="organiser_phone">Phone</label>
    <input type="tel" id="organiser_phone" name="organiser_phone">

    <label for="organiser_website">Website</label>
    <input type="url" id="organiser_website" name="organiser_website">
  </fieldset>

  <fieldset>
    <legend>Anything else</legend>
    <label for="notes">Notes for whoever reviews this</label>
    <textarea id="notes" name="notes" rows="2"></textarea>
  </fieldset>

  <!-- Honeypot: hidden from real visitors via CSS, left blank by humans. -->
  <div class="hp-field" aria-hidden="true">
    <label for="website_confirm">Leave this field blank</label>
    <input type="text" id="website_confirm" name="website_confirm" tabindex="-1" autocomplete="off">
  </div>

  <label for="human_check">Quick check — what is 3 + 4?</label>
  <input type="text" id="human_check" name="human_check" required>

  <button type="submit">Submit for review</button>
  <p id="form-status" role="status"></p>
</form>

<script>
(function () {
  var form = document.getElementById('submission-form');
  var statusEl = document.getElementById('form-status');
  var endpoint = {{ site.submission_endpoint | jsonify }};

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.className = '';
    statusEl.textContent = '';

    if (form.website_confirm.value !== '') {
      // Honeypot tripped — pretend to succeed, do nothing. Real spam bots
      // get a success message and never find out why nothing happened.
      statusEl.className = 'success';
      statusEl.textContent = 'Thanks — your submission has been sent for review.';
      form.reset();
      return;
    }

    if (form.human_check.value.trim() !== '7') {
      statusEl.className = 'error';
      statusEl.textContent = 'That check didn\'t look right — mind trying again? (It\'s just 3 + 4.)';
      return;
    }

    if (!endpoint) {
      statusEl.className = 'error';
      statusEl.textContent = 'This form isn\'t connected yet — see the notice above.';
      return;
    }

    var data = {
      title: form.title.value,
      description: form.description.value,
      category: form.category.value,
      parish: form.parish.value,
      venue: form.venue.value,
      frequency: form.frequency.value,
      day: form.day.value,
      time: form.time.value,
      cost_amount: form.cost_amount.value,
      cost_notes: form.cost_notes.value,
      mobility: Array.prototype.map.call(form.querySelectorAll('input[name="mobility"]:checked'), function (el) { return el.value; }),
      sensory: Array.prototype.map.call(form.querySelectorAll('input[name="sensory"]:checked'), function (el) { return el.value; }),
      physical_intensity: form.physical_intensity.value,
      suitable_for: Array.prototype.map.call(form.querySelectorAll('input[name="suitable_for"]:checked'), function (el) { return el.value; }),
      organiser_name: form.organiser_name.value,
      organiser_email: form.organiser_email.value,
      organiser_phone: form.organiser_phone.value,
      organiser_website: form.organiser_website.value,
      notes: form.notes.value,
      human_check: form.human_check.value,
      website_confirm: form.website_confirm.value
    };

    var submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    statusEl.textContent = 'Sending…';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (result) {
        submitBtn.disabled = false;
        if (result.ok) {
          statusEl.className = 'success';
          statusEl.textContent = 'Thanks — your submission has been sent for review.';
          form.reset();
        } else {
          statusEl.className = 'error';
          statusEl.textContent = (result.body && result.body.error) || 'Something went wrong — please try again.';
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        statusEl.className = 'error';
        statusEl.textContent = 'Could not reach the submission service — please try again shortly.';
      });
  });
})();
</script>
