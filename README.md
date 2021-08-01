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

- authenticate and save the userId/token
- on launch check if re-login is required
- state machine for login/auth
- interface for logging
- interface for cache

## Notes

Started using npx typescript-starter
