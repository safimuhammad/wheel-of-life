// Categories for the wheel of life
const categories = [
    { name: 'Health', color: '#5dade2' },
    { name: 'Career', color: '#5b6fb0' },
    { name: 'Love', color: '#a94469' },
    { name: 'Spirituality', color: '#8b5a9e' },
    { name: 'Family', color: '#c77fb5' },
    { name: 'Money', color: '#7bc043' },
    { name: 'Fun', color: '#f4d03f' },
    { name: 'Friends', color: '#e67e22' }
];

// State management
let currentCategoryIndex = 0;
let ratings = {};
let previewChart = null;
let resultChart = null;

// Initialize the app
function init() {
    updateCategoryDisplay();
    createPreviewChart();
}

// Update the category title
function updateCategoryDisplay() {
    const category = categories[currentCategoryIndex];
    document.getElementById('category-title').textContent = category.name;
}

// Select a rating
function selectRating(rating) {
    const category = categories[currentCategoryIndex].name;
    ratings[category] = rating;

    // Update button states
    document.querySelectorAll('.rating-btn').forEach((btn, index) => {
        if (index + 1 === rating) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Update preview chart
    updatePreviewChart();

    // Move to next category after a short delay
    setTimeout(() => {
        nextCategory();
    }, 300);
}

// Skip a category
function skipCategory() {
    nextCategory();
}

// Move to next category or show results
function nextCategory() {
    currentCategoryIndex++;

    if (currentCategoryIndex < categories.length) {
        updateCategoryDisplay();
        // Clear button selections
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        updatePreviewChart();
    } else {
        showResults();
    }
}

// Create the preview chart
function createPreviewChart() {
    const ctx = document.getElementById('previewChart').getContext('2d');

    // Only show categories that have been rated
    const ratedCategories = categories.filter(c => ratings[c.name] !== undefined);

    previewChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ratedCategories.map(c => `${c.name} ${ratings[c.name]}`),
            datasets: [{
                data: ratedCategories.map(c => ratings[c.name]),
                backgroundColor: ratedCategories.map(c => c.color),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30,
                    right: 30,
                    bottom: 30,
                    left: 30
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    grid: {
                        color: '#e0e0e0'
                    },
                    pointLabels: {
                        display: true,
                        font: {
                            size: 14,
                            weight: '400'
                        },
                        color: '#333'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// Update the preview chart
function updatePreviewChart() {
    if (previewChart) {
        // Only show categories that have been rated
        const ratedCategories = categories.filter(c => ratings[c.name] !== undefined);

        previewChart.data.labels = ratedCategories.map(c => `${c.name} ${ratings[c.name]}`);
        previewChart.data.datasets[0].data = ratedCategories.map(c => ratings[c.name]);
        previewChart.data.datasets[0].backgroundColor = ratedCategories.map(c => c.color);
        previewChart.update();
    }
}

// Show the results screen
function showResults() {
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';

    // Set the date
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('result-date').textContent = date;

    // Create result chart
    createResultChart();

    // Create legend
    createLegend();
}

// Create the result chart
function createResultChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');

    // Filter out categories with no ratings (skipped)
    const ratedCategories = categories.filter(c => ratings[c.name] !== undefined);

    resultChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ratedCategories.map(c => `${c.name} ${ratings[c.name]}`),
            datasets: [{
                data: ratedCategories.map(c => ratings[c.name]),
                backgroundColor: ratedCategories.map(c => c.color),
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 60,
                    right: 60,
                    bottom: 60,
                    left: 60
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        stepSize: 1,
                        display: false
                    },
                    grid: {
                        color: '#e0e0e0'
                    },
                    pointLabels: {
                        display: true,
                        font: {
                            size: 16,
                            weight: '400'
                        },
                        color: '#333',
                        padding: 10
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });

    // Create color legend
    createLegend();
}

// Create the legend
function createLegend() {
    const legendContainer = document.getElementById('legend');
    legendContainer.innerHTML = '';

    // Filter out categories with no ratings (skipped)
    const ratedCategories = categories.filter(c => ratings[c.name] !== undefined);

    ratedCategories.forEach(category => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = category.color;

        const label = document.createElement('span');
        label.textContent = `${category.name}: ${ratings[category.name]}`;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });
}

// Print the result
function printResult() {
    window.print();
}

// Download as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(24);
    pdf.text('My Wheel of Life', 105, 20, { align: 'center' });

    // Add date
    pdf.setFontSize(12);
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    pdf.text(date, 105, 30, { align: 'center' });

    // Add chart as image
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 30, 40, 150, 150);

    // Add color legend
    const ratedCategories = categories.filter(c => ratings[c.name] !== undefined);

    pdf.setFontSize(11);
    let xPos = 30;
    let yPos = 205;
    const legendItemsPerRow = 3;

    ratedCategories.forEach((category, index) => {
        // Draw colored square
        const hexColor = category.color;
        pdf.setFillColor(hexColor);
        pdf.rect(xPos, yPos - 3, 4, 4, 'F');

        // Draw text
        pdf.setTextColor(51, 51, 51);
        pdf.text(`${category.name}: ${ratings[category.name]}`, xPos + 6, yPos);

        // Move to next position
        if ((index + 1) % legendItemsPerRow === 0) {
            xPos = 30;
            yPos += 8;
        } else {
            xPos += 60;
        }
    });

    // Save the PDF
    pdf.save('wheel-of-life.pdf');
}

// Reset the app
function resetApp() {
    currentCategoryIndex = 0;
    ratings = {};
    document.getElementById('question-screen').style.display = 'block';
    document.getElementById('result-screen').style.display = 'none';
    updateCategoryDisplay();
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    updatePreviewChart();
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);