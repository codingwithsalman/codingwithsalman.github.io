// --- INITIALIZATION ---
let originalData = {}; // Store the originally loaded data to preserve its structure
document.getElementById('load-btn').addEventListener('click', loadAndPopulateForm);
document.getElementById('generate-btn').addEventListener('click', generateJson);

/**
 * Loads the existing resume.json file and populates the entire form.
 */
async function loadAndPopulateForm() {
    try {
        const response = await fetch('resume.json');
        if (!response.ok) throw new Error('Could not find resume.json. Make sure you are using a local server.');
        const data = await response.json();
        originalData = data; // Save the original structure

        // Populate Meta fields
        document.getElementById('meta-title').value = data.meta.title;
        document.getElementById('meta-description').value = data.meta.description;
        document.getElementById('meta-keywords').value = data.meta.keywords;
        document.getElementById('meta-ogTitle').value = data.meta.social.ogTitle;
        document.getElementById('meta-ogDescription').value = data.meta.social.ogDescription;
        document.getElementById('meta-twitterDescription').value = data.meta.social.twitterDescription;

        // Populate Personal Info fields, including all contact details
        document.getElementById('name').value = data.personalInfo.name;
        document.getElementById('title').value = data.personalInfo.title;
        document.getElementById('contact-location').value = data.personalInfo.contact.location;
        document.getElementById('contact-phone').value = data.personalInfo.contact.phone;
        document.getElementById('contact-email').value = data.personalInfo.contact.email;
        document.getElementById('contact-linkedin').value = data.personalInfo.contact.linkedin;
        document.getElementById('contact-github').value = data.personalInfo.contact.github;

        // Populate the single summary field directly, NOT with the helper function.
        document.getElementById('summary').value = data.sections.find(s => s.type === 'summary').content;

        // Populate the repeatable list sections using the helper function.
        populateSection('technologies-container', data.sections.find(s => s.type === 'technologies').items, addTechnology);
        populateSection('experience-container', data.sections.find(s => s.type === 'experience').items, addExperience);
        populateSection('projects-container', data.sections.find(s => s.type === 'projects').items, addProject);
        populateSection('education-container', data.sections.find(s => s.type === 'education').items, addEducation);
        
        alert('Data loaded successfully!');
    } catch (error) {
        alert('Could not load resume.json. Starting with a blank form. Error: ' + error.message);
    }
}

/**
 * Helper function to clear and populate a section that contains a LIST of items.
 * @param {string} containerId - The ID of the container div.
 * @param {Array} items - The array of data items.
 * @param {Function} addFunction - The function to call to add a single item's form.
 */
function populateSection(containerId, items, addFunction) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing items
    if (items && Array.isArray(items)) { // Ensure items is a valid array
        items.forEach(item => addFunction(item));
    }
}


// --- DYNAMIC FORM ELEMENT FUNCTIONS ---

function addTechnology(tech = {}) {
    const container = document.getElementById('technologies-container');
    const index = container.children.length;
    const div = document.createElement('div');
    div.className = 'item-container';
    div.id = `tech-item-${index}`;
    div.innerHTML = `
        <h3>Tech Category ${index + 1} <button type="button" class="btn-remove" onclick="removeItem('tech-item-${index}')">Remove</button></h3>
        <label for="tech-category-${index}">Category Name:</label>
        <input type="text" id="tech-category-${index}" value="${tech.category || ''}">
        <label for="tech-skills-${index}">Skills (one per line):</label>
        <textarea id="tech-skills-${index}">${(tech.skills || []).join('\n')}</textarea>
    `;
    container.appendChild(div);
}

function addExperience(job = {}) {
    const container = document.getElementById('experience-container');
    const index = container.children.length;
    const div = document.createElement('div');
    div.className = 'item-container';
    div.id = `exp-item-${index}`;
    div.innerHTML = `
        <h3>Job ${index + 1} <button type="button" class="btn-remove" onclick="removeItem('exp-item-${index}')">Remove</button></h3>
        <label for="exp-company-${index}">Company:</label>
        <input type="text" id="exp-company-${index}" value="${job.company || ''}">
        <label for="exp-role-${index}">Role:</label>
        <input type="text" id="exp-role-${index}" value="${job.role || ''}">
        <label for="exp-period-${index}">Period:</label>
        <input type="text" id="exp-period-${index}" value="${job.period || ''}">
        <label for="exp-achievements-${index}">Achievements (one per line):</label>
        <textarea id="exp-achievements-${index}">${(job.achievements || []).join('\n')}</textarea>
    `;
    container.appendChild(div);
}

function addProject(project = {}) {
    const container = document.getElementById('projects-container');
    const index = container.children.length;
    const div = document.createElement('div');
    div.className = 'item-container';
    div.id = `proj-item-${index}`;
    div.innerHTML = `
        <h3>Project ${index + 1} <button type="button" class="btn-remove" onclick="removeItem('proj-item-${index}')">Remove</button></h3>
        <label for="proj-name-${index}">Name:</label>
        <input type="text" id="proj-name-${index}" value="${project.name || ''}">
        <label for="proj-url-${index}">URL (optional):</label>
        <input type="text" id="proj-url-${index}" value="${project.url || ''}">
        <label for="proj-description-${index}">Description:</label>
        <textarea id="proj-description-${index}">${project.description || ''}</textarea>
    `;
    container.appendChild(div);
}

function addEducation(edu = {}) {
    const container = document.getElementById('education-container');
    const index = container.children.length;
    const div = document.createElement('div');
    div.className = 'item-container';
    div.id = `edu-item-${index}`;
    div.innerHTML = `
        <h3>Education ${index + 1} <button type="button" class="btn-remove" onclick="removeItem('edu-item-${index}')">Remove</button></h3>
        <label for="edu-degree-${index}">Degree/Certificate:</label>
        <input type="text" id="edu-degree-${index}" value="${edu.degree || ''}">
        <label for="edu-institution-${index}">Institution & Year:</label>
        <input type="text" id="edu-institution-${index}" value="${edu.institution || ''}">
    `;
    container.appendChild(div);
}

function removeItem(elementId) {
    const item = document.getElementById(elementId);
    if (item && confirm('Are you sure you want to remove this item?')) {
        item.remove();
    }
}


/**
 * Reads all form fields and generates the final resume.json content.
 */
function generateJson() {
    const finalJson = JSON.parse(JSON.stringify(originalData));

    finalJson.meta.title = document.getElementById('meta-title').value;
    finalJson.meta.description = document.getElementById('meta-description').value;
    finalJson.meta.keywords = document.getElementById('meta-keywords').value;
    finalJson.meta.social.ogTitle = document.getElementById('meta-ogTitle').value;
    finalJson.meta.social.ogDescription = document.getElementById('meta-ogDescription').value;
    finalJson.meta.social.twitterDescription = document.getElementById('meta-twitterDescription').value;

    finalJson.personalInfo.name = document.getElementById('name').value;
    finalJson.personalInfo.title = document.getElementById('title').value;
    finalJson.personalInfo.contact.location = document.getElementById('contact-location').value;
    finalJson.personalInfo.contact.phone = document.getElementById('contact-phone').value;
    finalJson.personalInfo.contact.email = document.getElementById('contact-email').value;
    finalJson.personalInfo.contact.linkedin = document.getElementById('contact-linkedin').value;
    finalJson.personalInfo.contact.github = document.getElementById('contact-github').value;
    
    finalJson.sections.find(s => s.type === 'summary').content = document.getElementById('summary').value;
    
    finalJson.sections.find(s => s.type === 'technologies').items = 
        Array.from(document.getElementById('technologies-container').children).map((div, i) => ({
            category: document.getElementById(`tech-category-${i}`).value,
            skills: document.getElementById(`tech-skills-${i}`).value.split('\n').filter(line => line.trim() !== '')
        }));

    finalJson.sections.find(s => s.type === 'experience').items = 
        Array.from(document.getElementById('experience-container').children).map((div, i) => ({
            company: document.getElementById(`exp-company-${i}`).value,
            role: document.getElementById(`exp-role-${i}`).value,
            period: document.getElementById(`exp-period-${i}`).value,
            achievements: document.getElementById(`exp-achievements-${i}`).value.split('\n').filter(line => line.trim() !== '')
        }));

    finalJson.sections.find(s => s.type === 'projects').items = 
        Array.from(document.getElementById('projects-container').children).map((div, i) => ({
            name: document.getElementById(`proj-name-${i}`).value,
            url: document.getElementById(`proj-url-${i}`).value,
            description: document.getElementById(`proj-description-${i}`).value
        }));

    finalJson.sections.find(s => s.type === 'education').items = 
        Array.from(document.getElementById('education-container').children).map((div, i) => ({
            degree: document.getElementById(`edu-degree-${i}`).value,
            institution: document.getElementById(`edu-institution-${i}`).value
        }));

    const outputArea = document.getElementById('json-output');
    outputArea.value = JSON.stringify(finalJson, null, 2);
    outputArea.select();
    navigator.clipboard.writeText(outputArea.value).then(() => {
        alert('JSON generated and copied to clipboard! Paste it into your resume.json file.');
    }).catch(err => {
        alert('JSON generated! Please copy it from the textarea below.');
        console.error('Could not copy to clipboard:', err);
    });
}