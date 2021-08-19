# falconz-app-chat-rc

chat client api modules. specifically meant to implement fetching from rocketchat backend

## Development workflow

```bash
# add changes
git add -A
git cz
npm run version
git push --follow-tags origin main && npm publish
```

## Todo

- start writing unit test before it is too large to start
- introduce json-schema validation - ajv
- remove lru and introduce datastructure library https://github.com/Yomguithereal/mnemonist
- authenticate and save the userId/token
- on launch check if re-login is required
- interface for data managers & jsonschema for data contracts
- state machine for login/auth
- interface for logging
- interface for cache

## Notes

Started using npx typescript-starter
