# Git Wrapped 


## File structure

- app/wrap-git-project
  - lib/wrap-git-project-cli
  - lib/wrap-git-project
- app/wrapped-project-website
  - lib/wrapped-project-ui
  - lib/wrapped-project

## Architecture

                            ┌─────────┐
                            │ GitRepo │
                            └────┬────┘
                                 │ unfold
          ┌──────────────────────┼────────────────────┐
          ▼                      ▼                    ▼
     ┌──────────┐          ┌──────────┐          ┌──────────┐ 
     │ Commit 1 │          │ Commit 2 │          │ Commit 3 │ 
     └──────────┘          └──────────┘          └──────────┘ 
           │                     │                     │
           └─────────────────────┼─────────────────────┘
                                 │ 
                                 │ fold (\acc curr -> [statisticUnfolder] <*> (acc, curr))
                                 │ 
                                 ▼                      
                           ┌────────────┐               
                           │ GitWrapped │               
                           └────────────┘               
                                 │ unfold
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
     ┌─────────────┐       ┌─────────────┐     ┌─────────────┐ 
     │ Statistic 1 │       │ Statistic 2 │     │ Statistic 3 │ 
     └─────────────┘       └─────────────┘     └─────────────┘ 

