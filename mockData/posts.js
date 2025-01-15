export const posts = [
  {
    id: 1,
    title: "Best Programming Languages in 2023",
    content:
      "Here's my take on the most in-demand programming languages this year...",
    upvotes: 234,
    comments: 45,
    created_at: new Date("2024-01-15").toISOString(),
    media_url: "https://picsum.photos/800/400?random=1",
    community_id: 11, // Yazılım
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "CodeMaster",
      profile_picture_url: "https://i.pravatar.cc/300",
    },
  },
  {
    id: 2,
    title: "Tips for Clean Code",
    content:
      "Let's discuss some essential principles for writing maintainable code...",
    upvotes: 567,
    comments: 89,
    created_at: new Date("2024-01-14").toISOString(),
    media_url: "https://picsum.photos/800/400?random=2",
    community_id: 11, // Yazılım
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "CleanCoder",
      profile_picture_url: "https://i.pravatar.cc/301",
    },
  },
  {
    id: 3,
    title: "Oppenheimer vs Barbie - Which deserves Best Picture?",
    content: "A deep dive into the cinematic achievements of both films...",
    upvotes: 150,
    comments: 20,
    created_at: new Date("2024-01-13").toISOString(),
    media_url: "https://picsum.photos/800/400?random=3",
    community_id: 3, // Sinema
    community: {
      id: 3,
      name: "Sinema",
    },
    author: {
      username: "MovieBuff",
      profile_picture_url: "https://i.pravatar.cc/302",
    },
  },
  {
    id: 4,
    title: "The Last of Us Season 2 begins filming!",
    content: "Breaking news about the highly anticipated second season...",
    upvotes: 300,
    comments: 50,
    created_at: new Date("2024-01-12").toISOString(),
    media_url: "https://picsum.photos/800/400?random=4",
    community_id: 3, // Sinema
    community: {
      id: 3,
      name: "Sinema",
    },
    author: {
      username: "SeriesExpert",
      profile_picture_url: "https://i.pravatar.cc/303",
    },
  },
  {
    id: 5,
    title: "Yeni Başlayanlar İçin Python Rehberi",
    content:
      "Python programlama dilini öğrenmek isteyenler için kapsamlı bir başlangıç kılavuzu...",
    upvotes: 420,
    comments: 65,
    created_at: new Date("2024-01-11").toISOString(),
    media_url: "https://picsum.photos/800/400?random=5",
    community_id: 11, // Yazılım
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "PythonMaster",
      profile_picture_url: "https://i.pravatar.cc/304",
    },
  },
  {
    id: 6,
    title: "Bitcoin 50,000 Doları Aştı!",
    content: "Kripto para piyasasındaki son gelişmeler ve analizler...",
    upvotes: 280,
    comments: 45,
    created_at: new Date("2024-01-10").toISOString(),
    media_url: "https://picsum.photos/800/400?random=6",
    community_id: 12, // Kripto
    community: {
      id: 12,
      name: "Kripto",
    },
    author: {
      username: "CryptoAnalyst",
      profile_picture_url: "https://i.pravatar.cc/305",
    },
  },
  {
    id: 7,
    title: "VALORANT Türkiye Finalleri Başlıyor",
    content:
      "Bu hafta sonu gerçekleşecek olan VALORANT Türkiye Finalleri hakkında tüm detaylar...",
    upvotes: 180,
    comments: 30,
    created_at: new Date("2024-01-09").toISOString(),
    media_url: "https://picsum.photos/800/400?random=7",
    community_id: 13, // E-Spor
    community: {
      id: 13,
      name: "E-Spor",
    },
    author: {
      username: "ESportsCaster",
      profile_picture_url: "https://i.pravatar.cc/306",
    },
  },
  {
    id: 8,
    title: "Evde Protein Açısından Zengin Yemek Tarifleri",
    content:
      "Fitness yapanlar için protein bakımından zengin ve lezzetli tarifler...",
    upvotes: 150,
    comments: 25,
    created_at: new Date("2024-01-08").toISOString(),
    media_url: "https://picsum.photos/800/400?random=8",
    community_id: 14, // Fitness
    community: {
      id: 14,
      name: "Fitness",
    },
    author: {
      username: "FitChef",
      profile_picture_url: "https://i.pravatar.cc/307",
    },
  },
  {
    id: 9,
    title: "2024 İlkbahar/Yaz Moda Trendleri",
    content: "Bu sezonun öne çıkan moda trendleri ve stil önerileri...",
    upvotes: 120,
    comments: 20,
    created_at: new Date("2024-01-07").toISOString(),
    media_url: "https://picsum.photos/800/400?random=9",
    community_id: 15, // Moda
    community: {
      id: 15,
      name: "Moda",
    },
    author: {
      username: "FashionGuru",
      profile_picture_url: "https://i.pravatar.cc/308",
    },
  },
  {
    id: 10,
    title: "Kapadokya Gezi Rehberi",
    content:
      "Kapadokya'da gezilecek yerler, konaklama önerileri ve aktiviteler...",
    upvotes: 200,
    comments: 35,
    created_at: new Date("2024-01-06").toISOString(),
    media_url: "https://picsum.photos/800/400?random=10",
    community_id: 9, // Seyahat
    community: {
      id: 9,
      name: "Seyahat",
    },
    author: {
      username: "Traveller",
      profile_picture_url: "https://i.pravatar.cc/309",
    },
  },
  {
    id: 11,
    title: "React vs Vue: 2024 Karşılaştırması",
    content:
      "Frontend geliştirme dünyasında en popüler iki framework'ün detaylı karşılaştırması...",
    upvotes: 320,
    comments: 48,
    created_at: new Date("2024-01-05").toISOString(),
    media_url: "https://picsum.photos/800/400?random=11",
    community_id: 11,
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "WebDev",
      profile_picture_url: "https://i.pravatar.cc/310",
    },
  },
  {
    id: 12,
    title: "Yeni Başlayanlar İçin Yapay Zeka ve Makine Öğrenimi",
    content:
      "Yapay zeka ve makine öğrenimi alanında kariyere başlamak isteyenler için kapsamlı rehber...",
    upvotes: 450,
    comments: 72,
    created_at: new Date("2024-01-04").toISOString(),
    media_url: "https://picsum.photos/800/400?random=12",
    community_id: 11,
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "AIExpert",
      profile_picture_url: "https://i.pravatar.cc/311",
    },
  },
  {
    id: 13,
    title: "İstanbul'un En İyi Kahve Dükkanları",
    content:
      "Şehrin dört bir yanından en iyi kahve mekanları ve özel kahve çeşitleri...",
    upvotes: 180,
    comments: 34,
    created_at: new Date("2024-01-03").toISOString(),
    media_url: "https://picsum.photos/800/400?random=13",
    community_id: 5,
    community: {
      id: 5,
      name: "Yemek",
    },
    author: {
      username: "CoffeeLover",
      profile_picture_url: "https://i.pravatar.cc/312",
    },
  },
  {
    id: 14,
    title: "2024'ün En İyi Akıllı Telefonları",
    content:
      "Bu yılın en çok öne çıkan akıllı telefon modelleri ve detaylı incelemeler...",
    upvotes: 290,
    comments: 55,
    created_at: new Date("2024-01-02").toISOString(),
    media_url: "https://picsum.photos/800/400?random=14",
    community_id: 6,
    community: {
      id: 6,
      name: "Teknoloji",
    },
    author: {
      username: "TechReviewer",
      profile_picture_url: "https://i.pravatar.cc/313",
    },
  },
  {
    id: 15,
    title: "Evde Spor İçin Temel Ekipmanlar",
    content:
      "Ev ortamında etkili antrenman yapmak için ihtiyacınız olan temel ekipmanlar...",
    upvotes: 210,
    comments: 28,
    created_at: new Date("2024-01-01").toISOString(),
    media_url: "https://picsum.photos/800/400?random=15",
    community_id: 14,
    community: {
      id: 14,
      name: "Fitness",
    },
    author: {
      username: "FitnessGuru",
      profile_picture_url: "https://i.pravatar.cc/314",
    },
  },
  {
    id: 16,
    title: "Ethereum 2.0: Yeni Dönem Başlıyor",
    content:
      "Ethereum'un yeni güncellemesi ve kripto para dünyasına etkileri...",
    upvotes: 380,
    comments: 62,
    created_at: new Date("2023-12-31").toISOString(),
    media_url: "https://picsum.photos/800/400?random=16",
    community_id: 12,
    community: {
      id: 12,
      name: "Kripto",
    },
    author: {
      username: "CryptoExpert",
      profile_picture_url: "https://i.pravatar.cc/315",
    },
  },
  {
    id: 17,
    title: "League of Legends 2024 Sezonu Değişiklikleri",
    content:
      "Yeni sezonla gelen meta değişiklikleri ve şampiyon güncellemeleri...",
    upvotes: 420,
    comments: 85,
    created_at: new Date("2023-12-30").toISOString(),
    media_url: "https://picsum.photos/800/400?random=17",
    community_id: 13,
    community: {
      id: 13,
      name: "E-Spor",
    },
    author: {
      username: "LOLPlayer",
      profile_picture_url: "https://i.pravatar.cc/316",
    },
  },
  {
    id: 18,
    title: "Minimalist Yaşam Rehberi",
    content: "Daha sade ve düzenli bir yaşam için minimalizm ipuçları...",
    upvotes: 245,
    comments: 42,
    created_at: new Date("2023-12-29").toISOString(),
    media_url: "https://picsum.photos/800/400?random=18",
    community_id: 7,
    community: {
      id: 7,
      name: "Yaşam",
    },
    author: {
      username: "Minimalist",
      profile_picture_url: "https://i.pravatar.cc/317",
    },
  },
  {
    id: 19,
    title: "Fotoğrafçılık İçin En İyi Başlangıç Kameraları",
    content:
      "Hobi olarak fotoğrafçılığa başlamak isteyenler için kamera önerileri...",
    upvotes: 190,
    comments: 36,
    created_at: new Date("2023-12-28").toISOString(),
    media_url: "https://picsum.photos/800/400?random=19",
    community_id: 8,
    community: {
      id: 8,
      name: "Fotoğrafçılık",
    },
    author: {
      username: "PhotoPro",
      profile_picture_url: "https://i.pravatar.cc/318",
    },
  },
  {
    id: 20,
    title: "Balkan Rotası: 2 Haftalık Gezi Planı",
    content:
      "Balkanlar'ı keşfetmek isteyenler için detaylı rota ve öneriler...",
    upvotes: 310,
    comments: 58,
    created_at: new Date("2023-12-27").toISOString(),
    media_url: "https://picsum.photos/800/400?random=20",
    community_id: 9,
    community: {
      id: 9,
      name: "Seyahat",
    },
    author: {
      username: "Globetrotter",
      profile_picture_url: "https://i.pravatar.cc/319",
    },
  },
  {
    id: 21,
    title: "Docker ve Kubernetes'e Giriş",
    content:
      "Container teknolojilerine başlangıç yapacaklar için temel bilgiler...",
    upvotes: 280,
    comments: 45,
    created_at: new Date("2023-12-26").toISOString(),
    media_url: "https://picsum.photos/800/400?random=21",
    community_id: 11,
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "DevOpsGuru",
      profile_picture_url: "https://i.pravatar.cc/320",
    },
  },
  {
    id: 22,
    title: "Ev Yapımı Pizza Tarifi",
    content:
      "İtalyan pizzacılarından öğrendiğim otantik pizza hamuru ve sos tarifi...",
    upvotes: 420,
    comments: 65,
    created_at: new Date("2023-12-25").toISOString(),
    media_url: "https://picsum.photos/800/400?random=22",
    community_id: 5,
    community: {
      id: 5,
      name: "Yemek",
    },
    author: {
      username: "ChefMaster",
      profile_picture_url: "https://i.pravatar.cc/321",
    },
  },
  {
    id: 23,
    title: "NFT Piyasasının Geleceği",
    content: "NFT teknolojisinin gelecekteki potansiyel kullanım alanları...",
    upvotes: 180,
    comments: 32,
    created_at: new Date("2023-12-24").toISOString(),
    media_url: "https://picsum.photos/800/400?random=23",
    community_id: 12,
    community: {
      id: 12,
      name: "Kripto",
    },
    author: {
      username: "NFTCollector",
      profile_picture_url: "https://i.pravatar.cc/322",
    },
  },
  {
    id: 24,
    title: "Sürdürülebilir Moda Önerileri",
    content:
      "Çevre dostu moda markaları ve sürdürülebilir alışveriş ipuçları...",
    upvotes: 290,
    comments: 48,
    created_at: new Date("2023-12-23").toISOString(),
    media_url: "https://picsum.photos/800/400?random=24",
    community_id: 15,
    community: {
      id: 15,
      name: "Moda",
    },
    author: {
      username: "EcoFashion",
      profile_picture_url: "https://i.pravatar.cc/323",
    },
  },
  {
    id: 25,
    title: "CS:GO 2'nin Yeni Özellikleri",
    content:
      "Counter-Strike 2'nin getirdiği yenilikler ve oynanış değişiklikleri...",
    upvotes: 520,
    comments: 95,
    created_at: new Date("2023-12-22").toISOString(),
    media_url: "https://picsum.photos/800/400?random=25",
    community_id: 13,
    community: {
      id: 13,
      name: "E-Spor",
    },
    author: {
      username: "CSPro",
      profile_picture_url: "https://i.pravatar.cc/324",
    },
  },
  {
    id: 26,
    title: "Meditasyon ve Mindfulness Rehberi",
    content: "Günlük meditasyon rutini oluşturmak için pratik öneriler...",
    upvotes: 230,
    comments: 38,
    created_at: new Date("2023-12-21").toISOString(),
    media_url: "https://picsum.photos/800/400?random=26",
    community_id: 7,
    community: {
      id: 7,
      name: "Yaşam",
    },
    author: {
      username: "MindfulLiving",
      profile_picture_url: "https://i.pravatar.cc/325",
    },
  },
  {
    id: 27,
    title: "Drone ile Fotoğrafçılık İpuçları",
    content: "Drone fotoğrafçılığında kompozisyon ve kamera ayarları...",
    upvotes: 340,
    comments: 52,
    created_at: new Date("2023-12-20").toISOString(),
    media_url: "https://picsum.photos/800/400?random=27",
    community_id: 8,
    community: {
      id: 8,
      name: "Fotoğrafçılık",
    },
    author: {
      username: "DroneShooter",
      profile_picture_url: "https://i.pravatar.cc/326",
    },
  },
  {
    id: 28,
    title: "Kış Sporları İçin En İyi Destinasyonlar",
    content: "Türkiye ve dünyadan en iyi kayak merkezleri...",
    upvotes: 260,
    comments: 44,
    created_at: new Date("2023-12-19").toISOString(),
    media_url: "https://picsum.photos/800/400?random=28",
    community_id: 9,
    community: {
      id: 9,
      name: "Seyahat",
    },
    author: {
      username: "SnowLover",
      profile_picture_url: "https://i.pravatar.cc/327",
    },
  },
  {
    id: 29,
    title: "Next.js 14 ile Server Actions",
    content:
      "Next.js 14'ün yeni özelliği Server Actions'ın detaylı kullanımı...",
    upvotes: 380,
    comments: 63,
    created_at: new Date("2023-12-18").toISOString(),
    media_url: "https://picsum.photos/800/400?random=29",
    community_id: 11,
    community: {
      id: 11,
      name: "Yazılım",
    },
    author: {
      username: "NextJSDev",
      profile_picture_url: "https://i.pravatar.cc/328",
    },
  },
  {
    id: 30,
    title: "Evde Barista: Espresso Yapımı",
    content: "Profesyonel kalitede espresso hazırlamanın püf noktaları...",
    upvotes: 290,
    comments: 47,
    created_at: new Date("2023-12-17").toISOString(),
    media_url: "https://picsum.photos/800/400?random=30",
    community_id: 5,
    community: {
      id: 5,
      name: "Yemek",
    },
    author: {
      username: "CoffeeMaster",
      profile_picture_url: "https://i.pravatar.cc/329",
    },
  },
];
