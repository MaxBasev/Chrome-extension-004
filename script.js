// Store selected cell for coloring
let selectedCell = null;
let currentModalCallback = null;
let currentView = 'daily';

// Initialize data from localStorage or create empty array
let tableData = JSON.parse(localStorage.getItem('lifeTrackerData')) || [];

// Modal elements
const modal = document.getElementById('modal');
const modalInput = document.getElementById('modal-input');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');
const modalClose = document.querySelector('.close');

// Confirmation modal elements
const confirmModal = document.getElementById('confirm-modal');
const confirmMessage = document.getElementById('confirm-message');
const confirmOk = document.getElementById('confirm-ok');
const confirmCancel = document.getElementById('confirm-cancel');

// Function to show modal with callback
function showModal(title, value, callback) {
	document.getElementById('modal-title').textContent = title;
	modalInput.value = value || '';
	currentModalCallback = callback;
	modal.style.display = 'block';
}

// Function to show confirmation modal
function showConfirmation(message, callback) {
	confirmMessage.textContent = message;
	currentModalCallback = callback;
	confirmModal.style.display = 'block';
}

// Function to save data to localStorage
function saveData() {
	localStorage.setItem('lifeTrackerData', JSON.stringify(tableData));
}

// Function to format date
function formatDate(date) {
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	});
}

// Function to get day name
function getDayName(date) {
	return date.toLocaleDateString('ru-RU', { weekday: 'short' });
}

// Function to create new row
function createRow(date = new Date()) {
	const row = {
		date: formatDate(date),
		day: getDayName(date),
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

// Function to delete row
function deleteRow(index) {
	showConfirmation('Вы уверены, что хотите удалить эту запись?', () => {
		tableData.splice(index, 1);
		renderTable();
		saveData();
	});
}

// Function to render table
function renderTable(data = tableData) {
	const tbody = document.getElementById('tableBody');
	tbody.innerHTML = '';

	data.forEach((row, index) => {
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
            <td><button class="delete-btn" data-index="${index}">✕</button></td>
        `;
		tbody.appendChild(tr);
	});
}

// Event Listeners
document.getElementById('addRow').addEventListener('click', () => createRow());

document.getElementById('tableBody').addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-btn')) {
		deleteRow(parseInt(e.target.dataset.index));
		return;
	}

	if (e.target.tagName === 'TD' && e.target.dataset.field) {
		selectedCell = e.target;
		const index = parseInt(e.target.dataset.index);
		const field = e.target.dataset.field;
		showModal('Редактировать запись', tableData[index][field], (value) => {
			tableData[index][field] = value;
			renderTable();
			saveData();
		});
	}
});

// Modal event listeners
modalSave.addEventListener('click', () => {
	if (currentModalCallback) {
		currentModalCallback(modalInput.value);
	}
	modal.style.display = 'none';
});

[modalCancel, modalClose].forEach(elem => {
	elem.addEventListener('click', () => {
		modal.style.display = 'none';
	});
});

// Confirmation modal event listeners
confirmOk.addEventListener('click', () => {
	if (currentModalCallback) {
		currentModalCallback();
	}
	confirmModal.style.display = 'none';
});

confirmCancel.addEventListener('click', () => {
	confirmModal.style.display = 'none';
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
	if (e.target === modal) {
		modal.style.display = 'none';
	}
	if (e.target === confirmModal) {
		confirmModal.style.display = 'none';
	}
});

document.querySelectorAll('.color-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		if (selectedCell) {
			const index = parseInt(selectedCell.dataset.index);
			const field = selectedCell.dataset.field;
			tableData[index].colors[field] = btn.dataset.color;

			renderTable();
			saveData();
		}
	});
});

// Функция для агрегации данных
function aggregateData(period) {
	const aggregated = [];

	if (period === 'daily') return tableData;

	const groupedData = {};

	tableData.forEach(row => {
		const date = new Date(row.date.split('.').reverse().join('-'));
		let key;

		if (period === 'weekly') {
			const weekNumber = getWeekNumber(date);
			key = `${date.getFullYear()}-W${weekNumber}`;
		} else if (period === 'monthly') {
			key = `${date.getFullYear()}-${date.getMonth() + 1}`;
		}

		if (!groupedData[key]) {
			groupedData[key] = {
				entries: [],
				colors: {
					работа: [],
					здоровье: [],
					финансы: [],
					отношения: [],
					счастье: [],
					блог: []
				}
			};
		}

		groupedData[key].entries.push(row);
		Object.keys(row.colors).forEach(field => {
			groupedData[key].colors[field].push(row.colors[field]);
		});
	});

	Object.entries(groupedData).forEach(([key, data]) => {
		const aggregatedRow = {
			date: period === 'weekly' ? `Неделя ${key.split('W')[1]}` : `${getMonthName(parseInt(key.split('-')[1]))}`,
			day: '',
			colors: {}
		};

		// Aggregate colors (majority wins)
		Object.keys(data.colors).forEach(field => {
			const colorCounts = data.colors[field].reduce((acc, color) => {
				acc[color] = (acc[color] || 0) + 1;
				return acc;
			}, {});

			aggregatedRow.colors[field] = Object.entries(colorCounts)
				.sort((a, b) => b[1] - a[1])[0][0];

			// Combine texts
			aggregatedRow[field] = data.entries
				.map(entry => entry[field])
				.filter(text => text)
				.join('\n');
		});

		aggregated.push(aggregatedRow);
	});

	return aggregated.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Функция для получения номера недели
function getWeekNumber(date) {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Функция для получения названия месяца
function getMonthName(month) {
	return new Date(2000, month - 1, 1).toLocaleDateString('ru-RU', { month: 'long' });
}

// Функция для расчета статистики
function calculateStats() {
	const stats = {
		total: tableData.length,
		success: {},
		failure: {},
		trend: {}
	};

	const fields = ['работа', 'здоровье', 'финансы', 'отношения', 'счастье', 'блог'];

	fields.forEach(field => {
		const colors = tableData.map(row => row.colors[field]);
		stats.success[field] = colors.filter(c => c === 'green').length;
		stats.failure[field] = colors.filter(c => c === 'red').length;

		// Calculate trend (last 7 days vs previous 7 days)
		const last7 = colors.slice(0, 7);
		const prev7 = colors.slice(7, 14);

		const last7Success = last7.filter(c => c === 'green').length;
		const prev7Success = prev7.filter(c => c === 'green').length;

		stats.trend[field] = last7Success - prev7Success;
	});

	return stats;
}

// Функция для обновления статистики в UI
function updateStats() {
	const stats = calculateStats();
	const container = document.querySelector('.stats-container');
	container.innerHTML = '';

	const fields = ['работа', 'здоровье', 'финансы', 'отношения', 'счастье', 'блог'];

	fields.forEach(field => {
		const successRate = ((stats.success[field] / stats.total) * 100).toFixed(1);
		const trend = stats.trend[field];

		const card = document.createElement('div');
		card.className = 'stat-card';
		card.innerHTML = `
            <div class="stat-title">${field}</div>
            <div class="stat-value">${successRate}%</div>
            <div class="stat-trend ${trend > 0 ? 'trend-up' : 'trend-down'}">
                ${trend > 0 ? '↑' : '↓'} ${Math.abs(trend)} за неделю
            </div>
        `;

		container.appendChild(card);
	});
}

// Event listeners для новых функций
document.querySelectorAll('.view-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		currentView = btn.dataset.view;
		document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
		btn.classList.add('active');
		renderTable(aggregateData(currentView));
	});
});

document.getElementById('toggleStats').addEventListener('click', () => {
	const container = document.querySelector('.stats-container');
	container.classList.toggle('visible');
	updateStats();
});

document.getElementById('exportData').addEventListener('click', () => {
	const dataStr = JSON.stringify(tableData, null, 2);
	const blob = new Blob([dataStr], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'life-tracker-data.json';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
});

document.getElementById('importData').addEventListener('click', () => {
	document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
	const file = e.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const importedData = JSON.parse(e.target.result);
				tableData = importedData;
				saveData();
				renderTable(aggregateData(currentView));
				updateStats();
			} catch (error) {
				alert('Ошибка при импорте данных');
			}
		};
		reader.readAsText(file);
	}
});

// Инициализация
updateStats();

// Initial render
renderTable(); 