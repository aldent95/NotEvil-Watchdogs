This readme will likely be added to over the weeks, and if you have any questions, ask or goodgle and update the readme.

General guidelines:
Do all your work on a branch and never push to master.
Keep commit message titles to less than 50 characters, followed by a blank line, then the message between 50-70 charcters per line.
Once you are 'done' with your branch, setup a pull request via the github website.


A quick easy command to setup Nano as your default editor for commits:
git config --global core.editor "nano"


Basic commands:

To get the most recent data from the git repo:
git pull

To check which files you have changed:
git status

To check the difference for un-added files compared to the last commit:
git diff

To check the difference for a specific un-added file compared to the last commit:
git diff <file path>
git diff directory_name/some_file.py

To add a specific file to be commited:
git add <file path>
git add directory_name/some_file.py

To add ALL files. Be careful with this. Also, use this over "git add ." as the dot may ignore .gitignore settings
git add -A 

Make a git commit and open your default editor to write the message:
git commit

Make a commit with the set message:
git commit -m "commit message"

To send your commits to the remote repo (see pushing of branches, as this can become complicated):
git push


Branching commands:

Change to a different existing branch:
git checkout <branch name>
git checkout master

Change to a new branch (will create the new branch):
git checkout -b <new branch name>
git checkout -b new_branch

Create and push the branch to the remote repo (after this "git push" works for following commits):
git push --set-upstream origin <branch name>
git push --set-upstream origin my_branch

Delete a git branch (once it has been merged on github and deleted):
git branch -D <branch name>
git branch -D my_branch

To update your branch with the changes from master, and replace your commits on top of those changes (more info about using git rebase will be given over time, please get me to help you for your first rebase or two):
git rebase master
