document.querySelectorAll('.tab-trigger').forEach(trigger => {
    trigger.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // Update active states
        document.querySelectorAll('.tab-trigger[data-tab]').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        
        // Initialize content based on tab
        setTimeout(() => {
            if (tabName === 'domestic') renderDomestic();
            if (tabName === 'industrial') renderIndustrial();
            if (tabName === 'pollution') renderPollution();
            if (tabName === 'alert') renderAlert();
        }, 50);
    });
});
