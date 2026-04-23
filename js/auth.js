class LocalAuthManager {
    constructor() {
        this.storageKey = 'dashboardUsers';
        this.sessionKey = 'currentUser';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    register(userData) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        if (users[userData.username]) {
            return { success: false, message: 'Username already exists' };
        }

        const user = {
            username: userData.username,
            password: this.hashPassword(userData.password),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
            registeredDate: new Date().toISOString()
        };

        users[userData.username] = user;
        localStorage.setItem(this.storageKey, JSON.stringify(users));
        return { success: true, message: 'Registration successful' };
    }

    login(username, password) {
        const users = JSON.parse(localStorage.getItem(this.storageKey));
        
        if (!users[username]) {
            return { success: false, message: 'Invalid username or password' };
        }

        const user = users[username];
        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid username or password' };
        }

        const sessionUser = {
            username: user.username,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionUser));
        return { success: true, user: sessionUser };
    }

    logout() {
        sessionStorage.removeItem(this.sessionKey);
    }

    getCurrentUser() {
        const userJson = sessionStorage.getItem(this.sessionKey);
        return userJson ? JSON.parse(userJson) : null;
    }

    isAuthenticated() {
        return sessionStorage.getItem(this.sessionKey) !== null;
    }

    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
    }
}

const authManager = new LocalAuthManager();

function initAuth() {
    if (authManager.isAuthenticated()) {
        showDashboard();
    } else {
        showAuthModal();
        setupAuthListeners();
    }
}

function setupAuthListeners() {
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    authTabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const tabName = this.getAttribute('data-tab');
            
            document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.auth-tab-content').forEach(tab => {
                tab.style.display = 'none';
                tab.classList.remove('active');
            });
            
            const tabElement = document.getElementById(tabName + 'Tab');
            if (tabElement) {
                tabElement.style.display = 'block';
                tabElement.classList.add('active');
            }
        });
    });

    attachLogoutListener();
}

function attachLogoutListener() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            authManager.logout();
            setTimeout(() => {
                location.reload();
            }, 100);
        };
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    const result = authManager.login(username, password);

    if (result.success) {
        errorDiv.style.display = 'none';
        showDashboard();
        setupAuthListeners();
        attachLogoutListener();
    } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regPasswordConfirm').value;
    const errorDiv = document.getElementById('registerError');

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 4) {
        errorDiv.textContent = 'Password must be at least 4 characters';
        errorDiv.style.display = 'block';
        return;
    }

    const userData = {
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        phone: document.getElementById('regPhone').value,
        address: document.getElementById('regAddress').value,
        username: document.getElementById('regUsername').value,
        password: password
    };

    const result = authManager.register(userData);

    if (result.success) {
        errorDiv.style.display = 'none';
        
        // Clear form first
        document.getElementById('registerForm').reset();
        
        // Switch to login tab
        document.querySelectorAll('.auth-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="login"]').classList.add('active');
        
        document.querySelectorAll('.auth-tab-content').forEach(tab => {
            tab.style.display = 'none';
            tab.classList.remove('active');
        });
        const loginTab = document.getElementById('loginTab');
        if (loginTab) {
            loginTab.style.display = 'block';
            loginTab.classList.add('active');
        }

        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.textContent = 'Registration successful! Please login with your credentials.';
        successDiv.style.cssText = 'background: #dcfce7; border: 1px solid #86efac; color: #15803d; padding: 10px 12px; border-radius: 6px; font-size: 12px; margin-bottom: 15px;';
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm && loginForm.parentElement) {
            loginForm.parentElement.insertBefore(successDiv, loginForm);
        }

        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 3000);
    } else {
        errorDiv.textContent = result.message;
        errorDiv.style.display = 'block';
    }
}

function showAuthModal() {
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('dashboardContainer').style.display = 'none';
}

function showDashboard() {
    const user = authManager.getCurrentUser();
    document.getElementById('userName').textContent = `Welcome, ${user.name}`;
    
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('dashboardContainer').style.display = 'block';
    
    attachLogoutListener();
}

window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

document.addEventListener('DOMContentLoaded', initAuth);
