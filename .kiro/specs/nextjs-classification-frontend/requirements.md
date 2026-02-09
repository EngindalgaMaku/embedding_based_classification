# Gereksinimler Dokümanı

## Giriş

Bu doküman, mevcut Python tabanlı Zero-Shot metin sınıflandırma sistemini bir REST API olarak sunmak ve bu API'yi tüketen bir Next.js 16 frontend uygulaması geliştirmek için gereksinimleri tanımlar. Kullanıcılar web arayüzü üzerinden metin listesi girebilecek, sınıflandırma kategorileri tanımlayabilecek, sınıflandırma çalıştırabilecek ve sonuçları tablo formatında görüntüleyip JSON olarak dışa aktarabilecektir.

## Sözlük

- **API_Sunucusu**: Mevcut Python sınıflandırma sistemini HTTP üzerinden sunan FastAPI tabanlı REST API bileşeni
- **Frontend**: Next.js 16 App Router kullanılarak geliştirilen web arayüzü uygulaması
- **Sınıflandırma_İsteği**: Kullanıcının gönderdiği metin listesi ve kategori listesini içeren API istek nesnesi
- **Sınıflandırma_Yanıtı**: API'nin döndürdüğü sınıflandırma sonuçlarını içeren yanıt nesnesi
- **Kategori**: Metinlerin atanabileceği kullanıcı tanımlı sınıflandırma etiketi
- **Sonuç_Tablosu**: Sınıflandırma sonuçlarını metin, kategori ve skor bilgileriyle gösteren tablo bileşeni

## Gereksinimler

### Gereksinim 1: REST API Endpoint Tanımlama

**Kullanıcı Hikayesi:** Bir geliştirici olarak, mevcut sınıflandırma sistemine HTTP üzerinden erişmek istiyorum, böylece frontend uygulaması backend ile iletişim kurabilsin.

#### Kabul Kriterleri

1. THE API_Sunucusu SHALL FastAPI framework kullanarak `/api/classify` endpoint'i üzerinden POST isteklerini kabul etmeli
2. WHEN bir Sınıflandırma_İsteği alındığında, THE API_Sunucusu SHALL istek gövdesinden metin listesini ve kategori listesini ayrıştırmalı
3. WHEN sınıflandırma tamamlandığında, THE API_Sunucusu SHALL her metin için kategori adı ve benzerlik skorunu içeren bir Sınıflandırma_Yanıtı döndürmeli
4. IF istek gövdesinde metin listesi boşsa, THEN THE API_Sunucusu SHALL HTTP 422 durum kodu ve açıklayıcı bir hata mesajı döndürmeli
5. IF istek gövdesinde kategori listesi boşsa, THEN THE API_Sunucusu SHALL HTTP 422 durum kodu ve açıklayıcı bir hata mesajı döndürmeli
6. IF sınıflandırma sırasında bir hata oluşursa, THEN THE API_Sunucusu SHALL HTTP 500 durum kodu ve hata detayını içeren bir yanıt döndürmeli

### Gereksinim 2: API İstek ve Yanıt Seri Hale Getirme

**Kullanıcı Hikayesi:** Bir geliştirici olarak, API istek ve yanıtlarının tutarlı bir JSON formatında olmasını istiyorum, böylece frontend-backend iletişimi güvenilir olsun.

#### Kabul Kriterleri

1. THE API_Sunucusu SHALL istek gövdesini şu JSON yapısında kabul etmeli: `{"texts": ["metin1", "metin2"], "categories": ["kategori1", "kategori2"]}`
2. THE API_Sunucusu SHALL yanıtı şu JSON yapısında döndürmeli: `{"results": [{"text": "metin", "category": "kategori", "similarity_score": 0.85}]}`
3. FOR ALL geçerli Sınıflandırma_İsteği nesneleri, istek JSON'unu ayrıştırma ardından tekrar seri hale getirme orijinal JSON yapısına eşdeğer bir yapı üretmeli (gidiş-dönüş özelliği)
4. WHEN benzerlik skoru döndürüldüğünde, THE API_Sunucusu SHALL skoru virgülden sonra dört basamak hassasiyetle döndürmeli

### Gereksinim 3: CORS ve API Erişim Yapılandırması

**Kullanıcı Hikayesi:** Bir geliştirici olarak, frontend uygulamasının farklı bir port üzerinden API'ye erişebilmesini istiyorum, böylece geliştirme ortamında sorunsuz çalışabilsin.

#### Kabul Kriterleri

1. THE API_Sunucusu SHALL CORS middleware yapılandırarak frontend origin'inden gelen isteklere izin vermeli
2. WHEN geliştirme ortamında çalışırken, THE API_Sunucusu SHALL `localhost` origin'lerinden gelen istekleri kabul etmeli

### Gereksinim 4: Metin Girişi Arayüzü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sınıflandırmak istediğim metinleri kolayca girmek istiyorum, böylece birden fazla metni tek seferde sınıflandırabileyim.

#### Kabul Kriterleri

1. THE Frontend SHALL kullanıcıya birden fazla metin girebileceği bir textarea bileşeni sunmalı
2. WHEN kullanıcı metinleri girdiğinde, THE Frontend SHALL her satırı ayrı bir metin olarak ayrıştırmalı
3. WHEN kullanıcı boş satırlar girdiğinde, THE Frontend SHALL boş satırları filtreleyerek yalnızca içerik barındıran satırları metin listesine dahil etmeli
4. THE Frontend SHALL girilen metin sayısını kullanıcıya göstermeli

### Gereksinim 5: Kategori Tanımlama Arayüzü

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sınıflandırma kategorilerini kendim tanımlamak istiyorum, böylece farklı kullanım senaryolarına uygun kategoriler oluşturabileyim.

#### Kabul Kriterleri

1. THE Frontend SHALL kullanıcıya kategori ekleyebileceği bir giriş alanı ve ekleme butonu sunmalı
2. WHEN kullanıcı bir kategori adı girip ekleme butonuna tıkladığında, THE Frontend SHALL kategoriyi listeye eklemeli ve giriş alanını temizlemeli
3. WHEN kullanıcı bir kategoriyi silmek istediğinde, THE Frontend SHALL kategorinin yanındaki silme butonuyla kategoriyi listeden kaldırmalı
4. IF kullanıcı boş bir kategori adı eklemeye çalışırsa, THEN THE Frontend SHALL eklemeyi engellemeli
5. THE Frontend SHALL varsayılan olarak "Lojistik ve Kargo", "Ürün Kalitesi ve Performans", "Müşteri Hizmetleri ve Destek" kategorilerini yüklemeli

### Gereksinim 6: Sınıflandırma Çalıştırma

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, girdiğim metinleri tanımladığım kategorilere göre sınıflandırmak istiyorum, böylece sonuçları hızlıca görebileyim.

#### Kabul Kriterleri

1. THE Frontend SHALL bir "Sınıflandır" butonu sunmalı
2. WHEN kullanıcı "Sınıflandır" butonuna tıkladığında, THE Frontend SHALL metin listesini ve kategori listesini API_Sunucusu'na göndermeli
3. WHILE sınıflandırma işlemi devam ederken, THE Frontend SHALL bir yükleniyor göstergesi görüntülemeli
4. IF metin listesi veya kategori listesi boşsa, THEN THE Frontend SHALL "Sınıflandır" butonunu devre dışı bırakmalı
5. IF API çağrısı başarısız olursa, THEN THE Frontend SHALL kullanıcıya anlaşılır bir hata mesajı göstermeli

### Gereksinim 7: Sonuç Görüntüleme

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sınıflandırma sonuçlarını düzenli bir tablo formatında görmek istiyorum, böylece her metnin hangi kategoriye atandığını ve benzerlik skorunu kolayca inceleyebileyim.

#### Kabul Kriterleri

1. WHEN sınıflandırma tamamlandığında, THE Frontend SHALL sonuçları metin, kategori ve benzerlik skoru sütunlarını içeren bir tabloda görüntülemeli
2. THE Frontend SHALL benzerlik skorunu virgülden sonra dört basamak hassasiyetle göstermeli
3. WHEN sonuçlar görüntülendiğinde, THE Frontend SHALL toplam sınıflandırılan metin sayısını göstermeli

### Gereksinim 8: JSON Dışa Aktarma

**Kullanıcı Hikayesi:** Bir kullanıcı olarak, sınıflandırma sonuçlarını JSON formatında indirmek istiyorum, böylece sonuçları başka sistemlerde kullanabileyim.

#### Kabul Kriterleri

1. WHEN sınıflandırma sonuçları mevcut olduğunda, THE Frontend SHALL bir "JSON İndir" butonu sunmalı
2. WHEN kullanıcı "JSON İndir" butonuna tıkladığında, THE Frontend SHALL sonuçları JSON formatında bir dosya olarak indirmeli
3. THE Frontend SHALL indirilen JSON dosyasını API_Sunucusu'nun yanıt formatıyla uyumlu yapıda oluşturmalı
