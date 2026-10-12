# Robotail Journal brand and media update — 2026-10-12

- Owner's brand color: PANTONE 2725 C. Web approximation: #685BC7, RGB 104, 91, 199. Reference: https://www.colorxs.com/color/pantone-2725-c. A display approximation is not a physical print proof.
- Preserve English, cats-only content and the warm home/editorial layout. Dark mode uses a lighter version of the same violet for readable text.
- Added three AI-generated lifestyle illustrations: playtime, feeding preparation, and reading together. These are illustrative scenes, not customer photographs or branded product demonstrations.
- Added three official website assets: a home-and-litter-box banner, C32 transparent-lid detail, and F20 app/tray view. Product appearance and original English artwork are unchanged.
- `content/journal-media.json` records lifestyle dimensions, responsive renditions, alt text, category eligibility, generation prompts, and the official banner source. `content/product-media.json` records original product sources and hashes.
- Seven journal scenes and eight original product images are available. Homepage imagery reserves the latest article's cover first and chooses five other distinct scenes.
- Future generated articles choose relevant least-used covers, avoid the two most recent covers where the eligible pool allows, and choose product photos only from the correct model's pool. Unpublished drafts do not consume the rotation.
- Existing Monday/Tuesday/Thursday 09:00 Asia/Shanghai publishing schedule, one-post-per-day guard, product facts, links and publication history are unchanged.
- Verification: 16 content/publication/media tests passed; static build passed. Desktop 1440px, mobile 390px, dark mode, article list, and lazy-loaded product images were inspected. Browser evidence is under ignored `output/playwright/2725-*`.
