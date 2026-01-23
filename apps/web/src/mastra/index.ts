import { Mastra } from "@mastra/core"
import { researchAssistantAgent } from "./agents"

/**
 * Mastra configuration for Coscientist AI features
 *
 * Provides:
 * - OpenAI GPT-4o model for AI-driven features
 * - Research assistant agent for edge suggestions and counterevidence search
 * - Extensible tool system for future AI capabilities
 */
export const mastra = new Mastra({
  agents: {
    researchAssistant: researchAssistantAgent,
  },
})

export default mastra
