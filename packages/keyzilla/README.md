# keyzilla
Keyzilla is a platform for managing API keys and secrets across projects and teams.

## Features

- Centralized API key management
- Multi-tenant architecture with encrypted key sharing
- CLI tool for easy interaction
- TypeScript support
- Integration with t3-env for type-safe environment variables
- Works with Vercel, Railway, Netlify, and other platforms
## Quick Start

Install:

```bash
npm install keyzilla
```

To pull the keys from the dashboard:

```bash
npx keyzilla pull
```

to use the keys in your project, you can use the following code:

```typescript
import { k } from 'keyzilla';
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

[MIT](./License)
