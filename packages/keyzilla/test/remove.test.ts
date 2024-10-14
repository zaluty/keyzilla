import { removeKeyzilla } from "../src/remove/index"
import { expect, describe, it, vi, beforeEach, afterEach } from "vitest"
import fs from "fs"
import path from "path"
import * as globModule from "glob"

// Mock the modules
vi.mock("fs")
vi.mock("path")
vi.mock("glob")
vi.mock("dotenv")

describe("removeKeyzilla", () => {
  const mockProjectRoot = "/mock/project/root"
  const mockEnvPath = "/mock/project/root/.env"
  const mockGitignorePath = "/mock/project/root/.gitignore"
  const mockKeyzillaEnvPath = "/mock/project/root/node_modules/keyzilla/dist/env.ts"

  beforeEach(() => {
    // Mock process.cwd()
    vi.spyOn(process, "cwd").mockReturnValue(mockProjectRoot)

    // Mock fs methods
    vi.mocked(fs.existsSync).mockReturnValue(true)
    vi.mocked(fs.readFileSync).mockImplementation((path: fs.PathOrFileDescriptor, options?: any) => {
      if (path === mockKeyzillaEnvPath) {
        return `
          export const k = {
            client: { "API_KEY": "clientValue" },
            server: { "SERVER_KEY": "serverValue" },
            runtimeEnv: { "API_KEY": process.env.API_KEY, "SERVER_KEY": process.env.SERVER_KEY }
          };
        `
      }
      return ""
    })
    vi.mocked(fs.writeFileSync).mockImplementation(() => {})

    // Mock path.join
    vi.mocked(path.join).mockImplementation((...args) => args.join("/"))

    // Mock glob
    vi.mocked(globModule.glob).mockResolvedValue(["file1.ts", "file2.js"])
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it("should process env.ts and update files", async () => {
    await removeKeyzilla()

    // This expectation should now pass
    expect(fs.readFileSync).toHaveBeenCalledWith(mockKeyzillaEnvPath, "utf-8")

    // Check if files were processed
    expect(globModule.glob).toHaveBeenCalledWith("**/*.{ts,js,tsx,jsx}", { ignore: ["**/node_modules/**", "**/dist/**"] })
    expect(fs.readFileSync).toHaveBeenCalledWith("/mock/project/root/file1.ts", "utf-8")
    expect(fs.readFileSync).toHaveBeenCalledWith("/mock/project/root/file2.js", "utf-8")

    // Check if .env file was created
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockEnvPath, "API_KEY=process.env.API_KEY\nSERVER_KEY=process.env.SERVER_KEY")

    // Check if .gitignore was updated
    expect(fs.readFileSync).toHaveBeenCalledWith(mockGitignorePath, "utf-8")
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockGitignorePath, expect.stringContaining(".env"))
  })

  it("should handle errors when env.ts is not found", async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    await removeKeyzilla()

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error finding keyzilla env.ts:", expect.any(Error))
  })

  it("should handle errors when parsing env.ts fails", async () => {
    vi.mocked(fs.readFileSync).mockReturnValueOnce("invalid content")
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    await removeKeyzilla()

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error parsing env.ts:", expect.any(Error))
  })
})
