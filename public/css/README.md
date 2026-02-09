# Dokumentasi Struktur CSS

## Struktur Folder

```
site/css/
├── main.css                    # Entry point - import semua modul
├── _variables.css             # Custom properties (warna, shadows, dll)
├── _reset.css                  # Reset browser styles
├── _base.css                   # Base styles (body, font global)
├── _layout.css                 # Layout utama (app container, chat container)
├── _responsive.css            # Media queries & responsive design
├── _accessibility.css         # Styles untuk aksesibilitas
├── _dark-mode.css             # Dark mode (auto & manual)
├── components/                # Komponen-komponen UI
│   ├── _chat-header.css
│   ├── _chat-messages.css
│   ├── _message.css
│   ├── _tool-calls.css
│   ├── _typing-indicator.css
│   ├── _chat-input.css
│   ├── _loading-overlay.css
│   └── _toast.css
└── markdown/                  # Styles untuk konten markdown
    ├── _code.css
    ├── _tables.css
    └── _typography.css
```

## Penggunaan

### Menggunakan main.css (Disarankan)

```html
<link rel="stylesheet" href="css/main.css" />
```

### Menggunakan style.css (Legacy/Kompatibilitas Mundur)

```html
<link rel="stylesheet" href="css/style.css" />
```

## Prinsip Desain

1. **Modular** - Setiap file memiliki satu tanggung jawab
2. **Reusable** - Komponen dapat digunakan ulang
3. **Scalable** - Mudah menambahkan komponen baru
4. **Maintainable** - Mudah memelihara dan debug

## Urutan Loading CSS

1. Variables (design tokens)
2. Reset (browser normalization)
3. Base (typography, globals)
4. Layout (containers)
5. Components (UI components)
6. Markdown (content styling)
7. Utilities (responsive, a11y, dark mode)

## Menambahkan Komponen Baru

1. Buat file baru di `components/`, contoh: `_button.css`
2. Tambahkan import di `main.css` pada bagian Components
3. Gunakan prefix untuk semua selector, contoh: `.btn-primary`

## Dark Mode

Mendukung dua metode:

- **Otomatis**: Berdasarkan preferensi sistem (`prefers-color-scheme`)
- **Manual**: Dengan menambahkan class `dark-mode` pada `<body>`

## Aksesibilitas

- Focus styles yang konsisten
- Skip link
- Reduced motion support
- Keyboard navigation
