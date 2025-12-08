# Usulzen - Türk Musikisi Ritim Rehberi

Usulzen, Türk Sanat Musikisi usullerini (ritimlerini) görsel ve işitsel olarak keşfetmek, analiz etmek ve öğrenmek için tasarlanmış interaktif bir web uygulamasıdır.

![Usulzen Preview](preview.png)

## Özellikler

- **Klasik Usul Kütüphanesi:** Sofyan, Düyek, Aksak, Devr-i Revan gibi temel usulleri dinleyin ve izleyin.
- **Görsel Ritim Haritası:** Vuruşların zaman çizelgesi üzerinde renkli ve anlaşılır gösterimi.
- **Ton Ayarları:** Düm (Sağ el) ve Tek (Sol el) seslerinin frekanslarını (Hz) anlık olarak ayarlayabilme.
- **Stüdyo Modu (Manuel Usul Oluşturma):** Kendi usulünüzü vuruş vuruş oluşturun ve oynatın. Yeni usul eklemek için *contents.ts* dosyası içinde uygun formatta manuel olarak ekleme yapmalısınız.
 
## Proje Videosu

<!-- GitHub README sanitizes many HTML tags; direct <video> may be stripped. Use a clickable thumbnail that opens the raw video. -->

[![Usulzen Video Preview](site-preview/preview.png)](https://raw.githubusercontent.com/ferahfeza/TMU/main/site-preview/Usulzen.mp4)

_Tıklayarak videoyu yeni sekmede açıp izleyebilirsiniz._

## Kurulum ve Çalıştırma

Bu projeyi yerel bilgisayarınızda çalıştırmak için:

1.  **Depoyu Klonlayın:**
    ```bash
    git clone https://github.com/ferahfeza/usulzen.git
    cd usulzen
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Uygulamayı Başlatın:**
    ```bash
    npm run dev
    ```

## Teknolojiler

- **Frontend:** React 19, TypeScript
- **Stil:** Tailwind CSS
- **Ses:** Web Audio API (Gerçek zamanlı osilatör sentezi)
- **İkonlar:** Lucide React

## Lisans

MIT
