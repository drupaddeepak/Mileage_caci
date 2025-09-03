<<<<<<< HEAD
# Mileage Calculator

A smart, location-aware web-based mileage calculator tool that automatically detects your region and provides customized fuel efficiency calculations and travel cost analysis.

## Features

- **🌍 Automatic Location Detection**: Detects your country/region using GPS or IP geolocation
- **🔄 Region-Specific Units**: Automatically shows appropriate units (km/l, mpg, l/100km) based on your location
- **💰 Local Currency & Pricing**: Displays results in your local currency with auto-detected fuel prices
- **📊 Regional Standards**: Compares your efficiency against local vehicle standards
- **⛽ Auto Fuel Prices**: Fetches current local fuel prices automatically
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **✅ Real-time Validation**: Input validation with helpful error messages
- **🎨 Clean UI**: Modern, intuitive interface with smooth animations

## How to Use

1. Open `index.html` in your web browser
2. Allow location access when prompted (or the app will use IP-based detection)
3. The app automatically detects your region and shows appropriate units
4. Enter your trip details:
   - Distance traveled (in your local units)
   - Fuel consumed (in your local units)
   - Current fuel price (or use the auto-detected price)
5. Click "Calculate Mileage" to get your results

## Supported Regions

The calculator automatically adapts to these regions:

- **🇮🇳 India**: km/l, ₹ currency, Indian efficiency standards
- **🇺🇸 United States**: mpg, $ currency, EPA standards
- **🇬🇧 United Kingdom**: mpg, £ currency, UK standards
- **🇩🇪 Germany**: l/100km, € currency, EU standards
- **🇫🇷 France**: l/100km, € currency, EU standards
- **🇦🇺 Australia**: km/l, A$ currency, Australian standards
- **🇨🇦 Canada**: km/l, C$ currency, Canadian standards

## Calculations

The calculator provides four key metrics with region-specific units:

### Fuel Efficiency
- **India/Australia/Canada**: km/liter (Distance ÷ Fuel consumed)
- **US/UK**: miles per gallon (mpg)
- **Europe**: liters per 100km (l/100km)

### Cost Analysis
- **Cost per Distance**: Calculated in local currency per unit distance
- **Total Fuel Cost**: Total cost in local currency

### Efficiency Ratings
Ratings are based on regional standards:

**India/Australia/Canada (km/l):**
- Excellent: 20+ km/l
- Good: 15-19.9 km/l
- Average: 10-14.9 km/l
- Poor: 5-9.9 km/l

**US/UK (mpg):**
- Excellent: 35+ mpg
- Good: 25-34.9 mpg
- Average: 20-24.9 mpg
- Poor: 15-19.9 mpg

**Europe (l/100km):**
- Excellent: ≤5 l/100km
- Good: 5-7 l/100km
- Average: 7-9 l/100km
- Poor: 9-12 l/100km

## Smart Features

### 🌍 Location Detection
- **GPS-based**: Uses your device's GPS for precise location
- **IP-based fallback**: Automatically falls back to IP geolocation if GPS is unavailable
- **Privacy-friendly**: Location data is only used for regional customization

### ⛽ Auto Fuel Prices
- Automatically fetches current fuel prices for your region
- Click "Use Auto Price" to quickly apply the detected price
- Prices are updated regularly for accuracy

### 🔄 Unit Conversion
- Automatically converts between different measurement systems
- Handles miles/kilometers, gallons/liters conversions seamlessly
- Shows results in your region's preferred units

## Tips for Accurate Results

- Fill your tank completely before starting your trip
- Note the exact distance traveled using your odometer
- Fill up again at the end to measure exact fuel consumption
- Use the auto-detected fuel price or enter current local prices
- Allow location access for the best regional customization

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Files

- `index.html` - Main HTML structure
- `styles.css` - CSS styling and responsive design
- `script.js` - JavaScript functionality and calculations
- `README.md` - This documentation file

## No Installation Required

Simply open `index.html` in any modern web browser. No server setup or dependencies required!
=======
# Mileage_caci
>>>>>>> c7f4986575bc359c6e43339f01052bea75fd83cc
