This is the Omnistrate Access UI, built in [Next.js](https://nextjs.org/), project was bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Prerequisite

Configure your organization details in the profile section on Omnistrate. These details will be shown to the customers  accesing this application  

![Alt text](https://drive.google.com/uc?id=1R0Ee8sBmHUwDo1StN15TO-TSJCQGzNX2 "org-configuration")
| Environment Variable    | Description |
| -------- | ------- |
| Organization Name  | Name of your organization     |
| Organization Description | Description of your organization     |
| Organization Support Email    | Email address to which customers can reach out for support   |
| Organization Logo URL    |  Your organization's logo URL   |



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



