# Submission for mid level cloud native engineer assignment

## My Solution

This repository has been built to show my understanding of how the given objective could be built with a focus on cloud native techniques. Due to time constraints it does not show production ready code.

### Known Issues

- There are no automated tests.
- There is no validation for form data, or feedback to the user showing them any issues or errors with form fields.
- There is no logout function.
- There is a lack of parametrisation to allow for a build pipeline into various testing and staging enviroments.
- There is a lack of adequate debug output to make the logs useful.
- Github actions and automated builds have not been built due to time constraints.
- calls to retrieve records from dynamodb do not take into account pagination
- Refresh tokens are not updated in the event that token rotation is required.
- There is no deduping of any eventbridge or stream events

### Notes on the solution.

#### Infastructure

- Infastructure has been built and provisioned using sst V3

#### Front End

- Front end has been build using React Router v7 ( formerly remix) with Server Side Rendering. The backend for frontend is provided by aws lambda.
- DynamoDB has been used for data storage for the users session.
- Upon a successfully login, a session is created with the session information being stored in DynamoDB, the session id is stored upon a secure cookie and is used to retrieve the information from the dynamodb record. The session stores the user information and the users refresh cookie.

#### OIDC Identity Provider

- Cogntio UserPool has been used as the OIDC compliant identity provider.
- Login in registration is provided by a cognito user pool client using hosted ui
- A cognito IdentityPool is used to provide authenticated users with access to restricted aws resources such as certain api endpoints

#### API

- A simple API has been built using APIGatewayV2, it offers two routes
- The first route is a publicly available `List` endpoint to retrieve approved posts
- The second is a protected route to create new posts. The Create route is protected via an iam authorizer.
- The Create post frontend page can only be accessed by a logged in user.
- To access the `Create` endpoint The authenticated users stored refresh token is used to retrieve a fresh id token, this is exchanged for credentials which are used to sign the request being sent to the protected create route.

#### Approval service

- The EventBridge option for the approval service has been implemented.
- A dynamoDB stream with a filter for INSERT events is used to pass an `ApprovalRequest` event to the event bridge. The `ApprovalRequest` contains the newly created record
- A mock approval service has been created, the service waits 10 seconds before generating an `ApprovalResponse` event. ( This mock service always approves posts ). The approval response consists of the posts record id and whether the post has been approved or not
- A function subscribed to the `ApprovalResponse` event is responsable for updating the dynamodb record in the case of the post being approved or deleting it in the case it has not been.

#### Archiving Posts

- The posts table in dynamodb has ttl enabled with the expires field of the record being set 30 days in the future.
- Upon a record being removed a stream event is sent to a lambda filtered for ttl events. the lamba takes the record that is being deleted and writes it to a seperate archives table.
