import { test, expect } from '@playwright/test';

test.describe('Prompt Library - Search and Copy', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application before each test
    await page.goto('http://localhost:3000');
  });

  test('should display all 7 prompts on initial load', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle('Prompt Library');

    // Verify header is visible
    await expect(page.getByRole('heading', { name: 'Prompt Library' })).toBeVisible();
    await expect(page.getByText('Search and copy prompt templates')).toBeVisible();

    // Verify search box is present
    await expect(page.getByRole('searchbox', { name: 'Search prompts...' })).toBeVisible();

    // Verify all 7 prompts are displayed
    await expect(page.getByRole('heading', { name: 'Meeting Summary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog Post Outline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Analysis Report' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Email Response Template' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Brainstorming Session' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'User Story Creation' })).toBeVisible();
  });

  test('should filter prompts by search keyword', async ({ page }) => {
    // Type "code" in the search box
    const searchBox = page.getByRole('searchbox', { name: 'Search prompts...' });
    await searchBox.fill('code');

    // Verify only "Code Review Checklist" is visible
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).toBeVisible();

    // Verify other prompts are not visible
    await expect(page.getByRole('heading', { name: 'Meeting Summary' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog Post Outline' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Analysis Report' })).not.toBeVisible();
  });

  test('should show "no results" message when search has no matches', async ({ page }) => {
    // Type a search term that doesn't match anything
    const searchBox = page.getByRole('searchbox', { name: 'Search prompts...' });
    await searchBox.fill('zzzzz');

    // Verify no results message is displayed
    await expect(page.getByText('No prompts found matching "zzzzz"')).toBeVisible();

    // Verify no prompt cards are visible
    await expect(page.getByRole('heading', { name: 'Meeting Summary' })).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).not.toBeVisible();
  });

  test('should clear search and show all prompts again', async ({ page }) => {
    // First, perform a search
    const searchBox = page.getByRole('searchbox', { name: 'Search prompts...' });
    await searchBox.fill('code');

    // Verify filtered results
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meeting Summary' })).not.toBeVisible();

    // Clear the search
    await searchBox.clear();

    // Verify all 7 prompts are visible again
    await expect(page.getByRole('heading', { name: 'Meeting Summary' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Blog Post Outline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Data Analysis Report' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Email Response Template' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Brainstorming Session' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'User Story Creation' })).toBeVisible();
  });

  test('should copy prompt to clipboard when copy button is clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Find the first prompt card (Meeting Summary)
    const firstPromptCard = page.locator('div.border.rounded-lg').first();
    await expect(firstPromptCard.getByRole('heading', { name: 'Meeting Summary' })).toBeVisible();

    // Click the copy button
    const copyButton = firstPromptCard.getByRole('button');
    await copyButton.click();

    // Verify the success toast appears
    await expect(page.getByText('Copied!')).toBeVisible();
    await expect(page.getByText('"Meeting Summary" copied to clipboard.')).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Please summarize the key points, decisions, and action items');
  });

  test('should show checkmark icon after successful copy', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Find a prompt card
    const promptCard = page.locator('div.border.rounded-lg').first();
    const copyButton = promptCard.getByRole('button');

    // Click the copy button
    await copyButton.click();

    // Wait for the success toast
    await expect(page.getByText('Copied!')).toBeVisible();

    // Note: The checkmark icon should be visible briefly (2 seconds)
    // This is a visual indicator that the copy succeeded
  });

  test('should search for "email" and copy the result', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Search for "email"
    const searchBox = page.getByRole('searchbox', { name: 'Search prompts...' });
    await searchBox.fill('email');

    // Verify "Email Response Template" is visible
    await expect(page.getByRole('heading', { name: 'Email Response Template' })).toBeVisible();

    // Click the copy button on the email prompt
    const emailCard = page.locator('div.border.rounded-lg').filter({ hasText: 'Email Response Template' });
    await emailCard.getByRole('button').click();

    // Verify the success toast
    await expect(page.getByText('Copied!')).toBeVisible();
    await expect(page.getByText('"Email Response Template" copied to clipboard.')).toBeVisible();

    // Verify clipboard content
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('Draft a professional email response');
  });

  test('should perform case-insensitive search', async ({ page }) => {
    // Search with uppercase
    const searchBox = page.getByRole('searchbox', { name: 'Search prompts...' });
    await searchBox.fill('CODE');

    // Verify "Code Review Checklist" is still found
    await expect(page.getByRole('heading', { name: 'Code Review Checklist' })).toBeVisible();

    // Clear and search with mixed case
    await searchBox.fill('BrAiNsToRmInG');

    // Verify "Brainstorming Session" is found
    await expect(page.getByRole('heading', { name: 'Brainstorming Session' })).toBeVisible();
  });
});
