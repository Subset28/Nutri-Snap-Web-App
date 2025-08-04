# NutriSnap – AI Menu Analyzer

**NutriSnap** is a cross-platform nutrition-focused mobile app that uses AI to help users make safe, healthy, and personalized food choices. Designed for people with food allergies, dietary preferences, or health goals, NutriSnap analyzes restaurant menus and food labels to provide instant, tailored insights.

---

## 🚀 Features

- **AI Food Scanner:** Instantly analyze restaurant menus, food labels, or ingredient lists with a quick photo or upload.
- **Personalized Results:** Get tailored recommendations based on your allergies, dietary preferences (gluten-free, vegan, keto, etc.), and health goals.
- **Allergy Alerts:** Automatic detection and clear warnings for common allergens and cross-contamination risks.
- **Healthy Eating Insights:** See nutrition highlights, calorie info, and ingredient breakdowns for smarter choices.
- **Diet Tracker:** Keep tabs on your dietary needs and preferences—no manual entry required.
- **Safety Mode:** Extra-strict analysis for those with severe allergies or sensitivities.
- **Privacy First:** No sign-up, no tracking, and your data stays on your device.
- **AdMob Integration:** Non-intrusive banner ads support app development.

---

## 🖼️ Screenshots

> Add screenshots of the app here (e.g., main menu, analysis results, settings panel, etc.)

---

## 📲 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Capacitor CLI (for native builds)
- Xcode (for iOS)
- Android Studio (for Android)

<!-- Force new build -->

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd nutri-snap-cac
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Start the development server:**
```sh
npm run dev
```
4. **Build for production:**
   ```sh
   npm run build
   ```
5. **Run on iOS/Android:**
   ```sh
   npx cap sync
   npx cap open ios   # For iOS (requires Xcode)
   npx cap open android   # For Android (requires Android Studio)
   ```

---

## ⚙️ Configuration

- **AdMob:**
  - Update your AdMob App ID and Banner Ad Unit ID in the relevant config and code files.
  - For development, use test ads. For production, use your real Ad Unit ID and set `isTesting: false`.
- **OpenAI API Key:**
  - Users must enter their own OpenAI API key in the app settings for menu analysis.

---

## 🔒 Privacy & Data
- No account or login required.
- User preferences and API keys are stored locally on the device.
- No personal data is collected or transmitted by the app itself.
- AdMob may collect device and usage data for ad delivery and analytics (see privacy policy for details).

---

## 🛠️ Tech Stack
- React (frontend)
- Capacitor (native functionality)
- Tailwind CSS (styling)
- OpenAI API (menu analysis)
- Google AdMob (ads)

---

## 📄 License
MIT License. See [LICENSE](LICENSE) for details.

---

## 📧 Support & Contact
- Email: [support@orbconcepts.com](mailto:support@orbconcepts.com)
- Privacy Policy: [https://orbconcepts.com/privacy-policy/](https://orbconcepts.com/privacy-policy/)

---

**NutriSnap: Eat smart. Eat safe. Every meal, everywhere.**
