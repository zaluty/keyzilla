# keyzilla

Keyzilla is a platform for managing API keys and secrets across projects and teams.
it gives you a global access over your api keys.

## Features

- Centralized API key management
- Multi-tenant architecture with encrypted key sharing
- CLI tool for easy interaction
- TypeScript support
- Integration with t3-env for type-safe environment variables [see here](https://github.com/t3-oss/t3-env)
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
import { k } from "keyzilla";
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Relationships

Keyzilla offers a free trial to its software as well as a paid subscription for organizations and companies so we give a portions of our revenue to all the FOSS we use in our project to support them and and also as a thanks for making the keyzilla journey easy and enjoyable.

## License

MIT
