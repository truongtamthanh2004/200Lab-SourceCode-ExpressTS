# Add module alias

## Install packages

```bash
npm install -D @types/module-alias
npm install module-alias
```

## Edit `tsconfig.json`

```json
{
  "compilerOptions": {
    //...
    // "rootDir": "./src",
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@/*":["*"],
      "@modules/*": ["modules/*"],
      "@share/*": ["share/*"]
    }
  },
}
```

## Edit `package.json`

```json
{
  //...
  "_moduleAliases": {
    "@root": ".",
    "@modules": "src/modules",
    "@share": "src/share"
  }
}
```

## Edit `src/index.ts`
Add the following line at the **top of the file**.

```ts
import 'module-alias/register';
//...
```