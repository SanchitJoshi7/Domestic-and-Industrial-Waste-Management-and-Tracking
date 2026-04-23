function renderAlert() {
    const content = document.getElementById('alert');
    content.innerHTML = `
        <div class="card alert">
            <div class="card-header">
                <div>
                    <div class="card-title">Raise Alert / Report Issue</div>
                    <div class="card-description">Report pollution incidents, waste saturation, or illegal dumping to relevant authorities</div>
                </div>
            </div>
            <div class="card-content">
                <div id="successAlert" class="alert alert-success" style="display: none;">
                    ✓ <span id="successMessage"></span>
                </div>

                <div class="authority-grid" id="authorityGrid"></div>

                <div id="submissionsSection" style="display: none;">
                    <div class="chart-container">
                        <div class="chart-title">🚨 Your Recent Alerts (<span id="submissionCount">0</span>)</div>
                        <div class="submissions-list" id="submissionsList"></div>
                    </div>
                </div>

                <div class="info-box">
                    <h4>📋 Important Information</h4>
                    <ul>
                        <li>• Your report will be tracked with a unique ID</li>
                        <li>• Authorities will acknowledge receipt within 24 hours</li>
                        <li>• You can check status updates on your registered mobile/email</li>
                        <li>• Multiple reports help identify patterns and enforce compliance</li>
                        <li>• Provide as much detail as possible for faster resolution</li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    renderAuthorityCards();
    updateSubmissionsDisplay();
}

function renderAuthorityCards() {
    const grid = document.getElementById('authorityGrid');
    grid.innerHTML = authorities.map(auth => `
        <div class="authority-card ${auth.color}" onclick="window.openAlertModal('${auth.id}')">
            <div class="authority-icon">${auth.icon}</div>
            <div class="authority-name">${auth.name}</div>
            <div class="authority-description">${auth.description}</div>
            <button type="button" class="authority-btn">Report Now</button>
        </div>
    `).join('');
}

function openAlertModal(authorityId) {
    currentAuthority = authorities.find(a => a.id === authorityId);
    document.getElementById('modalIcon').textContent = currentAuthority.icon;
    document.getElementById('modalAuthorityName').textContent = currentAuthority.name;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <form id="alertForm" onsubmit="window.handleAlertSubmit(event)">
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Your Name *</label>
                    <input type="text" id="formName" required placeholder="Full Name">
                </div>
                <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input type="email" id="formEmail" required placeholder="your@email.com">
                </div>
            </div>

            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">Mobile Number *</label>
                    <input type="tel" id="formMobile" required placeholder="+91 XXXXX XXXXX">
                </div>
                <div class="form-group">
                    <label class="form-label">Location/Address *</label>
                    <input type="text" id="formAddress" required placeholder="Street, Area, City">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Message/Alert Details *</label>
                <textarea id="formMessage" required placeholder="Describe the issue in detail..."></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Quick Templates</label>
                <div class="template-grid" id="templateGrid">
                    ${currentAuthority.templates.map((template, idx) => `
                        <button type="button" class="template-btn" onclick="window.selectTemplate('${template.replace(/'/g, "\\'")}')">
                            ${template}
                        </button>
                    `).join('')}
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%;">Submit</button>
        </form>
    `;

    document.getElementById('alertModal').classList.add('active');
}

function selectTemplate(template) {
    document.getElementById('formMessage').value = template;
    document.querySelectorAll('.template-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

function handleAlertSubmit(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('formName').value,
        email: document.getElementById('formEmail').value,
        mobile: document.getElementById('formMobile').value,
        address: document.getElementById('formAddress').value,
        message: document.getElementById('formMessage').value
    };

    const submission = {
        id: `alert-${Date.now()}`,
        authority: currentAuthority.name,
        ...formData,
        timestamp: new Date(),
        status: 'submitted'
    };

    submissions.unshift(submission);
    
    const successAlert = document.getElementById('successAlert');
    document.getElementById('successMessage').textContent = `Alert successfully submitted to ${currentAuthority.name}`;
    successAlert.style.display = 'flex';
    setTimeout(() => successAlert.style.display = 'none', 3000);
    
    updateSubmissionsDisplay();
    closeModal();
    document.getElementById('alertForm').reset();
}

function updateSubmissionsDisplay() {
    const section = document.getElementById('submissionsSection');
    const list = document.getElementById('submissionsList');
    
    if (submissions.length > 0) {
        section.style.display = 'block';
        document.getElementById('submissionCount').textContent = submissions.length;
        
        list.innerHTML = submissions.map(sub => `
            <div class="submission-item">
                <div class="submission-authority">${sub.authority}</div>
                <div class="submission-message">${sub.message}</div>
                <div class="submission-meta">
                    <span>📍 ${sub.address}</span>
                    <span>📧 ${sub.email}</span>
                    <span>📱 ${sub.mobile}</span>
                </div>
                <div class="submission-status">
                    <div class="status-badge" style="background: ${sub.status === 'submitted' ? '#dbeafe' : sub.status === 'acknowledged' ? '#fef3c7' : sub.status === 'processing' ? '#fed7aa' : '#dcfce7'}; color: ${sub.status === 'submitted' ? '#1e3a8a' : sub.status === 'acknowledged' ? '#92400e' : sub.status === 'processing' ? '#9a3412' : '#15803d'};">
                        ${sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </div>
                    <div style="margin-top: 4px; font-size: 10px; color: #94a3b8;">${sub.timestamp.toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }
}

window.openAlertModal = openAlertModal;
window.selectTemplate = selectTemplate;
window.handleAlertSubmit = handleAlertSubmit;

document.getElementById('alertModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});
