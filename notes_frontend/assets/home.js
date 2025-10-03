//
// Home Screen interactions (Ocean Professional)
// - Collapsible sidebar (aria-expanded reflects state)
// - Client-side search filter (on notes list)
// - Active note selection highlighting (click + keyboard)
// - New Note button + FAB create stub (no backend; resets editor and appends demo item)
//
// PUBLIC_INTERFACE
(function(){
  "use strict";

  // Cache DOM nodes
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const search = document.getElementById('search');
  const notesList = document.getElementById('notesList');
  const newNoteBtn = document.getElementById('newNoteBtn');
  const fabAdd = document.getElementById('fabAdd');

  // Utilities
  function selectNoteItem(li){
    if(!notesList || !li) return;
    notesList.querySelectorAll('.note-item').forEach(item=>{
      item.classList.remove('selected');
      item.setAttribute('aria-selected','false');
    });
    li.classList.add('selected');
    li.setAttribute('aria-selected','true');

    const t = li.querySelector('.note-title')?.textContent || '';
    const titleEl = document.querySelector('.editor-title');
    const area = document.querySelector('.editor-area');
    if(titleEl) titleEl.value = t;
    if(area) area.value = `Notes for "${t}"...`;
  }

  // PUBLIC_INTERFACE
  function initSidebarToggle(){
    /** Toggle sidebar collapsed state, update aria-expanded. */
    if(!toggle || !sidebar) return;
    toggle.addEventListener('click', ()=>{
      const collapsed = sidebar.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  // PUBLIC_INTERFACE
  function initSearchFilter(){
    /** Input-based filter on notes list; hides items not matching query. */
    if(!search || !notesList) return;
    const items = Array.from(notesList.querySelectorAll('.note-item'));
    search.addEventListener('input', ()=>{
      const q = search.value.trim().toLowerCase();
      // Avoid forcing layout; only set display state
      for(const li of items){
        const title = li.querySelector('.note-title')?.textContent?.toLowerCase() || '';
        const meta  = li.querySelector('.note-meta')?.textContent?.toLowerCase() || '';
        const match = !q || title.includes(q) || meta.includes(q);
        li.style.display = match ? '' : 'none';
      }
    });
  }

  // PUBLIC_INTERFACE
  function initNoteSelection(){
    /** Handles click and keyboard selection for list items and updates editor. */
    if(!notesList) return;

    // Click to select
    notesList.addEventListener('click', (e)=>{
      const li = e.target && (e.target.closest('.note-item'));
      if(li) selectNoteItem(li);
    });

    // Keyboard activation for list items
    notesList.addEventListener('keydown', (e)=>{
      const target = e.target;
      if(target && target.classList.contains('note-item')){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          selectNoteItem(target);
        }
        // Optional: simple arrow navigation
        if(e.key === 'ArrowDown'){
          e.preventDefault();
          const next = target.nextElementSibling;
          if(next && next.classList.contains('note-item')){
            next.focus();
          }
        }
        if(e.key === 'ArrowUp'){
          e.preventDefault();
          const prev = target.previousElementSibling;
          if(prev && prev.classList.contains('note-item')){
            prev.focus();
          }
        }
      }
    });
  }

  // PUBLIC_INTERFACE
  function initNewNote(){
    /** New Note stub: resets editor and appends a demo note at top for visual feedback. */
    function createNewNote(){
      const titleEl = document.querySelector('.editor-title');
      const area = document.querySelector('.editor-area');
      if(titleEl) titleEl.value = 'Untitled note';
      if(area) area.value = '';

      if(notesList){
        const li = document.createElement('li');
        li.className = 'note-item';
        li.tabIndex = 0;
        li.setAttribute('role','option');
        li.setAttribute('aria-selected','false');
        li.innerHTML = `
          <div class="note-title">Untitled note</div>
          <div class="note-meta">Just now · Draft</div>
        `;
        notesList.insertBefore(li, notesList.firstChild);
        selectNoteItem(li);
        // focus the title input for immediate typing
        titleEl?.focus();
      }
    }

    newNoteBtn?.addEventListener('click', createNewNote);
    fabAdd?.addEventListener('click', createNewNote);
  }

  // Initialize
  initSidebarToggle();
  initSearchFilter();
  initNoteSelection();
  initNewNote();

})();
