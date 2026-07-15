# Insurance Inventory

---

## Installation:

- You will need the most recent Long Term Support Node.js version on your machine. Please install according to your machine and the instructions here: https://nodejs.org/en/download/current or via HomeBrew.


- Note that application development is on the ‘working’ branch. 

- Clone the repository to your local machine. 

- Navigate into the directory. 

- Navigate to the ‘working’ branch using Git.

- Install the dependencies via `npm install`.

  - There will be warnings regarding deprecated packages. This is okay and a noted issue with the required Next.js/NeonAuth/React packages.

- Create a Neon account online at neon.com. This application utilizes Neon Auth, which is integrated into the database automatically. The application authorization and authentication will not work without Neon Auth

  - Create a Neon project once in the dashboard. 

  - Enable Neon Auth in the project.

  - Copy the DATABASE_URL connection string and the NEON_AUTH_BASE_URL.

  - Create a ‘.env’ file and paste the values. Your ‘.env’ should look like: 
      DATABASE_URL=connection-string-here
      NEON_AUTH_BASE_URL=base-url-here

  - The ‘.env’ file provides your application with the required secrets it needs. This file is not tracked in Git, due to being listed in the ‘.gitignore’ file. These secrets act as the connections to the database.

  - Add an additional item to the ‘.env’ called NEON_AUTH_COOKIE_SECRET. Generate a secret using OpenSSL. For example, one command that will generate a random string is `openssl rand -hex 32`. Save that random string to your ‘.env’ NEON_AUTH_COOKIE_SECRET.

  - Currently, the database has no tables and no data. To build out the schema, run the command `npx drizzle-kit push`. This will apply the local schema from the application code to the Neon Database. Then, seed the data via the command `node db/seed.ts`. 

- You are now ready to run the application. Run the command `npm run dev`

- Visit the Local link provided, usually `http://localhost:3000`.

## Testing: 

- You will need the latest LTS of Node.js and Vitest.

### Unit Testing:

- Install Vitest

- If a test file doesn't exist in your current director, make one called '__tests__'

- Identify items to test within the system. 

- Create a file within the __tests__ folder named after the file you are testing, such as implementationfilename.test.js

- Use the command 'npm run test' to run the tests. 

- Write tests and iteratively ensure they pass, along with all other tests. 

- Document any changes made to the code.

## Deployment: Coming soon!