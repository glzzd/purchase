
export const roles = [
    {
      systemRole: "autopark_admin",
      elements: {
        icon: "Car",
        name: "Avtomobil Parkı",
      },
      menuItems: [
        { name: "Avtomobil Siyahısı", link: "/autopark/list" },
        { name: "Yeni Avtomobil", link: "/autopark/new" },
      ],
    },
    {
      systemRole: "hr_admin",
      elements: {
        icon: "Users",
        name: "İnsan Resursları",
      },
      menuItems: [
        { name: "İşçilər", link: "/hr/employees" },
        { name: "Yeni İşçi Əlavə Et", link: "/hr/new" },
      ],
    },
    {
      systemRole: "purchase_admin",
      elements: {
        icon: "ShoppingCart",
        name: "Satınalma",
      },
      menuItems: [
        { name: "Bütün Sifarişlər", link: "/orders/all-order" },
        { name: "Yeni Sifariş Yarat", link: "/orders/make-order" },
        { name: "Lotlar", link: "/lots/all-lots" },
        { name: "Müqavilələr", link: "/contracts/all-contracts" },
      ],
    },
    {
      systemRole: "user",
      elements: {
        icon: "User",
      },
      menuItems: [
     
        { name: "Yeni Sifariş Yarat", link: "/orders/make-order" },
        { name: "Sifarişlərim", link: "/my-orders" }
      ],
    },
  ];
  