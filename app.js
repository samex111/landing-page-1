// Chart Default Styling for Dark Theme
Chart.defaults.color = '#9ca3af';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.scale.grid.color = '#2e333d';

// Core Palette (No Blue)
const colors = {
    primary: '#10b981', // Emerald
    secondary: '#8b5cf6', // Purple
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    bgHover: '#23272f'
};

// Store chart instances
let charts = {};

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    charts.traffic = initTrafficChart();
    charts.water = initWaterChart();
    charts.aqi = initAqiChart();
    charts.energy = initEnergyChart();
    charts.waste = initWasteChart();

    setupInteractivity();
    startLiveSimulation();
});

// 1. Initialize Leaflet Map
function initMap() {
    // Center of Indore city
    const map = L.map('city-map').setView([22.7196, 75.8577], 13);

    // Dark theme tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Mock Zones (Indore)
    const zones = [
        { coords: [22.7533, 75.8937], status: 'danger', radius: 800, label: 'Vijay Nagar - Heavy Traffic' },
        { coords: [22.7190, 75.8670], status: 'warning', radius: 600, label: 'MG Road - Moderate Congestion' },
        { coords: [22.7177, 75.8797], status: 'good', radius: 500, label: 'Geeta Bhawan - Clear Route' },
        { coords: [22.7231, 75.8234], status: 'good', radius: 900, label: 'Airport Road - Normal' }
    ];

    zones.forEach(zone => {
        let color = zone.status === 'danger' ? colors.danger : 
                    zone.status === 'warning' ? colors.warning : colors.primary;
        
        L.circle(zone.coords, {
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            radius: zone.radius
        }).addTo(map).bindPopup(zone.label);
    });
}

// 2. Traffic Density Chart (Line)
function initTrafficChart() {
    const ctx = document.getElementById('trafficChart').getContext('2d');
    
    // Gradient fill
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.5)'); // Warning amber
    gradient.addColorStop(1, 'rgba(245, 158, 11, 0.0)');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
            datasets: [{
                label: 'Vehicles / Hour',
                data: [1200, 4500, 3200, 2800, 3100, 5200, 4800, 2100],
                borderColor: colors.warning,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// 3. Water Usage Chart (Bar)
function initWaterChart() {
    const ctx = document.getElementById('waterChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Vijay Nagar', 'Tilak Nagar', 'LIG', 'Geeta Bhawan', 'Airport Road'],
            datasets: [{
                label: 'Usage (kL)',
                data: [450, 620, 310, 890, 520],
                backgroundColor: colors.secondary,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// 4. AQI Chart (Bar)
function initAqiChart() {
    const ctx = document.getElementById('aqiChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['PM2.5', 'PM10', 'NO2', 'SO2', 'O3', 'CO'],
            datasets: [{
                label: 'Concentration (µg/m³)',
                data: [75, 130, 42, 18, 35, 12],
                backgroundColor: [
                    colors.danger,   // PM2.5 (High)
                    colors.warning,  // PM10 (Moderate)
                    colors.primary,  // NO2 (Good)
                    colors.primary,  // SO2 (Good)
                    colors.primary,  // O3 (Good)
                    colors.primary   // CO (Good)
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// 5. Energy Consumption (Pie)
function initEnergyChart() {
    const ctx = document.getElementById('energyChart').getContext('2d');
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Grid Power', 'Solar Array', 'Wind Turbine', 'Backup Generators'],
            datasets: [{
                data: [60, 25, 10, 5],
                backgroundColor: [
                    '#4b5563',       // Gray (Grid)
                    colors.warning,  // Amber (Solar)
                    colors.primary,  // Green (Wind)
                    colors.danger    // Red (Generators)
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 6. Waste Management Chart (Horizontal Bar)
function initWasteChart() {
    const ctx = document.getElementById('wasteChart').getContext('2d');
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Vijay Nagar', 'Tilak Nagar', 'MG Road', 'LIG', 'Airport Road'],
            datasets: [{
                label: 'Fill Level (%)',
                data: [85, 42, 60, 95, 30],
                backgroundColor: (context) => {
                    const val = context.dataset.data[context.dataIndex];
                    if (val > 80) return colors.danger;
                    if (val > 50) return colors.warning;
                    return colors.primary;
                },
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { max: 100 }
            }
        }
    });
}

// Setup User Interactivity
function setupInteractivity() {
    // 1. Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 2. Search functionality (Filters the alerts)
    const searchInput = document.querySelector('.search-bar input');
    const alerts = document.querySelectorAll('.alert-item');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            alerts.forEach(alert => {
                const text = alert.innerText.toLowerCase();
                alert.style.display = text.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // 3. Traffic Chart Select Dropdown (Updates data)
    const trafficSelect = document.querySelector('.chart-card select');
    if(trafficSelect) {
        trafficSelect.addEventListener('change', (e) => {
            if(e.target.value === 'Week') {
                charts.traffic.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                charts.traffic.data.datasets[0].data = [35000, 42000, 38000, 45000, 48000, 22000, 18000];
            } else {
                charts.traffic.data.labels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
                charts.traffic.data.datasets[0].data = [1200, 4500, 3200, 2800, 3100, 5200, 4800, 2100];
            }
            charts.traffic.update();
        });
    }

    // 4. Notification Bell Dismissal
    const bell = document.querySelector('.notification');
    if(bell) {
        bell.addEventListener('click', () => {
            const badge = bell.querySelector('.badge');
            if (badge) {
                badge.style.display = 'none';
                alert("All notifications marked as read.");
            }
        });
    }
}

// Simulate real-time data fluctuations
function startLiveSimulation() {
    setInterval(() => {
        // Fluctuate Water usage chart slightly
        charts.water.data.datasets[0].data = charts.water.data.datasets[0].data.map(val => {
            let change = Math.floor(Math.random() * 20) - 10;
            return Math.max(0, val + change);
        });
        charts.water.update();

        // Fluctuate current Traffic data (last point in the array if looking at "Today")
        const trafficSelect = document.querySelector('.chart-card select');
        if(!trafficSelect || trafficSelect.value !== 'Week') {
            let dataArr = charts.traffic.data.datasets[0].data;
            let lastIndex = dataArr.length - 1;
            let change = Math.floor(Math.random() * 200) - 100;
            dataArr[lastIndex] = Math.max(0, dataArr[lastIndex] + change);
            charts.traffic.update();
        }
        
    }, 4000); // Every 4 seconds
}
