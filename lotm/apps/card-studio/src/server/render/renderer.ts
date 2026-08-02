import React from 'react'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server.node'
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { type CardContent, toBuilderCardState } from '../../domain/schema'
import {
  CARD_STUDIO_ROOT,
  createRenderAssets,
  FONT_STYLESHEET,
  resolveStateImages,
  type RenderAssets,
} from './assets'
import { CardMarkup } from './html'

export class CardPngRenderer {
  private constructor(
    private readonly browser: Browser,
    private readonly context: BrowserContext,
    private readonly page: Page,
    private readonly assets: RenderAssets,
    private readonly publicDir: string,
  ) {}

  static async create(projectRoot = process.env.CARDS_PROJECT_ROOT || CARD_STUDIO_ROOT): Promise<CardPngRenderer> {
    const root = path.resolve(projectRoot)
    const assets = await createRenderAssets(root)
    const publicDir = path.join(root, 'public')

    let browser: Browser
    try {
      browser = await chromium.launch({
        headless: true,
        executablePath: process.env.CARDS_BROWSER_EXECUTABLE_PATH || undefined,
      })
    } catch (error) {
      throw new Error(
        'No se pudo iniciar Chromium. Ejecuta `npm run cards:browser` o define CARDS_BROWSER_EXECUTABLE_PATH.',
        { cause: error },
      )
    }

    const context = await browser.newContext({
      viewport: { width: 1_200, height: 900 },
      deviceScaleFactor: 2,
    })
    const page = await context.newPage()
    return new CardPngRenderer(browser, context, page, assets, publicDir)
  }

  async render(content: CardContent): Promise<Buffer> {
    const state = await resolveStateImages(toBuilderCardState(content), this.publicDir, this.assets.defaultCover)
    const markup = renderToStaticMarkup(
      React.createElement(CardMarkup, { state, icons: this.assets.icons }),
    )
    await this.page.setContent(
      `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <link rel="stylesheet" href="${FONT_STYLESHEET}">
          <style>${this.assets.css}</style>
          <style>html,body{margin:0;width:100%;min-height:100%;}body.builder-root{display:flex;align-items:flex-start;justify-content:flex-start;}</style>
        </head>
        <body class="builder-root">${markup}</body>
      </html>`,
      { waitUntil: 'networkidle', timeout: 30_000 },
    )
    await this.page.evaluate(async () => {
      await document.fonts?.ready
      await Promise.all(
        [...document.images].map((image) =>
          image.complete ? Promise.resolve() : image.decode().catch(() => undefined),
        ),
      )
    })
    return this.page.locator('#card').screenshot({ type: 'png', animations: 'disabled' })
  }

  async close(): Promise<void> {
    await this.context.close()
    await this.browser.close()
  }
}
