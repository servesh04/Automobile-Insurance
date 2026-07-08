## **Vehicle Insurance System** 

## **Problem statement:** 

Imagine you are working for an insurance company that wants to modernize its operations by developing a comprehensive Insurance Management System for automobiles. The goal is to create a web-based application that allows users to manage policies, claims, and customer information efficiently. 

## **Scope:** 

1. **List available policies** : Home page shows the available vehicle insurance policies and the description of company with user reviews. Shows statistical data of number of policies active and number of claims served. 

2. **Proposal Submission:** Users can register and login in the application. Users can submit their vehicle insurance policy proposals for categories of vehicles like truck, motorcycle or camper van. 

Status of policy is proposal submitted. 

3. **Proposal review:** Insurance team reviews the proposal form and approves based on guidelines. 

   - Proposal team can request the applicant for additional details and documents and approve or reject the policy. Status of policy is changed to quote generated. 

4. **Sending Quotes:** Once a policy is submitted quote will be emailed with details of premium to be paid. Quote should be based on the policy package selected and add-ons selected based on defined business logic and appropriate calculations should be incorporated in the business logic of premium calculations. 

5. **Premium payment:** Users can complete the payment based on quote. Once the payment is done, officers can change policy status to active .User gets a copy of policy document through email. 

6. **Track policy status:** There are status like proposal submitted, quote generated, active, expired 

7. **Premium reminder email:** Application sends out an email to the policy holder one week before policy is about to expire. 

## **Technologies:** 

- Frontend: React.js / Angular Js. 

- Backend: Java, Spring Boot/C#, .Net / Python Djnago for API development. 

- Database: MySql / Sql Server. 

- Authentication: JSON Web Tokens (JWT) for secure user authentication. 

Reference Link: Tricents Vehicle Insurance 

Car Insurance - Buy Four Wheeler Policy Online @Best Price (bajajallianz.com) 

## **Use case Diagram:** 

## **Actor:  User** 

- Use Case: Register Account 

- Use Case: Log In 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

- Use Case: **Proposal Submission** 

   - Create new Proposal for policy of vehicle insurance. 

   - View the status of proposal. 

   - Complete the  payment when quote is submitted. 

- Use Case: Check status of policy and Download policy document 

- Use Case: Log Out 

## **Actor: Officer** 

- Use Case: Log In 

- Use Case:  Manage proposal documents. 

   - Request for additional information/document from user. 

   - Approve the proposal form and make the policy status as active. 

- Use Case: Log Out 

## **System: Security and Authentication** 

- Use Case: Authenticate User 

## **Associations:** 

- User creates proposal (Create incident, Check status). 

- Officer can approve or reject the policy proposal 

- Officer can verify the submitted documents and request for payment. 

- Officer can approve the payment and change the status to verified 

- Officer can approve or reject the proposal. 

- Officer can add new policy with features and add ons 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

## **Development Process:** 

**1. User Registration and Login:** 

   - Users can create accounts, providing personal details (Name, Address, Date of birth, aadhaar number, age should be calculated from DOB, PAN number ) 

   - The system validates the information and creates user profiles. 

   - Users log in using their credentials (username/email and password). 

## **2. User Dashboard and Policy proposal:** 

Users can log in to profile and access the proposal management section which has the following functionalities. 

- **Create new  proposal for vehicle insurance policy** (car/bike/camper van) 

   - Proposal form duly filled will be submitted to officers of insurance company for the review. 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

      - Status of policy is to be displayed to the user and user can track the status through the stages.( like **proposal submitted, quote generated, active, expired** 

      - **Once the officer receives the proposal form, he can request fir additional data or documents needed if any. If the prososl seems in accordance with the prerequistes of policy, Officer can approve it and generate the quote based on the underlying business logic.** 

      - Each policy should be assigned a unique id and should be emailed to user upon successful payment as policy document which includes the details of policy. Downloadable pdf to be generated upon successful incident creation. Each incident will should be automatically assigned with a status **initiated** upon successful creation. 

      - **View  all policies** : User should be able to track all the policies assigned to the him with highlighted status.( **proposal submitted, quote generated, active, expired** ) 

   - **Premium payment:** Users can complete the payment based on a quote. Once the payment is done, officers can change policy status to active. User gets a copy of policy document through email. 

**3. Officer Dashboard and Policy Management:** 

Officer can approve or reject the policy proposal. 

Officer can verify the submitted documents and request for payment. 

Officer can approve the payment and change the status to verified 

Officer can approve or reject the proposal. 

Officer can add new policy with features and add ons 

## **Functionalities** 

## **User Authentication and Authorization:** 

Design a secure login system for both customers and administrators. 

Implement role-based access control to ensure that only authorized users can perform specific actions. 

## **Customer Management:** 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

Allow users to create and manage their profiles with personal information. Implement a feature for customers to view and edit their contact details. 

## **Policy Management:** 

Design a system to create, view, and edit insurance policies by the officer 

Include features such as policy renewal and cancellation. 

## **Claim Processing:** 

Develop a claim management system where users can file new claims. 

Implement a workflow for claim processing, including validation, approval, and rejection. 

Allow users to track the status of their claims. 

## **Premium Calculation:** 

Create a module to calculate insurance premiums based on various factors (e.g., age of vehicle, coverage type, risk factors). 

Implement a dynamic pricing model that can be adjusted based on real-time data. 

## **Policy Documents and Communication:** 

Enable users to access and download policy documents. 

Implement a communication system to send alerts and notifications to customers about policy updates, renewals, and claims. 

## **Security and Compliance:** 

- User authentication and authorization are enforced to ensure data privacy. 

## **1. JWT Authentication:** 

JWT authentication involves generating a token upon successful user login and sending it to the client. The client includes this token in subsequent requests to authenticate the user. 

- User Login: Upon successful login (using valid credentials), generate a JWT token on the server. 

- Token Payload: The token typically contains user-related information (e.g., user ID, roles, expiration time). 

- Token Signing: Sign the token using a secret key known only to the server. This ensures that the token hasn't been tampered with. 

- Token Transmission: Send the signed token back to the client as a response to the login request. 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

- Client Storage: Store the token securely on the client side (e.g., in browser storage or cookies). 

## **2. JWT Authorization:** 

JWT authorization involves checking the token on protected routes to ensure that the user has the required permissions. 

- Protected Routes: Define routes that require authentication and authorization. 

- Token Verification: 

   1. Extract the token from the request header. 

   2. Verify the token's signature using the server's secret key. 

- Payload Verification: 

   1. Decode the token and extract user information. 

   2. Check user roles or permissions to determine access rights. 

- Access Control: Grant or deny access based on the user's roles and permissions. 

## **Logout:** 

- Logging out involves invalidating the JWT token on both the client and the server to prevent further unauthorized requests. 

## **Project Development Guidelines** 

The project to be developed based on the below design considerations. 

|**1**|**Backend Development**|•<br>Use Rest APIs (Springboot/ASP.Net Core WebAPI to develop the<br>services<br>•<br>Use Java/C# latest features.<br>•<br>Use ORM with database.<br>•<br>perform backend data validation.<br>•<br>Use Swagger to invoke APIs.<br>•<br>Implement API Versioning.<br>•<br>Implement security to allow/disallow CRUD operations.<br>•<br>Message input/output format should be in JSON (Read the values<br>from the property/input files, wherever applicable). Input/output<br>format can be designed as per the discretion of the participant.<br>•<br>Any error message or exception should be logged and should be<br>user-readable (not technical).<br>•<br>Database connections and web service URLs should be<br>configurable.<br>•<br>Implement Unit Test Project for testing the API.<br>•<br>Implement JWT for Security.<br>•<br>Implement Logging.|
|---|---|---|



© Hexaware Technologies Limited. All rights 

www.hexaware.com 

## welts 

• Follow Coding Standards with proper project structure. 

## **Frontend Constraints** 

|1.|**Layout and Structure**|Create a clean and organized layout for your registration and login<br>pages. You can use a responsive grid system (e.g., Bootstrap or<br>Flexbox)to ensureyour design looksgood on various screen sizes.|
|---|---|---|
|2|**Visual Elements**|**Logo:**Place your application's logo at the top of the page to establish<br>brand identity.|
|||**Form Fields:**Include input fields for email/username and password<br>for both registration and login. For registration, include additional<br>fields like name andpossiblyapassword confirmation field.|
|||**Buttons:**Design attractive and easily distinguishable buttons for<br>"Register," "Login," and "Forgot Password"(if applicable).|
|||**Error Messages:**Provide clear error messages for incorrect login<br>attempts or registration errors.|
|||**Background Image:**Consider using a relevant background image to<br>add visual appeal.|
|||**Hover Effects:**Change the appearance of buttons and links when<br>users hover over them.|
|||**Focus Styles:**Applyfocus styles to form fields when theyare selected|
|3.|**Color Scheme and**<br>**Typography**|Choose a color scheme that reflects your brand and creates a visually<br>pleasing experience. Ensure good contrast between text and<br>background colors for readability. Select a legible and consistent<br>typographyfor headings and bodytext.|
|4.|**Registration**<br>**Page/Add Bank**<br>**Employee**|**Form Fields:**Include fields for users to enter their name, email,<br>password, and any other relevant information. Use placeholders and<br>labels toguide users.|
|||**Validation:**Implement real-time validation for fields (e.g., check email<br>format) and provide immediate feedback for any errors.<br>**Form Validation:**Implement client-side form validation to ensure<br>required fields are filled out correctlybefore submission.|
|||**Password Strength:**Provide real-time feedback on password strength<br>using indicators or text.<br>**Password Requirements**: Clearly indicate password requirements<br>(e.g., minimum length, special characters) to help users create strong<br>passwords.|
|||**Registration Success:**Upon successful registration, redirect users to<br>the loginpage.|
|5.|**Login Page:**<br>**Customer/Bank**<br>**Employee**|**Form Fields:**Provide fields for users to enter their email and<br>password.|
|||**Password Recovery**: Include a "Forgot Password?" link that allows<br>users to reset theirpassword.|
|6.|**Common to**<br>**React/Angular**|•<br>Use Angular/React to develop the UI.<br>•<br>Implement Forms, data binding, validations, error message in<br>required pages.<br>•<br>Implement Routingand navigations.|



© Hexaware Technologies Limited. All rights 

www.hexaware.com 

|||•<br>Use JavaScript to enhance functionalities.<br>•<br>Implement External and Custom JavaScript files.<br>•<br>Implement Typescript for Functions Operators.<br>•<br>Any error message or exception should be logged and should be<br>user-readable (and not technical).<br>•<br>Follow coding standards.<br>•<br>Follow Standard project structure.<br>•<br>Design your pages to be responsive so they adapt well to different<br>screen sizes,includingmobile devices and tablets.|
|---|---|---|



**Good to have implementation features:** 

- Generate a SonarQube report and fix the required vulnerability. 

- Use the Moq framework as applicable. 

- Create a Docker image for the frontend and backend of the application . 

- Implement OAuth Security. 

- Implement design patterns. 

- Deploy the docker image in AWS EC2 or Azure VM. 

- Build the application using the AWS/Azure CI/CD pipeline. Trigger a CI/CD pipeline when code is checked-in to GIT. The check-in process should trigger unit tests with mocked dependencies. 

- Use AWS RDS or Azure SQL DB to store the data. 

© Hexaware Technologies Limited. All rights 

www.hexaware.com 

