// All available categories for the wheel of life
const allCategories = [
    { name: 'Health', color: '#5dade2' },
    { name: 'Career', color: '#5b6fb0' },
    { name: 'Love', color: '#a94469' },
    { name: 'Spirituality', color: '#8b5a9e' },
    { name: 'Family', color: '#c77fb5' },
    { name: 'Money', color: '#7bc043' },
    { name: 'Fun', color: '#f4d03f' },
    { name: 'Friends', color: '#e67e22' },
    { name: 'Fitness', color: '#e74c3c' },
    { name: 'Travelling', color: '#3498db' },
    { name: 'Mental Wellbeing', color: '#9b59b6' },
    { name: 'Skill Development', color: '#1abc9c' },
    { name: 'Social Life', color: '#f39c12' },
    { name: 'Stress Management', color: '#34495e' },
    { name: 'Work Life Balance', color: '#16a085' },
    { name: 'Parenting', color: '#d35400' }
];

// State management
let userDetails = {};
let selectedCategories = [];
let currentCategoryIndex = 0;
let ratings = {};
let comments = {};
let previewChart = null;
let resultChart = null;

// Initialize the app
function init() {
    // Set up user details form
    const userForm = document.getElementById('user-details-form');
    userForm.addEventListener('submit', handleUserDetailsSubmit);

    // Create sections grid
    createSectionsGrid();
}

// Handle user details form submission
function handleUserDetailsSubmit(e) {
    e.preventDefault();

    userDetails = {
        name: document.getElementById('userName').value,
        department: document.getElementById('userDepartment').value,
        title: document.getElementById('userTitle').value,
        experience: document.getElementById('userExperience').value
    };

    // Hide user details screen, show section selection
    document.getElementById('user-details-screen').style.display = 'none';
    document.getElementById('section-selection-screen').style.display = 'block';
}

// Create sections grid for selection
function createSectionsGrid() {
    const grid = document.getElementById('sectionsGrid');
    grid.innerHTML = '';

    allCategories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'section-card';
        card.dataset.index = index;

        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'section-color';
        colorIndicator.style.backgroundColor = category.color;

        const name = document.createElement('div');
        name.className = 'section-name';
        name.textContent = category.name;

        card.appendChild(colorIndicator);
        card.appendChild(name);

        card.addEventListener('click', () => toggleSectionSelection(index));

        grid.appendChild(card);
    });
}

// Toggle section selection
function toggleSectionSelection(index) {
    const card = document.querySelector(`.section-card[data-index="${index}"]`);
    const category = allCategories[index];

    const selectedIndex = selectedCategories.findIndex(c => c.name === category.name);

    if (selectedIndex > -1) {
        // Deselect
        selectedCategories.splice(selectedIndex, 1);
        card.classList.remove('selected');
    } else {
        // Select (max 8)
        if (selectedCategories.length < 8) {
            selectedCategories.push(category);
            card.classList.add('selected');
        }
    }

    // Update selection count
    const countEl = document.getElementById('selectionCount');
    countEl.textContent = `Selected: ${selectedCategories.length}/8`;

    // Enable/disable continue button
    const continueBtn = document.getElementById('continueWithSections');
    continueBtn.disabled = selectedCategories.length < 3;
}

// Start questionnaire with selected sections
function startQuestionnaire() {
    if (selectedCategories.length < 3) {
        alert('Please select at least 3 areas to continue.');
        return;
    }

    // Hide section selection, show question screen
    document.getElementById('section-selection-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'block';

    // Reset state for selected categories
    currentCategoryIndex = 0;
    ratings = {};
    comments = {};

    // Initialize preview chart
    createPreviewChart();
    updateCategoryDisplay();
}

// Update the category title
function updateCategoryDisplay() {
    const category = selectedCategories[currentCategoryIndex];
    document.getElementById('category-title').textContent = category.name;
}

// Select a rating
function selectRating(rating) {
    const category = selectedCategories[currentCategoryIndex].name;
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

// Move to next category or show results
function nextCategory() {
    currentCategoryIndex++;

    if (currentCategoryIndex < selectedCategories.length) {
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

    // Only show categories that have been rated from selected categories
    const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

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
        // Only show categories that have been rated from selected categories
        const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

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

    // Create comments section
    createCommentsSection();
}

// Create comments section on results page
function createCommentsSection() {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = '';

    const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

    ratedCategories.forEach(category => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';

        const header = document.createElement('div');
        header.className = 'comment-header';

        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'comment-color-indicator';
        colorIndicator.style.backgroundColor = category.color;

        const title = document.createElement('div');
        title.className = 'comment-title';
        title.textContent = `${category.name} (Rated: ${ratings[category.name]}/10)`;

        header.appendChild(colorIndicator);
        header.appendChild(title);

        const textarea = document.createElement('textarea');
        textarea.className = 'comment-textarea';
        textarea.placeholder = `Why did you rate ${category.name} as ${ratings[category.name]}?`;
        textarea.rows = 3;
        textarea.dataset.category = category.name;
        textarea.value = comments[category.name] || '';

        // Update comments object when user types
        textarea.addEventListener('input', (e) => {
            comments[category.name] = e.target.value;
        });

        commentCard.appendChild(header);
        commentCard.appendChild(textarea);
        container.appendChild(commentCard);
    });
}

// Create the result chart
function createResultChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');

    // Use selected categories with ratings
    const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

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

    // Use selected categories with ratings
    const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

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

    let yPos = 20;

    // Add title
    pdf.setFontSize(24);
    pdf.text('My Wheel of Life', 105, yPos, { align: 'center' });
    yPos += 10;

    // Add date
    pdf.setFontSize(12);
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    pdf.text(date, 105, yPos, { align: 'center' });
    yPos += 15;

    // Add user details
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Name: ${userDetails.name}`, 20, yPos);
    yPos += 6;
    pdf.text(`Department: ${userDetails.department}`, 20, yPos);
    yPos += 6;
    pdf.text(`Title: ${userDetails.title}`, 20, yPos);
    yPos += 6;
    pdf.text(`Experience: ${userDetails.experience} years`, 20, yPos);
    yPos += 15;

    // Add chart as image
    const canvas = document.getElementById('resultChart');
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 30, yPos, 150, 150);
    yPos += 160;

    // Add color legend
    const ratedCategories = selectedCategories.filter(c => ratings[c.name] !== undefined);

    pdf.setFontSize(11);
    pdf.setTextColor(51, 51, 51);
    let xPos = 20;
    const legendItemsPerRow = 2;

    ratedCategories.forEach((category, index) => {
        // Check if we need a new page
        if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
            xPos = 20;
        }

        // Draw colored square
        const hexColor = category.color;
        pdf.setFillColor(hexColor);
        pdf.rect(xPos, yPos - 3, 4, 4, 'F');

        // Draw text
        pdf.setTextColor(51, 51, 51);
        pdf.text(`${category.name}: ${ratings[category.name]}`, xPos + 6, yPos);

        // Move to next position
        if ((index + 1) % legendItemsPerRow === 0) {
            xPos = 20;
            yPos += 8;
        } else {
            xPos += 95;
        }
    });

    // Add comments section
    if (Object.keys(comments).length > 0) {
        // Check space or add new page
        if (yPos > 200) {
            pdf.addPage();
            yPos = 20;
        } else {
            yPos += 15;
        }

        pdf.setFontSize(14);
        pdf.setTextColor(51, 51, 51);
        pdf.text('Comments', 20, yPos);
        yPos += 10;

        pdf.setFontSize(10);
        ratedCategories.forEach(category => {
            const comment = comments[category.name];
            if (comment) {
                // Check if we need a new page
                if (yPos > 260) {
                    pdf.addPage();
                    yPos = 20;
                }

                pdf.setTextColor(100, 100, 100);
                pdf.text(`${category.name} (${ratings[category.name]}):`, 20, yPos);
                yPos += 6;

                // Split long comments
                pdf.setTextColor(51, 51, 51);
                const lines = pdf.splitTextToSize(comment || 'No comment provided', 170);
                lines.forEach(line => {
                    if (yPos > 280) {
                        pdf.addPage();
                        yPos = 20;
                    }
                    pdf.text(line, 20, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }
        });
    }

    // Save the PDF
    pdf.save('wheel-of-life.pdf');
}

// Reset the app
function resetApp() {
    // Reset all state
    currentCategoryIndex = 0;
    ratings = {};
    comments = {};
    selectedCategories = [];
    userDetails = {};

    // Reset all screens
    document.getElementById('user-details-screen').style.display = 'block';
    document.getElementById('section-selection-screen').style.display = 'none';
    document.getElementById('question-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';

    // Clear form
    document.getElementById('user-details-form').reset();

    // Recreate sections grid
    createSectionsGrid();
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);