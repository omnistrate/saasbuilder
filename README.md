This is the Omnistrate Access UI, built in [Next.js](https://nextjs.org/), project was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Prerequisite

Configure your organization details in the profile section on Omnistrate. These details will be shown to the customers  accesing this application  

![Alt text](https://drive.google.com/uc?id=1R0Ee8sBmHUwDo1StN15TO-TSJCQGzNX2 "org-configuration")
| Service Provider Details    | Description |
| -------- | ------- |
| Organization Name  | Name of your organization     |
| Organization Description | Description of your organization     |
| Organization Support Email    | Email address to which customers can reach out for support   |
| Organization Logo URL    |  Your organization's logo URL   |
| Organization Favicon URL    |  Your organization's favicon URL   |


## Getting Started

Install dependencies:

```bash
yarn install
```

Before running the development server ,configure these environment variables in .env.local file:


| Organization Details    | Description |
| -------- | ------- |
| PROVIDER_EMAIL  | Omnistrate account email    |
| PROVIDER_HASHED_PASS | Omnistrate account password hashed using SHA256    |
| NEXT_PUBLIC_DOMAIN_URL    | The secure domain URL where this application will be deployed eg. https://www.yourcloud.com   |
| MAIL_USER_EMAIL    |  Gmail account to be used to send mails (signup, reset password etc) to your customers   |
| MAIL_USER_PASSWORD    | Gmail account app password   |


Run the development server:

```bash
yarn dev
```

To Build the code:

```bash
yarn build
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy to Omnistrate Platform

The SaasBuilder application can be deployed easily on Omnistrate platform. If you have not customized the SaaSBuilder, you should be able to use the docker image from Omnistrate and deploy it. However if you have customized SaaSBuilder, then you need to build the custom image and use it to deploy it on Omnistrate. Here are the steps for both scenarios - 

#### No customization - 
- If you havent made any custom changes, creating an Omnistrate hosted service is simple, refer to the following video https://www.youtube.com/watch?v=oYhxQIjdbAc
- Use the saasbuilder-docker-compose.yaml to deploy and create the service for SaaSBuilder app.
- Access the application by navigating to the cluster endpoint in your browser.

#### Customized SaaSBuilder - 
- If you have made the custom changes, you need to first publish your docker image
- Then update the saasbuilder-docker-compose.yaml with your image details
- Refer to the following video https://www.youtube.com/watch?v=oYhxQIjdbAc
- Use the updated saasbuilder-docker-compose.yaml to deploy and create the service for SaaSBuilder app
- Access the application by navigating to the cluster endpoint in your browser.


