#!/usr/bin/env node

import "dotenv/config"

import { Command } from "commander"
import { reviewCommand } from "./command/review.js"
import { commitCommand } from "./command/commit.js"
import pkg from '../package.json' with { type: 'json' }

const version = pkg.version

const program = new Command()

program
  .name("ai-tools")
  .description("ai dev assistant")
  .version(version)

program
  .command("review")
  .description("review code changes")
  .option("--base <branch>", "base branch to compare")
  .option("--staged", "review only staged changes")
  .action((options) => reviewCommand(options))

program.command("commit")
  .description("generate git commit message")
  .option("--base <branch>", "base branch to compare")
  .option("--staged", "review only staged changes")
  .action((options) => commitCommand(options))

program.parse()