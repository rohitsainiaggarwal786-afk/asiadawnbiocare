# Asia Dawn BMS — Ready APK Package (Hinglish Guide)

Maine sab pre-wire kar diya hai. Aapko ab sirf **2 cheezein** karni hain:
**(A)** is folder ko GitHub par upload karke APK download karna, aur
**(B)** Hostinger ki `sync.php` me ek chhota code paste karna.
Bas. Niche detail hai.

---

## Folder me kya-kya hai (sab ready)
```
adbc-app/
├─ capacitor.config.json        ← app config (ready)
├─ package.json                 ← Capacitor 8 + GPS plugin (ready)
├─ .github/workflows/build-apk.yml  ← APK auto-builder (ready)
├─ sync-gps-endpoint.php        ← sync.php me paste karne wala code
├─ SETUP-GUIDE.md               ← ye file
└─ www/
   ├─ index.html                ← AAPKA app + tracking.js line LAGI HUI hai
   └─ tracking.js               ← background GPS code (ready)
```
> `index.html` me background-tracking ki line maine already laga di hai — aapko kuch edit nahi karna.

---

## (A) APK banao — GitHub se (FREE, bina kuch install kiye)

1. **github.com** par free account banao.
2. **New repository** → naam `adbc-app` → **Private** → Create.
3. Repo page par **"uploading an existing file"** link dabao → is `adbc-app` folder ke andar ke **saare items** drag-drop karo (`.github`, `www`, aur baaki files sab) → **Commit changes**.
   - `www` folder aur `.github` folder bhi zaroor upload ho jayein.
4. Upar **Actions** tab kholo → build apne aap chalu hoga → green ✓ aane do (~5–7 min).
5. Us build par click → niche **Artifacts** → `ADBC-BMS-apk` download → andar **`app-debug.apk`**.
6. Wo `.apk` agents ko WhatsApp/link se bhej do.

> Aage app me change karo to wahi files dobara upload → naya APK apne aap.

---

## (B) Server par GPS endpoint (ek baar) — Hostinger me

1. Hostinger → File Manager → `asiadawnbiocare.com/web/sync.php` kholo.
2. `sync-gps-endpoint.php` ka `action === 'gps'` aur `action === 'gps_all'` waala block,
   apni `sync.php` ke andar (jahan baaki `action` handle hote hain) paste karo.
3. Secret key check pehle se aapki sync.php me hai — same `AsiaDawn@2024!` use hui hai.
4. File-based (`live_locations.json`) se chal jayega. MySQL use karte ho to file ke andar
   ka note dekho (INSERT ... ON DUPLICATE KEY UPDATE).

Iske bina location server par save nahi hogi — ye step zaroori hai.

---

## (C) Agent ke phone par (ek baar, har phone)

1. `app-debug.apk` install karo ("Unknown sources" allow — ek baar).
2. App pehli baar khulne par location permission → **"Allow all the time"** chuno
   (sirf "while using app" se background nahi chalega).
3. Battery optimization OFF karo:
   - Xiaomi/Redmi: Apps → ADBC BMS → Battery → **No restrictions** + Autostart **ON**
   - Vivo/Oppo/Realme: Battery → Background power → **Allow**
   - Samsung: Battery → Background usage limits → **Never sleeping apps** me add
4. Ek permanent notification "📍 ADBC BMS Location On" dikhegi — ye Android ka rule hai,
   isi se background tracking chalti hai. Agent ko bhi pata rehta hai tracking on hai.

---

## Kaam kaise karega
- Agent login → tracking auto start → har location `sync.php?action=gps` par (app band ho tab bhi).
- Saara data jaise pehle, waise hi **Hostinger MySQL** par. APK sirf access ka tarika hai.
- Admin/Manager apne Live Tracking panel me sab dekh sakta hai.
- Logout → tracking band.

## Notes
- Abhi **Android-only**. iPhone chahiye to Apple Developer account (~₹8000/saal) + alag steps.
- `live_locations.json` writable folder me ho (permission 755/775).
- Agar plugin runtime issue aaye, `capacitor.config.json` me `android` ke andar
  `"useLegacyBridge": true` add karke dobara build kar lena.
