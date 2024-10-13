# Contributing to [Project Name]

We're excited that you're interested in contributing to [Project Name]! This project uses [Semantic Release](https://semantic-release.gitbook.io/semantic-release/) to automate version management and package releases. To ensure that your contributions are properly recognized and versioned, please follow these guidelines when making commits.

## Commit Message Format

We use the [Conventional Commits](https://www.conventionalcommits.org/) specification for our commit messages. This format is used by Semantic Release to determine the type of changes in the codebase and automatically update the version number.

Each commit message should be structured as follows:

### Types

The commit type must be one of the following:

- `feat`: A new feature (corresponds to a `MINOR` version increment)
- `fix`: A bug fix (corresponds to a `PATCH` version increment)
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Breaking Changes

If a commit introduces a breaking change, it should be indicated in the footer with a `BREAKING CHANGE:` prefix, or by appending a `!` after the type/scope. This will result in a `MAJOR` version increment.

### Examples
