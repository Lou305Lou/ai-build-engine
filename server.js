import Fastify from "fastify";
import generateRoute from "./routes/generate.js";

const fastify = Fastify({
  logger: true
});

// Register your generator route
fastify.register(generateRoute);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
