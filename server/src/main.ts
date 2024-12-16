import { createApp } from "./app";

const app = createApp();

app.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

process.on("SIGINT", () => {
  console.log(`Gracefully stopping server`);
  app.close(() => {
    process.exit();
  });
});
