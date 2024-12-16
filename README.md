# Recruitment repository

This recruitment repository was created with two main goals: to show you what to expect when working with us (as the stack reflects some parts of our actual codebase), and to help us understand how you approach tasks where not everything is known from the start.

Focus on completing the most important parts of what has been started here. You'll find "TODO" comments throughout the code, but you're not limited to those—feel free to implement whatever you think best demonstrates your skills.

## Gettings started

1. Install the dependencies

   ```
   $ pnpm install
   ```

2. Set up the database schema

   ```
   $ docker-compose up -d postgresql; pnpm run -C server dev:db; docker-compose stop postgresql
   ```

3. Start

   ```
   $ pnpm run dev
   ```

### Database

You will need to update the database schema whenever you change the models:

```
$ docker-compose up -d postgresql; pnpm run -C server dev:db; docker-compose stop postgresql
```
