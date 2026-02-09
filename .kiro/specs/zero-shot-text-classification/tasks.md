# Uygulama Planı: Zero-Shot Metin Sınıflandırma

## Genel Bakış

Bu plan, OpenAI embedding vektörleri ve Kosinüs Benzerliği kullanan Zero-Shot metin sınıflandırma sisteminin Python ile adım adım uygulanmasını tanımlar. Her görev bir öncekinin üzerine inşa edilir.

## Görevler

- [x] 1. Proje yapısı ve veri modellerini oluştur
  - [x] 1.1 Proje dizin yapısını ve bağımlılık dosyasını oluştur
    - `src/` dizini altında `__init__.py`, `models.py`, `embedding_client.py`, `similarity.py`, `classifier.py`, `reporter.py` dosyalarını oluştur
    - `tests/` dizini altında `__init__.py`, `conftest.py` dosyalarını oluştur
    - `requirements.txt` dosyasında `openai`, `scikit-learn`, `numpy`, `pytest`, `hypothesis` bağımlılıklarını tanımla
    - _Gereksinimler: Tüm gereksinimler_
  - [x] 1.2 `Category` ve `ClassificationResult` dataclass'larını `models.py` içinde tanımla
    - `Category`: `name: str`, `embedding: list[float]` alanları
    - `ClassificationResult`: `text: str`, `category: str`, `similarity_score: float` alanları
    - _Gereksinimler: 2.4, 5.1_

- [x] 2. EmbeddingClient bileşenini uygula
  - [x] 2.1 `embedding_client.py` içinde `EmbeddingClient` sınıfını uygula
    - `__init__` metodu: `api_key` parametresi veya `OPENAI_API_KEY` ortam değişkeninden API anahtarını al, eksikse `ValueError` fırlat
    - `get_embedding` metodu: Boş metin kontrolü (`ValueError`), OpenAI API çağrısı, hata yakalama (`RuntimeError`)
    - `text-embedding-3-small` modelini kullan
    - _Gereksinimler: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 2.2 `EmbeddingClient` için birim testlerini yaz
    - Boş metin girişinde `ValueError` fırlatılması testi
    - API hatası simülasyonunda `RuntimeError` fırlatılması testi
    - API anahtarı eksikliğinde `ValueError` fırlatılması testi
    - Başarılı embedding alma testi (mock ile)
    - _Gereksinimler: 1.1, 1.2, 1.3, 1.4_

- [x] 3. SimilarityCalculator bileşenini uygula
  - [x] 3.1 `similarity.py` içinde `SimilarityCalculator` sınıfını uygula
    - `cosine_similarity` statik metodu: scikit-learn `cosine_similarity` fonksiyonunu kullanarak iki vektör arasındaki benzerliği hesapla
    - Farklı boyuttaki vektörler için `ValueError` fırlat
    - _Gereksinimler: 3.1, 3.2_
  - [ ]* 3.2 Kosinüs benzerliği için property testlerini yaz
    - **Property 2: Kosinüs benzerliği aralık ve öz-benzerlik**
    - **Validates: Requirements 3.2, 3.3**
  - [ ]* 3.3 Dik vektörler için birim testi yaz
    - Dik vektörlerde benzerlik skorunun ~0.0 olması
    - _Gereksinimler: 3.4_

- [ ] 4. Checkpoint - Temel bileşenlerin doğrulanması
  - Tüm testlerin geçtiğinden emin ol, sorular varsa kullanıcıya sor.

- [ ] 5. ZeroShotClassifier bileşenini uygula
  - [ ] 5.1 `classifier.py` içinde `ZeroShotClassifier` sınıfını uygula
    - `__init__`: `EmbeddingClient` bağımlılığını al, boş kategori listesi başlat
    - `add_category`: Kategori adının embedding'ini hesapla ve `Category` olarak sakla
    - `classify`: Metin embedding'ini al, tüm kategorilerle karşılaştır, en yüksek skorlu kategoriyi `ClassificationResult` olarak döndür
    - `classify_batch`: Her metni bağımsız olarak sınıflandır, sonuçları liste olarak döndür
    - Kategori listesi boşsa `ValueError` fırlat
    - _Gereksinimler: 2.1, 2.2, 2.3, 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]* 5.2 Kategori ekleme invariantı için property testi yaz
    - **Property 1: Kategori ekleme invariantı**
    - **Validates: Requirements 2.2, 2.3**
  - [ ]* 5.3 En yüksek skor seçimi için property testi yaz
    - **Property 3: En yüksek skor seçimi**
    - **Validates: Requirements 4.2**
  - [ ]* 5.4 Sonuç yapısı bütünlüğü için property testi yaz
    - **Property 4: Sonuç yapısı bütünlüğü**
    - **Validates: Requirements 4.3, 5.1**
  - [ ]* 5.5 Toplu sınıflandırma tutarlılığı için property testi yaz
    - **Property 5: Toplu sınıflandırma tutarlılığı**
    - **Validates: Requirements 4.5, 5.2**

- [ ] 6. ResultReporter bileşenini uygula
  - [ ] 6.1 `reporter.py` içinde `ResultReporter` sınıfını uygula
    - `to_json`: `ClassificationResult` listesini JSON string'e dönüştür
    - `from_json`: JSON string'i `ClassificationResult` listesine dönüştür, geçersiz JSON'da `ValueError` fırlat
    - `format_score`: Float değeri virgülden sonra 4 basamak hassasiyetle formatla
    - _Gereksinimler: 5.3, 6.1, 6.2, 6.4_
  - [ ]* 6.2 JSON round-trip için property testi yaz
    - **Property 7: JSON seri hale getirme gidiş-dönüş**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  - [ ]* 6.3 Skor formatlama hassasiyeti için property testi yaz
    - **Property 6: Skor formatlama hassasiyeti**
    - **Validates: Requirements 5.3**
  - [ ]* 6.4 Geçersiz JSON ve edge case birim testlerini yaz
    - Geçersiz JSON girişinde `ValueError` fırlatılması testi
    - Boş liste seri hale getirme/ayrıştırma testi
    - _Gereksinimler: 6.4_

- [ ] 7. Entegrasyon ve ana çalıştırma betiği
  - [ ] 7.1 `main.py` dosyasında tüm bileşenleri birleştir
    - Varsayılan üç kategoriyi yükle
    - Örnek Türkçe müşteri yorumlarını sınıflandır
    - Sonuçları ekrana yazdır ve JSON olarak kaydet
    - _Gereksinimler: 2.1, 4.1, 4.2, 5.1, 5.2, 5.3, 6.1_

- [ ] 8. Son checkpoint - Tüm testlerin doğrulanması
  - Tüm testlerin geçtiğinden emin ol, sorular varsa kullanıcıya sor.

## Notlar

- `*` ile işaretli görevler isteğe bağlıdır ve hızlı MVP için atlanabilir
- Her görev belirli gereksinimlere referans verir
- Checkpoint'ler artımlı doğrulama sağlar
- Property testleri evrensel doğruluk özelliklerini doğrular
- Birim testleri belirli örnekleri ve edge case'leri doğrular
- Tüm testlerde OpenAI API çağrıları mock'lanmalıdır
