(function () {
  var PREFIX = 'tb-list:';

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try {
      if (val === null) localStorage.removeItem(key);
      else localStorage.setItem(key, val);
    } catch (e) {}
  }

  function itemText(li) {
    var span = li.querySelector('span:nth-child(2)');
    if (span && span.textContent.trim()) {
      return span.textContent.replace(/\s+/g, ' ').trim();
    }
    return li.textContent.replace(/\s+/g, ' ').trim();
  }

  function keyFor(sectionId, text) {
    return PREFIX + sectionId + ':' + text;
  }

  document.querySelectorAll('[data-checklist-section]').forEach(function (section) {
    var sectionId = section.getAttribute('data-checklist-section');
    var items = Array.prototype.slice.call(section.querySelectorAll('.checklist li'));
    if (!items.length) return;

    var progress = section.querySelector('[data-checklist-progress]');
    if (!progress) {
      progress = document.createElement('div');
      progress.setAttribute('data-checklist-progress', '');
      var firstHeading = section.querySelector('h1, h2');
      if (firstHeading && firstHeading.parentNode) {
        firstHeading.parentNode.insertBefore(progress, firstHeading.nextSibling);
      } else {
        section.insertBefore(progress, section.firstChild);
      }
    }
    if (!progress.classList.contains('list-progress')) {
      progress.classList.add('list-progress');
    }

    function update() {
      var done = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains('checked')) done++;
      }
      if (done === items.length) {
        progress.textContent = 'all done ✓';
        progress.classList.add('done');
      } else {
        progress.textContent = done + ' / ' + items.length + ' done';
        progress.classList.remove('done');
      }
    }

    items.forEach(function (li) {
      var text = itemText(li);
      if (!text) return;
      var key = keyFor(sectionId, text);
      if (safeGet(key) === '1') li.classList.add('checked');

      li.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var nowChecked = !li.classList.contains('checked');
        li.classList.toggle('checked', nowChecked);
        safeSet(key, nowChecked ? '1' : null);
        update();
      });
    });

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'list-reset';
    reset.textContent = '↺ Uncheck all';
    reset.addEventListener('click', function () {
      if (!confirm('Uncheck every item on this page?')) return;
      items.forEach(function (li) {
        var t = itemText(li);
        if (!t) return;
        safeSet(keyFor(sectionId, t), null);
        li.classList.remove('checked');
      });
      update();
    });
    section.appendChild(reset);

    update();
  });
})();
