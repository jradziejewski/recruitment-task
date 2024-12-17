# Recruitment repository

This recruitment repository was created with two main goals: to show you what to expect when working with us (as the stack reflects some parts of our actual codebase), and to help us understand how you approach tasks where not everything is known from the start.

Create a simple frontend with a submission form and a backend that handles form submissions, stores them in a database, and sends confirmation emails to submitters. Focus on implementing the components you consider most important. While you'll find "TODO" comments throughout the code, feel free to implement whatever best showcases your skills.

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

## Handing over

When finished, send the Git bundle file to pawel@juo.io. Create it using this command:

```
$ git bundle create <name>.bundle HEAD
```
