module.exports = [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
        encodeURIComponent: "readonly",
        setTimeout: "readonly",
        addEventListener: "readonly",
        allBusinesses: "writable",
        categoryFilter: "writable",
        locationFilter: "writable",
        categoryNames: "readonly",
        loadDirectoryData: "readonly",
        initializeFilters: "readonly",
        updateFilterButtonStates: "readonly",
        getDisplayName: "readonly",
        getFilteredBusinesses: "readonly",
        renderDirectory: "readonly",
        renderContactInfoInto: "readonly",
        formatPhoneNumber: "readonly",
        resetFilters: "writable"
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];
