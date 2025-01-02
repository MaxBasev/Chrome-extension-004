// Store selected cell for coloring
let selectedCell = null;

// Initialize data from localStorage or create empty array
let tableData = JSON.parse(localStorage.getItem('lifeTrackerData')) || [];

// Function to save data to localStorage
function saveData() {
	localStorage.setItem('lifeTrackerData', JSON.stringify(tableData));
}

// Function to create new row
function createRow(date = new Date()) {
	const row = {
		date: date.toLocaleDateString(),
		day: date.getDay(),
		работа: '',
		здоровье: '',
		финансы: '',
		отношения: '',
		счастье: '',
		блог: '',
		colors: {
			работа: 'white',
			здоровье: 'white',
			финансы: 'white',
			отношения: 'white',
			счастье: 'white',
			блог: 'white'
		}
	};
	tableData.push(row);
	renderTable();
	saveData();
}

// Function to render table
function renderTable() {
	const tbody = document.getElementById('tableBody');
	tbody.innerHTML = '';

	tableData.forEach((row, index) => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
            <td>${row.date}</td>
            <td>${row.day}</td>
            <td class="${row.colors.работа}" data-index="${index}" data-field="работа">${row.работа}</td>
            <td class="${row.colors.здоровье}" data-index="${index}" data-field="здоровье">${row.здоровье}</td>
            <td class="${row.colors.финансы}" data-index="${index}" data-field="финансы">${row.финансы}</td>
            <td class="${row.colors.отношения}" data-index="${index}" data-field="отношения">${row.отношения}</td>
            <td class="${row.colors.счастье}" data-index="${index}" data-field="счастье">${row.счастье}</td>
            <td class="${row.colors.блог}" data-index="${index}" data-field="блог">${row.блог}</td>
        `;
		tbody.appendChild(tr);
	});
}

// Event Listeners
document.getElementById('addRow').addEventListener('click', () => createRow());

document.getElementById('tableBody').addEventListener('click', (e) => {
	if (e.target.tagName === 'TD' && e.target.dataset.field) {
		selectedCell = e.target;
		const index = e.target.dataset.index;
		const field = e.target.dataset.field;
		const content = prompt('Введите текст:', tableData[index][field]);
		if (content !== null) {
			tableData[index][field] = content;
			renderTable();
			saveData();
		}
	}
});

document.querySelectorAll('.color-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		if (selectedCell) {
			const index = selectedCell.dataset.index;
			const field = selectedCell.dataset.field;
			tableData[index].colors[field] = btn.dataset.color;
			renderTable();
			saveData();
		}
	});
});

// Initial render
renderTable(); 