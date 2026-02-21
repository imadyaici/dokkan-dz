export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Enforce lowercase for types and scopes
        'type-case': [2, 'always', 'lower-case'],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'always', 'lower-case'],
        // Examples of allowed types:
        // feat: A new feature
        // fix: A bug fix
        // build: Changes that affect the build system or external dependencies
        // chore: Other changes that don't modify src or test files
        // ci: Changes to our CI configuration files and scripts
        // docs: Documentation only changes
        // style: Changes that do not affect the meaning of the code (white-space, formatting, etc)
        // refactor: A code change that neither fixes a bug nor adds a feature
        // perf: A code change that improves performance
        // test: Adding missing tests or correcting existing tests
    },
};
