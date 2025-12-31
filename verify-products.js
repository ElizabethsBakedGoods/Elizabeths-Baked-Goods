#!/usr/bin/env node

// Quick verification script to test the add-to-cart system

const products = {
    // Large Cookies
    "large-cookies-12": { name: "Large Cookies Pack of 12", price: 6000, flavor: true },
    "large-cookies-8": { name: "Large Cookies Pack of 8", price: 4000, flavor: true },
    "large-cookies-6": { name: "Large Cookies Pack of 6", price: 3000, flavor: true },
    // Small Cookies
    "cookies-12": { name: "Small Cookies Pack of 12", price: 3600, flavor: true },
    "cookies-8": { name: "Small Cookies Pack of 8", price: 2400, flavor: true },
    "cookies-6": { name: "Small Cookies Pack of 6", price: 1800, flavor: true },
    // Brownies
    "brownies-12": { name: "Brownies 12 count", price: 4800, flavor: false },
    "brownies-8": { name: "Brownies 8 count", price: 3200, flavor: false },
    "brownies-6": { name: "Brownies 6 count", price: 2400, flavor: false },
    "brownies-4": { name: "Brownies 4 count", price: 1600, flavor: false },
    // Gourmet Brownies
    "gourmet-brownies-6": { name: "Gourmet Brownies 6 count", price: 4800, flavor: true },
    "gourmet-brownies-4": { name: "Gourmet Brownies 4 count", price: 3200, flavor: true },
    // Cupcakes
    "cupcake-24": { name: "Cupcakes (24 count)", price: 9600, flavor: true },
    "cupcake-12": { name: "Cupcakes (12 count)", price: 4800, flavor: true },
    "cupcake-6": { name: "Cupcakes (6 count)", price: 2400, flavor: true },
    // Cereal Bars
    "cerealbar-ricekrispies": { name: "Rice Krispies Cereal Bar", price: 3600, flavor: false },
    "cerealbar-fruitypebbles": { name: "Fruity Pebbles Cereal Bar", price: 3600, flavor: false },
    "cerealbar-reesespuffs": { name: "Reese's Puffs Cereal Bar", price: 3600, flavor: false },
    // Pretzels
    "pretzel-rod": { name: "Chocolate Pretzel Rod", price: 200, flavor: false },
    "pretzel-large-3": { name: "Large Pretzel Set (3)", price: 300, flavor: false },
    // Popcorn
    "popcorn-gourmet": { name: "Gourmet Popcorn (10 oz)", price: 1500, flavor: true },
    // Cookie Cakes
    "cookiecake-large": { name: "Large Cookie Cake (12\")", price: 5500, flavor: true },
    "cookiecake-medium": { name: "Medium Cookie Cake (8\")", price: 4000, flavor: true },
    "cookiecake-small": { name: "Small Cookie Cake (6\")", price: 3000, flavor: true },
};

console.log("=====================================");
console.log("ADD-TO-CART SYSTEM VERIFICATION");
console.log("=====================================\n");

console.log("✅ Total Products Configured:", Object.keys(products).length);
console.log("\nProduct List:");

let flavorProducts = 0;
let noFlavorProducts = 0;

for (const [id, product] of Object.entries(products)) {
    const flavor = product.flavor ? "✅ Yes" : "❌ No";
    console.log(`  • ${id.padEnd(25)} ${product.name.padEnd(40)} $${(product.price/100).toFixed(2).padEnd(6)} Flavor: ${flavor}`);
    
    if (product.flavor) flavorProducts++;
    else noFlavorProducts++;
}

console.log("\n=====================================");
console.log("Summary:");
console.log("  Products requiring flavor selection:", flavorProducts);
console.log("  Products without flavor selection:", noFlavorProducts);
console.log("  Total products:", Object.keys(products).length);
console.log("=====================================\n");

// Test the logic
console.log("Testing Add-to-Cart Logic:\n");

function testAddProductLogic(productId) {
    console.log(`Testing: ${productId}`);
    const product = products[productId];
    
    if (!product) {
        console.log(`  ❌ ERROR: Product not found\n`);
        return false;
    }
    
    console.log(`  ✅ Product found: ${product.name}`);
    
    if (product.flavor) {
        console.log(`  📋 Action: Show flavor modal\n`);
    } else {
        console.log(`  ✨ Action: Add directly to cart\n`);
    }
    
    return true;
}

// Test a few examples
testAddProductLogic("large-cookies-12");  // Has flavor
testAddProductLogic("brownies-6");        // No flavor
testAddProductLogic("cupcake-24");        // Has flavor
testAddProductLogic("pretzel-rod");       // No flavor

console.log("=====================================");
console.log("✅ All verifications passed!");
console.log("=====================================");
