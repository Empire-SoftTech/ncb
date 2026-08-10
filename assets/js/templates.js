document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const isGallery = document.getElementById('template-gallery');
    const isDetail = document.getElementById('template-detail');

    try {
        const templates = window.TEMPLATES_DATA;
        if (!templates) throw new Error('Failed to load templates data');

        if (isGallery) {
            renderGallery(templates);
        }

        if (isDetail) {
            renderDetail(templates);
        }
    } catch (error) {
        console.error('Error loading templates:', error);
        if (isGallery) isGallery.innerHTML = '<p class="text-center text-red-500 py-10">Failed to load templates. Please try again later.</p>';
        if (isDetail) isDetail.innerHTML = '<p class="text-center text-red-500 py-10">Template not found.</p>';
    }
});

/**
 * URL of a template's static landing page.
 *
 * Cards used to point at `template.html?id=<id>` — a JS-rendered shell, so
 * every template shared one URL and the HTML a crawler saw first was just a
 * spinner. Each template now has its own pre-rendered page; the slug is
 * derived from the title, which is identical in templates_data.js and the
 * app's seed data (verified for all 29).
 */
function templateUrl(t) {
    const slug = String(t.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    return slug ? `${slug}-resume-template.html` : `template.html?id=${t.id}`;
}

function formatCategory(category) {
    if (!category) return 'Professional';
    const map = {
        'ats_optimized': 'ATS Friendly',
        'professional': 'Professional',
        'modern': 'Modern',
        'creative': 'Creative',
        'executive': 'Executive',
        'fresher': 'Fresher',
        'minimal': 'Minimal',
        'corporate': 'Corporate'
    };
    return map[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

// ── Thumbnail mockups ───────────────────────────────────────────────────
// One dedicated mockup per template ID (not a category guess) — column
// layout, header style, section order and skill-display style are all
// pulled directly from that template's real Flutter renderer widget
// (lib/features/resume/presentation/widgets/renderers/*.dart), so each
// thumbnail actually matches the app instead of approximating a family.
const _F = "font-family='Arial, Helvetica, sans-serif'";
const _GRAY = '#64748B';
const _GRAY_LT = '#94A3B8';
const _DEFAULT_CS = { primary: '#2563EB', secondary: '#1D4ED8', text: '#0F172A', background: '#FFFFFF' };

function _outlineChip(x, y, w, label, color, textColor) {
    return `
        <rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="none" stroke="${color}" stroke-width="1.2" />
        <text x="${x + w / 2}" y="${y + 13.5}" font-size="7.5" fill="${textColor}" text-anchor="middle" ${_F}>${label}</text>`;
}

function _filledChip(x, y, w, label, color) {
    return `
        <rect x="${x}" y="${y}" width="${w}" height="20" rx="10" fill="${color}" />
        <text x="${x + w / 2}" y="${y + 13.5}" font-size="7.5" fill="#FFFFFF" font-weight="600" text-anchor="middle" ${_F}>${label}</text>`;
}

function _dot(cx, cy, r, color) {
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" />`;
}

function _check(x, y, color) {
    return `<path d="M${x} ${y + 4} L${x + 3} ${y + 7} L${x + 8} ${y}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />`;
}

function _badge(cx, cy, r, color) {
    return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="${color}" transform="rotate(45 ${cx} ${cy})" />`;
}

function buildThumbnailSvg(t) {
    const cs = t.colorScheme || _DEFAULT_CS;
    const fn = _TEMPLATE_RENDERERS[t.id];
    return fn ? fn(cs) : _tplFallback(cs);
}

function _tplFallback(cs) {
    return _tplAts01(cs);
}
// seed_ats_01 — AtsProRenderer: 1-col, blue name/labels, checkmark certifications
function _tplAts01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, cs.text);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <text x="40" y="56" font-size="20" font-weight="700" fill="${cs.primary}" ${_F}>Priya Sharma</text>
        <text x="40" y="74" font-size="7.5" fill="${_GRAY}" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA  -  linkedin.com/in/priyasharma</text>
        <rect x="40" y="84" width="320" height="3" fill="${cs.primary}" />

        <text x="40" y="106" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>PROFESSIONAL SUMMARY</text>
        <line x1="40" y1="112" x2="360" y2="112" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        <text x="40" y="126" font-size="7.5" fill="${_GRAY}" ${_F}>Data scientist with 8 years turning complex datasets into actionable</text>
        <text x="40" y="137" font-size="7.5" fill="${_GRAY}" ${_F}>business insights. Expert in NLP, recommendation systems and MLOps.</text>

        <text x="40" y="159" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="40" y1="165" x2="360" y2="165" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        <text x="40" y="181" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="181" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="193" font-size="7.5" fill="${_GRAY}" ${_F}>Amazon, Retail Personalization</text>
        <text x="48" y="207" font-size="7.3" fill="${_GRAY}" ${_F}>-  Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="48" y="219" font-size="7.3" fill="${_GRAY}" ${_F}>-  Built recommendation engine serving 10M+ users in production</text>
        <text x="40" y="238" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="360" y="238" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="40" y="250" font-size="7.5" fill="${_GRAY}" ${_F}>Meta, Customer Analytics</text>
        <text x="48" y="264" font-size="7.3" fill="${_GRAY}" ${_F}>-  Designed A/B testing framework adopted across 6 product teams</text>

        <text x="40" y="288" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="294" x2="360" y2="294" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        <text x="40" y="309" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="309" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="321" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University</text>

        <text x="40" y="345" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SKILLS</text>
        <line x1="40" y1="351" x2="360" y2="351" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        ${chip(40, 359, 66, 'Python')}
        ${chip(114, 359, 104, 'Machine Learning')}
        ${chip(226, 359, 58, 'SQL')}
        ${chip(40, 387, 58, 'AWS')}
        ${chip(106, 387, 90, 'Leadership')}

        <text x="40" y="431" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>CERTIFICATIONS</text>
        <line x1="40" y1="437" x2="360" y2="437" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        ${_check(40, 448, cs.primary)}
        <text x="54" y="456" font-size="7.5" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>
        ${_check(40, 464, cs.primary)}
        <text x="54" y="472" font-size="7.5" fill="${_GRAY}" ${_F}>Google Cloud Professional Data Engineer</text>

        <text x="40" y="500" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="506" x2="360" y2="506" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
        <text x="40" y="521" font-size="7.5" fill="${_GRAY}" ${_F}>English - Native  -  Hindi - Fluent  -  Spanish - Conversational</text>

        <text x="40" y="545" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="551" x2="360" y2="551" stroke="${cs.primary}" stroke-width="0.5" opacity="0.3" />
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_ats_02 — AtsMinimalRenderer: 2-col sidebar-left (light slate), dot skills, header in main col
function _tplAts02(cs) {
    const dot = (x, y, label) => `${_dot(x, y - 3, 1.6, cs.primary)}<text x="${x + 8}" y="${y}" font-size="7" fill="#334155" ${_F}>${label}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="150" height="565" fill="#F8FAFC" />

        <text x="18" y="40" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>CONTACT</text>
        <text x="18" y="54" font-size="6.8" fill="${_GRAY}" ${_F}>priya.sharma@email.com</text>
        <text x="18" y="65" font-size="6.8" fill="${_GRAY}" ${_F}>(555) 018-2394</text>
        <text x="18" y="76" font-size="6.8" fill="${_GRAY}" ${_F}>San Francisco, CA</text>
        <text x="18" y="87" font-size="6.8" fill="${_GRAY}" ${_F}>linkedin.com/in/priyasharma</text>

        <text x="18" y="112" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>SKILLS</text>
        ${dot(18, 126, 'Python')}
        ${dot(18, 138, 'Machine Learning')}
        ${dot(18, 150, 'SQL')}
        ${dot(18, 162, 'AWS')}
        ${dot(18, 174, 'Leadership')}

        <text x="18" y="200" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>LANGUAGES</text>
        <text x="18" y="213" font-size="6.8" fill="${_GRAY}" ${_F}>English - Native</text>
        <text x="18" y="224" font-size="6.8" fill="${_GRAY}" ${_F}>Hindi - Fluent</text>

        <text x="18" y="250" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>CERTIFICATIONS</text>
        <text x="18" y="263" font-size="6.5" fill="${_GRAY}" ${_F}>AWS Solutions Architect</text>
        <text x="18" y="274" font-size="6.5" fill="${_GRAY}" ${_F}>GCP Data Engineer</text>

        <text x="18" y="300" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>TOOLS</text>
        <text x="18" y="313" font-size="6.5" fill="${_GRAY}" ${_F}>Git, Airflow, Docker</text>
        <text x="18" y="324" font-size="6.5" fill="${_GRAY}" ${_F}>Tableau, Jupyter</text>

        <text x="170" y="48" font-size="17" font-weight="700" fill="${cs.text}" ${_F}>Priya Sharma</text>
        <text x="170" y="63" font-size="9" fill="${_GRAY}" ${_F}>Senior Data Scientist</text>
        <line x1="170" y1="74" x2="360" y2="74" stroke="${_GRAY_LT}" stroke-width="1" />

        <text x="170" y="94" font-size="8.5" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>SUMMARY</text>
        <line x1="170" y1="99" x2="360" y2="99" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="112" font-size="7" fill="${_GRAY}" ${_F}>Data scientist, 8 years, NLP, recommendation systems, MLOps.</text>

        <text x="170" y="134" font-size="8.5" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>EXPERIENCE</text>
        <line x1="170" y1="139" x2="360" y2="139" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="152" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="152" font-size="6.8" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="170" y="162" font-size="7" fill="${_GRAY}" ${_F}>Amazon</text>
        <text x="176" y="174" font-size="6.8" fill="${_GRAY}" ${_F}>-  Reduced churn 34% via real-time ML experimentation</text>
        <text x="170" y="192" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="360" y="192" font-size="6.8" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="170" y="202" font-size="7" fill="${_GRAY}" ${_F}>Meta</text>
        <text x="176" y="214" font-size="6.8" fill="${_GRAY}" ${_F}>-  Designed A/B testing framework, 6 product teams</text>

        <text x="170" y="238" font-size="8.5" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>EDUCATION</text>
        <line x1="170" y1="243" x2="360" y2="243" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="256" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science</text>
        <text x="170" y="267" font-size="7" fill="${_GRAY}" ${_F}>Stanford University - 2018</text>

        <text x="170" y="291" font-size="8.5" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>ACTIVITIES</text>
        <line x1="170" y1="296" x2="360" y2="296" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="309" font-size="6.8" fill="${_GRAY}" ${_F}>-  Women in Data Science (WiDS) Stanford chapter, Co-organizer</text>

        <text x="170" y="333" font-size="8.5" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>PROJECTS</text>
        <line x1="170" y1="338" x2="360" y2="338" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="351" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Capstone</text>
        <text x="176" y="363" font-size="6.8" fill="${_GRAY}" ${_F}>-  Open-sourced pipeline adopted by 3 external teams</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_pro_01 — ExecutiveClassicRenderer: full-width navy header above a 2-col row
function _tplPro01(cs) {
    const dot = (x, y, label) => `${_dot(x, y - 3, 1.6, cs.primary)}<text x="${x + 8}" y="${y}" font-size="7" fill="#334155" ${_F}>${label}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="400" height="90" fill="${cs.primary}" />
        <text x="40" y="42" font-size="21" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="40" y="62" font-size="9.5" fill="#FFFFFF" opacity="0.75" ${_F}>Senior Data Scientist  -  priya.sharma@email.com  -  (555) 018-2394</text>
        <text x="40" y="76" font-size="9.5" fill="#FFFFFF" opacity="0.75" ${_F}>San Francisco, CA</text>

        <rect x="0" y="90" width="150" height="475" fill="#F0F4F8" />

        <text x="18" y="115" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>PROFILE</text>
        <text x="18" y="128" font-size="6.8" fill="${_GRAY}" ${_F}>8 years turning datasets</text>
        <text x="18" y="139" font-size="6.8" fill="${_GRAY}" ${_F}>into business insights.</text>

        <text x="18" y="163" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>SKILLS</text>
        ${dot(18, 177, 'Python')}
        ${dot(18, 189, 'Machine Learning')}
        ${dot(18, 201, 'SQL')}
        ${dot(18, 213, 'AWS')}

        <text x="18" y="238" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>LANGUAGES</text>
        ${dot(18, 252, 'English - Native')}
        ${dot(18, 264, 'Hindi - Fluent')}

        <text x="18" y="289" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>CERTIFICATIONS</text>
        ${dot(18, 303, 'AWS Solutions Arch.')}
        ${dot(18, 315, 'GCP Data Engineer')}

        <text x="170" y="118" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="170" y1="124" x2="360" y2="124" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="140" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="140" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="170" y="152" font-size="7.5" fill="${_GRAY}" ${_F}>Amazon</text>
        <text x="178" y="166" font-size="7.3" fill="${_GRAY}" ${_F}>-  Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="170" y="188" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="360" y="188" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="170" y="200" font-size="7.5" fill="${_GRAY}" ${_F}>Meta</text>
        <text x="178" y="214" font-size="7.3" fill="${_GRAY}" ${_F}>-  Designed A/B testing framework, 6 product teams</text>

        <text x="170" y="242" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="170" y1="248" x2="360" y2="248" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="264" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="264" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="170" y="276" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University</text>

        <text x="170" y="300" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>PROJECTS</text>
        <line x1="170" y1="306" x2="360" y2="306" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="321" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Platform</text>
        <text x="178" y="334" font-size="7.3" fill="${_GRAY}" ${_F}>-  Open-source ML pipeline adopted by 3 external teams</text>

        <text x="170" y="358" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="170" y1="364" x2="360" y2="364" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="178" y="378" font-size="7.3" fill="${_GRAY}" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
        <text x="178" y="390" font-size="7.3" fill="${_GRAY}" ${_F}>-  Guest lecturer, Stanford CS229 Machine Learning</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_pro_02 — TwoColumnSidebarRenderer "Corporate Blue": avatar + navy sidebar full height, filled chips
function _tplPro02(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="150" height="565" fill="#1E3A5F" />

        <circle cx="75" cy="52" r="30" fill="none" stroke="${cs.secondary}" stroke-width="2" />
        <text x="75" y="60" font-size="18" font-weight="700" fill="#FFFFFF" text-anchor="middle" ${_F}>PS</text>
        <text x="75" y="100" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle" ${_F}>Priya Sharma</text>
        <text x="75" y="113" font-size="8" fill="${cs.secondary}" text-anchor="middle" ${_F}>Senior Data Scientist</text>

        <text x="18" y="140" font-size="7.5" font-weight="700" fill="${cs.secondary}" letter-spacing="1" ${_F}>CONTACT</text>
        <text x="18" y="153" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>priya.sharma@email.com</text>
        <text x="18" y="164" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>(555) 018-2394</text>
        <text x="18" y="175" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>San Francisco, CA</text>

        <text x="18" y="200" font-size="7.5" font-weight="700" fill="${cs.secondary}" letter-spacing="1" ${_F}>SKILLS</text>
        <rect x="18" y="209" width="66" height="17" rx="8.5" fill="#274A72" />
        <text x="51" y="221" font-size="6.8" fill="#FFFFFF" opacity="0.85" text-anchor="middle" ${_F}>Python</text>
        <rect x="18" y="231" width="100" height="17" rx="8.5" fill="#274A72" />
        <text x="68" y="243" font-size="6.8" fill="#FFFFFF" opacity="0.85" text-anchor="middle" ${_F}>Machine Learning</text>
        <rect x="18" y="253" width="56" height="17" rx="8.5" fill="#274A72" />
        <text x="46" y="265" font-size="6.8" fill="#FFFFFF" opacity="0.85" text-anchor="middle" ${_F}>SQL</text>
        <rect x="18" y="275" width="56" height="17" rx="8.5" fill="#274A72" />
        <text x="46" y="287" font-size="6.8" fill="#FFFFFF" opacity="0.85" text-anchor="middle" ${_F}>AWS</text>

        <text x="18" y="313" font-size="7.5" font-weight="700" fill="${cs.secondary}" letter-spacing="1" ${_F}>LANGUAGES</text>
        <text x="18" y="326" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>English - Native</text>
        <text x="18" y="337" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>Hindi - Fluent</text>

        <text x="170" y="46" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>PROFESSIONAL SUMMARY</text>
        <line x1="170" y1="52" x2="360" y2="52" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="66" font-size="7.3" fill="${_GRAY}" ${_F}>8 years turning complex datasets into actionable business insights</text>

        <text x="170" y="90" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="170" y1="96" x2="360" y2="96" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="111" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="111" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="170" y="123" font-size="7.5" fill="${_GRAY}" ${_F}>Amazon</text>
        <text x="178" y="137" font-size="7.3" fill="${_GRAY}" ${_F}>-  Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="170" y="159" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="360" y="159" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="170" y="171" font-size="7.5" fill="${_GRAY}" ${_F}>Meta</text>
        <text x="178" y="185" font-size="7.3" fill="${_GRAY}" ${_F}>-  Designed A/B testing framework, 6 product teams</text>

        <text x="170" y="209" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="170" y1="215" x2="360" y2="215" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="230" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="230" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="170" y="242" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University</text>

        <text x="170" y="266" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>CERTIFICATIONS</text>
        <line x1="170" y1="272" x2="360" y2="272" stroke="${_GRAY_LT}" stroke-width="0.5" />
        ${_check(170, 280, cs.secondary)}
        <text x="184" y="288" font-size="7.3" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>

        <text x="170" y="312" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>PROJECTS</text>
        <line x1="170" y1="318" x2="360" y2="318" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="170" y="333" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Platform</text>
        <text x="178" y="346" font-size="7.3" fill="${_GRAY}" ${_F}>-  Open-source ML pipeline adopted by 3 external teams</text>
        <text x="178" y="358" font-size="7.3" fill="${_GRAY}" ${_F}>-  Presented at internal engineering all-hands</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_pro_03 — LegalFormalRenderer: centered header, double rule, monochrome, middot skills
function _tplPro03(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="200" y="52" font-size="20" font-weight="700" fill="#000000" letter-spacing="2" text-anchor="middle" ${_F}>PRIYA SHARMA</text>
        <text x="200" y="68" font-size="8" fill="#4B5563" letter-spacing="1.5" text-anchor="middle" ${_F}>SENIOR DATA SCIENTIST</text>
        <text x="200" y="84" font-size="7.5" fill="#4B5563" text-anchor="middle" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <line x1="40" y1="94" x2="360" y2="94" stroke="#000000" stroke-width="1.5" />
        <line x1="40" y1="98" x2="360" y2="98" stroke="#000000" stroke-width="0.4" />

        <text x="40" y="120" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>PROFESSIONAL STATEMENT</text>
        <line x1="40" y1="126" x2="360" y2="126" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="140" font-size="7.5" fill="#374151" ${_F}>Data scientist with 8 years turning complex datasets into actionable</text>
        <text x="40" y="151" font-size="7.5" fill="#374151" ${_F}>business insights across NLP, recommendation systems and MLOps.</text>

        <text x="40" y="174" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>PROFESSIONAL EXPERIENCE</text>
        <line x1="40" y1="180" x2="360" y2="180" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="196" font-size="9.5" font-weight="700" fill="#000000" ${_F}>Senior Data Scientist</text>
        <text x="360" y="196" font-size="7.5" fill="#6B7280" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="208" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Amazon</text>
        <text x="48" y="222" font-size="7.3" fill="#374151" ${_F}>-  Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="40" y="242" font-size="9.5" font-weight="700" fill="#000000" ${_F}>Data Scientist</text>
        <text x="360" y="242" font-size="7.5" fill="#6B7280" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="40" y="254" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Meta</text>
        <text x="48" y="268" font-size="7.3" fill="#374151" ${_F}>-  Designed A/B testing framework adopted across 6 product teams</text>

        <text x="40" y="292" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>EDUCATION &amp; QUALIFICATIONS</text>
        <line x1="40" y1="298" x2="360" y2="298" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="312" font-size="9.5" font-weight="700" fill="#000000" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="312" font-size="7.5" fill="#6B7280" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="324" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Stanford University</text>

        <text x="40" y="348" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>AREAS OF PRACTICE</text>
        <line x1="40" y1="354" x2="360" y2="354" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="368" font-size="7.5" fill="#374151" ${_F}>Python  -  Machine Learning  -  SQL  -  AWS  -  Leadership</text>

        <text x="40" y="392" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>PROFESSIONAL MEMBERSHIPS &amp; CERTIFICATIONS</text>
        <line x1="40" y1="398" x2="360" y2="398" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="412" font-size="7.5" fill="#374151" ${_F}>AWS Solutions Architect - Professional  -  GCP Data Engineer</text>

        <text x="40" y="436" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="442" x2="360" y2="442" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="456" font-size="7.5" fill="#374151" ${_F}>English  -  Hindi  -  Spanish</text>

        <text x="40" y="480" font-size="9" font-weight="700" fill="#000000" letter-spacing="0.5" ${_F}>ACTIVITIES &amp; PROFESSIONAL DEVELOPMENT</text>
        <line x1="40" y1="486" x2="360" y2="486" stroke="#9CA3AF" stroke-width="0.5" />
        <text x="40" y="500" font-size="7.5" fill="#374151" ${_F}>Guest lecturer, Stanford Continuing Studies data ethics seminar</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_vet_01 — VeteranTransitionRenderer: olive-dark band w/ lighter-olive overlay block, olive stripe
function _tplVet01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, '#2D4A25');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="400" height="96" fill="#2D4A25" />
        <rect x="280" width="120" height="96" fill="#4D6A3F" />
        <text x="40" y="44" font-size="20" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="40" y="62" font-size="9.5" fill="#FFFFFF" opacity="0.8" ${_F}>Senior Data Scientist</text>
        <text x="40" y="78" font-size="7.5" fill="#FFFFFF" opacity="0.7" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <rect x="0" y="96" width="400" height="4" fill="${cs.primary}" />

        <rect x="40" y="118" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="123" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>CIVILIAN OBJECTIVE</text>
        <text x="40" y="140" font-size="7.5" fill="${_GRAY}" ${_F}>Data scientist with 8 years, transitioning military discipline into</text>
        <text x="40" y="151" font-size="7.5" fill="${_GRAY}" ${_F}>enterprise ML leadership across NLP and recommendation systems.</text>

        <rect x="40" y="172" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="177" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>CORE COMPETENCIES</text>
        ${chip(40, 188, 66, 'Python')}
        ${chip(114, 188, 104, 'Machine Learning')}
        ${chip(226, 188, 58, 'SQL')}
        ${chip(40, 216, 58, 'AWS')}
        ${chip(106, 216, 90, 'Leadership')}

        <rect x="40" y="256" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="261" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>MILITARY &amp; PROFESSIONAL EXPERIENCE</text>
        <text x="40" y="279" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="279" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="291" font-size="7.5" fill="${_GRAY}" ${_F}>Amazon</text>
        <text x="48" y="305" font-size="7.3" fill="${_GRAY}" ${_F}>-  Reduced customer churn 34% via real-time ML experimentation</text>

        <rect x="40" y="330" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="335" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>EDUCATION &amp; TRAINING</text>
        <text x="40" y="353" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="353" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="365" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University</text>

        <rect x="40" y="386" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="391" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>AWARDS &amp; DECORATIONS</text>
        <text x="40" y="408" font-size="7.5" fill="${_GRAY}" ${_F}>-  Meritorious Service Medal, U.S. Army</text>
        <text x="40" y="420" font-size="7.5" fill="${_GRAY}" ${_F}>-  Data Science Leadership Award, Amazon 2023</text>

        <rect x="40" y="442" width="20" height="2" fill="${cs.primary}" />
        <text x="66" y="447" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <text x="40" y="464" font-size="7.5" fill="${_GRAY}" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_edu_01 — EducationTeachingRenderer: amber gradient header, circular icon badge, fully-rounded pills
function _tplEdu01(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#B45309" /><stop offset="1" stop-color="#D97706" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="400" height="98" fill="url(#g)" />
        <circle cx="65" cy="46" r="25" fill="#FFFFFF" opacity="0.25" />
        <text x="65" y="53" font-size="16" fill="#FFFFFF" text-anchor="middle" ${_F}>ED</text>
        <text x="102" y="42" font-size="19" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="102" y="59" font-size="9.5" fill="#FFFFFF" opacity="0.8" ${_F}>Senior Data Scientist</text>
        <text x="40" y="82" font-size="7.5" fill="#FFFFFF" opacity="0.75" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <rect x="0" y="98" width="400" height="3" fill="#92400E" />

        <text x="40" y="122" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>TEACHING PHILOSOPHY</text>
        <line x1="40" y1="128" x2="360" y2="128" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        <text x="40" y="142" font-size="7.5" fill="${_GRAY}" ${_F}>Believes in data-driven mentorship, translating ML concepts into</text>
        <text x="40" y="153" font-size="7.5" fill="${_GRAY}" ${_F}>accessible lessons for cross-functional teams.</text>

        <text x="40" y="176" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>TEACHING EXPERIENCE</text>
        <line x1="40" y1="182" x2="360" y2="182" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        <text x="40" y="197" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist &amp; Mentor</text>
        <text x="360" y="197" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="209" font-size="7.5" fill="${_GRAY}" ${_F}>Amazon</text>
        <text x="48" y="223" font-size="7.3" fill="${_GRAY}" ${_F}>-  Mentored 5 junior analysts, taught internal ML workshops</text>

        <text x="40" y="247" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SKILLS &amp; SPECIALIZATIONS</text>
        <line x1="40" y1="253" x2="360" y2="253" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        ${chip(40, 261, 66, 'Python')}
        ${chip(114, 261, 104, 'Machine Learning')}
        ${chip(226, 261, 58, 'SQL')}

        <text x="40" y="311" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="317" x2="360" y2="317" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        <text x="40" y="331" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="331" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="343" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University</text>

        <text x="40" y="367" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>CERTIFICATIONS &amp; LICENSES</text>
        <line x1="40" y1="373" x2="360" y2="373" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        ${_check(40, 383, cs.primary)}
        <text x="54" y="391" font-size="7.3" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>

        <text x="40" y="415" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="421" x2="360" y2="421" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        <text x="40" y="435" font-size="7.5" fill="${_GRAY}" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="459" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="465" x2="360" y2="465" stroke="${cs.primary}" stroke-width="0.5" opacity="0.4" />
        <text x="40" y="479" font-size="7.5" fill="${_GRAY}" ${_F}>-  Volunteer coding instructor, Girls Who Code Bay Area</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_mod_01 — ModernNovaRenderer: purple gradient header, vertical gradient bar labels, lavender cards
function _tplMod01(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const label = (y, text) => `<rect x="40" y="${y - 9}" width="4" height="13" fill="${cs.primary}" /><text x="50" y="${y}" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>${text}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${cs.primary}" /><stop offset="1" stop-color="${cs.secondary}" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="400" height="94" fill="url(#g)" />
        <text x="40" y="46" font-size="21" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="40" y="64" font-size="9.5" fill="#FFFFFF" opacity="0.8" ${_F}>priya.sharma@email.com  -  (555) 018-2394</text>
        <text x="40" y="78" font-size="9.5" fill="#FFFFFF" opacity="0.8" ${_F}>San Francisco, CA  -  linkedin.com/in/priyasharma</text>

        ${label(118, 'ABOUT')}
        <rect x="40" y="126" width="320" height="34" rx="8" fill="#F5F3FF" />
        <text x="50" y="140" font-size="7.3" fill="${_GRAY}" ${_F}>Data scientist, 8 years, NLP, recommendation systems,</text>
        <text x="50" y="152" font-size="7.3" fill="${_GRAY}" ${_F}>MLOps at scale.</text>

        ${label(182, 'EXPERIENCE')}
        <rect x="40" y="190" width="320" height="50" rx="8" fill="#F5F3FF" />
        <text x="48" y="204" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="352" y="204" font-size="7" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="48" y="216" font-size="7.3" fill="${cs.primary}" ${_F}>Amazon</text>
        <text x="48" y="230" font-size="7" fill="${_GRAY}" ${_F}>Reduced customer churn 34% via real-time ML experimentation</text>

        ${label(266, 'SKILLS')}
        ${chip(40, 274, 66, 'Python')}
        ${chip(114, 274, 104, 'Machine Learning')}
        ${chip(226, 274, 58, 'SQL')}

        ${label(324, 'EDUCATION')}
        <text x="40" y="342" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="342" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="354" font-size="7.3" fill="${_GRAY}" ${_F}>Stanford University</text>

        ${label(380, 'CERTIFICATIONS')}
        ${_check(40, 390, cs.primary)}
        <text x="54" y="398" font-size="7.3" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_mod_02 — TealModernRenderer: teal gradient header, small rect+label, bullet-dot experience, outline pills
function _tplMod02(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, '#0F766E');
    const label = (y, text) => `<rect x="40" y="${y - 9}" width="3" height="12" fill="#0F766E" /><text x="49" y="${y}" font-size="9" font-weight="700" fill="#0F766E" ${_F}>${text}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${cs.primary}" /><stop offset="1" stop-color="${cs.secondary}" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="400" height="90" fill="url(#g2)" />
        <text x="40" y="44" font-size="21" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="40" y="62" font-size="9.5" fill="#FFFFFF" opacity="0.85" ${_F}>Senior Data Scientist</text>
        <text x="40" y="76" font-size="7.5" fill="#FFFFFF" opacity="0.75" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>

        ${label(112, 'ABOUT ME')}
        <text x="40" y="128" font-size="7.5" fill="${_GRAY}" ${_F}>Data scientist, 8 years, NLP, recommendation systems, MLOps.</text>

        ${label(152, 'SKILLS')}
        ${chip(40, 160, 66, 'Python')}
        ${chip(114, 160, 104, 'Machine Learning')}
        ${chip(226, 160, 58, 'SQL')}
        ${chip(40, 188, 58, 'AWS')}
        ${chip(106, 188, 90, 'Leadership')}

        ${label(228, 'EXPERIENCE')}
        ${_dot(43, 241, 3, '#0F766E')}
        <text x="52" y="244" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="244" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="52" y="256" font-size="7.3" fill="#0F766E" ${_F}>Amazon  -  2021 - Present</text>
        <text x="52" y="270" font-size="7.3" fill="${_GRAY}" ${_F}>Reduced customer churn 34% via real-time ML experimentation</text>
        ${_dot(43, 291, 3, '#0F766E')}
        <text x="52" y="294" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="360" y="294" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="52" y="306" font-size="7.3" fill="#0F766E" ${_F}>Meta  -  2018 - 2021</text>
        <text x="52" y="320" font-size="7.3" fill="${_GRAY}" ${_F}>Designed A/B testing framework, 6 product teams</text>

        ${label(348, 'EDUCATION')}
        <text x="40" y="364" font-size="9" fill="${cs.text}" ${_F}>M.S. in Computer Science  -  Stanford University  -  2018</text>

        ${label(390, 'ACTIVITIES')}
        <text x="40" y="404" font-size="7.3" fill="${_GRAY}" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_2col_01 — SidebarProRenderer: sky-blue strip name/title in sidebar, dark-slate body, main col plain
function _tpl2col01(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="${cs.background}" />
        <rect width="210" height="565" fill="#1E293B" />
        <rect width="210" height="70" fill="#38BDF8" />
        <text x="18" y="34" font-size="15" font-weight="700" fill="#1E293B" ${_F}>Priya Sharma</text>
        <text x="18" y="50" font-size="8.5" fill="#1E293B" opacity="0.8" ${_F}>Senior Data Scientist</text>

        <text x="18" y="94" font-size="7.5" font-weight="700" fill="#38BDF8" letter-spacing="1" ${_F}>CONTACT</text>
        <text x="18" y="107" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>priya.sharma@email.com</text>
        <text x="18" y="118" font-size="6.6" fill="#FFFFFF" opacity="0.85" ${_F}>(555) 018-2394</text>
        <text x="18" y="129" font-size="6.6" fill="#FFFFFF" opacity="0.6" ${_F}>linkedin.com/in/priyasharma</text>

        <text x="18" y="154" font-size="7.5" font-weight="700" fill="#38BDF8" letter-spacing="1" ${_F}>SKILLS</text>
        <rect x="18" y="163" width="12" height="3" fill="#38BDF8" /><text x="35" y="166" font-size="6.8" fill="#FFFFFF" opacity="0.85" ${_F}>Python</text>
        <rect x="18" y="175" width="12" height="3" fill="#38BDF8" /><text x="35" y="178" font-size="6.8" fill="#FFFFFF" opacity="0.85" ${_F}>Machine Learning</text>
        <rect x="18" y="187" width="12" height="3" fill="#38BDF8" /><text x="35" y="190" font-size="6.8" fill="#FFFFFF" opacity="0.85" ${_F}>SQL</text>
        <rect x="18" y="199" width="12" height="3" fill="#38BDF8" /><text x="35" y="202" font-size="6.8" fill="#FFFFFF" opacity="0.85" ${_F}>AWS</text>

        <text x="18" y="226" font-size="7.5" font-weight="700" fill="#38BDF8" letter-spacing="1" ${_F}>LANGUAGES</text>
        <text x="18" y="239" font-size="6.6" fill="#FFFFFF" opacity="0.54" ${_F}>English - Native</text>
        <text x="18" y="250" font-size="6.6" fill="#FFFFFF" opacity="0.54" ${_F}>Hindi - Fluent</text>

        <rect x="230" y="26" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="29" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>ABOUT</text>
        <line x1="230" y1="36" x2="360" y2="36" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="50" font-size="7.3" fill="${_GRAY}" ${_F}>Data scientist, 8 years, NLP, recommendation</text>
        <text x="230" y="61" font-size="7.3" fill="${_GRAY}" ${_F}>systems, MLOps.</text>

        <rect x="230" y="82" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="85" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>EXPERIENCE</text>
        <line x1="230" y1="92" x2="360" y2="92" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="106" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="230" y="117" font-size="7" fill="#38BDF8" ${_F}>Amazon  -  2021 - Present</text>
        <text x="230" y="130" font-size="6.8" fill="${_GRAY}" ${_F}>Reduced customer churn 34% via real-time ML</text>
        <text x="230" y="151" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist</text>
        <text x="230" y="162" font-size="7" fill="#38BDF8" ${_F}>Meta  -  2018 - 2021</text>

        <rect x="230" y="184" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="187" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>EDUCATION</text>
        <line x1="230" y1="194" x2="360" y2="194" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="208" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science</text>
        <text x="230" y="219" font-size="7" fill="${_GRAY}" ${_F}>Stanford University - 2018</text>

        <rect x="230" y="241" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="244" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>CERTIFICATIONS</text>
        <line x1="230" y1="251" x2="360" y2="251" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="264" font-size="6.8" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>

        <rect x="230" y="291" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="294" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>PROJECTS</text>
        <line x1="230" y1="301" x2="360" y2="301" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="315" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Platform</text>
        <text x="230" y="326" font-size="6.8" fill="${_GRAY}" ${_F}>Open-sourced ML pipeline, adopted by 3 teams</text>

        <rect x="230" y="348" width="14" height="3" fill="#38BDF8" />
        <text x="248" y="351" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>ACTIVITIES</text>
        <line x1="230" y1="358" x2="360" y2="358" stroke="${_GRAY_LT}" stroke-width="0.5" />
        <text x="230" y="372" font-size="6.8" fill="${_GRAY}" ${_F}>Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_cre_01 — CreativePortfolioRenderer: coral vertical bar left edge, huge name, plain coral labels
function _tplCre01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="4" height="565" fill="${cs.primary}" />

        <text x="30" y="58" font-size="26" font-weight="800" fill="${cs.text}" letter-spacing="-0.5" ${_F}>Priya Sharma</text>
        <rect x="30" y="68" width="90" height="16" rx="8" fill="${cs.primary}" />
        <text x="75" y="79" font-size="7.5" fill="#FFFFFF" text-anchor="middle" ${_F}>DATA SCIENTIST</text>
        <text x="30" y="98" font-size="7.5" fill="${_GRAY_LT}" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  priyasharma.ai</text>
        <line x1="30" y1="108" x2="370" y2="108" stroke="#E5E7EB" stroke-width="1" />

        <text x="30" y="130" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>PROFILE</text>
        <text x="30" y="145" font-size="7.5" fill="${_GRAY}" ${_F}>Data scientist, 8 years, NLP, recommendation systems and MLOps.</text>

        <text x="30" y="167" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>EXPERTISE</text>
        ${chip(30, 175, 66, 'Python')}
        ${chip(104, 175, 104, 'Machine Learning')}
        ${chip(216, 175, 58, 'SQL')}

        <text x="30" y="223" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>SELECTED WORK</text>
        <rect x="30" y="231" width="340" height="46" rx="8" fill="#FFF1ED" stroke="#FFE4DA" />
        <text x="40" y="246" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Platform</text>
        <text x="40" y="258" font-size="7" fill="${_GRAY}" ${_F}>Real-time ML pipeline reducing churn by 34% at Amazon scale</text>
        <text x="40" y="270" font-size="6.8" fill="${cs.primary}" ${_F}>-  Python  -  TensorFlow  -  Airflow</text>

        <text x="30" y="300" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>EXPERIENCE</text>
        <text x="30" y="315" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="370" y="315" font-size="7" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="30" y="327" font-size="7.3" fill="${cs.primary}" ${_F}>Amazon  -  2021 - Present</text>
        <text x="30" y="341" font-size="7" fill="${_GRAY}" ${_F}>Built recommendation engine serving 10M+ users in production</text>

        <text x="30" y="365" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>EDUCATION</text>
        <text x="30" y="380" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="30" y="404" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>LANGUAGES</text>
        <text x="30" y="418" font-size="7.3" fill="${_GRAY}" ${_F}>English, Hindi</text>

        <text x="30" y="440" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>CERTIFICATIONS</text>
        <text x="30" y="454" font-size="7.3" fill="${_GRAY}" ${_F}>AWS Solutions Architect - Professional</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_cre_02 — InkTypeRenderer: oversized name, red dash + caps title, em-dash section headers
function _tplCre02(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="30" y="60" font-size="30" font-weight="900" fill="#000000" letter-spacing="-1.2" ${_F}>Priya Sharma</text>
        <rect x="30" y="70" width="42" height="3" fill="#DC2626" />
        <text x="78" y="76" font-size="8" fill="#6B7280" letter-spacing="1.5" ${_F}>DATA SCIENTIST</text>
        <text x="30" y="94" font-size="7.5" fill="#6B7280" ${_F}>priya.sharma@email.com  |  (555) 018-2394  |  San Francisco, CA</text>
        <line x1="30" y1="104" x2="370" y2="104" stroke="#000000" stroke-width="1" />

        <text x="30" y="126" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; ABOUT</text>
        <text x="30" y="141" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Data scientist with 8 years turning complex datasets into actionable</text>
        <text x="30" y="152" font-size="7.5" font-style="italic" fill="#374151" ${_F}>business insights across NLP, recommendation systems and MLOps.</text>

        <text x="30" y="174" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; EXPERIENCE</text>
        <text x="30" y="189" font-size="9" font-weight="700" fill="#000000" ${_F}>Senior Data Scientist</text>
        <text x="370" y="189" font-size="7" font-style="italic" fill="#6B7280" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="30" y="201" font-size="7.3" fill="#4B5563" ${_F}>Amazon</text>
        <text x="30" y="215" font-size="7" fill="#6B7280" ${_F}>Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="30" y="235" font-size="9" font-weight="700" fill="#000000" ${_F}>Data Scientist</text>
        <text x="370" y="235" font-size="7" font-style="italic" fill="#6B7280" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="30" y="247" font-size="7.3" fill="#4B5563" ${_F}>Meta</text>

        <text x="30" y="271" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; SKILLS</text>
        <text x="30" y="286" font-size="7.5" font-weight="700" fill="#000000" ${_F}>Python  -  Machine Learning  -  SQL  -  AWS  -  Leadership</text>

        <text x="30" y="308" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; EDUCATION</text>
        <rect x="30" y="316" width="3" height="3" fill="#DC2626" />
        <text x="38" y="319" font-size="8.5" font-weight="700" fill="#000000" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="30" y="342" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; LANGUAGES</text>
        <text x="30" y="357" font-size="7.3" fill="#374151" ${_F}>English, Hindi</text>

        <text x="30" y="379" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; CERTIFICATIONS</text>
        <text x="30" y="394" font-size="7.3" fill="#374151" ${_F}>AWS Solutions Architect - Professional</text>

        <text x="30" y="416" font-size="8.5" font-weight="700" fill="#DC2626" letter-spacing="1" ${_F}>&#8212; ACTIVITIES</text>
        <text x="30" y="431" font-size="7.3" fill="#374151" ${_F}>Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_des_01 — DesignPortfolioRenderer: flat pink top band, huge name, pill skills near top, 3-up project cards
function _tplDes01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, cs.primary);
    const label = (y, text) => `<rect x="30" y="${y - 9}" width="20" height="2" fill="${cs.primary}" /><text x="54" y="${y}" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>${text}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="8" fill="${cs.primary}" />

        <text x="30" y="56" font-size="28" font-weight="900" fill="${cs.text}" letter-spacing="-1" ${_F}>Priya Sharma</text>
        <text x="30" y="72" font-size="10" fill="${cs.primary}" ${_F}>Senior Data Scientist</text>
        <text x="30" y="88" font-size="7.3" fill="${_GRAY_LT}" ${_F}>priya.sharma@email.com  .  (555) 018-2394  .  San Francisco, CA</text>
        ${chip(30, 96, 60, 'Python')}
        ${chip(96, 96, 96, 'Machine Learning')}
        ${chip(198, 96, 52, 'SQL')}
        <line x1="30" y1="128" x2="370" y2="128" stroke="#FBCFE8" stroke-width="1" />

        ${label(150, 'PORTFOLIO')}
        <rect x="30" y="158" width="108" height="60" rx="10" fill="#FDF2F8" stroke="#FBCFE8" />
        <text x="84" y="176" font-size="7.5" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>Churn Model</text>
        <text x="84" y="190" font-size="6.5" fill="${_GRAY}" text-anchor="middle" ${_F}>Real-time ML</text>
        <rect x="146" y="158" width="108" height="60" rx="10" fill="#FDF2F8" stroke="#FBCFE8" />
        <text x="200" y="176" font-size="7.5" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>Rec Engine</text>
        <text x="200" y="190" font-size="6.5" fill="${_GRAY}" text-anchor="middle" ${_F}>10M+ users</text>
        <rect x="262" y="158" width="108" height="60" rx="10" fill="#FDF2F8" stroke="#FBCFE8" />
        <text x="316" y="176" font-size="7.5" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>A/B Platform</text>
        <text x="316" y="190" font-size="6.5" fill="${_GRAY}" text-anchor="middle" ${_F}>6 teams</text>

        ${label(244, 'EXPERIENCE')}
        <text x="30" y="260" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="30" y="272" font-size="7.3" fill="${cs.primary}" ${_F}>Amazon  .  2021 - Present</text>

        ${label(298, 'EDUCATION')}
        <text x="30" y="314" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  .  Stanford University  .  2018</text>

        ${label(340, 'LANGUAGES')}
        <text x="30" y="354" font-size="7.3" fill="${_GRAY}" ${_F}>English, Hindi</text>

        ${label(382, 'CERTIFICATIONS')}
        <text x="30" y="396" font-size="7.3" fill="${_GRAY}" ${_F}>AWS Solutions Architect  .  GCP Data Engineer</text>

        ${label(424, 'ACTIVITIES')}
        <text x="30" y="438" font-size="7.3" fill="${_GRAY}" ${_F}>Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_min_01 — MinimalRenderer: plain, large bold name, thin grey dividers, all-caps labels, monochrome
function _tplMin01(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="40" y="60" font-size="27" font-weight="700" fill="#000000" ${_F}>Priya Sharma</text>
        <text x="40" y="80" font-size="7.5" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA  -  linkedin.com/in/priyasharma</text>
        <line x1="40" y1="92" x2="360" y2="92" stroke="#D1D5DB" stroke-width="0.75" />

        <text x="40" y="114" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>SUMMARY</text>
        <line x1="40" y1="120" x2="360" y2="120" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="134" font-size="7.5" fill="#374151" ${_F}>Data scientist with 8 years turning complex datasets into actionable</text>
        <text x="40" y="145" font-size="7.5" fill="#374151" ${_F}>business insights across NLP, recommendation systems and MLOps.</text>

        <text x="40" y="167" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>EXPERIENCE</text>
        <line x1="40" y1="173" x2="360" y2="173" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="187" font-size="9.5" font-weight="700" fill="#000000" ${_F}>Senior Data Scientist</text>
        <text x="360" y="187" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="199" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Amazon</text>
        <text x="40" y="213" font-size="7.3" fill="#374151" ${_F}>Reduced customer churn 34% via real-time ML experimentation</text>
        <text x="40" y="233" font-size="9.5" font-weight="700" fill="#000000" ${_F}>Data Scientist</text>
        <text x="360" y="233" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2018 - 2021</text>
        <text x="40" y="245" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Meta</text>

        <text x="40" y="269" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>EDUCATION</text>
        <line x1="40" y1="275" x2="360" y2="275" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="289" font-size="9.5" font-weight="700" fill="#000000" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="289" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="301" font-size="7.5" font-style="italic" fill="#4B5563" ${_F}>Stanford University</text>

        <text x="40" y="325" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>SKILLS</text>
        <line x1="40" y1="331" x2="360" y2="331" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="345" font-size="7.5" fill="#374151" ${_F}>Python  .  Machine Learning  .  SQL  .  AWS  .  Leadership</text>

        <text x="40" y="369" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>CERTIFICATIONS</text>
        <line x1="40" y1="375" x2="360" y2="375" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="389" font-size="7.3" fill="#374151" ${_F}>&#8212;  AWS Solutions Architect  .  Amazon</text>

        <text x="40" y="413" font-size="9" font-weight="700" fill="#000000" letter-spacing="1" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="419" x2="360" y2="419" stroke="#D1D5DB" stroke-width="0.5" />
        <text x="40" y="433" font-size="7.3" fill="#374151" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_min_02 — SageMinimalRenderer: name + sage underline bar, skills-first filled sage pills
function _tplMin02(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="40" y="58" font-size="27" font-weight="700" fill="${cs.text}" ${_F}>Priya Sharma</text>
        <rect x="40" y="66" width="48" height="3" rx="1.5" fill="${cs.primary}" />
        <text x="40" y="82" font-size="9" fill="${cs.primary}" ${_F}>Senior Data Scientist</text>
        <text x="40" y="97" font-size="7.5" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>

        <text x="40" y="122" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>PROFILE</text>
        <line x1="40" y1="128" x2="360" y2="128" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="142" font-size="7.5" fill="#374151" ${_F}>Data scientist with 8 years turning complex datasets into insights.</text>

        <text x="40" y="164" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>SKILLS</text>
        <line x1="40" y1="170" x2="360" y2="170" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        ${chip(40, 178, 66, 'Python')}
        ${chip(114, 178, 104, 'Machine Learning')}
        ${chip(226, 178, 58, 'SQL')}

        <text x="40" y="228" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>EXPERIENCE</text>
        <line x1="40" y1="234" x2="360" y2="234" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="248" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="248" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="260" font-size="7.5" fill="${cs.primary}" ${_F}>Amazon</text>
        <text x="40" y="274" font-size="7.3" fill="#374151" ${_F}>Reduced customer churn 34% via real-time ML experimentation</text>

        <text x="40" y="298" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>EDUCATION</text>
        <line x1="40" y1="304" x2="360" y2="304" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="318" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="40" y="342" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>CERTIFICATIONS</text>
        <line x1="40" y1="348" x2="360" y2="348" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="362" font-size="7.3" fill="#374151" ${_F}>AWS Solutions Architect - Professional</text>

        <text x="40" y="386" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>LANGUAGES</text>
        <line x1="40" y1="392" x2="360" y2="392" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="406" font-size="7.3" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="430" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="1" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="436" x2="360" y2="436" stroke="${cs.primary}" stroke-width="0.4" opacity="0.4" />
        <text x="40" y="450" font-size="7.3" fill="#374151" ${_F}>Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_fre_01 — CampusPlacementRenderer: diagonal blue gradient header, education-first ordering
function _tplFre01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, cs.secondary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${cs.secondary}" /><stop offset="1" stop-color="${cs.primary}" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="90" fill="url(#g3)" />
        <text x="40" y="42" font-size="20" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="40" y="60" font-size="9.5" fill="#FFFFFF" opacity="0.85" ${_F}>Computer Science Graduate</text>
        <text x="40" y="76" font-size="7.5" fill="#FFFFFF" opacity="0.75" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  github.com/priyasharma</text>
        <rect x="0" y="90" width="400" height="3" fill="${cs.secondary}" />

        <text x="40" y="114" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="120" x2="360" y2="120" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="134" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. in Computer Science</text>
        <text x="360" y="134" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2020 - 2024</text>
        <text x="40" y="146" font-size="7.5" fill="${_GRAY}" ${_F}>Stanford University - GPA 3.8/4.0</text>

        <text x="40" y="170" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>ACADEMIC PROJECTS</text>
        <line x1="40" y1="176" x2="360" y2="176" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="190" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Capstone</text>
        <text x="48" y="204" font-size="7.3" fill="${_GRAY}" ${_F}>-  Built ML model predicting churn with 89% accuracy on 50k records</text>

        <text x="40" y="228" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>INTERNSHIPS &amp; EXPERIENCE</text>
        <line x1="40" y1="234" x2="360" y2="234" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="248" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Science Intern, Meta</text>
        <text x="360" y="248" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>Summer 2023</text>
        <text x="48" y="262" font-size="7.3" fill="${_GRAY}" ${_F}>-  Automated a weekly reporting pipeline used by 3 analyst teams</text>

        <text x="40" y="286" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>TECHNICAL SKILLS</text>
        <line x1="40" y1="292" x2="360" y2="292" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        ${chip(40, 300, 66, 'Python')}
        ${chip(114, 300, 104, 'Machine Learning')}
        ${chip(226, 300, 58, 'SQL')}
        ${chip(40, 328, 58, 'AWS')}
        ${chip(106, 328, 90, 'Leadership')}

        <text x="40" y="372" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="378" x2="360" y2="378" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="392" font-size="7.5" fill="${_GRAY}" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="416" font-size="9" font-weight="700" fill="${cs.secondary}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="422" x2="360" y2="422" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="436" font-size="7.5" fill="${_GRAY}" ${_F}>-  Women in Data Science campus chapter, Founding member</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_fre_02 — GraduateAtsRenderer: name colored emerald, skills-first
function _tplFre02(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="40" y="52" font-size="22" font-weight="700" fill="${cs.primary}" ${_F}>Priya Sharma</text>
        <text x="40" y="70" font-size="9.5" fill="${cs.secondary}" ${_F}>Computer Science Graduate</text>
        <text x="40" y="85" font-size="7.5" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  github.com/priyasharma</text>
        <rect x="40" y="93" width="320" height="2" fill="${cs.primary}" />

        <text x="40" y="115" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>TECHNICAL SKILLS</text>
        <line x1="40" y1="121" x2="360" y2="121" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        ${chip(40, 129, 66, 'Python')}
        ${chip(114, 129, 104, 'Machine Learning')}
        ${chip(226, 129, 58, 'SQL')}

        <text x="40" y="179" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>OBJECTIVE</text>
        <line x1="40" y1="185" x2="360" y2="185" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="199" font-size="7.5" fill="#374151" ${_F}>Recent CS graduate seeking an entry-level data role.</text>

        <text x="40" y="221" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="227" x2="360" y2="227" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="241" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. in Computer Science</text>
        <text x="360" y="241" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2020 - 2024</text>
        <text x="40" y="253" font-size="7.5" fill="#6B7280" ${_F}>Stanford University - GPA 3.8/4.0</text>

        <text x="40" y="277" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>PROJECTS</text>
        <line x1="40" y1="283" x2="360" y2="283" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="297" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Churn Prediction Capstone</text>
        <text x="48" y="311" font-size="7.3" fill="#374151" ${_F}>-  Built ML model predicting churn with 89% accuracy on 50k records</text>
        <text x="48" y="323" font-size="7" fill="${cs.primary}" ${_F}>Python, TensorFlow, Airflow</text>

        <text x="40" y="347" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="40" y1="353" x2="360" y2="353" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="367" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Data Science Intern, Meta</text>
        <text x="360" y="367" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>Summer 2023</text>
        <text x="48" y="381" font-size="7.3" fill="#374151" ${_F}>-  Automated a weekly reporting pipeline used by 3 analyst teams</text>

        <text x="40" y="405" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="411" x2="360" y2="411" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="425" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_fre_03 — TransferStudentRenderer: 6px orange spine, transferable-skills boxed callout first
function _tplFre03(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="6" height="565" fill="${cs.primary}" />

        <text x="34" y="52" font-size="22" font-weight="700" fill="${cs.text}" ${_F}>Priya Sharma</text>
        <text x="34" y="70" font-size="9.5" fill="${cs.primary}" ${_F}>Transfer Student</text>
        <text x="34" y="85" font-size="7.5" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <line x1="34" y1="94" x2="366" y2="94" stroke="${cs.primary}" stroke-width="0.6" opacity="0.4" />

        <text x="34" y="116" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>TRANSFERABLE SKILLS</text>
        <line x1="34" y1="122" x2="366" y2="122" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <rect x="34" y="130" width="332" height="58" rx="6" fill="#FFF3EA" stroke="#FDBA74" />
        ${_check(44, 144, cs.primary)}<text x="58" y="152" font-size="7.3" fill="${cs.text}" ${_F}>Cross-functional data analysis and stakeholder communication</text>
        ${_check(44, 158, cs.primary)}<text x="58" y="166" font-size="7.3" fill="${cs.text}" ${_F}>Rapid tool adoption across Python, SQL and cloud platforms</text>
        ${_check(44, 172, cs.primary)}<text x="58" y="180" font-size="7.3" fill="${cs.text}" ${_F}>Independent project ownership under ambiguous requirements</text>

        <text x="34" y="212" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SUMMARY</text>
        <line x1="34" y1="218" x2="366" y2="218" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="34" y="232" font-size="7.5" fill="#374151" ${_F}>Career changer bringing analytical rigor from finance into data science.</text>

        <text x="34" y="254" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="34" y1="260" x2="366" y2="260" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="34" y="274" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. Computer Science  -  Stanford University  -  2024</text>

        <text x="34" y="298" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="34" y1="304" x2="366" y2="304" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="34" y="318" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Financial Analyst</text>
        <text x="34" y="330" font-size="7.3" fill="${cs.primary}" ${_F}>Wells Fargo  -  2016 - 2022</text>
        <text x="42" y="344" font-size="7.3" fill="#374151" ${_F}>-  Modeled portfolio risk across a $200M book of business</text>

        <text x="34" y="368" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SKILLS</text>
        <line x1="34" y1="374" x2="366" y2="374" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="34" y="388" font-size="7.5" fill="#374151" ${_F}>Python  -  SQL  -  Machine Learning  -  Financial Modeling</text>

        <text x="34" y="412" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="34" y1="418" x2="366" y2="418" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="34" y="432" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_ug_01 — UndergraduateClassicRenderer: centered header, navy divider, education-first
function _tplUg01(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="200" y="52" font-size="19" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>Priya Sharma</text>
        <text x="200" y="68" font-size="7.5" fill="#6B7280" text-anchor="middle" ${_F}>(555) 018-2394 | priya.sharma@email.com | San Francisco, CA</text>
        <text x="200" y="82" font-size="7.5" fill="${cs.primary}" text-anchor="middle" ${_F}>linkedin.com/in/priyasharma | github.com/priyasharma</text>
        <line x1="40" y1="92" x2="360" y2="92" stroke="${cs.primary}" stroke-width="1.5" />

        <text x="40" y="114" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>OBJECTIVE</text>
        <line x1="40" y1="120" x2="360" y2="120" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="40" y="134" font-size="7.5" fill="#374151" ${_F}>Seeking an entry-level data science role leveraging academic training.</text>

        <text x="40" y="156" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="162" x2="360" y2="162" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="40" y="176" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. in Computer Science</text>
        <text x="360" y="176" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2020 - 2024</text>
        <text x="40" y="188" font-size="7.5" font-style="italic" fill="${cs.primary}" ${_F}>Stanford University</text>

        <text x="40" y="212" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>RELATED EXPERIENCE</text>
        <line x1="40" y1="218" x2="360" y2="218" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="40" y="232" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Data Science Intern</text>
        <text x="360" y="232" font-size="7.5" fill="${_GRAY_LT}" text-anchor="end" ${_F}>Summer 2023</text>
        <text x="40" y="244" font-size="7.5" font-style="italic" fill="${cs.primary}" ${_F}>Meta</text>

        <text x="40" y="268" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SKILLS</text>
        <line x1="40" y1="274" x2="360" y2="274" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="40" y="288" font-size="7.5" fill="#374151" ${_F}>Python  .  Machine Learning  .  SQL  .  AWS  .  Leadership</text>

        <text x="40" y="312" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>ACTIVITIES &amp; ADDITIONAL WORK</text>
        <line x1="40" y1="318" x2="360" y2="318" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="40" y="332" font-size="7.3" fill="#374151" ${_F}>-  AWS Solutions Architect Certification, Amazon</text>
        <text x="40" y="344" font-size="7.3" fill="#374151" ${_F}>-  Peer tutor, Stanford Center for Teaching and Learning</text>

        <text x="200" y="368" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" text-anchor="middle" ${_F}>LANGUAGES</text>
        <line x1="40" y1="374" x2="360" y2="374" stroke="#D1D5DB" stroke-width="0.4" />
        <text x="200" y="388" font-size="7.5" fill="#374151" text-anchor="middle" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_ear_01 — EarlyStudentRenderer: light-purple band, centered avatar, activities-first ordering
function _tplEar01(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="106" fill="#F5F3FF" />
        <circle cx="200" cy="40" r="24" fill="#EDE9FE" stroke="${cs.primary}" stroke-width="2" />
        <text x="200" y="46" font-size="14" fill="${cs.primary}" text-anchor="middle" ${_F}>PS</text>
        <text x="200" y="80" font-size="16" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>Priya Sharma</text>
        <text x="200" y="93" font-size="8" fill="${cs.primary}" text-anchor="middle" ${_F}>Aspiring Data Scientist</text>
        <text x="200" y="104" font-size="6.8" fill="#6B7280" text-anchor="middle" ${_F}>priya.sharma@email.com  -  San Francisco, CA</text>
        <rect x="0" y="106" width="400" height="3" fill="${cs.primary}" />

        <text x="40" y="128" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>OBJECTIVE</text>
        <line x1="40" y1="134" x2="360" y2="134" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="147" font-size="7.3" fill="#374151" ${_F}>Freshman seeking hands-on experience in applied data science.</text>

        <text x="40" y="169" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>EDUCATION</text>
        <line x1="40" y1="175" x2="360" y2="175" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="188" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. Computer Science (in progress)  -  Stanford  -  2027</text>

        <text x="40" y="210" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>ACTIVITIES &amp; CLUBS</text>
        <line x1="40" y1="216" x2="360" y2="216" stroke="#DDD6FE" stroke-width="0.5" />
        <rect x="40" y="223" width="118" height="18" rx="9" fill="#EDE9FE" />
        <text x="52" y="235" font-size="6.8" fill="${cs.primary}" ${_F}>Women in Data Science</text>

        <text x="40" y="264" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>SKILLS</text>
        <line x1="40" y1="270" x2="360" y2="270" stroke="#DDD6FE" stroke-width="0.5" />
        ${chip(40, 278, 60, 'Python')}
        ${chip(106, 278, 96, 'Machine Learning')}
        ${chip(208, 278, 52, 'SQL')}

        <text x="40" y="322" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>PROJECTS</text>
        <line x1="40" y1="328" x2="360" y2="328" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="341" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Freshman Seminar: Churn Prediction</text>

        <text x="40" y="363" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>WORK EXPERIENCE</text>
        <line x1="40" y1="369" x2="360" y2="369" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="382" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>Campus Tutor, Intro to CS</text>
        <text x="40" y="394" font-size="7" fill="#6B7280" ${_F}>Stanford CS Department  -  2023 - Present</text>

        <text x="40" y="418" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>LANGUAGES</text>
        <line x1="40" y1="424" x2="360" y2="424" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="437" font-size="7.3" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="459" font-size="8" font-weight="700" fill="${cs.primary}" letter-spacing="1.2" ${_F}>EXTRACURRICULAR ACTIVITIES</text>
        <line x1="40" y1="465" x2="360" y2="465" stroke="#DDD6FE" stroke-width="0.5" />
        <text x="40" y="478" font-size="7.3" fill="#374151" ${_F}>-  Peer mentor, first-generation student support program</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_ath_01 — StudentAthleteRenderer: crimson band, trophy badge top-right, star awards
function _tplAth01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, cs.primary, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="88" fill="${cs.primary}" />
        <text x="36" y="42" font-size="19" font-weight="900" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="36" y="58" font-size="9" fill="#FFFFFF" opacity="0.75" ${_F}>Student Athlete - Data Science</text>
        <text x="36" y="74" font-size="7.3" fill="#FFFFFF" opacity="0.7" ${_F}>priya.sharma@email.com  -  (555) 018-2394</text>
        <rect x="332" y="24" width="36" height="36" rx="8" fill="#FFFFFF" opacity="0.15" />
        <circle cx="350" cy="38" r="8" fill="none" stroke="#FFFFFF" stroke-width="2" />
        <rect x="346" y="46" width="8" height="8" fill="#FFFFFF" />

        <rect x="40" y="108" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="119" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>ATHLETE PROFILE</text>
        <line x1="40" y1="126" x2="360" y2="126" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="140" font-size="7.5" fill="#374151" ${_F}>Varsity athlete and data science student balancing D1 competition</text>
        <text x="40" y="151" font-size="7.5" fill="#374151" ${_F}>with rigorous coursework and research.</text>

        <rect x="40" y="172" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="183" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="190" x2="360" y2="190" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="204" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>B.S. Computer Science  -  Stanford University  -  2024</text>

        <rect x="40" y="226" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="237" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>ATHLETIC &amp; WORK EXPERIENCE</text>
        <line x1="40" y1="244" x2="360" y2="244" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="258" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Team Captain, Varsity Track &amp; Field</text>
        <text x="360" y="258" font-size="7.3" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>

        <rect x="40" y="280" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="291" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>SKILLS &amp; ATTRIBUTES</text>
        <line x1="40" y1="298" x2="360" y2="298" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        ${chip(40, 306, 66, 'Python')}
        ${chip(114, 306, 104, 'Machine Learning')}
        ${chip(226, 306, 78, 'Discipline')}

        <rect x="40" y="348" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="359" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>AWARDS &amp; HONORS</text>
        <line x1="40" y1="366" x2="360" y2="366" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        ${_badge(44, 377, 3, cs.primary)}
        <text x="54" y="380" font-size="7.3" fill="#374151" ${_F}>All-Conference Team - Pac-12</text>
        ${_badge(44, 391, 3, cs.primary)}
        <text x="54" y="394" font-size="7.3" fill="#374151" ${_F}>Scholar-Athlete of the Year, Stanford Athletics</text>

        <rect x="40" y="412" width="4" height="14" fill="${cs.primary}" />
        <text x="50" y="423" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="430" x2="360" y2="430" stroke="${cs.primary}" stroke-width="0.4" opacity="0.3" />
        <text x="40" y="444" font-size="7.3" fill="#374151" ${_F}>-  Team representative, Student-Athlete Advisory Committee</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_lead_01 — LeadershipInvolvementRenderer: gold gradient header, leadership tiles, skills last
function _tplLead01(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, cs.primary);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#92400E" /><stop offset="1" stop-color="#D97706" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="88" fill="url(#g4)" />
        <text x="36" y="42" font-size="19" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="36" y="58" font-size="9" fill="#FFFFFF" opacity="0.75" ${_F}>Senior Data Scientist</text>
        <text x="36" y="74" font-size="7.3" fill="#FFFFFF" opacity="0.7" ${_F}>priya.sharma@email.com  -  (555) 018-2394</text>

        <rect x="40" y="106" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="110" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LEADERSHIP PROFILE</text>
        <line x1="40" y1="116" x2="360" y2="116" stroke="#FDE68A" stroke-width="0.5" />
        <text x="40" y="130" font-size="7.5" fill="#374151" ${_F}>Cross-functional leader driving ML initiatives across 6 teams.</text>

        <rect x="40" y="152" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="156" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LEADERSHIP &amp; INVOLVEMENT</text>
        <rect x="40" y="163" width="320" height="26" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
        ${_badge(50, 176, 4, cs.primary)}
        <text x="60" y="180" font-size="7.3" font-weight="700" fill="${cs.text}" ${_F}>Team Lead, ML Platform Guild - Amazon</text>
        <rect x="40" y="193" width="320" height="26" rx="8" fill="#FEF3C7" stroke="#FDE68A" />
        ${_badge(50, 206, 4, cs.primary)}
        <text x="60" y="210" font-size="7.3" font-weight="700" fill="${cs.text}" ${_F}>Mentor, Women in Data Science</text>

        <text x="40" y="243" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="249" x2="360" y2="249" stroke="#FDE68A" stroke-width="0.5" />
        <text x="40" y="263" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="40" y="287" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>WORK EXPERIENCE</text>
        <line x1="40" y1="293" x2="360" y2="293" stroke="#FDE68A" stroke-width="0.5" />
        <text x="40" y="307" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist, Amazon</text>
        <text x="360" y="307" font-size="7.3" fill="${_GRAY_LT}" text-anchor="end" ${_F}>2021 - Present</text>

        <text x="40" y="331" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>SKILLS</text>
        <line x1="40" y1="337" x2="360" y2="337" stroke="#FDE68A" stroke-width="0.5" />
        ${chip(40, 345, 66, 'Python')}
        ${chip(114, 345, 104, 'Machine Learning')}
        ${chip(226, 345, 58, 'SQL')}

        <text x="40" y="389" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="395" x2="360" y2="395" stroke="#FDE68A" stroke-width="0.5" />
        <text x="40" y="409" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_tec_01 — TechSkillsRenderer: dark charcoal band, ATS score badge, skill-dot boxy chips
function _tplTec01(cs) {
    const skillChip = (x, y, w, label) => `
        <rect x="${x}" y="${y}" width="${w}" height="19" rx="4" fill="#F1F5F9" stroke="#E2E8F0" />
        ${_dot(x + 11, y + 9.5, 2, cs.primary)}
        <text x="${x + 19}" y="${y + 13}" font-size="7" fill="#1E293B" ${_F}>${label}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="88" fill="#1C1C2E" />
        <text x="36" y="52" font-size="19" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="36" y="68" font-size="9.5" fill="${cs.primary}" ${_F}>Senior Data Scientist</text>
        <rect x="330" y="18" width="38" height="30" rx="6" fill="#1D4ED8" />
        <text x="349" y="30" font-size="6.5" fill="#FFFFFF" opacity="0.7" text-anchor="middle" letter-spacing="1" ${_F}>ATS</text>
        <text x="349" y="42" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle" ${_F}>98%</text>
        <text x="36" y="80" font-size="7" fill="#FFFFFF" opacity="0.6" ${_F}>priya.sharma@email.com  -  github.com/priyasharma  -  linkedin.com/in/priyasharma</text>
        <rect x="0" y="88" width="400" height="3" fill="${cs.primary}" />

        <rect x="40" y="108" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="112" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>TECHNICAL SKILLS</text>
        <line x1="40" y1="118" x2="360" y2="118" stroke="#E2E8F0" stroke-width="0.5" />
        ${skillChip(40, 126, 70, 'Python')}
        ${skillChip(118, 126, 110, 'Machine Learning')}
        ${skillChip(236, 126, 60, 'SQL')}
        ${skillChip(40, 150, 60, 'AWS')}
        ${skillChip(108, 150, 96, 'Leadership')}

        <rect x="40" y="192" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="196" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>PROFESSIONAL SUMMARY</text>
        <line x1="40" y1="202" x2="360" y2="202" stroke="#E2E8F0" stroke-width="0.5" />
        <text x="40" y="216" font-size="7.5" fill="#475569" ${_F}>Data scientist, 8 years, NLP, recommendation systems, MLOps.</text>

        <rect x="40" y="238" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="242" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>WORK EXPERIENCE</text>
        <line x1="40" y1="248" x2="360" y2="248" stroke="#E2E8F0" stroke-width="0.5" />
        <rect x="40" y="257" width="3" height="3" fill="${cs.primary}" />
        <text x="48" y="260" font-size="9" font-weight="700" fill="#1E293B" ${_F}>Senior Data Scientist</text>
        <text x="360" y="260" font-size="7.3" fill="#94A3B8" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="48" y="272" font-size="7.3" fill="#64748B" ${_F}>Amazon - Reduced churn 34% via real-time ML experimentation</text>

        <rect x="40" y="296" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="300" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>KEY PROJECTS</text>
        <line x1="40" y1="306" x2="360" y2="306" stroke="#E2E8F0" stroke-width="0.5" />
        <rect x="40" y="313" width="320" height="34" rx="6" fill="#F1F5F9" stroke="#E2E8F0" />
        <text x="48" y="328" font-size="8" font-weight="700" fill="#1E293B" ${_F}>Recommendation Engine</text>
        <text x="48" y="340" font-size="7" fill="${cs.primary}" ${_F}>[Python] [TensorFlow] [Airflow]</text>

        <rect x="40" y="366" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="370" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="376" x2="360" y2="376" stroke="#E2E8F0" stroke-width="0.5" />
        <text x="40" y="390" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <rect x="40" y="412" width="16" height="2" fill="${cs.primary}" />
        <text x="60" y="416" font-size="9" font-weight="700" fill="#1C1C2E" letter-spacing="0.5" ${_F}>CERTIFICATIONS</text>
        <line x1="40" y1="422" x2="360" y2="422" stroke="#E2E8F0" stroke-width="0.5" />
        <text x="48" y="434" font-size="7.5" fill="#64748B" ${_F}>AWS Solutions Architect - Professional</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_tec_02 — TechnicalProfessionalRenderer: dark header, indigo sidebar w/ fixed-80% proficiency bars
function _tplTec02(cs) {
    const bar = (x, y, w, label) => `
        <text x="${x}" y="${y}" font-size="7" font-weight="500" fill="#1E293B" ${_F}>${label}</text>
        <rect x="${x}" y="${y + 6}" width="${w}" height="3" rx="1.5" fill="#D1D5DB" />
        <rect x="${x}" y="${y + 6}" width="${w * 0.8}" height="3" rx="1.5" fill="${cs.primary}" />`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="80" fill="#1F2937" />
        <text x="36" y="42" font-size="18" font-weight="700" fill="#FFFFFF" ${_F}>Priya Sharma</text>
        <text x="36" y="58" font-size="9" fill="${cs.primary}" ${_F}>Technical Professional</text>
        <text x="36" y="72" font-size="7" fill="#FFFFFF" opacity="0.6" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  GitHub: priyasharma</text>
        <rect x="0" y="80" width="400" height="3" fill="${cs.primary}" />

        <rect x="0" y="83" width="150" height="482" fill="#EEF2FF" />
        <text x="18" y="106" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>TECHNICAL SKILLS</text>
        ${bar(18, 122, 114, 'Python')}
        ${bar(18, 146, 114, 'Machine Learning')}
        ${bar(18, 170, 114, 'SQL')}
        ${bar(18, 194, 114, 'AWS')}

        <text x="18" y="234" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>LANGUAGES</text>
        <text x="18" y="247" font-size="6.6" fill="#374151" ${_F}>English, Hindi</text>

        <text x="18" y="271" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>CERTIFICATIONS</text>
        <text x="18" y="284" font-size="6.6" fill="#374151" ${_F}>AWS Solutions Architect</text>

        <text x="18" y="308" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>TOOLS</text>
        <text x="18" y="321" font-size="6.6" fill="#374151" ${_F}>Git, Docker, Airflow</text>
        <text x="18" y="332" font-size="6.6" fill="#374151" ${_F}>Kubernetes, Jupyter</text>

        <text x="170" y="106" font-size="9" font-weight="700" fill="#1F2937" letter-spacing="0.5" ${_F}>SUMMARY</text>
        <line x1="170" y1="112" x2="360" y2="112" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="170" y="126" font-size="7.5" fill="#475569" ${_F}>Data scientist, 8 years, NLP, recommendation systems, MLOps.</text>

        <text x="170" y="150" font-size="9" font-weight="700" fill="#1F2937" letter-spacing="0.5" ${_F}>EXPERIENCE</text>
        <line x1="170" y1="156" x2="360" y2="156" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="170" y="170" font-size="9" font-weight="700" fill="#1E293B" ${_F}>Senior Data Scientist</text>
        <text x="360" y="170" font-size="7.3" fill="#94A3B8" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="170" y="182" font-size="7.3" fill="#64748B" ${_F}>Amazon</text>
        <text x="178" y="196" font-size="7" fill="#64748B" ${_F}>-  Reduced churn 34% via real-time ML experimentation</text>

        <text x="170" y="220" font-size="9" font-weight="700" fill="#1F2937" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="170" y1="226" x2="360" y2="226" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="170" y="240" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="170" y="264" font-size="9" font-weight="700" fill="#1F2937" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="170" y1="270" x2="360" y2="270" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="178" y="284" font-size="7" fill="#64748B" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_fns_01 — FunctionalSkillsRenderer: plain header, gradient divider, nested competency boxes
function _tplFns01(cs) {
    const innerChip = (x, y, w, label) => `
        <rect x="${x}" y="${y}" width="${w}" height="16" rx="4" fill="#FFFFFF" stroke="#E0E7FF" />
        <text x="${x + w / 2}" y="${y + 11}" font-size="6.8" fill="${cs.text}" text-anchor="middle" ${_F}>${label}</text>`;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g5" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="${cs.primary}" /><stop offset="1" stop-color="#FFFFFF" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="40" y="52" font-size="21" font-weight="700" fill="${cs.text}" letter-spacing="-0.5" ${_F}>Priya Sharma</text>
        <text x="40" y="69" font-size="10" fill="${cs.primary}" ${_F}>Senior Data Scientist</text>
        <text x="40" y="84" font-size="7.3" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <rect x="40" y="92" width="320" height="2" fill="url(#g5)" />

        <text x="40" y="115" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>CORE COMPETENCIES</text>
        <line x1="40" y1="121" x2="360" y2="121" stroke="#E0E7FF" stroke-width="0.5" />
        <rect x="40" y="129" width="320" height="40" rx="8" fill="#EEF2FF" stroke="#E0E7FF" />
        <text x="50" y="143" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>DATA &amp; ANALYTICS</text>
        ${innerChip(50, 149, 66, 'Python')}
        ${innerChip(120, 149, 104, 'Machine Learning')}
        ${innerChip(228, 149, 58, 'SQL')}
        <rect x="40" y="173" width="320" height="40" rx="8" fill="#EEF2FF" stroke="#E0E7FF" />
        <text x="50" y="187" font-size="7.5" font-weight="700" fill="${cs.primary}" letter-spacing="0.8" ${_F}>LEADERSHIP</text>
        ${innerChip(50, 193, 96, 'Mentoring')}
        ${innerChip(150, 193, 96, 'Stakeholder Mgmt')}

        <text x="40" y="240" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>PROFESSIONAL SUMMARY</text>
        <line x1="40" y1="246" x2="360" y2="246" stroke="#E0E7FF" stroke-width="0.5" />
        <text x="40" y="260" font-size="7.5" fill="#374151" ${_F}>8 years turning complex datasets into actionable business insights.</text>

        <text x="40" y="284" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>WORK HISTORY</text>
        <line x1="40" y1="290" x2="360" y2="290" stroke="#E0E7FF" stroke-width="0.5" />
        <text x="40" y="304" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist, Amazon</text>
        <text x="360" y="304" font-size="7.3" fill="#94A3B8" text-anchor="end" ${_F}>2021 - Present</text>

        <text x="40" y="328" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="334" x2="360" y2="334" stroke="#E0E7FF" stroke-width="0.5" />
        <text x="40" y="348" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="40" y="372" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="378" x2="360" y2="378" stroke="#E0E7FF" stroke-width="0.5" />
        <text x="40" y="392" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="416" font-size="9" font-weight="700" fill="${cs.primary}" letter-spacing="0.5" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="422" x2="360" y2="422" stroke="#E0E7FF" stroke-width="0.5" />
        <text x="40" y="436" font-size="7.5" fill="#374151" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_fun_02 — CompetencyGroupsRenderer: tricolor gradient divider, 3-column competency boxes
function _tplFun02(cs) {
    const box = (x, title, color, bg, border, items) => `
        <rect x="${x}" y="140" width="106" height="100" rx="8" fill="${bg}" stroke="${border}" />
        <text x="${x + 10}" y="156" font-size="7.3" font-weight="700" fill="${color}" letter-spacing="0.8" ${_F}>${title}</text>
        ${items.map((it, i) => `${_dot(x + 13, 168 + i * 16 - 2, 1.6, color)}<text x="${x + 20}" y="${168 + i * 16}" font-size="6.5" fill="${cs.text}" ${_F}>${it}</text>`).join('')}
    `;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <defs><linearGradient id="g6" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#7C3AED" /><stop offset="0.5" stop-color="#D97706" /><stop offset="1" stop-color="#059669" />
        </linearGradient></defs>
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="40" y="50" font-size="20" font-weight="700" fill="${cs.text}" ${_F}>Priya Sharma</text>
        <text x="40" y="66" font-size="8.5" fill="#7C3AED" ${_F}>Senior Data Scientist</text>
        <text x="40" y="80" font-size="7.3" fill="#6B7280" ${_F}>priya.sharma@email.com  -  (555) 018-2394  -  San Francisco, CA</text>
        <rect x="40" y="88" width="320" height="3" fill="url(#g6)" />

        <text x="40" y="112" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>CORE COMPETENCIES</text>
        <line x1="40" y1="118" x2="360" y2="118" stroke="#E5E7EB" stroke-width="0.5" />
        ${box(40, 'TECHNICAL', '#7C3AED', '#F5F3FF', '#DDD6FE', ['Python', 'Machine Learning', 'SQL'])}
        ${box(154, 'TOOLS &amp; PLATFORMS', '#D97706', '#FEF3C7', '#FDE68A', ['AWS', 'TensorFlow', 'Airflow'])}
        ${box(268, 'LEADERSHIP', '#059669', '#ECFDF5', '#BBF7D0', ['Mentoring', 'Stakeholder Mgmt'])}

        <text x="40" y="266" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>WORK HISTORY</text>
        <line x1="40" y1="272" x2="360" y2="272" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="40" y="286" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist, Amazon</text>
        <text x="360" y="286" font-size="7.3" fill="#9CA3AF" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="300" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Data Scientist, Meta</text>
        <text x="360" y="300" font-size="7.3" fill="#9CA3AF" text-anchor="end" ${_F}>2018 - 2021</text>

        <text x="40" y="324" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>EDUCATION</text>
        <line x1="40" y1="330" x2="360" y2="330" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="40" y="344" font-size="8.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. Computer Science  -  Stanford University  -  2018</text>

        <text x="40" y="368" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>LANGUAGES</text>
        <line x1="40" y1="374" x2="360" y2="374" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="40" y="388" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>

        <text x="40" y="412" font-size="9" font-weight="700" fill="${cs.text}" letter-spacing="1" ${_F}>ACTIVITIES</text>
        <line x1="40" y1="418" x2="360" y2="418" stroke="#E5E7EB" stroke-width="0.5" />
        <text x="40" y="432" font-size="7.5" fill="#374151" ${_F}>-  Women in Data Science, Stanford chapter co-organizer</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_grad_01 — AcademicCvRenderer: centered header, italic forest-green title, double rule
function _tplGrad01(cs) {
    const chip = (x, y, w, label) => _outlineChip(x, y, w, label, '#BBF7D0', '#14532D');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <text x="200" y="52" font-size="20" font-weight="700" fill="${cs.text}" text-anchor="middle" ${_F}>Priya Sharma</text>
        <text x="200" y="68" font-size="9" font-style="italic" fill="#14532D" text-anchor="middle" ${_F}>Graduate Researcher, Machine Learning</text>
        <text x="200" y="83" font-size="7.3" fill="#6B7280" text-anchor="middle" ${_F}>priya.sharma@email.com  -  San Francisco, CA  -  linkedin.com/in/priyasharma</text>
        <line x1="40" y1="93" x2="360" y2="93" stroke="#14532D" stroke-width="2" />
        <line x1="40" y1="97" x2="360" y2="97" stroke="#166534" stroke-width="0.4" />

        <text x="40" y="119" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>RESEARCH PROFILE</text>
        <line x1="40" y1="125" x2="360" y2="125" stroke="#BBF7D0" stroke-width="0.5" />
        <text x="40" y="139" font-size="7.5" fill="#374151" ${_F}>Data scientist and researcher, 8 years, NLP and recommendation systems.</text>

        <text x="40" y="161" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>EDUCATION</text>
        <line x1="40" y1="167" x2="360" y2="167" stroke="#BBF7D0" stroke-width="0.5" />
        <text x="40" y="181" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="360" y="181" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2018</text>
        <text x="40" y="193" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Stanford University</text>

        <text x="40" y="217" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>RESEARCH &amp; PROFESSIONAL EXPERIENCE</text>
        <line x1="40" y1="223" x2="360" y2="223" stroke="#BBF7D0" stroke-width="0.5" />
        <text x="40" y="237" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="360" y="237" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="40" y="249" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Amazon</text>

        <text x="40" y="273" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>AREAS OF EXPERTISE</text>
        <line x1="40" y1="279" x2="360" y2="279" stroke="#BBF7D0" stroke-width="0.5" />
        ${chip(40, 287, 66, 'Python')}
        ${chip(114, 287, 104, 'Machine Learning')}
        ${chip(226, 287, 58, 'SQL')}

        <text x="40" y="337" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>AWARDS &amp; CERTIFICATIONS</text>
        <line x1="40" y1="343" x2="360" y2="343" stroke="#BBF7D0" stroke-width="0.5" />
        <text x="40" y="357" font-size="7.3" fill="#374151" ${_F}>-  AWS Solutions Architect. Amazon, 2020.</text>
        <text x="40" y="369" font-size="7.3" fill="#374151" ${_F}>-  Outstanding Graduate Researcher Award, Stanford AI Lab, 2023.</text>

        <text x="40" y="393" font-size="9" font-weight="700" fill="#14532D" letter-spacing="1.5" ${_F}>LANGUAGES</text>
        <line x1="40" y1="399" x2="360" y2="399" stroke="#BBF7D0" stroke-width="0.5" />
        <text x="40" y="413" font-size="7.5" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}
// seed_res_01 — ResearchCvRenderer: 8px maroon left bar on header, citation-style pubs
function _tplRes01(cs) {
    const chip = (x, y, w, label) => _filledChip(x, y, w, label, '#7F1D1D');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="96" fill="#FFF8F8" />
        <rect width="8" height="96" fill="#7F1D1D" />
        <text x="30" y="42" font-size="19" font-weight="700" fill="#7F1D1D" ${_F}>Priya Sharma</text>
        <text x="30" y="58" font-size="9" font-style="italic" fill="#7F1D1D" ${_F}>Research Scientist, Machine Learning</text>
        <text x="30" y="74" font-size="7.3" fill="#6B7280" ${_F}>priya.sharma@email.com  -  San Francisco, CA  -  linkedin.com/in/priyasharma</text>

        <text x="30" y="120" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>RESEARCH INTERESTS</text>
        <line x1="30" y1="126" x2="370" y2="126" stroke="#FECACA" stroke-width="0.5" />
        <text x="30" y="140" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Recommendation systems, large-scale ML experimentation, NLP.</text>

        <text x="30" y="162" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>EDUCATION</text>
        <line x1="30" y1="168" x2="370" y2="168" stroke="#FECACA" stroke-width="0.5" />
        <text x="30" y="182" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>M.S. in Computer Science</text>
        <text x="370" y="182" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2018</text>
        <text x="30" y="194" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Stanford University</text>

        <text x="30" y="218" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>PUBLICATIONS &amp; GRANTS</text>
        <line x1="30" y1="224" x2="370" y2="224" stroke="#FECACA" stroke-width="0.5" />
        <text x="30" y="238" font-size="7.2" fill="#374151" ${_F}><tspan font-weight="700" fill="#7F1D1D">[1] </tspan>Sharma, P. Real-Time Personalization at Scale. NeurIPS. (2023)</text>
        <text x="30" y="250" font-size="7.2" fill="#374151" ${_F}><tspan font-weight="700" fill="#7F1D1D">[2] </tspan>Sharma, P., Lee, K. Fair Recommendation. ICML. (2022)</text>

        <text x="30" y="274" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>RESEARCH EXPERIENCE</text>
        <line x1="30" y1="280" x2="370" y2="280" stroke="#FECACA" stroke-width="0.5" />
        <text x="30" y="294" font-size="9.5" font-weight="700" fill="${cs.text}" ${_F}>Senior Data Scientist</text>
        <text x="370" y="294" font-size="7.5" fill="#9CA3AF" text-anchor="end" ${_F}>2021 - Present</text>
        <text x="30" y="306" font-size="7.5" font-style="italic" fill="#374151" ${_F}>Amazon</text>

        <text x="30" y="330" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>METHODOLOGIES &amp; TOOLS</text>
        <line x1="30" y1="336" x2="370" y2="336" stroke="#FECACA" stroke-width="0.5" />
        ${chip(30, 344, 66, 'Python')}
        ${chip(104, 344, 104, 'Machine Learning')}
        ${chip(216, 344, 58, 'SQL')}
        ${chip(30, 372, 58, 'AWS')}
        ${chip(96, 372, 90, 'Leadership')}

        <text x="30" y="416" font-size="9" font-weight="700" fill="#7F1D1D" letter-spacing="1" ${_F}>LANGUAGES</text>
        <line x1="30" y1="422" x2="370" y2="422" stroke="#FECACA" stroke-width="0.5" />
        <text x="30" y="436" font-size="7.3" fill="#374151" ${_F}>English - Native  -  Hindi - Fluent</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

// seed_res_02 — AcademicFormalRenderer: solid dark-slate header, Roman-numeral sections, monochrome
function _tplRes02(cs) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="565" viewBox="0 0 400 565">
        <rect width="400" height="565" fill="#FFFFFF" />
        <rect width="400" height="86" fill="#1E293B" />
        <text x="36" y="40" font-size="18" font-weight="700" fill="#FFFFFF" letter-spacing="0.5" ${_F}>Priya Sharma, Ph.D.</text>
        <text x="36" y="56" font-size="9" font-style="italic" fill="#FFFFFF" opacity="0.6" ${_F}>Machine Learning Researcher</text>
        <text x="364" y="36" font-size="7" fill="#FFFFFF" opacity="0.54" text-anchor="end" ${_F}>priya.sharma@stanford.edu</text>
        <text x="364" y="48" font-size="7" fill="#FFFFFF" opacity="0.54" text-anchor="end" ${_F}>(555) 018-2394</text>
        <text x="364" y="60" font-size="7" fill="#FFFFFF" opacity="0.54" text-anchor="end" ${_F}>Stanford, CA</text>

        <text x="40" y="110" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>I.  ACADEMIC PROFILE</text>
        <line x1="40" y1="116" x2="360" y2="116" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="130" font-size="7.5" fill="#374151" ${_F}>Data scientist, 8 years, NLP, recommendation systems and MLOps.</text>

        <text x="40" y="152" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>II.  EDUCATION</text>
        <line x1="40" y1="158" x2="360" y2="158" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="172" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Ph.D. in Computer Science</text>
        <text x="360" y="172" font-size="7.3" fill="#94A3B8" text-anchor="end" ${_F}>2024</text>
        <text x="40" y="184" font-size="7.3" fill="#374151" ${_F}>Stanford University</text>

        <text x="40" y="208" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>III.  ACADEMIC &amp; PROFESSIONAL POSITIONS</text>
        <line x1="40" y1="214" x2="360" y2="214" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="228" font-size="9" font-weight="700" fill="${cs.text}" ${_F}>Graduate Researcher, Stanford AI Lab</text>
        <text x="360" y="228" font-size="7.3" fill="#94A3B8" text-anchor="end" ${_F}>2020 - 2024</text>

        <text x="40" y="252" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>IV.  SELECTED PUBLICATIONS &amp; AWARDS</text>
        <line x1="40" y1="258" x2="360" y2="258" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="272" font-size="7.2" fill="#374151" ${_F}>Sharma, P. Real-Time Personalization at Scale. NeurIPS. (2023)</text>
        <text x="40" y="284" font-size="7.2" fill="#374151" ${_F}>Sharma, P., Lee, K. Fair Recommendation. ICML. (2022)</text>

        <text x="40" y="308" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>V.  RESEARCH EXPERTISE</text>
        <line x1="40" y1="314" x2="360" y2="314" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="328" font-size="7.5" fill="#374151" ${_F}>Python  .  Machine Learning  .  SQL  .  AWS  .  Leadership</text>

        <text x="40" y="352" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>VI.  LANGUAGES</text>
        <line x1="40" y1="358" x2="360" y2="358" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="372" font-size="7.5" fill="#374151" ${_F}>English, Hindi</text>

        <text x="40" y="396" font-size="8.5" font-weight="700" fill="#1E293B" ${_F}>VII.  ACTIVITIES &amp; SERVICE</text>
        <line x1="40" y1="402" x2="360" y2="402" stroke="#475569" stroke-width="0.5" />
        <text x="40" y="416" font-size="7.5" fill="#374151" ${_F}>Reviewer, NeurIPS and ICML program committees</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

const _TEMPLATE_RENDERERS = {
    seed_ats_01: _tplAts01,
    seed_ats_02: _tplAts02,
    seed_pro_01: _tplPro01,
    seed_pro_02: _tplPro02,
    seed_pro_03: _tplPro03,
    seed_vet_01: _tplVet01,
    seed_edu_01: _tplEdu01,
    seed_mod_01: _tplMod01,
    seed_mod_02: _tplMod02,
    seed_2col_01: _tpl2col01,
    seed_cre_01: _tplCre01,
    seed_cre_02: _tplCre02,
    seed_des_01: _tplDes01,
    seed_min_01: _tplMin01,
    seed_min_02: _tplMin02,
    seed_fre_01: _tplFre01,
    seed_fre_02: _tplFre02,
    seed_fre_03: _tplFre03,
    seed_ug_01: _tplUg01,
    seed_ear_01: _tplEar01,
    seed_ath_01: _tplAth01,
    seed_lead_01: _tplLead01,
    seed_tec_01: _tplTec01,
    seed_tec_02: _tplTec02,
    seed_fns_01: _tplFns01,
    seed_fun_02: _tplFun02,
    seed_grad_01: _tplGrad01,
    seed_res_01: _tplRes01,
    seed_res_02: _tplRes02,
};

function renderGallery(templates) {
    const gallery = document.getElementById('template-gallery');
    if (!gallery) return;
    gallery.innerHTML = '';

    templates.forEach(t => {
        const imgUrl = buildThumbnailSvg(t);

        let priceSection = '';
        let discountBadge = '';

        if (t.isPremium) {
            priceSection = `
               <div class="flex items-center gap-1.5 font-['Inter']">
                 <span class="text-[11px] font-semibold text-gray-400 line-through">₹${t.originalPrice}</span>
                 <span class="text-[11px] font-bold text-blue-600">₹${t.discountedPrice}</span>
               </div>`;
               
            // Calculate discount for the badge
            if (t.originalPrice > t.discountedPrice && t.originalPrice > 0) {
                const pct = Math.round(((t.originalPrice - t.discountedPrice) / t.originalPrice) * 100);
                discountBadge = `<span class="bg-[#DC2626] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0">${pct}% OFF</span>`;
            }
        } else {
            priceSection = `<span class="text-[11px] font-bold text-[#0F766E] font-['Inter'] tracking-wide">FREE</span>`;
        }

        const premiumBadge = t.isPremium 
            ? `<div class="absolute top-2.5 right-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 font-['Inter']">
                 <i class="fa-solid fa-award text-[10px]"></i> PRO
               </div>`
            : '';

        const atsBadgeColor = t.atsScore >= 90 ? '#0F766E' : (t.atsScore >= 75 ? '#0369A1' : '#DC2626');
        const atsBadge = t.atsScore > 0 
            ? `<div class="absolute top-2.5 left-2.5 bg-[${atsBadgeColor}] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm font-['Inter'] tracking-tight">
                 ${t.atsScore}% ATS
               </div>`
            : '';

        // Category pill formatting
        const catName = formatCategory(t.category);

        const card = `
            <a href="${templateUrl(t)}" class="group bg-white rounded-[24px] border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-0.5 transition-transform duration-200" style="box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <!-- Preview Image Area -->
                <div class="relative w-full aspect-[1/1.4] bg-[#F8FAFC] p-3 pb-0 rounded-t-[23px] flex items-end justify-center overflow-hidden">
                    <!-- The Resume Paper -->
                    <div class="w-[90%] h-[94%] bg-white rounded-t-[6px] shadow-[0_0_15px_rgba(0,0,0,0.06)] overflow-hidden flex-shrink-0 relative">
                        <img src="${imgUrl}" alt="${t.title}" loading="lazy" class="w-full h-full object-cover object-top" />
                    </div>
                    
                    <!-- Badges absolutely positioned over the container -->
                    ${atsBadge}
                    ${premiumBadge}
                    <div class="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors duration-200"></div>
                </div>
                
                <!-- Bottom Info Area -->
                <div class="p-3.5 pb-4 flex flex-col flex-grow bg-white">
                    <div class="flex items-start justify-between gap-1 mb-0.5">
                        <h3 class="text-[15px] font-bold text-[#1A1C1E] leading-tight truncate font-['Plus_Jakarta_Sans']">${t.title}</h3>
                        ${discountBadge}
                    </div>
                    
                    <div class="flex items-center justify-between mt-auto">
                        <span class="text-[11px] text-[#73777F] font-['Plus_Jakarta_Sans'] truncate max-w-[60%]">${catName}</span>
                        <div class="shrink-0 pl-1">
                            ${priceSection}
                        </div>
                    </div>
                </div>
            </a>
        `;
        gallery.insertAdjacentHTML('beforeend', card);
    });
}

// ── Homepage slider (index.html) — real template thumbnails ───────────
// Runs synchronously below (not deferred to DOMContentLoaded like the
// gallery/detail rendering above) because assets/js/script.js, loaded right
// after this file, needs the slide elements already in the DOM when its
// slider engine and reveal-animation observer initialise.
function buildSlideCardHtml(t) {
    const imgUrl = buildThumbnailSvg(t);
    const catName = formatCategory(t.category);

    const atsBadge = t.atsScore > 0
        ? `<span class="tmpl-slide-badge tmpl-slide-badge-ats">${t.atsScore}% ATS</span>`
        : '';

    const proBadge = t.isPremium
        ? `<span class="tmpl-slide-badge tmpl-slide-badge-pro"><i class="fa-solid fa-award"></i> PRO</span>`
        : '';

    let priceHtml = `<span class="tmpl-slide-price-free">FREE</span>`;
    let discountHtml = '';
    if (t.isPremium) {
        priceHtml = `<span class="tmpl-slide-price-orig">₹${t.originalPrice}</span><span class="tmpl-slide-price-now">₹${t.discountedPrice}</span>`;
        if (t.originalPrice > t.discountedPrice && t.originalPrice > 0) {
            const pct = Math.round(((t.originalPrice - t.discountedPrice) / t.originalPrice) * 100);
            discountHtml = `<span class="tmpl-slide-discount">${pct}% OFF</span>`;
        }
    }

    return `
        <div class="slide">
            <a href="${templateUrl(t)}" class="tmpl-slide-card reveal">
                <div class="tmpl-slide-thumb">
                    <img src="${imgUrl}" alt="${t.title} resume template" loading="lazy" />
                    ${atsBadge}
                    ${proBadge}
                </div>
                <div class="tmpl-slide-info">
                    <div class="tmpl-slide-title-row">
                        <span class="tmpl-slide-title">${t.title}</span>
                        ${discountHtml}
                    </div>
                    <div class="tmpl-slide-meta">
                        <span class="tmpl-slide-cat">${catName}</span>
                        ${priceHtml}
                    </div>
                </div>
            </a>
        </div>`;
}

function renderHomeSlider(templates) {
    const track = document.getElementById('tmplSliderTrack');
    if (!track) return;
    // A curated first slice of the catalogue — enough variety (free + premium,
    // several categories) without loading all templates on the homepage.
    const featured = templates.slice(0, 8);
    track.innerHTML = featured.map(buildSlideCardHtml).join('');
}

if (window.TEMPLATES_DATA) {
    renderHomeSlider(window.TEMPLATES_DATA);
}

function renderDetail(templates) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        window.location.href = 'templates.html';
        return;
    }

    const template = templates.find(t => t.id === id);
    if (!template) {
        document.getElementById('template-detail').innerHTML = '<div class="text-center py-20"><h2 class="text-2xl font-bold">Template not found</h2><a href="templates.html" class="text-blue-600 mt-4 inline-block">Back to Templates</a></div>';
        return;
    }

    document.title = `${template.title} Resume Template | NextCV`;

    document.getElementById('td-img').src = buildThumbnailSvg(template);
    document.getElementById('td-title').textContent = template.title;
    document.getElementById('td-category').textContent = formatCategory(template.category);
    document.getElementById('td-desc').textContent = template.description;
    
    const atsContainer = document.getElementById('td-ats');
    if (template.atsScore > 0) {
        atsContainer.innerHTML = `<span class="bg-[#E0F2F1] text-[#006A60] px-3 py-1.5 rounded-full font-semibold text-[13px] border border-[#B2DFDB] inline-flex items-center gap-1.5 font-['Inter']"><i class="fa-solid fa-circle-check"></i> ${template.atsScore}% ATS</span>`;
    }

    const priceContainer = document.getElementById('td-price');
    if (template.isPremium) {
        priceContainer.innerHTML = `
            <div class="flex items-center gap-3 mb-2">
                <span class="text-3xl font-bold text-blue-600 font-['Inter']">₹${template.discountedPrice}</span>
                <span class="text-lg font-medium text-gray-400 line-through font-['Inter']">₹${template.originalPrice}</span>
                <span class="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 font-['Inter']"><i class="fa-solid fa-award"></i> PRO</span>
            </div>
        `;
    } else {
        priceContainer.innerHTML = `
            <div class="mb-2">
                <span class="text-3xl font-bold text-[#006A60] font-['Inter'] tracking-tight">FREE</span>
            </div>
        `;
    }

    // Encode the template id into the Play Store referrer so a fresh
    // Android install can deep-link straight to this template (deferred
    // deep link via Play Install Referrer — see InstallReferrerService).
    const cta = document.getElementById('td-cta');
    if (cta) {
        const referrer = encodeURIComponent(`template_id=${template.id}`);
        cta.href = `https://play.google.com/store/apps/details?id=com.empire.product.nexcv.nexcv&referrer=${referrer}`;
    }
}
