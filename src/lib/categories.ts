import { slugifyCategoryName } from "@/lib/category-slugs.mjs";

export const categoriesData = [
  {
    name: "Visiting Cards",
    subCategories: [
      {
        title: "Visiting Cards",
        items: [
          { name: "Standard Visiting Cards", isNew: false },
          { name: "Classic Visiting Cards", isNew: false },
          { name: "Rounded Corner Visiting Cards", isNew: false },
          { name: "Square Visiting Cards", isNew: false },
          { name: "Leaf Visiting Cards", isNew: true },
          { name: "Oval Visiting Cards", isNew: true },
          { name: "Circle Visiting Cards", isNew: true }
        ]
      },
      {
        title: "Brilliant Finishes",
        items: [
          { name: "Spot UV Visiting Cards", isNew: false },
          { name: "Raised Foil Visiting Cards", isNew: false }
        ]
      },
      {
        title: "Standard Papers",
        items: [
          { name: "Glossy Visiting Cards", isNew: false },
          { name: "Matte Visiting Cards", isNew: false },
          { name: "Bulk Visiting Cards", isNew: true }
        ]
      },
      {
        title: "Premium Papers",
        items: [
          { name: "Premium Plus Visiting Cards", isNew: false },
          { name: "Non-Tearable Visiting Cards", isNew: false },
          { name: "Velvet Touch Visiting Cards", isNew: false },
          { name: "Pearl Visiting Cards", isNew: true },
          { name: "Kraft Visiting Cards", isNew: true }
        ]
      },
      {
        title: "Digital Visiting Cards",
        items: [
          { name: "QR Code Visiting Cards", isNew: false },
          { name: "NFC Visiting Cards", isNew: false }
        ]
      }
    ]
  },
  {
    name: "Stationery, Letterheads & Notebooks",
    subCategories: [
      {
        title: "Office Stationery",
        items: [
          { name: "Letterheads", isNew: false },
          { name: "Notebooks", isNew: false },
          { name: "Notepads", isNew: false }
        ]
      },
      {
        title: "Pens & Writing",
        items: [
          { name: "Engraved Pens", isNew: false },
          { name: "Plastic Pens", isNew: false }
        ]
      }
    ]
  },
  {
    name: "Stamps and Ink",
    subCategories: [
      {
        title: "Rubber Stamps",
        items: [
          { name: "Self-Inking Stamps", isNew: false },
          { name: "Pre-Inked Stamps", isNew: false },
          { name: "Pocket Stamps", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Signs, Posters & Marketing Materials",
    subCategories: [
      {
        title: "Banners & Posters",
        items: [
          { name: "Vinyl Banners", isNew: false },
          { name: "Roll-Up Standees", isNew: false },
          { name: "Posters", isNew: false }
        ]
      },
      {
        title: "Marketing Materials",
        items: [
          { name: "Flyers & Leaflets", isNew: false },
          { name: "Brochures", isNew: false },
          { name: "Menu Cards", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Labels, Stickers & Packaging",
    subCategories: [
      {
        title: "Stickers & Labels",
        items: [
          { name: "Custom Roll Labels", isNew: false },
          { name: "Die-Cut Stickers", isNew: true },
          { name: "Product Labels", isNew: false }
        ]
      },
      {
        title: "Packaging Solutions",
        items: [
          { name: "Custom Mailer Boxes", isNew: false },
          { name: "Paper Bags", isNew: false },
          { name: "Polymailers", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Clothing, Caps & Bags",
    subCategories: [
      {
        title: "Apparel",
        items: [
          { name: "T-Shirts", isNew: false },
          { name: "Polo Shirts", isNew: false },
          { name: "Hoodies & Sweatshirts", isNew: true }
        ]
      },
      {
        title: "Accessories",
        items: [
          { name: "Custom Caps", isNew: false },
          { name: "Tote Bags", isNew: false },
          { name: "Laptop Backpacks", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Mugs, Albums & Gifts",
    subCategories: [
      {
        title: "Drinkware Gifts",
        items: [
          { name: "Photo Mugs", isNew: false },
          { name: "Magic Mugs", isNew: true },
          { name: "Travel Mugs", isNew: false }
        ]
      },
      {
        title: "Photo Gifts",
        items: [
          { name: "Photo Albums", isNew: false },
          { name: "Canvas Prints", isNew: false },
          { name: "Custom Calendars", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Umbrellas & Rainwear",
    subCategories: [
      {
        title: "Rain Protection",
        items: [
          { name: "Classic Umbrellas", isNew: false },
          { name: "Golf Umbrellas", isNew: false },
          { name: "Custom Raincoats", isNew: true }
        ]
      }
    ]
  },
  {
    name: "Drinkware",
    subCategories: [
      {
        title: "Bottles & Mugs",
        items: [
          { name: "Water Bottles", isNew: false },
          { name: "Stainless Steel Bottles", isNew: true },
          { name: "Coffee Mugs", isNew: false }
        ]
      }
    ]
  },
  {
    name: "Custom Polo T-shirts",
    subCategories: [
      {
        title: "Polo Styles",
        items: [
          { name: "Cotton Polo Shirts", isNew: false },
          { name: "Dry-Fit Polo Shirts", isNew: true },
          { name: "Embroidered Polos", isNew: false }
        ]
      }
    ]
  },
  {
    name: "Custom T-Shirts",
    subCategories: [
      {
        title: "T-Shirt Styles",
        items: [
          { name: "Round Neck T-Shirts", isNew: false },
          { name: "V-Neck T-Shirts", isNew: false },
          { name: "Graphic Printed Tees", isNew: true }
        ]
      }
    ]
  }
];


/** Return the canonical slug for a category display name. */
export function slugifyCategory(name: string): string {
  return slugifyCategoryName(name);
}

/** Resolve only categories explicitly present in the canonical catalog. */
export function getCategoryBySlug(slug: string) {
  return categoriesData.find((category) => slugifyCategory(category.name) === slug);
}
