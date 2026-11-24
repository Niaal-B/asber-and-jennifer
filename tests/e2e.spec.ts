import { expect, test, type Page } from '@playwright/test';

const MAPS_URL = 'https://maps.app.goo.gl/hX7stQEbChDZGxU96?g_st=iw';
const YOUTUBE = /youtube\.com|ytimg\.com|googlevideo\.com|youtube-nocookie\.com/;

// Keep tests independent of the internet: block YouTube except where a test opts in.
test.beforeEach(async ({ page }, info) => {
  if (!info.title.includes('[network]')) await page.route(YOUTUBE, (r) => r.abort());
});

async function openInvitation(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.locator('.hero')).toBeVisible({ timeout: 10_000 });
}

async function openRsvp(page: Page) {
  await openInvitation(page);
  await page.getByRole('button', { name: 'RSVP here' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

test.describe('invitation flow', () => {
  test('cover shows the couple and opens the invitation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => {
      // Network errors from YouTube being blocked in tests are expected.
      if (m.type() === 'error' && !/Failed to load resource|ERR_FAILED/.test(m.text())) errors.push(m.text());
    });

    await page.goto('/');
    await expect(page.locator('.cover__names')).toContainText('Jennifer');
    await expect(page.locator('.cover__names')).toContainText('Asber');
    await openInvitation(page);
    await expect(page.locator('.cover')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('an early press-and-hold tap on Open still opens (regression)', async ({ page }) => {
    await page.goto('/');
    // Press immediately, during the entrance animation, and hold like a real finger.
    await page.getByRole('button', { name: 'Open' }).click({ delay: 120 });
    await expect(page.locator('.hero')).toBeVisible({ timeout: 10_000 });
  });

  test('shows the confirmed details exactly', async ({ page }) => {
    await openInvitation(page);
    const card = page.locator('.invite');
    await expect(card).toContainText('Asber');
    await expect(card).not.toContainText('Dr Asber');
    await expect(card).toContainText('Dr. Mohammed Saleem K.');
    await expect(card).toContainText('Dr. Fathimathul Zohara K.');
    await expect(card).toContainText('Jennifer');
    await expect(card).not.toContainText('Dr Jennifer');
    await expect(card).toContainText('Mr. Abdul Majeed Kanhirandy');
    await expect(card).toContainText('Mrs. Saira Aboobacker');
    await expect(card).toContainText('Parappan Square');
    await expect(card).toContainText('Venniyur');
    await expect(card).toContainText('Saturday');
    await expect(card).toContainText('11:30 AM');
    await expect(page.locator('.hero__date')).toHaveText('02.01.2027');
  });

  test('countdown ticks', async ({ page }) => {
    await openInvitation(page);
    const seconds = page.locator('.countdown__value').nth(3);
    const first = await seconds.textContent();
    await expect.poll(async () => seconds.textContent(), { timeout: 3000 }).not.toBe(first);
  });

  test('venue links to the provided Google Maps location', async ({ page }) => {
    await openInvitation(page);
    const link = page.getByRole('link', { name: /google map/i });
    await expect(link).toHaveAttribute('href', MAPS_URL);
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('footer credits the designer on Instagram', async ({ page }) => {
    await page.goto('/');
    const link = page.getByRole('link', { name: '@niaal._' });
    await expect(link).toHaveAttribute('href', 'https://www.instagram.com/niaal._/');
    await expect(page.locator('.site-footer')).toContainText('With love, Asber & Jennifer');
  });

  test('shows contact and blessings data from references', async ({ page }) => {
    await openInvitation(page);
    await expect(page.locator('.flow')).toHaveCount(0);
    await expect(page.locator('.contact')).toBeVisible();
    await expect(page.locator('.contact')).toContainText('Dr Saleem');
    await expect(page.locator('.contact')).toContainText('+91 98461 00134');
    await expect(page.locator('.blessing')).toBeVisible();
    await expect(page.locator('.blessing')).toContainText('SAFA, ADAM, MOIDEEN');
    await expect(page.locator('.vinyl')).toHaveCount(0);
  });

  test('music player is omitted per groom preference', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await openInvitation(page);
    await expect(page.locator('.vinyl')).toHaveCount(0);
    await expect(page.locator('.invite')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('back to top returns to the hero', async ({ page }) => {
    await openInvitation(page);
    await page.getByRole('button', { name: 'Back to top' }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBeLessThan(5);
  });
});

test.describe('RSVP', () => {
  test('validates required fields before sending', async ({ page }) => {
    let called = false;
    await page.route('**/api/rsvp', (r) => ((called = true), r.fulfill({ json: { ok: true } })));
    await openRsvp(page);
    await page.getByRole('button', { name: 'Send RSVP' }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    await expect(page.getByText('Please let us know if you can attend.')).toBeVisible();
    expect(called).toBe(false);
  });

  test('submits successfully and remembers the response', async ({ page }) => {
    let sent: Record<string, unknown> = {};
    await page.route('**/api/rsvp', async (r) => {
      sent = r.request().postDataJSON();
      await new Promise((res) => setTimeout(res, 400));
      await r.fulfill({ json: { ok: true } });
    });
    await openRsvp(page);
    await page.getByLabel('Your name').fill('Fathima Rahman');
    await page.getByText('Joyfully accept').click();
    await page.getByRole('button', { name: 'More guests' }).click();
    await page.getByLabel(/message to the couple/i).fill('Congratulations!');
    await page.getByRole('button', { name: 'Send RSVP' }).click();

    await expect(page.getByRole('button', { name: /sending/i })).toBeDisabled();
    await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible();
    expect(sent).toMatchObject({ name: 'Fathima Rahman', attendance: 'attending', guests: 2, message: 'Congratulations!', website: '' });
    expect(String(sent.submissionId)).toMatch(/^[0-9a-f-]{36}$/);

    await page.getByRole('button', { name: 'Close' }).first().click();
    await expect(page.locator('.rsvp__lines')).toContainText('Your response has been received');
    await expect(page.locator('.rsvp__lines')).not.toContainText('Fathima');
    await page.reload();
    await page.getByRole('button', { name: 'Open' }).click();
    await expect(page.getByRole('button', { name: 'Update RSVP' })).toBeVisible();
  });

  test('declining hides the guest count and sends 0 guests', async ({ page }) => {
    let sent: Record<string, unknown> = {};
    await page.route('**/api/rsvp', async (r) => {
      sent = r.request().postDataJSON();
      await r.fulfill({ json: { ok: true } });
    });
    await openRsvp(page);
    await page.getByLabel('Your name').fill('Ameen');
    await page.getByText('Joyfully accept').click();
    await expect(page.getByText('Number of guests')).toBeVisible();
    await page.getByText('Regretfully decline').click();
    await expect(page.getByText('Number of guests')).toHaveCount(0);
    await page.getByRole('button', { name: 'Send RSVP' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible();
    expect(sent).toMatchObject({ attendance: 'not_attending', guests: 0 });
  });

  test('shows a server error and retries with the same submission id', async ({ page }) => {
    const ids: string[] = [];
    let attempt = 0;
    await page.route('**/api/rsvp', async (r) => {
      ids.push(r.request().postDataJSON().submissionId);
      attempt++;
      if (attempt === 1) await r.fulfill({ status: 502, json: { ok: false, error: 'upstream_error' } });
      else await r.fulfill({ json: { ok: true } });
    });
    await openRsvp(page);
    await page.getByLabel('Your name').fill('Fathima Rahman');
    await page.getByText('Joyfully accept').click();
    await page.getByRole('button', { name: 'Send RSVP' }).click();
    await expect(page.getByRole('alert')).toContainText("couldn't save your response");
    await page.getByRole('button', { name: 'Try again' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible();
    expect(ids).toHaveLength(2);
    expect(ids[0]).toBe(ids[1]);
  });

  test('handles a network failure', async ({ page }) => {
    await page.route('**/api/rsvp', (r) => r.abort('internetdisconnected'));
    await openRsvp(page);
    await page.getByLabel('Your name').fill('Fathima Rahman');
    await page.getByText('Regretfully decline').click();
    await page.getByRole('button', { name: 'Send RSVP' }).click();
    await expect(page.getByRole('alert')).toContainText("couldn't reach the server");
  });

  test('end-to-end through the real proxy code (dev mock upstream)', async ({ page }) => {
    await openRsvp(page);
    await page.getByLabel('Your name').fill('Proxy Test');
    await page.getByText('Joyfully accept').click();
    await page.waitForTimeout(3100); // stay above the anti-bot minimum fill time
    const response = page.waitForResponse('**/api/rsvp');
    await page.getByRole('button', { name: 'Send RSVP' }).click();
    const res = await response;
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual({ ok: true, duplicate: false });
    await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible();
  });

  test('Escape closes the dialog', async ({ page }) => {
    await openRsvp(page);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

test.describe('layout', () => {
  for (const width of [360, 390, 768, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 860 });
      await page.goto('/');
      const coverOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(coverOverflow).toBeLessThanOrEqual(0);
      await page.getByRole('button', { name: 'Open' }).click();
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('invitation text stays inside the frame at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openInvitation(page);
    const fits = await page.locator('.invite .frame__content').evaluate((el) => el.scrollHeight <= el.clientHeight + 1);
    expect(fits).toBe(true);
  });
});
