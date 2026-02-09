export interface Preset {
  name: string;
  categories: string[];
  texts: string[];
}

export const PRESETS: Preset[] = [
  {
    name: "Müşteri Şikayetleri",
    categories: ["Lojistik ve Kargo", "Ürün Kalitesi ve Performans", "Müşteri Hizmetleri ve Destek"],
    texts: [
      "Kargom 1 haftadır gelmedi, hala şubede bekliyor.",
      "Ürünün kumaşı çok ince, hemen yırtıldı.",
      "Telefondaki temsilci çok kaba davrandı, yardımcı olmadı.",
      "Paketleme çok özenliydi, teşekkürler.",
      "Cihazın şarjı çok çabuk bitiyor, beklentimi karşılamadı.",
      "İade süreci için kimseye ulaşamıyorum, maillere dönmüyorlar.",
      "Kurye arkadaş çok nazikti, kapıya kadar getirdi.",
      "Renkleri fotoğraftakinden farklı geldi, hayal kırıklığı.",
      "Canlı destek hattı sorunu 2 dakikada çözdü.",
      "Hızlı teslimat için teşekkür ederim, ertesi gün elimdeydi.",
    ],
  },
  {
    name: "Bilgisayar Bileşenleri",
    categories: ["Donanım", "Yazılım", "Çevre Birimleri"],
    texts: [
      "RAM 16GB DDR5 çok hızlı çalışıyor.",
      "Windows 11 Pro lisansı aktif edilmedi.",
      "RTX 4070 ekran kartı oyunlarda mükemmel performans veriyor.",
      "Visual Studio Code eklentileri çok yavaş yükleniyor.",
      "Mekanik klavye tuş sesleri çok rahatsız edici.",
      "SSD 1TB NVMe okuma hızı beklentimin altında.",
      "Antivirüs yazılımı sürekli yanlış alarm veriyor.",
      "Bluetooth mouse bağlantısı sürekli kopuyor.",
      "İşlemci sıcaklığı 90 dereceyi geçiyor.",
      "Docker container'ları çok fazla bellek tüketiyor.",
    ],
  },
  {
    name: "Restoran Yorumları",
    categories: ["Yemek Kalitesi", "Servis ve Hizmet", "Ambiyans ve Mekan"],
    texts: [
      "Etler çok iyi pişirilmiş, lezzet harika.",
      "Garson çok ilgisizdi, 20 dakika kimse gelmedi.",
      "Mekanın dekorasyonu çok şık ve modern.",
      "Porsiyon çok küçük, fiyatına göre yetersiz.",
      "Sipariş çok hızlı geldi, teşekkürler.",
      "Müzik çok yüksekti, konuşamadık.",
      "Tatlılar ev yapımı ve çok taze.",
      "Hesapta yanlış kalem vardı, düzeltmeleri uzun sürdü.",
      "Bahçe katı çok huzurlu, manzara güzel.",
      "Çorba soğuk geldi, iade ettik.",
    ],
  },
  {
    name: "Eğitim Platformu",
    categories: ["İçerik Kalitesi", "Teknik Sorunlar", "Fiyatlandırma"],
    texts: [
      "Kurs içeriği çok detaylı ve anlaşılır anlatılmış.",
      "Video oynatıcı sürekli donuyor, izleyemiyorum.",
      "Aylık abonelik fiyatı çok yüksek.",
      "Eğitmen konuyu gerçek örneklerle açıklıyor, harika.",
      "Mobil uygulamada videolar açılmıyor.",
      "Yıllık plan indirimi çok cazip.",
      "Altyazılar yanlış, senkronize değil.",
      "Pratik ödevler öğrenmeyi pekiştiriyor.",
      "Ödeme sayfası hata veriyor, satın alamıyorum.",
      "Sertifika programı kariyerime çok katkı sağladı.",
    ],
  },
];
