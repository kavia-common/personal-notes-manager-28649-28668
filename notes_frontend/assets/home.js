// Home Screen interactions (Ocean Professional)
// Assumptions:
// - Collapsible sidebar on small screens; aria-expanded reflects state
// - Client-side search filter demo only
// - New Note resets editor fields and focuses title

(function(){
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const search = document.getElementById('search');
  const notesList = document.getElementById('notesList');

  if(toggle && sidebar){
    toggle.addEventListener('click', ()=>{
      const collapsed = sidebar.classList.toggle('collapsed');
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  // Basic client-side filter for demo
  if(search && notesList){
    search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase();
      notesList.querySelectorAll('.note-item').forEach(li =>{
        const title = li.querySelector('.note-title')?.textContent?.toLowerCase()||'';
        const meta = li.querySelector('.note-meta')?.textContent?.toLowerCase()||'';
        const match = title.includes(q) || meta.includes(q);
        li.style.display = match ? '' : 'none';
      });
    });
  }

  // New Note demo
  document.querySelector('.new-note')?.addEventListener('click', ()=>{
    const titleEl = document.querySelector('.editor-title');
    const area = document.querySelector('.editor-area');
    if(titleEl) titleEl.value = 'Untitled note';
    if(area) area.value = '';
    titleEl?.focus();
  });

  // Keyboard activation for list items
  notesList?.addEventListener('keydown', (e)=>{
    const target = e.target;
    if(target && target.classList.contains('note-item')){
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        // Select the note (simple visual feedback)
        notesList.querySelectorAll('.note-item').forEach(li => li.classList.remove('selected'));
        target.classList.add('selected');
        // Populate editor with selected content (demo)
        const t = target.querySelector('.note-title')?.textContent || '';
        const titleEl = document.querySelector('.editor-title');
        const area = document.querySelector('.editor-area');
        if(titleEl) titleEl.value = t;
        if(area) area.value = `Notes for "${t}"...`;
      }
    }
  });
})();
