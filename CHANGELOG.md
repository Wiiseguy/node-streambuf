# **streambuf** Changelog

### [1.2.0] (16-aug-2022)
- TypeScript rewrite
- Added CHANGELOG

### [1.1.4] (01-jan-2022)
- Added BigInt support

### [1.1.3] (31-dec-2021)
- Removed Travis CI integration
- Added GitHub Actions integration
- Added `readChar` and `writeChar`
- Added `writeString7`
- Fix: prevent `skip`/`seek`/`setPos` from going out of bounds

### [1.1.2] (19-feb-2021)
- Minor changes to README and package.json keywords

### [1.1.1] (18-feb-2021)
- Minor changes to README

### [1.1.0] (18-feb-2021)
- Replaced ava with aqa because of the constant dependabot security issues with ava's numerous dependencies

### [merge] (16-feb-2021)
- dependabot ini bump due to security issue in ini (through ava)

### [merge] (10-dec-2020)
- dependabot ini bump due to security issue in lodash (through ava)

### [1.0.13] (06-apr-2020)
- Updated ava from 1.1.0 to 3.6.0 following npm audit issues
- Added keywords to package.json

### [1.0.12] (05-apr-2020)
- Updated package-lock.json due to a security issue in lodash (through ava)

### [1.0.11] (17-jul-2019)
- Updated package-lock.json due to a security issue in lodash (through ava)

### [1.0.10] (28-jun-2019)
- Updated package-lock.json due to a security issue in js-yaml (through ava)

### [1.0.9] (25-jan-2019)
- Updated ava from 0.24.0 to 1.1.0 following npm audit issues

### [1.0.8] (30-dec-2017)
- Added Travis CI integration and fancy build status badge

### [1.0.7] (29-dec-2017)
- Added 7-bit integer methods and tests
- Added the API to the README

### [1.0.6] (29-dec-2017)
- Added xFloat and xDouble Buffer methods support

### [1.0.5] (29-dec-2017)
- Added write methods, so streambuf is no longer a read-only library

### [1.0.4] (28-dec-2017)
- Minor README change

### [1.0.3] (28-dec-2017)
- Added many tests
- Rewrote integer methods
- Added LICENSE

### [1.0.2] (27-dec-2017)
- Added usage and examples to README

### [1.0.1] (27-dec-2017)
- Added README

### [1.0.0] (27-dec-2017)
- Initial release
- Created git repository
- Published NPM package

### [local] (06-jan-2015)
- Very first version! Originally used StreamBuffer to read and walk through old game data files and extract images and sounds