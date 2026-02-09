# Gereksinimler Dokümanı

## Giriş

Bu doküman, OpenAI embedding vektörleri ve Kosinüs Benzerliği kullanarak müşteri yorumlarını önceden tanımlanmış kategorilere sınıflandıran bir Zero-Shot metin sınıflandırma sisteminin gereksinimlerini tanımlar. Sistem, eğitim verisi gerektirmeden tamamen anlamsal anlayışa dayalı çalışır.

## Sözlük

- **Sınıflandırıcı**: Müşteri yorumlarını kategorilere atayan ana sistem bileşeni
- **Embedding**: Bir metin parçasının OpenAI API aracılığıyla elde edilen sayısal vektör temsili
- **Kosinüs_Benzerliği**: İki vektör arasındaki açısal benzerliği -1 ile 1 arasında ölçen metrik
- **Kategori**: Müşteri yorumlarının atanabileceği önceden tanımlanmış sınıflandırma etiketi
- **Zero-Shot**: Eğitim verisi olmadan, yalnızca anlamsal benzerlik kullanarak sınıflandırma yapma yaklaşımı
- **Embedding_İstemcisi**: OpenAI API ile iletişim kurarak metin embedding vektörlerini alan bileşen

## Gereksinimler

### Gereksinim 1: Metin Embedding Elde Etme

**Kullanıcı Hikayesi:** Bir geliştirici olarak, metin girdilerinin embedding vektörlerini almak istiyorum, böylece metinler arasında anlamsal karşılaştırma yapabileyim.

#### Kabul Kriterleri

1. WHEN bir metin girişi sağlandığında, THE Embedding_İstemcisi SHALL OpenAI `text-embedding-3-small` modelini kullanarak embedding vektörünü döndürmeli
2. WHEN boş bir metin girişi sağlandığında, THE Embedding_İstemcisi SHALL açıklayıcı bir hata mesajı döndürmeli
3. IF OpenAI API çağrısı başarısız olursa, THEN THE Embedding_İstemcisi SHALL hatayı yakalayıp anlamlı bir hata mesajı ile bildirmeli
4. THE Embedding_İstemcisi SHALL API anahtarını ortam değişkeninden veya yapılandırma parametresinden almalı

### Gereksinim 2: Kategori Tanımlama ve Yönetimi

**Kullanıcı Hikayesi:** Bir geliştirici olarak, sınıflandırma kategorilerini tanımlamak ve yönetmek istiyorum, böylece yorumları doğru kategorilere atayabileyim.

#### Kabul Kriterleri

1. THE Sınıflandırıcı SHALL şu üç önceden tanımlanmış kategoriyi desteklemeli: "Lojistik ve Kargo", "Ürün Kalitesi ve Performans", "Müşteri Hizmetleri ve Destek"
2. WHEN bir kategori tanımlandığında, THE Sınıflandırıcı SHALL kategori adının embedding vektörünü hesaplamalı ve saklamalı
3. WHEN yeni bir kategori eklendiğinde, THE Sınıflandırıcı SHALL mevcut kategorileri bozmadan yeni kategoriyi listeye dahil etmeli
4. THE Sınıflandırıcı SHALL her kategorinin adını ve karşılık gelen embedding vektörünü bir veri yapısında tutmalı

### Gereksinim 3: Kosinüs Benzerliği Hesaplama

**Kullanıcı Hikayesi:** Bir geliştirici olarak, iki embedding vektörü arasındaki benzerliği hesaplamak istiyorum, böylece bir metnin hangi kategoriye en yakın olduğunu belirleyebileyim.

#### Kabul Kriterleri

1. WHEN iki embedding vektörü sağlandığında, THE Sınıflandırıcı SHALL scikit-learn kütüphanesinin `cosine_similarity` fonksiyonunu kullanarak benzerlik skorunu hesaplamalı
2. THE Sınıflandırıcı SHALL benzerlik skorunu -1.0 ile 1.0 arasında bir ondalık sayı olarak döndürmeli
3. WHEN aynı iki vektör karşılaştırıldığında, THE Sınıflandırıcı SHALL 1.0 değerine yakın bir benzerlik skoru döndürmeli
4. WHEN birbirine dik iki vektör karşılaştırıldığında, THE Sınıflandırıcı SHALL 0.0 değerine yakın bir benzerlik skoru döndürmeli

### Gereksinim 4: Metin Sınıflandırma

**Kullanıcı Hikayesi:** Bir geliştirici olarak, müşteri yorumlarını otomatik olarak sınıflandırmak istiyorum, böylece yorumları manuel olarak incelemek zorunda kalmayayım.

#### Kabul Kriterleri

1. WHEN bir müşteri yorumu sağlandığında, THE Sınıflandırıcı SHALL yorumun embedding vektörünü tüm kategori embedding vektörleriyle karşılaştırmalı
2. WHEN benzerlik skorları hesaplandığında, THE Sınıflandırıcı SHALL en yüksek Kosinüs Benzerliği skoruna sahip kategoriyi döndürmeli
3. THE Sınıflandırıcı SHALL sınıflandırma sonucunda kategori adını ve benzerlik skorunu birlikte döndürmeli
4. THE Sınıflandırıcı SHALL anahtar kelime eşleştirme, düzenli ifade veya model eğitimi kullanmadan yalnızca anlamsal benzerliğe dayalı sınıflandırma yapmalı
5. WHEN birden fazla yorum sınıflandırılacağında, THE Sınıflandırıcı SHALL her yorumu bağımsız olarak sınıflandırmalı ve sonuçları bir liste olarak döndürmeli

### Gereksinim 5: Sonuç Raporlama

**Kullanıcı Hikayesi:** Bir geliştirici olarak, sınıflandırma sonuçlarını yapılandırılmış bir formatta görmek istiyorum, böylece sonuçları kolayca analiz edebileyim.

#### Kabul Kriterleri

1. WHEN bir sınıflandırma tamamlandığında, THE Sınıflandırıcı SHALL yorum metnini, atanan kategoriyi ve benzerlik skorunu içeren bir sonuç nesnesi döndürmeli
2. WHEN birden fazla yorum sınıflandırıldığında, THE Sınıflandırıcı SHALL tüm sonuçları sıralı bir liste olarak döndürmeli
3. THE Sınıflandırıcı SHALL benzerlik skorunu virgülden sonra dört basamak hassasiyetle raporlamalı

### Gereksinim 6: Seri Hale Getirme ve Ayrıştırma

**Kullanıcı Hikayesi:** Bir geliştirici olarak, sınıflandırma sonuçlarını JSON formatında kaydetmek ve yüklemek istiyorum, böylece sonuçları kalıcı olarak saklayabileyim.

#### Kabul Kriterleri

1. WHEN sınıflandırma sonuçları üretildiğinde, THE Sınıflandırıcı SHALL sonuçları JSON formatına seri hale getirebilmeli
2. WHEN JSON formatında sonuçlar yüklendiğinde, THE Sınıflandırıcı SHALL JSON verisini ayrıştırarak orijinal sonuç nesnelerine dönüştürmeli
3. FOR ALL geçerli sonuç nesneleri, seri hale getirme ardından ayrıştırma işlemi orijinal nesneye eşdeğer bir nesne üretmeli (gidiş-dönüş özelliği)
4. IF geçersiz JSON verisi sağlanırsa, THEN THE Sınıflandırıcı SHALL açıklayıcı bir hata mesajı döndürmeli
