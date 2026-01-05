// --- APPLICATION INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

let originalData = {}; // Global access to the loaded data for functions like PDF filename

/**
 * Main function to initialize the application.
 * It loads data, renders the page, and sets up all interactive elements.
 */
async function initializeApp() {
    try {
        originalData = await loadResumeData();
      //  renderMetadata(originalData.meta);
        renderResume(originalData);
        setupEventListeners();
        setupScrollAnimations();
    } catch (error) {
        console.error('Failed to initialize the application:', error);
        const mainContainer = document.getElementById('resume-content-container') || document.body;
        mainContainer.innerHTML = 
            '<p style="text-align:center; color:red; padding: 50px;">Failed to load resume data. Please check the browser console (F12) for errors.</p>';
    }
}

/**
 * Data Source Layer: Fetches the resume data from the resume.json file.
 * @returns {Promise<object>} The resume data object.
 */
async function loadResumeData() {
    const response = await fetch('resume.json');
    if (!response.ok) {
        throw new Error(`Failed to fetch resume.json: ${response.statusText}`);
    }
    return await response.json();
}


// --- RENDERING ENGINE ---

/**
 * Dynamically populates the <head> tag with SEO and social media metadata.
 * @param {object} meta - The meta object from resume.json.
 */
// In script.js
function renderMetadata(meta) {
    if (!meta) return;

    document.title = meta.title;
    const createMetaTag = (attrs) => {
        // Find by name OR property to correctly update any tag
        let el = document.querySelector(`meta[name="${attrs.name}"], meta[property="${attrs.property}"]`);
        if (!el) {
            el = document.createElement('meta');
            document.head.appendChild(el);
        }
        Object.keys(attrs).forEach(attr => el.setAttribute(attr, attrs[attr]));
    };

    createMetaTag({ name: 'description', content: meta.description });
    createMetaTag({ name: 'keywords', content: meta.keywords });

    // Open Graph
    createMetaTag({ property: 'og:title', content: meta.social.ogTitle });
    createMetaTag({ property: 'og:description', content: meta.social.ogDescription });
    createMetaTag({ property: 'og:image', content: meta.social.imageUrl });
    createMetaTag({ property: 'og:url', content: meta.social.resumeUrl });
    createMetaTag({ property: 'og:type', content: 'website' });
    
    // Twitter Card
    createMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
    createMetaTag({ name: 'twitter:title', content: meta.social.ogTitle });
    createMetaTag({ name: 'twitter:description', content: meta.social.twitterDescription });
    createMetaTag({ name: 'twitter:image', content: meta.social.imageUrl });
    
    // Structured Data (JSON-LD)
    let ldJsonScript = document.querySelector('script[type="application/ld+json"]');
    if (!ldJsonScript) {
        ldJsonScript = document.createElement('script');
        ldJsonScript.type = 'application/ld+json';
        document.head.appendChild(ldJsonScript);
    }
    const sd = meta.structuredData;
    ldJsonScript.textContent = JSON.stringify({
        "@context": "https://schema.org/", "@type": "Person", "name": sd.name, "jobTitle": sd.jobTitle, "url": meta.social.resumeUrl, "image": sd.image,
        "address": { "@type": "PostalAddress", "addressLocality": sd.addressLocality, "addressCountry": sd.addressCountry },
        "email": sd.email, "telephone": sd.telephone, "sameAs": sd.sameAs, "knowsAbout": sd.knowsAbout
    }, null, 2);
}

function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Optional: stop observing after it's visible
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of the section is visible

    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Renders the entire body of the resume by populating the header and main content container.
 * @param {object} data - The full resume data object.
 */
function renderResume(data) {
    renderHeader(data.personalInfo);
    const mainContainer = document.getElementById('resume-content-container');
    mainContainer.innerHTML = ''; 
    data.sections.forEach(section => {
        mainContainer.innerHTML += generateSectionHtml(section);
    });
}

/**
 * Creates the HTML for a full section wrapper (e.g., Experience, Projects).
 * @param {object} section - A section object from resume.json.
 * @returns {string} The complete HTML for a section.
 */
function generateSectionHtml(section) {
    let contentHtml = '';
    switch (section.type) {
        case 'summary': contentHtml = `<p class="summary-text">${section.content}</p>`; break;
        case 'technologies': contentHtml = generateTechnologiesHtml(section.items); break;
        case 'experience': contentHtml = generateExperienceHtml(section.items); break;
        case 'projects': contentHtml = generateProjectsHtml(section.items); break;
        case 'education': contentHtml = generateEducationHtml(section.items); break;
        default: return ''; 
    }
    return `<div class="section"><div class="section-title">${section.title}</div>${contentHtml}</div>`;
}


// --- RENDER HELPER FUNCTIONS ---

function renderHeader(personalInfo) {
    document.getElementById('name').textContent = personalInfo.name;
    document.getElementById('title').textContent = personalInfo.title;
    const contact = personalInfo.contact;
    document.getElementById('contact-info').innerHTML = `
        📍 ${contact.location}<br>
        📞 ${contact.phone} | ✉️ <a href="mailto:${contact.email}">${contact.email}</a><br>
        🔗 <a href="${contact.linkedin}" target="_blank">LinkedIn Profile</a> | 💻 <a href="${contact.github}" target="_blank">GitHub Portfolio</a>
    `;
}

function generateTechnologiesHtml(items) {
    const categoriesHtml = items.map(item => {
        const skillsText = '• ' + item.skills.join(' &nbsp;•&nbsp; '); 
        return `<div class="skill-category"><div class="skill-category-title">${item.category}</div><div class="skill-category-content">${skillsText}</div></div>`;
    }).join('');
    return `<div class="skills-grid">${categoriesHtml}</div>`;
}

function generateExperienceHtml(items) {
    return items.map(job => {
        const achievementsHtml = job.achievements.map(item => `<li>${item}</li>`).join('');
        return `<div class="job"><div class="job-header"><div class="company">${job.company} • ${job.role}</div></div><div class="job-details">${job.period}</div><ul class="achievements">${achievementsHtml}</ul></div>`;
    }).join('');
}

function generateProjectsHtml(items) {
    return items.map(project => {
        const titleHtml = project.url ? `<a href="${project.url}" target="_blank">${project.name}</a>` : project.name;
        return `<div class="project"><div class="project-name">${titleHtml}</div><div class="project-description">${project.description}</div></div>`;
    }).join('');
}

function generateEducationHtml(items) {
    return items.map(edu => `<div class="education-item"><div class="degree">${edu.degree}</div><div class="institution">${edu.institution}</div></div>`).join('');
}


// --- UI EVENT LISTENERS AND HELPERS ---
/**
 * Sets up all interactive elements on the page.
 */
function setupEventListeners() {
    const fabMainBtn = document.getElementById('fab-main-btn');
    const fabContainer = document.querySelector('.fab-container');
    const darkToggleBtn = document.getElementById('darkToggleBtn');
    const toggleQrBtn = document.getElementById('toggleQrBtn');
    const toggleImageBtn = document.getElementById('toggleImageBtn'); 
    const printBtn = document.getElementById('printBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');

    fabMainBtn?.addEventListener('click', () => fabContainer.classList.toggle('active'));
    window.addEventListener('click', (e) => { if (!fabContainer?.contains(e.target)) fabContainer?.classList.remove('active'); });

    darkToggleBtn?.addEventListener('click', () => { document.body.classList.toggle('dark-mode');  });
    toggleQrBtn?.addEventListener('click', () => { document.body.classList.toggle('qr-hidden'); });
    toggleImageBtn.addEventListener('click', () => {
        document.body.classList.toggle('no-image');

        const useTag = toggleImageBtn.querySelector('use');
        const isImageHidden = document.body.classList.contains('no-image');

         if (isImageHidden) {
            // CORRECTED: Use local reference
            useTag.setAttribute('href', '#person-off');
            toggleImageBtn.title = 'Show Profile Image';
        } else {
            // CORRECTED: Use local reference
            useTag.setAttribute('href', '#person');
            toggleImageBtn.title = 'Hide Image (for ATS)';
        }
    });
    printBtn?.addEventListener('click', () => { fabContainer.classList.remove('active'); window.print(); });
    downloadPdfBtn?.addEventListener('click', () => { fabContainer.classList.remove('active'); downloadPdf(); });

    document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'p') { e.preventDefault(); window.print(); } });
}

/**
 * Generates and downloads a PDF by applying a special CSS class that mimics the print layout.
 */
function downloadPdf() {
    const resumeContainer = document.getElementById('resume-container');
    const filename = `Resume - ${originalData.personalInfo.name}.pdf`;

    document.body.classList.add('pdf-generating');
    document.body.classList.add('pdf-view');

    const opt = {
        margin:       0.20, // Set to 0 because our .pdf-view class now handles the margins via padding
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak:    { mode: 'css', avoid: ['.job', '.project', '.education-item', '.skill-category'] }
    };

    html2pdf().from(resumeContainer).set(opt).save().finally(() => {
        document.body.classList.remove('pdf-generating');
        document.body.classList.remove('pdf-view');
    });
}

// --- Asynchronous Visitor Badge Loader ---
window.addEventListener('load', function() {
    const badgeContainer = document.getElementById('visitor-badge-container');
    if (badgeContainer) {
        const badgeImg = new Image();
        badgeImg.onload = () => { badgeImg.alt = 'Visitor Count'; badgeContainer.appendChild(badgeImg); };
        badgeImg.onerror = () => { console.log('Visitor badge failed to load.'); badgeContainer.style.display = 'none'; };
        badgeImg.src = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fadnaanaeem.github.io%2Fresume%2F&count_bg=%2328A745&title_bg=%23555555&icon=&title=Visitors&edge_flat=false';
    }
});