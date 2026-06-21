/**
 * football-products.js
 * Dữ liệu sản phẩm cho trang Nike Football – National Team
 */

const PRODUCTS = [
    {
        id: "eng-2026-stadium-home-men",
        name: "England National Team 2026 Stadium Home",
        type: "Men's Nike Dri-FIT Football Shirt",
        price: 2399000,
        badge: "Promo Exclusion",
        badgeType: "promo",
        category: "tops-tshirts",
        gender: "men",
        kids: null,
        sale: false,
        colors: ["white"],
        brand: "nike",
        sports: ["football"],
        img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop&crop=center",
        images: [
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=800&fit=crop&crop=center",
        ],
        colorName: "White/Speed Red/Obsidian/Obsidian",
        styleCode: "IB4551-100",
        origin: "Laos, Thailand",
        promoExcluded: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        disabledSizes: [],
        description:
            "Wear the colours with pride in this England Stadium shirt. Made with sweat-wicking Dri-FIT technology, it's designed to keep you cool and comfortable whether you're cheering from the stands or playing your own match.",
    },
    {
        id: "eng-2026-stadium-home-younger-kids",
        name: "England 2026 Stadium Home",
        type: "Younger Kids' Nike Football Replica 3-Piece Kit",
        price: 1939000,
        badge: "Promo Exclusion",
        badgeType: "promo",
        category: "tops-tshirts",
        gender: "unisex",
        kids: "boys",
        sale: false,
        colors: ["white"],
        brand: "nike",
        sports: ["football"],
        recycled: true,
        img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=800&fit=crop&crop=center",
        images: [
            "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=800&fit=crop&crop=center",
        ],
        colorName: "White/Speed Red/Obsidian/Obsidian",
        styleCode: "IB4553-100",
        origin: "Laos, Thailand",
        promoExcluded: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        disabledSizes: ["XS", "S"],
        sizeFitNote: "Model is wearing size M and is 5'1\" (154cm approx.)",
        fitType: "Standard fit: easy and traditional",
        description:
            "Outfit future little stars in the full colours with this three-piece kit. Inspired by what the pros wear, it has a team shirt with matching shorts and socks. Made from lightweight, sweat-wicking fabric, it helps keep young athletes comfortable while they zoom, scurry or play.",
    },
    {
        id: "eng-2026-stadium-home-older-kids",
        name: "England National Team 2026 Stadium Home",
        type: "Older Kids' Nike Dri-FIT Football Shirt",
        price: 1939000,
        badge: "Sold Out",
        badgeType: "sold-out",
        category: "tops-tshirts",
        gender: "unisex",
        kids: "boys",
        sale: false,
        colors: ["white"],
        brand: "nike",
        sports: ["football"],
        img: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&h=800&fit=crop&crop=center",
        images: [
            "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=600&h=800&fit=crop&crop=center",
        ],
        colorName: "White/Speed Red/Obsidian/Obsidian",
        styleCode: "IB4552-100",
        origin: "Laos, Thailand",
        promoExcluded: false,
        soldOut: true,
        sizes: ["XS", "S", "M", "L", "XL"],
        disabledSizes: ["XS", "S", "M", "L", "XL"],
        description:
            "Show your support for England in this Stadium shirt, designed with sweat-wicking Dri-FIT fabric to help keep older kids cool, dry and comfortable on game day.",
    },
];

if (typeof window !== "undefined") {
    window.PRODUCTS = PRODUCTS;
}