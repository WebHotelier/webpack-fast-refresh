## 5.0.3 (July 28th, 2020)

- Sync with latest `@next/react-refresh-utils`
- Add license to files copied from @vercel/next.js

## 5.0.0 (May 10th, 2020)

We no longer want to assume anything about your webpack configuration (e.g. file extensions for your React components). We also want to use as little as possible of webpack's internal API.

For this reason, we no longer trying to put everything together for you. The loader and entry runtime have been separated from the webpack plugin. Users will need to manually add each one to their configuration. Besides significantly simplifying our code, this change will help keep compatibility with future webpack versions and with more advanced/obscure configurations.

Version was bumped to v5 in order to match minimum compatible webpack version.

- **BREAKING CHANGE**: Minimum required version is now `webpack@v5.0.0-beta.15`
- **BREAKING CHANGE**: Separated the webpack loader and entry runtime from the webpack plugin. See our [README](./README.md) for instructions.
- **NEW**: Added optional plugin for integration with [react-error-overlay](https://github.com/facebook/create-react-app/tree/master/packages/react-error-overlay)
- **NEW**: Added support for `module.hot.invalidate`
- **FIX**: We now properly support webpack's [descriptor entries](https://webpack.js.org/configuration/entry-context/#entry-descriptor)

## 2.0.0 (Mar 21st, 2020)

- Now requires Babel 7.9.0+ with runtime=`automatic` on preset-react (see [README.md](./README.md))

## 1.2.6 (Dec 15, 2019)

- Fix webpack not caching loader

## 1.2.4 (Dec 11, 2019)

- Minor tweaks

## 1.0.9 (Oct 11, 2019)

- Remove `webpack@4` support again

## 1.0.4 (Sep 16th, 2019)

- Adds support for both `webpack@4` and `webpack@5`

## 1.0.2 (Sep 15th, 2019)

- Properly establishes refresh boundaries for named exports

## 1.0.0 (Sep 14th, 2019)

- Initial release
