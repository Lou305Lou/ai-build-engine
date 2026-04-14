import { generateProject } from "../engine/generator.js";

export default async function (fastify) {
  fastify.post("/generate", async (req, reply) => {
    const structure = req.body.structure;

    if (!structure) {
      return reply.code(400).send({ error: "Missing structure" });
    }

    const result = generateProject(structure);
    return reply.send(result);
  });
}
