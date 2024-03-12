# SaaSBuilder Open Source Project README

## Introduction

The SaaSBuilder project, provided by Omnistrate, is an open-source platform designed for service providers to deliver customizable SaaS solutions to end customers. It supports direct use for quick deployment or extensive customization through forking, catering to diverse provider needs. This adaptability saves significant time and costs in developing and launching SaaS offerings. Additionally, its open-source nature encourages community engagement, leading to continuous improvement, innovation, and security enhancements, benefiting from the collective expertise of developers worldwide.

## Getting Started

To get started with the SaaSBuilder open-source project, begin by configuring your service on the Omnistrate Platform to make it ready for use. While familiarity with Next.js and Docker enhances your ability to customize the application, lack of expertise in these areas won't hinder your ability to deploy the SaaS Builder application with basic customizations. The process involves cloning the project's repository, setting up your development environment, and configuring the necessary environment variables to tailor the application to your requirements.

### Pre-requisites

- Before starting, ensure your SaaS offering is already configured on the Omnistrate platform; for guidance, refer to this instructional video [here](https://www.youtube.com/watch?v=oYhxQIjdbAc).
- Make sure your service is marked public for customer access
- Update your Omnistrate profile with essential service and SaasBuilder configurations, including your organization's description, support email, logo, and favicon URLs.

These details are crucial as they will be presented to customers accessing your application, enhancing brand visibility and support accessibility.

![Alt text](https://drive.google.com/uc?id=1ZcxfwS1cqRNbpdGTnUSj_-SGZ4FwFosE "Organization config")

![Alt text](https://drive.google.com/uc?id=1h7Lnp_-1P-dOdD1ri0QZPi2Rd_U1LUK9 "SaaSBuilder config")

| Service Provider Details   | Description                                                |
| -------------------------- | ---------------------------------------------------------- |
| Organization Name          | Name of your organization                                  |
| Organization Description   | Description of your organization                           |
| Organization Support Email | Email address to which customers can reach out for support |
| Organization Logo URL      | Your organization's logo URL                               |
| Organization Favicon URL   | Your organization's favicon URL                            |

### Customizations

#### Mandatory Customizations

- For mandatory customizations, include configurations such as organization details (name, description, support email, logo URL, and favicon URL) directly in your Omnistrate account. These are already covered in the pre-requisites section
- Additionally, customize your service plan details to include pricing, support options, descriptions for each plan, and relevant documentation links. These elements are crucial for presenting a clear, branded, and informative interface to your customers, ensuring they have all the necessary information to select and utilize your services effectively.

![Alt text](https://drive.google.com/uc?id=1QW3RJ_eT6EIprYIagToNL0pDcUd5ZXd2 "Service plan config modify")

![Alt text](https://drive.google.com/uc?id=1ERufnIhd_YhYVTynbWYbg3FO9JxH5ucV "Service plan config details")

#### Optional Customizations

- For deeper and more comprehensive customizations, optional modifications involve altering the source code itself. This approach allows for significant changes beyond the basic settings, enabling you to tailor the application's functionality, user interface, and overall user experience to better align with your brand and customer needs. Through code customizations, you have the freedom to implement new features, optimize existing workflows, or integrate with other services, providing a truly unique solution for your users.
- When opting for deeper customizations by altering the source code, it's important to remember that maintaining your forked repository in sync with the master branch is your responsibility. This ensures that your customizations benefit from the latest updates, features, and security patches from the original project, helping maintain your application's integrity and performance over time.

## Build and Run Locally

To build and run the SaaS Builder locally

1. Clone the Repository: Use Git to clone the repository to your local machine.

```bash
git clone https://github.com/omnistrate/saasbuilder.git
```

2. Install dependencies with yarn

```bash
yarn install
```

3. Configure .env.local: Create a .env.local file in the root directory. Populate it with necessary environment variables

| Environment Variables | Description                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------- |
| PROVIDER_EMAIL        | Omnistrate account email                                                                    |
| PROVIDER_HASHED_PASS  | Omnistrate account password hashed using SHA256                                             |
| YOUR_SAAS_DOMAIN_URL  | The secure domain URL where this application will be deployed eg. https://www.yourcloud.com |
| MAIL_USER_EMAIL       | Gmail account to be used to send mails (signup, reset password etc) to your customers       |
| MAIL_USER_PASSWORD    | Gmail account app password                                                                  |

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to access the app locally

## Deploy on Omnistrate Platform

Deploying on the Omnistrate Platform can follow two main paths: without code customizations and with code customizations.

### Without Code Customizations

For users looking to deploy the SaaSBuilder quickly and without modifications, the straightforward approach involves using a predefined Docker compose [yaml](https://github.com/omnistrate/saasbuilder/blob/master/saasbuilder-docker-compose.yaml). This method facilitates the creation and launching of your service on the Omnistrate platform, utilizing the SaaSBuilder's existing setup and allowing for basic, provided customizations. It's an efficient path for rapid deployment, capitalizing on the built-in configurations of SaaSBuilder.

For a video guide covering all the below steps, you can follow it [here](https://www.loom.com/share/58d0019c307646868dae2ba9bc56f727?sid=bab3b5f7-b6b8-4669-9dff-e53ee74dd3cc). The manual steps are listed below -

- Copy the contents of the saasbuilder-docker-compose.yaml
- Login to Omnistrate and navigate to "Build Your SaSS" and "Your Compose Spec" tab
- Paste the content of saasbuilder-docker-compose.yaml in the yaml editor and provide name, description (logo image is optional and wont be seen by your customers).
- Start by copying the content from the saasbuilder-docker-compose.yaml.
- Log into Omnistrate, navigate to "Build Your SaaS" and select the "Your Compose Spec" tab.
- Paste the yaml content into the editor, adding a service name and description. (Logos are optional.)
- Choose your service model: Provider Hosted or Omnistrate Hosted, to create your service.
- Follow the prompt to launch an instance of the SaaSBuilder Service.
- Specify instance details: type, Omnistrate account and password, SMTP email and password, and hosting domain.
- Post-creation, navigate to the "Network" tab, copy the cluster endpoint.
- Access the SaaSBuilder App through the copied endpoint to reach the login page.
- Register as an end user to begin consuming services.

### With Code Customizations

For users looking to customize the SaaSBuilder, this option involves customizing the code after forking the SaaSBuilder repository. You'll make necessary changes, build and push your Docker image to a repository, update the Docker compose file to use your new image, and then create and launch your service on Omnistrate. This method allows for significant level of customization and flexibility however it is important to remember that maintaining your forked repository in sync with the master branch is your responsibility.

- After you have made all the customization code changes, you need to build a docker image and push it to your own repo. The dockerfile is already [available](https://github.com/omnistrate/saasbuilder/blob/master/Dockerfile), you could use the same.

```bash
docker build -t yourorg/yoursaasbuilder:1.0.0 .
```

```bash
docker push yourorg/yoursaasbuilder:1.0.0
```

- After you have pushed the docker image, you need to refer to it in your docker compose spec

- Once you have updated the docker compose spec, you will use it to create a service in Omnistrate. Rest of the steps are same as those defined in the "Without Code Customization" [section](#without-code-customizations) above.

## Configure Your Custom Domain

To configure a custom domain for your service hosted on Omnistrate, you'll need to perform two main actions.

- First, contact Omnistrate support to inform about your domain details, ensuring it can be configured in Omnistrate.
- Second, configure a CNAME record in your domain's DNS settings to point to the Omnistrate hosted service's name. This process involves accessing your domain registrar's or DNS provider's control panel and adding the CNAME record and map it to the Global endpoint of the SaasBuilder hosted in Omnistrate. Detailed instructions for this process are typically provided by the DNS hosting service or your domain registrar.

<!-- ## Troubleshooting/FAQ
Q1: What should I do if I encounter a yarn install error?
A1: Ensure your node and yarn versions meet the project's requirements. Try clearing your yarn cache with yarn cache clean and reinstalling dependencies.

Q2: How do I resolve Docker compose deployment errors?
A2: Verify that your Docker environment is set up correctly. Ensure the Docker daemon is running and your docker-compose.yml file points to the correct image tags. Review the Docker and project logs for specific error messages. -->

## Contributing

We welcome contributions from the community! Here's how you can help:

- Fork the Repository: Start by forking the project's repository.
- Make Your Changes: Whether it's fixing a bug or adding a feature, make your changes in a separate branch.
- Adhere to Coding Standards: Ensure your code matches the project's style and best practices.
- Submit a Pull Request: Open a pull request with a clear description of your changes and any relevant issue numbers.

## Support and Contact

If you need help or want to report an issue, please follow these steps:

- Open an Issue: If you can't find an answer, open an issue on our GitHub repository with a detailed description of the problem along with reproducible steps, environment details and all necessary screenshots, videos.
- Contact Us: For more direct support, contact Omnistrate support

We strive to create a welcoming and supportive community, so don't hesitate to reach out!
