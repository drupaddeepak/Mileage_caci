// Enhanced Mileage Calculator with Location Detection
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mileageForm');
    const resultsSection = document.getElementById('results');
    
    // Form elements
    const distanceInput = document.getElementById('distance');
    const fuelInput = document.getElementById('fuel');
    const priceInput = document.getElementById('price');
    const fuelTypeSelect = document.getElementById('fuelType');
    
    // Label elements for dynamic updates
    const distanceLabel = document.getElementById('distanceLabel');
    const fuelLabel = document.getElementById('fuelLabel');
    const priceLabel = document.getElementById('priceLabel');
    
    // Result elements
    const efficiencyElement = document.getElementById('efficiency');
    const costPerKmElement = document.getElementById('costPerKm');
    const totalCostElement = document.getElementById('totalCost');
    const ratingElement = document.getElementById('rating');
    
    // Result label elements
    const efficiencyLabel = document.getElementById('efficiencyLabel');
    const costPerKmLabel = document.getElementById('costPerKmLabel');
    const totalCostLabel = document.getElementById('totalCostLabel');
    const ratingLabel = document.getElementById('ratingLabel');
    
    // Result unit elements
    const efficiencyUnit = document.getElementById('efficiencyUnit');
    const costPerKmUnit = document.getElementById('costPerKmUnit');
    const totalCostUnit = document.getElementById('totalCostUnit');
    const ratingUnit = document.getElementById('ratingUnit');
    
    // Location elements
    const locationInfo = document.getElementById('locationInfo');
    const countryName = document.getElementById('countryName');
    const autoPriceInfo = document.getElementById('autoPriceInfo');
    const autoPrice = document.getElementById('autoPrice');
    const autoPriceCurrency = document.getElementById('autoPriceCurrency');
    const useAutoPriceBtn = document.getElementById('useAutoPrice');
    
    // Global variables
    let userLocation = null;
    let regionConfig = null;
    let currentFuelPrice = null;
    let currentFuelType = 'petrol';
    
    // Region configurations
    const regionConfigs = {
        'IN': { // India
            name: 'India',
            distanceUnit: 'km',
            fuelUnit: 'liters',
            currency: '₹',
            efficiencyUnit: 'km/l',
            costPerUnit: '₹/km',
            efficiencyStandards: {
                excellent: 20,
                good: 15,
                average: 10,
                poor: 5
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/IN'
        },
        'US': { // United States
            name: 'United States',
            distanceUnit: 'miles',
            fuelUnit: 'gallons',
            currency: '$',
            efficiencyUnit: 'mpg',
            costPerUnit: '$/mile',
            efficiencyStandards: {
                excellent: 35,
                good: 25,
                average: 20,
                poor: 15
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/US'
        },
        'GB': { // United Kingdom
            name: 'United Kingdom',
            distanceUnit: 'miles',
            fuelUnit: 'liters',
            currency: '£',
            efficiencyUnit: 'mpg',
            costPerUnit: '£/mile',
            efficiencyStandards: {
                excellent: 50,
                good: 40,
                average: 30,
                poor: 20
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/GB'
        },
        'DE': { // Germany
            name: 'Germany',
            distanceUnit: 'km',
            fuelUnit: 'liters',
            currency: '€',
            efficiencyUnit: 'l/100km',
            costPerUnit: '€/km',
            efficiencyStandards: {
                excellent: 5,
                good: 7,
                average: 9,
                poor: 12
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/DE'
        },
        'FR': { // France
            name: 'France',
            distanceUnit: 'km',
            fuelUnit: 'liters',
            currency: '€',
            efficiencyUnit: 'l/100km',
            costPerUnit: '€/km',
            efficiencyStandards: {
                excellent: 5,
                good: 7,
                average: 9,
                poor: 12
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/FR'
        },
        'AU': { // Australia
            name: 'Australia',
            distanceUnit: 'km',
            fuelUnit: 'liters',
            currency: 'A$',
            efficiencyUnit: 'km/l',
            costPerUnit: 'A$/km',
            efficiencyStandards: {
                excellent: 20,
                good: 15,
                average: 10,
                poor: 5
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/AU'
        },
        'CA': { // Canada
            name: 'Canada',
            distanceUnit: 'km',
            fuelUnit: 'liters',
            currency: 'C$',
            efficiencyUnit: 'km/l',
            costPerUnit: 'C$/km',
            efficiencyStandards: {
                excellent: 20,
                good: 15,
                average: 10,
                poor: 5
            },
            fuelPriceAPI: 'https://api.fuelpriceapi.com/v1/prices/CA'
        }
    };
    
    // Default configuration (fallback)
    const defaultConfig = regionConfigs['IN'];
    
    // Initialize the application
    async function initializeApp() {
        try {
            await detectUserLocation();
            await fetchFuelPrice();
            updateUIForRegion();
        } catch (error) {
            console.error('Initialization error:', error);
            // Fallback to default configuration
            regionConfig = defaultConfig;
            updateUIForRegion();
        }
    }
    
    // Detect user location
    async function detectUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const countryCode = await getCountryFromCoordinates(latitude, longitude);
                        userLocation = { latitude, longitude, countryCode };
                        regionConfig = regionConfigs[countryCode] || defaultConfig;
                        
                        // Update location display
                        countryName.textContent = regionConfig.name;
                        locationInfo.style.display = 'block';
                        
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    // Fallback to IP-based location detection
                    detectLocationByIP().then(resolve).catch(reject);
                },
                { timeout: 10000, enableHighAccuracy: false }
            );
        });
    }
    
    // Get country from coordinates using reverse geocoding
    async function getCountryFromCoordinates(lat, lon) {
        try {
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const data = await response.json();
            return data.countryCode;
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            throw error;
        }
    }
    
    // Fallback location detection using IP
    async function detectLocationByIP() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;
            userLocation = { countryCode };
            regionConfig = regionConfigs[countryCode] || defaultConfig;
            
            // Update location display
            countryName.textContent = regionConfig.name;
            locationInfo.style.display = 'block';
        } catch (error) {
            console.error('IP location detection error:', error);
            throw error;
        }
    }
    
    // Fetch current fuel price for the region
    async function fetchFuelPrice() {
        if (!regionConfig || !regionConfig.fuelPriceAPI) {
            return;
        }
        
        try {
            // Using a mock API response since real fuel price APIs require keys
            // In a real implementation, you would use a proper fuel price API
            const mockPrices = {
                'IN': 95.50,
                'US': 3.50,
                'GB': 1.45,
                'DE': 1.65,
                'FR': 1.70,
                'AU': 1.80,
                'CA': 1.40
            };
            
            currentFuelPrice = mockPrices[userLocation?.countryCode] || 95.50;
            
            // Update auto price display
            autoPrice.textContent = currentFuelPrice.toFixed(2);
            autoPriceCurrency.textContent = regionConfig.currency;
            autoPriceInfo.style.display = 'block';
            
        } catch (error) {
            console.error('Fuel price fetch error:', error);
        }
    }
    
    // Update UI elements for the current region
    function updateUIForRegion() {
        if (!regionConfig) return;
        
        // Update input labels
        distanceLabel.textContent = `Distance Traveled (${regionConfig.distanceUnit})`;
        updateFuelLabels();
        updatePriceLabel();
        
        // Update placeholders
        distanceInput.placeholder = `Enter distance in ${regionConfig.distanceUnit}`;
        updateFuelPlaceholder();
        priceInput.placeholder = `Enter current fuel price`;
        
        // Update result labels and units
        efficiencyUnit.textContent = regionConfig.efficiencyUnit;
        costPerKmUnit.textContent = regionConfig.costPerUnit;
        totalCostUnit.textContent = regionConfig.currency;
    }
    
    // Update fuel labels based on fuel type
    function updateFuelLabels() {
        const fuelType = fuelTypeSelect.value;
        let fuelUnit = regionConfig.fuelUnit;
        let fuelLabelText = 'Fuel Consumed';
        
        switch(fuelType) {
            case 'electric':
                fuelUnit = 'kWh';
                fuelLabelText = 'Energy Consumed';
                break;
            case 'cng':
                fuelUnit = 'kg';
                fuelLabelText = 'CNG Consumed';
                break;
            default:
                fuelUnit = regionConfig.fuelUnit;
                fuelLabelText = 'Fuel Consumed';
        }
        
        fuelLabel.textContent = `${fuelLabelText} (${fuelUnit})`;
    }
    
    // Update price label based on fuel type
    function updatePriceLabel() {
        const fuelType = fuelTypeSelect.value;
        let priceUnit = regionConfig.fuelUnit === 'gallons' ? 'Gallon' : 'Liter';
        let priceLabelText = 'Fuel Price per';
        
        switch(fuelType) {
            case 'electric':
                priceUnit = 'kWh';
                priceLabelText = 'Electricity Price per';
                break;
            case 'cng':
                priceUnit = 'kg';
                priceLabelText = 'CNG Price per';
                break;
            default:
                priceUnit = regionConfig.fuelUnit === 'gallons' ? 'Gallon' : 'Liter';
                priceLabelText = 'Fuel Price per';
        }
        
        priceLabel.textContent = `${priceLabelText} ${priceUnit} (${regionConfig.currency})`;
    }
    
    // Update fuel placeholder based on fuel type
    function updateFuelPlaceholder() {
        const fuelType = fuelTypeSelect.value;
        let fuelUnit = regionConfig.fuelUnit;
        
        switch(fuelType) {
            case 'electric':
                fuelUnit = 'kWh';
                break;
            case 'cng':
                fuelUnit = 'kg';
                break;
        }
        
        fuelInput.placeholder = `Enter ${fuelType === 'electric' ? 'energy' : 'fuel'} consumed in ${fuelUnit}`;
    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get input values
        const distance = parseFloat(distanceInput.value);
        const fuel = parseFloat(fuelInput.value);
        const price = parseFloat(priceInput.value);
        const fuelType = fuelTypeSelect.value;
        
        // Validate inputs
        if (!validateInputs(distance, fuel, price)) {
            return;
        }
        
        // Calculate results
        const results = calculateMileage(distance, fuel, price, fuelType);
        
        // Display results
        displayResults(results);
        
        // Show results section
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    // Input validation
    function validateInputs(distance, fuel, price) {
        let isValid = true;
        
        // Distance validation
        if (isNaN(distance) || distance <= 0) {
            showError(distanceInput, 'Please enter a valid distance greater than 0');
            isValid = false;
        }
        
        // Fuel validation
        if (isNaN(fuel) || fuel <= 0) {
            showError(fuelInput, 'Please enter a valid fuel amount greater than 0');
            isValid = false;
        }
        
        // Price validation
        if (isNaN(price) || price <= 0) {
            showError(priceInput, 'Please enter a valid fuel price greater than 0');
            isValid = false;
        }
        
        // Additional validation: fuel consumption should be reasonable
        if (isValid && fuel > distance) {
            showError(fuelInput, 'Fuel consumption cannot be greater than distance traveled');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Show error for specific input
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    // Clear all errors
    function clearErrors() {
        const errorInputs = document.querySelectorAll('.error');
        const errorMessages = document.querySelectorAll('.error-message');
        
        errorInputs.forEach(input => input.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
    }
    
    // Calculate mileage and related metrics
    function calculateMileage(distance, fuel, price, fuelType) {
        if (!regionConfig) {
            regionConfig = defaultConfig;
        }
        
        let efficiency, costPerUnit, totalCost;
        
        // Calculate efficiency based on region and fuel type
        if (regionConfig.efficiencyUnit === 'mpg') {
            // Convert to miles per gallon for US/UK
            const distanceInMiles = regionConfig.distanceUnit === 'miles' ? distance : distance * 0.621371;
            const fuelInGallons = regionConfig.fuelUnit === 'gallons' ? fuel : fuel * 0.264172;
            efficiency = distanceInMiles / fuelInGallons;
        } else if (regionConfig.efficiencyUnit === 'l/100km') {
            // Liters per 100km for European countries
            efficiency = (fuel / distance) * 100;
        } else {
            // km/l for most other countries
            efficiency = distance / fuel;
        }
        
        // Adjust efficiency calculation for electric vehicles
        if (fuelType === 'electric') {
            // For electric vehicles, show km/kWh instead of km/l
            efficiency = distance / fuel;
        }
        
        // Calculate cost per unit distance
        costPerUnit = (fuel * price) / distance;
        
        // Calculate total cost
        totalCost = fuel * price;
        
        // Get efficiency rating based on fuel type
        const rating = getEfficiencyRating(efficiency, fuelType);
        
        return {
            efficiency: efficiency,
            costPerUnit: costPerUnit,
            totalCost: totalCost,
            rating: rating,
            fuelType: fuelType
        };
    }
    
    // Get efficiency rating based on region standards and fuel type
    function getEfficiencyRating(efficiency, fuelType) {
        if (!regionConfig) {
            regionConfig = defaultConfig;
        }
        
        // Get fuel-specific standards
        const standards = getFuelSpecificStandards(fuelType);
        
        if (regionConfig.efficiencyUnit === 'l/100km') {
            // Lower is better for l/100km
            if (efficiency <= standards.excellent) {
                return { text: 'Excellent', color: '#39FF14' };
            } else if (efficiency <= standards.good) {
                return { text: 'Good', color: '#00FF41' };
            } else if (efficiency <= standards.average) {
                return { text: 'Average', color: '#FFD700' };
            } else if (efficiency <= standards.poor) {
                return { text: 'Poor', color: '#FF6B6B' };
            } else {
                return { text: 'Very Poor', color: '#FF4444' };
            }
        } else {
            // Higher is better for mpg and km/l
            if (efficiency >= standards.excellent) {
                return { text: 'Excellent', color: '#39FF14' };
            } else if (efficiency >= standards.good) {
                return { text: 'Good', color: '#00FF41' };
            } else if (efficiency >= standards.average) {
                return { text: 'Average', color: '#FFD700' };
            } else if (efficiency >= standards.poor) {
                return { text: 'Poor', color: '#FF6B6B' };
            } else {
                return { text: 'Very Poor', color: '#FF4444' };
            }
        }
    }
    
    // Get fuel-specific efficiency standards
    function getFuelSpecificStandards(fuelType) {
        const baseStandards = regionConfig.efficiencyStandards;
        
        switch(fuelType) {
            case 'electric':
                return {
                    excellent: baseStandards.excellent * 2, // Electric is typically 2x more efficient
                    good: baseStandards.good * 1.8,
                    average: baseStandards.average * 1.5,
                    poor: baseStandards.poor * 1.2
                };
            case 'hybrid':
                return {
                    excellent: baseStandards.excellent * 1.5,
                    good: baseStandards.good * 1.3,
                    average: baseStandards.average * 1.1,
                    poor: baseStandards.poor
                };
            case 'cng':
                return {
                    excellent: baseStandards.excellent * 1.2,
                    good: baseStandards.good * 1.1,
                    average: baseStandards.average,
                    poor: baseStandards.poor * 0.9
                };
            case 'diesel':
                return {
                    excellent: baseStandards.excellent * 1.3,
                    good: baseStandards.good * 1.2,
                    average: baseStandards.average * 1.1,
                    poor: baseStandards.poor
                };
            default: // petrol/gasoline
                return baseStandards;
        }
    }
    
    // Display calculation results
    function displayResults(results) {
        // Update efficiency with fuel-specific unit
        let efficiencyUnitText = regionConfig.efficiencyUnit;
        if (results.fuelType === 'electric') {
            efficiencyUnitText = 'km/kWh';
        }
        efficiencyUnit.textContent = efficiencyUnitText;
        efficiencyElement.textContent = results.efficiency.toFixed(2);
        
        // Update cost per unit
        costPerKmElement.textContent = results.costPerUnit.toFixed(2);
        
        // Update total cost
        totalCostElement.textContent = results.totalCost.toFixed(2);
        
        // Update rating with color and fuel type
        ratingElement.textContent = results.rating.text;
        ratingElement.style.color = results.rating.color;
        ratingElement.style.textShadow = `0 0 10px ${results.rating.color}`;
        
        // Add fuel type indicator to rating
        const fuelTypeEmoji = {
            'petrol': '⛽',
            'diesel': '🛢️',
            'electric': '⚡',
            'hybrid': '🔋',
            'cng': '💨'
        };
        ratingUnit.textContent = fuelTypeEmoji[results.fuelType] || '';
        
        // Add animation to result cards
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.style.animation = 'fadeInUp 0.5s ease-out forwards';
        });
    }
    
    // Use auto-detected price
    useAutoPriceBtn.addEventListener('click', function() {
        if (currentFuelPrice) {
            priceInput.value = currentFuelPrice.toFixed(2);
            priceInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Fuel type change handler
    fuelTypeSelect.addEventListener('change', function() {
        currentFuelType = this.value;
        updateFuelLabels();
        updatePriceLabel();
        updateFuelPlaceholder();
        
        // Add visual feedback
        this.style.borderColor = '#39FF14';
        this.style.boxShadow = '0 0 15px rgba(57, 255, 20, 0.3)';
        
        setTimeout(() => {
            this.style.borderColor = '#2a2a2a';
            this.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)';
        }, 1000);
    });
    
    // Real-time input validation
    [distanceInput, fuelInput, priceInput].forEach(input => {
        input.addEventListener('input', function() {
            // Remove error state on input
            this.classList.remove('error');
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
            
            // Basic validation feedback
            const value = parseFloat(this.value);
            if (this.value && (isNaN(value) || value <= 0)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#e1e5e9';
            }
        });
        
        // Focus and blur effects
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.background = 'white';
        });
        
        input.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.borderColor = '#e1e5e9';
                this.style.background = '#fafbfc';
            }
        });
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key to submit form
        if (e.key === 'Enter' && !e.shiftKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName === 'INPUT') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            form.reset();
            resultsSection.style.display = 'none';
            clearErrors();
        }
    });
    
    // Auto-format numbers as user types
    [distanceInput, fuelInput, priceInput].forEach(input => {
        input.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (!isNaN(value) && value > 0) {
                // Format to appropriate decimal places
                if (this === distanceInput) {
                    this.value = value.toFixed(1);
                } else if (this === fuelInput) {
                    this.value = value.toFixed(2);
                } else if (this === priceInput) {
                    this.value = value.toFixed(2);
                }
            }
        });
    });
    
    // Add loading state to calculate button
    const calculateBtn = document.querySelector('.calculate-btn');
    form.addEventListener('submit', function() {
        calculateBtn.textContent = 'Calculating...';
        calculateBtn.disabled = true;
        
        // Simulate calculation delay for better UX
        setTimeout(() => {
            calculateBtn.textContent = 'Calculate Mileage';
            calculateBtn.disabled = false;
        }, 500);
    });
    
    // Initialize the application
    initializeApp();
});