# Championship project

# Proposal

This is a empty project, so I wanna configure this project by steps.
Initially I wanna configure the architecture.
This will be a project to manage a soccer championship.

I’ll give you technical and non-technical requirements and request to me more information if you consider if is necessary.

## Non-technical

### Teams

- We will have a list of teams
- Each team should have a undefined number of players
- Each team should have a flag and name to differentiate
- Also should have one captain

### Soccer matches

- This should be soccer schedule, where we can see which team will play against which team
- Championship should start in a league phase initially (everyone vs everyone) and admin members can enable or disable group phase.
- If group phase is enable, it should recognize first 4 teams at the position table and creates a groups for the group phase.

### Positions table

- Here we calculate: played matches, accumulated points, diff goals, positive goals, negative goals and position based on the points and diff goals.
- Table should update based on the soccer matches played.

## Techical

### Project architecture and patterns

- Project should follow good practices and avoid code smell practices.
- Follow SOLID principles, POO and clean code strictly.
- Always where you use data, it should be isolated to a only one data source. Avoid multiple instances for managing data.
- Project must be implemented in RemixJS framework as monolith.
- Use Facade pattern to isolate HTTP library
- Use Adapter pattern to map variables before sending and after receiving.
- In Front side, manage the structure with Container/Presentational Pattern
- In Backend side, if you use APIs, manage it through good practices for API RESTful
- Use an global way to displays a user-friendly errors
- Only administrators can manipulate project’s data.
- Project can be available for public users but only read data.
- Authentication should be available through Whatsapp code validation, I’ll prove to you the token later on.
- It must enable CORS to accept request from the frontend if it is necessary.
- Database should use PostgreSQL.