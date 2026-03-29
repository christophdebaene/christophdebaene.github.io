# Git

## Key Commands

`git init` : Initialize a Git repository *(only required once per project)*
`git add <file(s)>` Stage code changes *(for the next commit)*
`git commit -m "..."`: Create a commit for the staged changes *(with a message)*
`git status` : Get the current repository status *(e.g. which changes are staged)*
`git log`: Output a chronologically ordered list of commits
`git checkout <id>`: Temporarily move back to commit <id>
`git revert <id>`: Revert the changes of commit <id> *(by creating a new commit)*
`git reset <id>`: Undo commit's up to commit <id> by deleting commits

`git reset --hard`

in Vim to quit type :wq

git branch feature-restructure
git branch
git checkout feature-restructure
git branch -D feature-restructure // delete


git checkout -b feature-restructure // directly checkout and create a branch
git add .

git checkout master
git merge feature-restructure
