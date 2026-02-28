# Contributing to Neon Hangman

Thank you for your interest in contributing to **Neon Hangman**! 🎮⚡ We welcome contributions from everyone, whether you're fixing a bug, adding a feature, or improving documentation.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report any unacceptable behavior.

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/neon-hangman.git
   cd neon-hangman
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Add your Firebase credentials to .env.local
   ```
5. **Start the dev server**:
   ```bash
   npm run dev
   ```

## 🔧 How to Contribute

### Types of Contributions We Welcome

- 🐛 **Bug Fixes** — Found a bug? Fix it and submit a PR!
- ✨ **New Features** — Have a cool idea? Let's discuss it first via an Issue.
- 📝 **Documentation** — Improve README, add code comments, write guides
- 🎨 **UI/UX Improvements** — Make things look even more neon!
- 📦 **New Word Categories** — Add more words and categories to expand the game
- 🧪 **Tests** — Add test coverage for existing functionality
- 🌐 **Translations** — Help make the game accessible in more languages

## 📤 Pull Request Process

1. **Create an Issue first** for significant changes to discuss the approach
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our [code style](#code-style)
4. **Test thoroughly** — make sure nothing is broken
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new word category for astronomy"
   ```
6. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** against `main` with:
   - A clear title and description
   - Screenshots for UI changes
   - Reference to any related Issues

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

| Prefix | Usage |
|--------|-------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation only |
| `style:` | Formatting, no code change |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvement |
| `test:` | Adding tests |
| `chore:` | Maintenance tasks |

## 🎨 Code Style

- **TypeScript** — All code should be strongly typed. Avoid `any` where possible.
- **React** — Use functional components with hooks
- **Formatting** — Follow the existing ESLint configuration
- **Naming** — Use `camelCase` for variables/functions, `PascalCase` for components/types
- **File Structure** — Keep components focused and reusable
- **CSS** — Use Tailwind CSS utility classes. Custom CSS goes in `globals.css`

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** — Clear summary of the issue
2. **Steps to Reproduce** — How do we see the bug?
3. **Expected Behavior** — What should happen?
4. **Actual Behavior** — What actually happens?
5. **Screenshots** — If applicable
6. **Environment** — Browser, OS, Node.js version

## 💡 Suggesting Features

We love hearing ideas! Please:

1. **Check existing Issues** to avoid duplicates
2. **Open a new Issue** with the `feature` label
3. **Describe** the feature and why it would be valuable
4. **Include mockups** or examples if possible

---

Thank you for helping make Neon Hangman even more awesome! ⚡🎮
