# Branch Protection Setup for Main Branch

This guide explains how to require approved pull requests before merging to the `main` branch.

## GitHub Branch Protection Rules

Follow these steps to protect your main branch:

### Step 1: Access Branch Protection Settings
1. Go to your repository: https://github.com/Silver-Hornets-21331/SilverHornets
2. Click **Settings** (top navigation bar)
3. Click **Branches** (left sidebar under "Code and automation")
4. Under "Branch protection rules", click **Add rule** (or **Add branch protection rule**)

### Step 2: Configure Protection Rules
1. **Branch name pattern**: Enter `main`
2. **Enable the following settings**:

   ✅ **Require a pull request before merging**
   - Check this box to prevent direct pushes to main
   - This will require all changes to go through a PR
   
   ✅ **Require approvals**
   - Set "Required number of approvals before merging" to `1` (or more)
   - This ensures at least one team member reviews changes
   
   ✅ **Dismiss stale pull request approvals when new commits are pushed**
   - Recommended: Ensures fresh reviews after new changes
   
   ✅ **Require status checks to pass before merging** (Optional)
   - Select "Require branches to be up to date before merging"
   - Select the "Validate PR" check (from our workflow)
   
   ✅ **Require conversation resolution before merging** (Optional)
   - All PR comments must be resolved before merging
   
   ✅ **Include administrators** (Recommended)
   - Apply these rules even to repository administrators
   - Ensures consistent workflow for all team members

3. Click **Create** (or **Save changes**)

### Step 3: Verify Protection is Active
1. Try to push directly to main: `git push origin main`
2. You should receive an error message
3. This confirms protection is working!

## Workflow for Making Changes

With branch protection enabled, here's the new workflow:

### 1. Create a Feature Branch
```powershell
git checkout -b feature/my-new-feature
```

### 2. Make Your Changes
Edit files, test locally, commit your changes:
```powershell
git add .
git commit -m "Description of changes"
```

### 3. Push Your Branch
```powershell
git push origin feature/my-new-feature
```

### 4. Create a Pull Request
1. Go to your repository on GitHub
2. Click **Pull requests** tab
3. Click **New pull request**
4. Select `main` as base branch and your feature branch as compare branch
5. Fill in the PR description
6. Click **Create pull request**

### 5. Request Review
1. On the PR page, click **Reviewers** in the right sidebar
2. Select a team member to review
3. Wait for approval

### 6. Merge After Approval
Once approved and all checks pass:
1. Click **Merge pull request**
2. Click **Confirm merge**
3. Optionally, delete the feature branch

## Automated PR Checks

The `.github/workflows/pr-checks.yml` workflow automatically runs on every PR:
- ✓ Validates HTML files
- ✓ Checks for required files
- ✓ Detects broken links
- ✓ Validates JSON syntax

## Emergency Override (Administrators Only)

If you need to bypass protection in an emergency:
1. Go to Settings → Branches
2. Click **Edit** on the main branch rule
3. Temporarily uncheck protection rules
4. Make your changes
5. **Re-enable protection immediately after**

⚠️ **Note**: Bypassing protection should only be done in genuine emergencies!

## Benefits of This Setup

✅ **Code Quality** - All changes are reviewed before merging
✅ **Team Collaboration** - Promotes discussion and knowledge sharing
✅ **Error Prevention** - Catches mistakes before they reach main
✅ **Audit Trail** - All changes documented in PR history
✅ **Safe Rollback** - Easy to revert problematic changes

## Troubleshooting

**Q: Can't push to main even after creating PR?**
A: That's correct! You shouldn't push to main directly. Push to your feature branch instead.

**Q: Need to update PR after feedback?**
A: Just commit and push to the same feature branch. The PR updates automatically.

**Q: Accidentally committed to main locally?**
A: Create a new branch from main, reset main to origin/main, then push your new branch:
```powershell
git branch feature/my-changes
git checkout main
git reset --hard origin/main
git checkout feature/my-changes
git push origin feature/my-changes
```

## Next Steps

1. Set up branch protection rules following Step 1 and 2 above
2. Test the workflow by creating a test PR
3. Train team members on the new workflow
4. Consider adding a CODEOWNERS file for automatic reviewer assignment

---

For questions, contact the repository administrators or refer to [GitHub's official documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches).
