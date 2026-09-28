const { setupZonelessTestEnv } = require('jest-preset-angular/setup-env/zoneless');
const { registerLocaleData } = require('@angular/common');
const localeDe = require('@angular/common/locales/de');
const localeFr = require('@angular/common/locales/fr');

// Mirrors the bootstrap in `src/app/app.config.ts`, which unit tests never
// load. Without it the locale-aware pipes in `src/app/i18n/locale.pipes.ts`
// throw NG0701 (missing locale data) as soon as a component under test
// renders `| date`, `| number`, `| currency` or `| percent`.
registerLocaleData(localeDe.default ?? localeDe);
registerLocaleData(localeFr.default ?? localeFr);

setupZonelessTestEnv();
