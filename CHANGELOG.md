# Changelog

[English](./CHANGELOG.md) | [Русский](./CHANGELOG.ru.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-01-31

### Added

- Jest testing framework configuration
- Husky pre-commit hooks for code quality enforcement
- PNPM package manager support with lock file
- Comprehensive test suite with 574+ test cases
- Additional unit tests for edge cases and validation

### Fixed

- `isLeapYear` function bug fix
- Improved input validation across all methods

### Changed

- Enhanced JSDoc comments for better documentation
- Improved method implementations
- Updated VS Code settings for better development experience
- Optimized TypeScript configuration

## [2.4.0] - 2026-01-19

### Changed

- Updated README documentation
- Made type definitions readonly for better type safety
- Improved code organization and structure

## [2.2.2] - 2026-01-17

### Added

- Migration to Biome.js for linting and formatting

### Changed

- Improved code formatting throughout the project
- Updated README documentation
- Reduced bundle size

### Removed

- ESLint configuration (replaced by Biome.js)
- Unnecessary dependencies

## [2.2.0] - 2026-01-13

### Added

- `setUrl()` function for runtime URL configuration

### Changed

- Updated README with more examples and documentation
- Cleaned up codebase
- Improved test organization

## [2.1.1] - 2026-01-13

### Added

- `isLeapYear()` function to check for leap years
- `today()` function for checking current date
- `tomorrow()` function for checking next day
- New test suite with comprehensive coverage

### Changed

- Updated README with new function documentation
- Restructured codebase with new module organization

### Removed

- Unnecessary dependencies

## [2.0.0] - 2026-01-12

### Breaking Changes

- **Return types changed from numeric to boolean**
- Removed excessive utility methods

### Added

- Boolean return types for cleaner API
- Interval validation for date range checks
- Comprehensive test suite

### Changed

- Updated all tests for new return types
- Improved code organization and cleanup
- Updated dependencies to latest versions
- Migrated from Yarn to NPM
- Updated ESLint configuration

### Removed

- Prettier configuration (using ESLint for formatting)
- Jest configuration (replaced with simpler setup)
- Yarn lock file

## [1.0.0] - 2024-11-08

### Added

- TypeScript rewrite of the entire library
- Type definitions for all functions
- Jest testing framework
- Comprehensive test suite
- TSDoc comments
- Build system with TypeScript compiler

### Changed

- Migrated entire codebase from JavaScript to TypeScript
- Updated package.json for TypeScript project
- Improved README documentation
- Better error handling
