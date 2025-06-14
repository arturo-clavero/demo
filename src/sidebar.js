document.addEventListener('DOMContentLoaded', () => {
	feather.replace();
	
	// Your existing sidebar logic
	const sidebar = document.querySelector('.sidebar');
	const toggleBtn = document.querySelector('.toggle-btn');
	const items = document.querySelectorAll('.sidebar li');
  
	toggleBtn.addEventListener('click', () => {
	  sidebar.classList.toggle('collapsed');
	  sidebar.classList.toggle('expanded');
	});
  
	items.forEach(item => {
	  item.addEventListener('click', () => {
		items.forEach(i => i.classList.remove('active'));
		item.classList.add('active');
	  });
	});
  });
  
