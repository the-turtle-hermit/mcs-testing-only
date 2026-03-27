Man Camp South site package v2

Included updates:
- Store page hidden from navigation
- Text-only wordmark branding
- Homepage simplified around registration, details, and camp information
- Details page populated with confirmed checklist content
- About page aligned to the mission-focused direction
- Store page preserved for future merch launch

Deploy:
1. Extract this zip.
2. Replace the repo files with these files.
3. Commit changes.
4. Cloudflare Pages will auto-deploy.

Main editable files:
- assets/js/config.js  -> dates, pricing, schedule, FAQs, product data
- assets/css/styles.css -> visual styling
- index.html / about.html / details.html -> page structure


Updated in v4: venue details added for Lion King Ministries and Jonnie W. added as featured guest speaker.


Updated in v5: removed venue phone number so attendee contact stays focused on Man Camp South.


Updated in v6: homepage simplified, original headline restored, Pretix widget embedded on home, speaker moved to About, venue image added to Details, and new uploaded photos incorporated.

PWA files added:
- manifest.webmanifest
- sw.js
- /icons/*.png

To test installability, deploy these files on HTTPS and open the site from a real phone browser. iPhone users install from Safari > Share > Add to Home Screen. Android users should see the in-site Install App button on supported browsers.
