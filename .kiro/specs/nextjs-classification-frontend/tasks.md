# Uygulama Planı: Next.js Sınıflandırma Frontend ve FastAPI Backend

## Genel Bakış

Bu plan, mevcut Python Zero-Shot sınıflandırma sistemini FastAPI REST API olarak sunmak ve Next.js 16 frontend uygulamasını geliştirmek için adım adım uygulama görevlerini tanımlar. Önce backend API, ardından frontend bileşenleri, son olarak entegrasyon yapılır.

## Görevler

- [x] 1. Backend API altyapısını oluştur
  - [x] 1.1 FastAPI uygulama dosyasını ve Pydantic şemalarını oluştur
    - `api/` dizini altında `__init__.py`, `main.py`, `schemas.py` dosyalarını oluştur
    - `schemas.py` içinde `ClassifyRequest` (texts, categories alanları, boş liste doğrulaması) ve `ClassifyResponse`, `ClassificationResultItem` Pydantic modellerini tanımla
    - `main.py` içinde FastAPI uygulamasını oluştur, CORS middleware ekle (localhost:3000 origin'i)
    - `requirements.txt` dosyasına `fastapi`, `uvicorn`, `httpx` bağımlılıklarını ekle
    - _Gereksinimler: 1.1, 2.1, 2.2, 3.1, 3.2_
  - [x] 1.2 `/api/classify` POST endpoint'ini uygula
    - `ClassifyRequest` alarak `ZeroShotClassifier` ile sınıflandırma yap
    - Her kategori için `add_category` çağır, `classify_batch` ile sonuçları al
    - Skorları 4 basamak hassasiyetle yuvarla
    - Hata durumunda HTTP 500 döndür
    - `EmbeddingClient` örneğini uygulama başlangıcında oluştur
    - _Gereksinimler: 1.2, 1.3, 1.6, 2.4_
  - [ ]* 1.3 API endpoint birim testlerini yaz
    - FastAPI TestClient ile boş metin listesi → 422, boş kategori listesi → 422 testleri
    - Başarılı sınıflandırma yanıt yapısı testi (mock classifier ile)
    - CORS header kontrolü testi
    - _Gereksinimler: 1.4, 1.5, 1.6, 3.1_
  - [ ]* 1.4 Pydantic model round-trip property testi yaz
    - **Property 1: İstek seri hale getirme gidiş-dönüş**
    - **Validates: Requirements 2.3**
  - [ ]* 1.5 Yanıt yapısı tamlığı property testi yaz
    - **Property 2: Yanıt yapısı tamlığı**
    - **Validates: Requirements 1.3, 2.2**
  - [ ]* 1.6 API skor hassasiyeti property testi yaz
    - **Property 3: API skor hassasiyeti**
    - **Validates: Requirements 2.4**

- [x] 2. Checkpoint - Backend API doğrulaması
  - Tüm testlerin geçtiğinden emin ol, sorular varsa kullanıcıya sor.

- [x] 3. Next.js frontend projesini oluştur
  - [x] 3.1 Next.js 16 projesi oluştur ve yapılandır
    - `frontend/` dizininde Next.js projesi oluştur (App Router, TypeScript, Tailwind CSS)
    - `frontend/src/lib/api.ts` dosyasında API istemci modülünü yaz (ClassifyRequest, ClassifyResponse, ClassificationResult tipleri, classify fonksiyonu)
    - `NEXT_PUBLIC_API_URL` ortam değişkeni desteği ekle
    - `fast-check` bağımlılığını ekle
    - _Gereksinimler: 1.1, 2.1, 2.2_
  - [x] 3.2 Metin girişi bileşenini uygula (`frontend/src/components/TextInput.tsx`)
    - Textarea bileşeni: her satır ayrı metin olarak ayrıştırılır
    - Boş satırları filtrele
    - Girilen metin sayısını göster
    - `parseTexts` yardımcı fonksiyonunu ayrı bir `utils.ts` dosyasında tanımla
    - _Gereksinimler: 4.1, 4.2, 4.3, 4.4_
  - [ ]* 3.3 Metin ayrıştırma property testi yaz
    - **Property 4: Metin ayrıştırma — satır bölme ve filtreleme**
    - **Validates: Requirements 4.2, 4.3**

- [x] 4. Kategori yönetimi bileşenini uygula
  - [x] 4.1 Kategori yönetimi bileşenini oluştur (`frontend/src/components/CategoryManager.tsx`)
    - Kategori ekleme: input alanı + ekleme butonu
    - Kategori silme: her kategorinin yanında silme butonu
    - Boş kategori adı eklemeyi engelle
    - Varsayılan kategoriler: "Lojistik ve Kargo", "Ürün Kalitesi ve Performans", "Müşteri Hizmetleri ve Destek"
    - _Gereksinimler: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ]* 4.2 Kategori ekleme/silme property testlerini yaz
    - **Property 5: Kategori ekleme geçerliliği ve liste büyümesi**
    - **Property 6: Kategori silme ve liste küçülmesi**
    - **Validates: Requirements 5.2, 5.3, 5.4**

- [x] 5. Sonuç görüntüleme ve dışa aktarma bileşenlerini uygula
  - [x] 5.1 Sonuç tablosu bileşenini oluştur (`frontend/src/components/ResultsTable.tsx`)
    - Metin | Kategori | Benzerlik Skoru sütunları ile tablo
    - Skor virgülden sonra 4 basamak hassasiyetle gösterilir
    - Toplam sınıflandırılan metin sayısı gösterilir
    - `formatScore` yardımcı fonksiyonunu `utils.ts` dosyasına ekle
    - _Gereksinimler: 7.1, 7.2, 7.3_
  - [ ]* 5.2 Skor gösterim hassasiyeti property testi yaz
    - **Property 8: Frontend skor gösterim hassasiyeti**
    - **Validates: Requirements 7.2**
  - [x] 5.3 JSON dışa aktarma fonksiyonunu uygula
    - "JSON İndir" butonu: sonuçları JSON dosyası olarak indir
    - API yanıt formatıyla uyumlu JSON yapısı
    - `exportResultsAsJson` yardımcı fonksiyonunu `utils.ts` dosyasına ekle
    - _Gereksinimler: 8.1, 8.2, 8.3_
  - [ ]* 5.4 JSON dışa aktarma format tutarlılığı property testi yaz
    - **Property 9: JSON dışa aktarma format tutarlılığı**
    - **Validates: Requirements 8.3**

- [x] 6. Ana sayfayı birleştir ve entegrasyonu tamamla
  - [x] 6.1 Ana sayfa bileşenini oluştur (`frontend/src/app/page.tsx`)
    - Client Component olarak tüm bileşenleri birleştir
    - State yönetimi: texts, categories, results, loading, error
    - "Sınıflandır" butonu: texts veya categories boşsa disabled
    - Loading state: yükleniyor göstergesi
    - Error state: hata mesajı gösterimi
    - Sonuçlar mevcut olduğunda ResultsTable ve JSON İndir butonu göster
    - _Gereksinimler: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 6.2 Sınıflandır butonu devre dışı durumu property testi yaz
    - **Property 7: Sınıflandır butonu devre dışı durumu**
    - **Validates: Requirements 6.4**
  - [ ]* 6.3 Ana sayfa birim testlerini yaz
    - Varsayılan kategorilerin yüklenmesi testi
    - Yükleniyor göstergesinin görüntülenmesi testi
    - Hata mesajının gösterilmesi testi
    - JSON İndir butonunun sonuçlar mevcut olduğunda görünmesi testi
    - _Gereksinimler: 5.5, 6.3, 6.5, 8.1_

- [x] 7. Son checkpoint - Tüm testlerin doğrulanması
  - Tüm testlerin geçtiğinden emin ol, sorular varsa kullanıcıya sor.

## Notlar

- `*` ile işaretli görevler isteğe bağlıdır ve hızlı MVP için atlanabilir
- Her görev belirli gereksinimlere referans verir
- Backend testlerinde `ZeroShotClassifier` ve `EmbeddingClient` mock'lanmalıdır
- Frontend testlerinde API çağrıları mock'lanmalıdır
- Property testleri evrensel doğruluk özelliklerini doğrular
- Birim testleri belirli örnekleri ve edge case'leri doğrular
- Backend: `uvicorn api.main:app --reload` ile çalıştırılır (port 8000)
- Frontend: `npm run dev` ile çalıştırılır (port 3000)
