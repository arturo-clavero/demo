import StateManager from "./core/StateManager";

document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  const sidebar = document.querySelector('.sidebar');
  const toggleBtn = document.querySelector('.toggle-btn');
  const items = document.querySelectorAll('.sidebar li');
  const stateManager = new StateManager();

  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('expanded');
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      // Visually update active class
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // Switch scene based on data-scene
      const sceneName = item.getAttribute('data-scene');
      if (sceneName) {
        stateManager.switchState(sceneName);
      }
    });
  });
});

document.querySelectorAll('.sidebar li.has-submenu > .label').forEach(label => {
	label.addEventListener('click', () => {
	  const parent = label.parentElement;
	  parent.classList.toggle('active');
	});
  });
  
