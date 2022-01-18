# git CLI Commands

## Switching Branches

To switch to a branch that already exists:

```bash
git checkout [branch name]
```

To switch to and create new branch that doesn't already exits:

```bash
git checkout -b [branch name]
```

This will create a local branch, the first time you attempt to `push` it up you will get an error that tells you the correct command to run:

```bash
git push --set-upstream origin [branch name]
```

By default new branches will clone the default repository branch giving you a copy of the code to start from. You can instruct git to clone from a different branch or even a specific commit number, see the article below the following note.

**NOTE:** The longer way to create new branches is by using `git branch [name options]` but this requires more work. Just about everything you do with the `branch` command can be done with the `checkout -b` command.

Here is an article that teaches some advanced uses of `git branch` which can also be used with `git checkout -b`: [Article](https://www.git-tower.com/learn/git/faq/create-branch/)

## Merging Branches

Switch into the branch you want to merge changes into, here I switch to the main branch and make sure I `pull` any remote changes:

```bash
git checkout main
git pull
```

Now you simply merge another branch into the main like so:

```bash
git merge [other branch name]
```

Resolve any issues if needed. A commit message will most likely auto open, complete this as needed. If no message popped up run:

```bash
git commit -m "merged [other branch name] into [branch name"
git push
```

And the merge is done. Don't forget to delete any unneeded branches.

## Deleting A Branch

Once a branch is no longer needed the following can be run from the command line; assuming you have a local copy of this branch.

```bash
// Deletes branch locally
git branch -d [branch name to delete]
// Deletes branch remotely
git push origin --delete [branch name to delete]
```
