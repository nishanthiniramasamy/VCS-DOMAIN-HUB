
          // Global variables
        let cart = [];
        let currentStep = 1;
        let currentPaymentMethod = 'card';

        // Domain search functionality
        function searchDomain() {
            const domain = document.getElementById('domainInput').value.trim();
            const extension = document.getElementById('extensionSelect').value;
            
            if (!domain) {
                showNotification('Please enter a domain name', 'error');
                return;
            }

            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = '<div style="text-align: center; padding: 2rem;">🔍 Searching domains...</div>';
            
            // Simulate search results
            setTimeout(() => {
                const extensions = ['.com', '.net', '.org', '.io', '.ai', '.co', '.dev', '.app', '.tech'];
                let results = '';
                
                extensions.forEach(ext => {
                    const available = Math.random() > 0.3; // 70% chance of being available
                    const price = getPriceForExtension(ext);
                    
                    results += `
                        <div class="domain-result ${available ? 'available' : 'taken'}">
                            <div>
                                <strong>${domain}${ext}</strong>
                                <span style="margin-left: 1rem; color: ${available ? '#28a745' : '#dc3545'};">
                                    ${available ? '✅ Available' : '❌ Taken'}
                                </span>
                            </div>
                            <div>
                                ${available ? `
                                    <span style="font-weight: bold; margin-right: 1rem;">$${price}/year</span>
                                    <button class="add-to-cart" onclick="addToCart('${domain}${ext}', ${price})">
                                        Add to Cart
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                });
                
                resultsDiv.innerHTML = results;
            }, 1000);
        }

        function getPriceForExtension(ext) {
            const prices = {
                '.com': 12.99, '.net': 14.99, '.org': 13.99, '.io': 49.99,
                '.ai': 199.99, '.co': 24.99, '.dev': 15.99, '.app': 18.99, '.tech': 22.99
            };
            return prices[ext] || 15.99;
        }

        // Cart functionality
        function addToCart(domain, price) {
            const existingItem = cart.find(item => item.domain === domain);
            if (existingItem) {
                showNotification('Domain already in cart', 'error');
                return;
            }
            
            cart.push({ domain, price });
            updateCartDisplay();
            showNotification(`${domain} added to cart!`);
        }

        function updateCartDisplay() {
            const count = cart.length;
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            
            document.getElementById('cart-count').textContent = count;
            document.getElementById('cart-total').textContent = total.toFixed(2);
        }

        function toggleCart() {
            const modal = document.getElementById('cartModal');
            if (modal.style.display === 'flex') {
                closeCart();
            } else {
                showCart();
            }
        }

        function showCart() {
            const modal = document.getElementById('cartModal');
            const cartItems = document.getElementById('cartItems');
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
            } else {
                let itemsHTML = '';
                cart.forEach((item, index) => {
                    itemsHTML += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #eee;">
                            <div>
                                <strong>${item.domain}</strong><br>
                                <small>1 year registration</small>
                            </div>
                            <div style="text-align: right;">
                                <div>$${item.price}</div>
                                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #dc3545; cursor: pointer;">Remove</button>
                            </div>
                        </div>
                    `;
                });
                cartItems.innerHTML = itemsHTML;
            }
            
            const total = cart.reduce((sum, item) => sum + item.price, 0);
            document.getElementById('modalCartTotal').textContent = total.toFixed(2);
            
            modal.classList.add('active');
        }

        function closeCart() {
            document.getElementById('cartModal').classList.remove('active');
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartDisplay();
            showCart(); // Refresh cart display
        }

        function proceedToCheckout() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            closeCart();
            showCheckout();
        }

        // Enhanced checkout functionality
        function showCheckout() {
            const modal = document.getElementById('checkoutModal');
            updateCheckoutOrderItems();
            modal.classList.add('active');
            currentStep = 1;
            updateStepDisplay();
        }

        function closeCheckout() {
            document.getElementById('checkoutModal').classList.remove('active');
        }

        function updateCheckoutOrderItems() {
            const container = document.getElementById('checkoutOrderItems');
            let itemsHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                subtotal += item.price;
                itemsHTML += `
                    <div class="order-item">
                        <div>
                            <strong>${item.domain}</strong><br>
                            <small>1 year registration</small>
                        </div>
                        <div>$${item.price.toFixed(2)}</div>
                    </div>
                `;
            });
            
            // Add services
            const whoisPrivacy = document.getElementById('whoisPrivacy')?.checked ? 9.99 : 0;
            if (whoisPrivacy > 0) {
                itemsHTML += `
                    <div class="order-item">
                        <div>WHOIS Privacy Protection</div>
                        <div>$${whoisPrivacy.toFixed(2)}</div>
                    </div>
                `;
            }
            
            const total = subtotal + whoisPrivacy;
            itemsHTML += `
                <div class="order-item">
                    <div><strong>Total</strong></div>
                    <div><strong>$${total.toFixed(2)}</strong></div>
                </div>
            `;
            
            container.innerHTML = itemsHTML;
        }

        function updateTotal() {
            updateCheckoutOrderItems();
        }

        function nextStep() {
            if (currentStep < 4) {
                if (validateCurrentStep()) {
                    currentStep++;
                    updateStepDisplay();
                }
            } else {
                completePurchase();
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                currentStep--;
                updateStepDisplay();
            }
        }

        function updateStepDisplay() {
            // Update step indicators
            for (let i = 1; i <= 4; i++) {
                const step = document.getElementById(`step${i}`);
                const section = document.getElementById(`section${i}`);
                
                step.classList.remove('active', 'completed');
                section.classList.remove('active');
                
                if (i < currentStep) {
                    step.classList.add('completed');
                } else if (i === currentStep) {
                    step.classList.add('active');
                    section.classList.add('active');
                }
            }
            
            // Update navigation buttons
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            
            prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
            
            if (currentStep === 4) {
                nextBtn.textContent = '🎉 Complete Order';
                nextBtn.style.display = 'none'; // Hide on confirmation step
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.style.display = 'block';
            }
        }

        function validateCurrentStep() {
            if (currentStep === 2) {
                const required = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'state', 'zipCode', 'country'];
                for (let field of required) {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                        element.focus();
                        return false;
                    }
                }
            } else if (currentStep === 3 && currentPaymentMethod === 'card') {
                const required = ['cardNumber', 'cardName', 'cardExpiry', 'cardCVC'];
                for (let field of required) {
                    const element = document.getElementById(field);
                    if (!element.value.trim()) {
                        showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                        element.focus();
                        return false;
                    }
                }
            }
            return true;
        }

        function selectPaymentMethod(method) {
            currentPaymentMethod = method;
            
            // Update UI
            document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('active'));
            event.target.closest('.payment-method').classList.add('active');
            
            // Show/hide payment forms
            document.querySelectorAll('.payment-form').forEach(form => form.style.display = 'none');
            document.getElementById(`${method}Payment`).style.display = 'block';
        }

        function completePurchase() {
            // Simulate payment processing
            showNotification('Processing payment...', 'info');
            
            setTimeout(() => {
                currentStep = 4;
                updateStepDisplay();
                showNotification('Payment successful! Welcome to VCS Domain Hub!');
                
                // Clear cart after successful purchase
                setTimeout(() => {
                    cart = [];
                    updateCartDisplay();
                }, 3000);
            }, 2000);
        }

        function downloadReceipt() {
            showNotification('Receipt downloaded successfully!');
        }

        function manageDomains() {
            showNotification('Redirecting to domain management...');
            setTimeout(() => {
                closeCheckout();
            }, 1000);
        }

        // Utility functions
        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(`${tab}-section`).classList.add('active');
        }

        function selectTLD(tld) {
            document.querySelectorAll('.tld-pill').forEach(pill => pill.classList.remove('active'));
            event.target.classList.add('active');
            document.getElementById('extensionSelect').value = tld;
        }

        function toggleFeatureFlags() {
            document.getElementById('featureFlags').classList.toggle('active');
        }

        function toggleFeature(feature) {
            event.target.classList.toggle('active');
        }

        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification show ${type}`;
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Card number formatting
        document.addEventListener('DOMContentLoaded', function() {
            const cardNumber = document.getElementById('cardNumber');
            const cardExpiry = document.getElementById('cardExpiry');
            
            if (cardNumber) {
                cardNumber.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                    this.value = formattedValue;
                });
            }
            
            if (cardExpiry) {
                cardExpiry.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    this.value = value;
                });
            }
        });

         // Mobile Navigation Functions
        function toggleMobileNav() {
            const mobileNav = document.getElementById('mobileNav');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            mobileNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        }

        function closeMobileNav() {
            const mobileNav = document.getElementById('mobileNav');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }

        // Event Listeners for Mobile Navigation
        document.getElementById('mobileMenuToggle').addEventListener('click', toggleMobileNav);
        document.getElementById('mobileOverlay').addEventListener('click', closeMobileNav);

        // Modal functionality
        function openModal(type) {
            const overlay = document.getElementById('modalOverlay');
            overlay.classList.add('active');
            switchTab(type);
        }

        function closeModal() {
            const overlay = document.getElementById('modalOverlay');
            overlay.classList.remove('active');
            // Reset forms
            document.querySelectorAll('form').forEach(form => form.reset());
        }

        function switchTab(type) {
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(type + 'Tab').classList.add('active');
            
            // Update form visibility
            document.querySelectorAll('.form-content').forEach(form => form.classList.remove('active'));
            document.getElementById(type + 'Form').classList.add('active');
        }

        // Form handling
        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Simulate login process
            console.log('Login attempt:', { email, password });
            alert('Login functionality would be implemented here!\n\nEmail: ' + email);
            
            // In a real application, you would send this data to your server
            // closeModal();
        }

        function handleSignup(event) {
            event.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Password validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long!');
                return;
            }
            
            // Simulate signup process
            console.log('Signup attempt:', { fullName, email, password });
            alert('Signup functionality would be implemented here!\n\nName: ' + fullName + '\nEmail: ' + email);
            
            // In a real application, you would send this data to your server
            // closeModal();
        }

        function handleForgotPassword() {
            const email = prompt('Please enter your email address:');
            if (email) {
                alert('Password reset link would be sent to: ' + email);
                // In a real application, you would send a password reset email
            }
        }

        function showTerms() {
            alert('Terms & Conditions would be displayed here in a real application.');
        }

        // Close modal when clicking outside
        document.getElementById('modalOverlay').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
                closeMobileNav();
            }
        });

        // Initialize - set login as default active tab
        document.addEventListener('DOMContentLoaded', function() {
            switchTab('login');
        });